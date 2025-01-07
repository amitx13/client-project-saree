import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const INITIAL_REWARD = 200;
const LEVEL_REWARD = 10;
const LAST_LEVEL_REWARD = 20;


export const referalChain = async (referrerId: string,MAX_LEVEL=6) => {
    const referralChain: string[] = [referrerId]
    let currentReferrerId: string = referrerId

    // Find referral chain up to 6 levels
    for (let level = 1; level < MAX_LEVEL; level++) {
      const parentUser = await prisma.user.findUnique({
        where: { id: currentReferrerId },
        select: { referrerId: true }
      })

      if (!parentUser?.referrerId) break
      
      referralChain.push(parentUser.referrerId)
      currentReferrerId = parentUser.referrerId
    }

    return referralChain
}

export const createReferalIncome = async (referalChain:string[]) => {
    const updates = [];

    for(let i = 0; i < referalChain.length; i++) {
        const rewardAmount = i === 0 ? INITIAL_REWARD : i === 5 ? LAST_LEVEL_REWARD :LEVEL_REWARD;
        updates.push(
            prisma.user.update({
                where: { id: referalChain[i] },
                data: {
                    walletBalance: { increment: rewardAmount },
                    levelIncome: { increment: rewardAmount }
                }
            })
        );
    }
    await Promise.all(updates)

    
}

export const updateReferralLevels = async (referralChain: string[]) => {
    const updates = referralChain.map((userId, index) => {
      const levelKey = `level${index + 1}Count`;
      return prisma.levelReward.upsert({
        where: { userId },
        update: { [levelKey]: { increment: 1 } },
        create: { userId, [levelKey]: 1 }
      });
    });

    await Promise.all(updates)
    
};

export const updateReferralTree = async (referralChain: string[], childUserId: string) => {
    const updates = referralChain.map(async (userId, index) => {
      const currentTree = await prisma.referalTree.findUnique({
        where: { userId }
      });
  
      const levelKey = `level${index + 1}` as 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6';
      
      const newUser = [childUserId] as Prisma.JsonArray;
      
      const existingUsers = currentTree?.[levelKey] as Prisma.JsonArray | null;
      
      const updatedUsers = existingUsers 
        ? [...new Set([...existingUsers, childUserId])] as Prisma.JsonArray
        : newUser;
  
      const updateData = {
        [levelKey]: updatedUsers
      };
  
      return prisma.referalTree.upsert({
        where: { userId },
        create: {
          userId,
          ...updateData
        },
        update: updateData
      });
    });
  
    await Promise.all(updates.filter(Boolean));
  };

export const updateRewardEligibility = async (referralChain: string[]) => { 
    for (const userId of referralChain) {
        // Get user's current level counts
        const levelReward = await prisma.levelReward.findUnique({
          where: { userId }
        });

        if(levelReward?.level1Count === 0) continue;
    
        if (!levelReward) continue;
    
        const rewards = await prisma.reward.findMany();
        
        const updates = rewards.map(async (reward) => {
          let isEligible = false;
    
          switch (reward.level) {
            case 3: // Silver
              isEligible = levelReward.level3Count >= 1000;
              break;
            case 4: // Gold
              isEligible = levelReward.level4Count >= 10000;
              break;
            case 5: // Platinum
              isEligible = levelReward.level5Count >= 100000;
              break;
            case 6: // Diamond
              isEligible = levelReward.level6Count >= 1000000;
              break;
          }
    
          return prisma.userReward.update({
            where: {
                userId_rewardId: {
                    userId: userId,
                    rewardId: reward.id
                },
                isClaimed: false
            },
            data: {
                isClaimable: isEligible
            }
        });
    });

    await Promise.all(updates);
    
}}

export const activateAccountWithCode = async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    if (!userId || !code) {
        res.status(400).json({ success: false, message: "User ID and code are required" });
        return;
    }

    try {
        const activationCode = await prisma.activationCode.findUnique({ where: { code } });
        if (!activationCode || activationCode.isUsed ) {
            res.status(400).json({ success: false, message: "Invalid or expired activation code" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (user.membershipStatus) {
            res.status(400).json({ success: false, message: "Account is already activated" });
            return;
        }

        const rewards = await prisma.reward.findMany();

        const userRewards = rewards.map((reward) => ({
            userId: user.id,
            rewardId: reward.id,
            isClaimable: false,
            isClaimed: false,
          }))

        await prisma.$transaction([
            prisma.activationCode.update({ where: { code }, data: { isUsed: true } }),
            prisma.user.update({ where: { id: userId }, data: { membershipStatus: true } }),
            prisma.userReward.createMany({ data: userRewards }),
            prisma.levelReward.create({ data: { userId: user.id }})
        ]);
      
        if (user.referrerId) {
            const referralChain = await referalChain(user.referrerId);
            await createReferalIncome(referralChain);
            await updateReferralLevels(referralChain);
            await updateRewardEligibility(referralChain);
        }

        res.status(200).json({ success: true, message: "Account activated successfully"});
    } catch (error) {
        console.error("Error activating account:", error);
        res.status(500).json({ success: false, message: "An error occurred while activating the account", error });
    }
};