import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    const { id, sareeId } = req.body;

    if (!id || !sareeId) {
        res.status(400).json({ success:false, message:"Invalid User or saree." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id:id },
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        if (!user.membershipStatus) {
            res.status(400).json({ success:false, message: "Your membership is inactive." });
            return
        }

        if (user.orderStatus) {
            res.status(400).json({ success:false, message: "You have already placed an order." });
            return
        }

        const data = await prisma.saree.findUnique({
            where: { id: sareeId },
        })

        if(data?.stock === false){
            res.status(400).json({ success:false, message: "Saree is out of stock." });
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

        res.status(201).json({ success:true, message: "Order created successfully."});

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success:false, message: "Something went wrong while creating the order." });
    }
};

export const getUserOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ success:false, message: "UserId is required." });
        return
    }

    try {
        const details = await prisma.order.findMany({
            where: { userId: id },
        });


        if (!details) {
            res.status(404).json({ success:false, message: "No Order found." });
            return
        }

        res.status(200).json({ success:true, orders: details });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success:false, message: "Something went wrong while fetching user orders." });
    }
};

export const getAllReceivedCodes = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id){
        res.status(400).json({ success: false, message: "User ID is required" });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const data = await prisma.activationCode.findMany(
            {
                where: {
                    ownerUserID: id
                }
            }
        );

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error fetching codes:", error);
        res.status(500).json({ success: false, message: "Internal server error while fetching codes" });
    }
}

export const transferActivationCode = async (req: Request, res: Response) => {
    const { parentUserID, chileUserId, quantity } = req.body;
    if (!parentUserID || !chileUserId || !quantity) {
        res.status(400).json({ success: false, message: "User ID and quantity are required" });
        return;
    }
    try {
        const users = await prisma.user.findMany({
            where: { 
                OR:[
                    {id:parentUserID},
                    {id:chileUserId}
                ]
            }
        })

        if (!users || users.length < 2) {
            if(users[0].id === parentUserID){
                res.status(404).json({ success: false, message: "Cannot transfer codes to same user" });
                return;
            }
            res.status(404).json({ success: false, message: `User with id: ${chileUserId} not found` });
            return;
        }

        const codes = await prisma.activationCode.findMany({
            where: {
                ownerUserID: parentUserID,
                isUsed: false
            },
            take: quantity
        });

        if (codes.length < quantity) {
            res.status(400).json({ success: false, message: "Insufficient codes" });
            return;
        }

        const data = await prisma.activationCode.updateMany({
            where: {
            id: {
                in: codes.map((code) => code.id)
            }
            },
            data: {
                ownerUserID: chileUserId
            }
        });

        res.status(200).json({ success: true, message: "Codes transferred successfully" });
    } catch (error) {
        console.log("Error Transfering codes:", error);
        res.status(500).json({ success: false, message: "Internal server error while transferring codes" });
    }
}