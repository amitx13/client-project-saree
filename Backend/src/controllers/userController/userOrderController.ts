import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    const { email, sareeId } = req.body;

    if (!email || !sareeId) {
        res.status(400).json({ message: "Email and sareeId are required." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }

        if (!user.membershipStatus) {
            res.status(400).json({ message: "Your membership is inactive." });
            return
        }

        if (user.orderStatus) {
            res.status(400).json({ message: "You have already placed an order." });
            return
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                sareeId,
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { orderStatus: true },
        });

        res.status(201).json({ status:true, message: "Order created successfully."});

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Something went wrong while creating the order." });
    }
};