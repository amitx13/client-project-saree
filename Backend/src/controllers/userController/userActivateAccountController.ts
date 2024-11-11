import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const MAX_LEVEL = 6;
const INITIAL_REWARD = 300;
const LEVEL_REWARD = 30;

export const updateUserRewardStatus = async (userId: string, level: number) => {
    try {
        const userReward = await prisma.userReward.findFirst({
            where: { userId, reward: { level } }
        });
        if (userReward) {
            await prisma.userReward.update({
                where: { id: userReward.id },
                data: { isClaimable: true }
            });
        }
    } catch (error) {
        console.error("Error updating user reward status:", error);
    }
};

export const createLevelReward = async (userId: string) => {
    try {
        let currentReferrerId = userId;
        let level = 1;
        const updates = [];

        while (currentReferrerId && level <= MAX_LEVEL) {
            const rewardAmount = level === 1 ? INITIAL_REWARD : LEVEL_REWARD;

            updates.push(
                prisma.user.update({
                    where: { id: currentReferrerId },
                    data: {
                        walletBalance: { increment: rewardAmount },
                        levelIncome: { increment: rewardAmount }
                    }
                })
            );

            const referrer = await prisma.user.findUnique({
                where: { id: currentReferrerId }
            });

            if (referrer?.referrerId) {
                currentReferrerId = referrer.referrerId;
                level++;
            } else {
                break;
            }
        }

        await Promise.all(updates); // Execute all updates in parallel
    } catch (error) {
        console.error("Error creating level reward:", error);
    }
};

export const updateNetworkSizeAndRewards = async (userId: string) => {
    let currentReferrerId = userId;

    while (currentReferrerId) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: currentReferrerId },
                data: { networkSize: { increment: 1 } }
            });

            const { networkSize } = updatedUser;
            if (networkSize === 100) await updateUserRewardStatus(currentReferrerId, 2);
            else if (networkSize === 1000) await updateUserRewardStatus(currentReferrerId, 3);
            else if (networkSize === 10000) await updateUserRewardStatus(currentReferrerId, 4);
            else if (networkSize === 100000) await updateUserRewardStatus(currentReferrerId, 5);

            const referrer = await prisma.user.findUnique({
                where: { id: currentReferrerId }
            });
            if (referrer?.referrerId) {
                currentReferrerId = referrer.referrerId;
            } else {
                break;
            }
        } catch (error) {
            console.error("Error updating network size and rewards:", error);
            break;
        }
    }
};

export const activateAccountWithCode = async (req: Request, res: Response) => {
    const { userId, code } = req.body;
    if (!userId || !code) {
        res.status(400).json({ success: false, message: "User ID and code are required" });
        return;
    }

    try {
        const activationCode = await prisma.activationCode.findUnique({ where: { code } });
        if (!activationCode || activationCode.isUsed || (activationCode.expiresAt && activationCode.expiresAt < new Date())) {
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

        await prisma.$transaction([
            prisma.activationCode.update({ where: { code }, data: { isUsed: true } }),
            prisma.user.update({ where: { id: userId }, data: { membershipStatus: true } })
        ]);

        const rewards = await prisma.reward.findMany();

        const userRewards = rewards.map((reward) => ({
          userId: user.id,
          rewardId: reward.id,
          isClaimable: false,
          isClaimed: false,
        }));
      
        await prisma.userReward.createMany({ data: userRewards });

        if (user.referrerId) {
            const parentUser = await prisma.user.findUnique({
                where: { id: user.referrerId },
                include: { referrals: true }
            });
            if (parentUser?.referrals.length === 10) await updateUserRewardStatus(parentUser.id, 1);

            await createLevelReward(user.referrerId);
            await updateNetworkSizeAndRewards(user.referrerId);
        }

        res.status(200).json({ success: true, message: "Account activated successfully"});
    } catch (error) {
        console.error("Error activating account:", error);
        res.status(500).json({ success: false, message: "An error occurred while activating the account", error });
    }
};