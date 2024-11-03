import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const claimReward = async (req: Request, res: Response) => {
    const { userId, rewardId } = req.body;

    if (!userId || !rewardId) {
        res.status(400).json({ success:false, message: "All fields are required." });
        return
    }

    try {
        const userReward = await prisma.userReward.findFirst({
            where: { userId, rewardId }
        });

        if (!userReward) {
            res.status(404).json({ success:false, message: "Reward not found." });
            return
        }

        if (!userReward.isClaimable) {
            res.status(400).json({ success:false, message: "Reward is not claimable." });
            return
        }

        if (userReward.isClaimed) {
            res.status(400).json({ success:false, message: "Reward has already been claimed." });
            return
        }

        const reward = await prisma.reward.findUnique({
            where: { id: rewardId }
        })
        if (reward) {
            const Response = await prisma.$transaction([
                prisma.userReward.update({
                    where: { id: userReward.id },
                    data: { isClaimed: true, claimDate:new Date() }
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: { walletBalance: { increment: reward.amount } }
                })
            ]);

            if (!Response) {
                res.status(400).json({ success:false, message: "Failed to claim reward." });
                return
            }

            res.status(200).json({ success:true, message: "Reward claimed successfully." });
        } else{
            res.status(404).json({ success:false, message: "Reward not found." });
        }


    } catch (error) {
        console.error("Error claiming reward:", error);
        res.status(500).json({ success:false, message: "Something went wrong while claiming the reward." });
    }
}