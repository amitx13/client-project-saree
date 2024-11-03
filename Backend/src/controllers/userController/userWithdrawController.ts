import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createWithdrawalRequest = async (req: Request, res: Response) => {
    const { userId, amount } = req.body;

    // Validate input
    if (!userId || amount <= 0) {
        res.status(400).json({ error: "Invalid input. Ensure userId is provided and amount is greater than zero." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return
        }

        if (user.walletBalance < amount) {
            res.status(400).json({ status: false, message: "Insufficient balance." });
            return
        }

        // Create withdrawal request
        await prisma.withdrawalRequest.create({
            data: {
                userId: user.id,
                amount,
                status: "PENDING",
            },
        });

        // Update user's wallet balance
        await prisma.user.update({
            where: { id: userId },
            data: { walletBalance: {decrement:amount} },
        });

        res.status(200).json({ status:true, message: "Withdrawal request created successfully." });
    } catch (error) {
        console.error("Error creating withdrawal request:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};