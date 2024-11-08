import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import crypto from 'crypto'


const prisma = new PrismaClient();

export const addProduct = async (req:Request, res:Response) => {
    const {name} = req.body;
    if (!name || !req.file) {
        res.status(400).json({message: "All fields are required"});
        return
    }
    try {
        const compressedImagePath = path.join("public", "uploads", `${Date.now()}-${req.file.originalname}`);
        await sharp(req.file.path)
            .resize(200)
            .jpeg({ quality: 70 })
            .toFile(compressedImagePath);

        fs.unlinkSync(req.file.path);

        const saree = await prisma.saree.create({
            data: {
                name,
                image: compressedImagePath 
            }
        });

        res.status(201).json({ message: "Saree added successfully", saree });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while adding saree", error });
    }
}

export const deleteProduct = async (req:Request, res:Response) => {
    const {id} = req.body;
    if (!id) {
        res.status(400).json({message: "All fields are required"});
        return
    }
    try {
        await prisma.saree.delete({
            where: {
                id
            }
        });
        res.status(200).json({ message: "Saree deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while deleting saree", error });
    }
}

export const dispatchOrder = async (req:Request, res:Response) => {
    const {id, userId, sareeId} = req.body;
    if (!id || !userId || !sareeId) {
        res.status(400).json({message: "All fields are required"});
        return
    }
    try {
        await prisma.order.update({
            where: {
                id,
                userId,
                sareeId
            },
            data: {
                dispatch: true
            }
        });
        res.status(200).json({ message: "Order dispatched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while dispatching order", error });
    }
}

export const completeWithdrawalRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    // Validate requestId
    if (!requestId) {
        res.status(400).json({ error: "Invalid request. Please provide a valid requestId." });
        return
    }

    try {
        const request = await prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            res.status(404).json({ error: "Withdrawal request not found." });
            return
        }

        await prisma.withdrawalRequest.update({
            where: { id: requestId },
            data: { status: "COMPLETED" },
        });

        res.status(200).json({ message: "Withdrawal request completed." });
    } catch (error) {
        console.error("Error completing withdrawal request:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

export const rejectWithdrawalRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    // Validate requestId
    if (!requestId) {
        res.status(400).json({ error: "Invalid request. Please provide a valid requestId." });
        return
    }

    try {
        const request = await prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            res.status(404).json({ error: "Withdrawal request not found." });
            return
        }

        await prisma.withdrawalRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" },
        });

        await prisma.user.update({
            where: { id: request.userId },
            data: { walletBalance: { increment: request.amount } },
        })

        res.status(200).json({ message: "Withdrawal request REJECTED." });
    } catch (error) {
        console.error("Error completing withdrawal request:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

function generateActivationCode(): string {
    return crypto.randomBytes(8).toString('hex')
  }
  
export const createMultipleActivationCodes = async (req: Request, res: Response) => {
    const { count } = req.body
  
    if (!count || typeof count !== 'number' || count <= 0) {
      res.status(400).json({ error: "Invalid request. Please provide a valid positive integer for 'count'." })
      return
    }
  
    try {
      const codes = Array.from({ length: count }, () => generateActivationCode())
  
      const activationCodeData = codes.map((code) => ({
        code,
        isUsed: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      }))
  
      await prisma.activationCode.createMany({
        data: activationCodeData,
        skipDuplicates: true  // Avoids errors if there are duplicate codes
      })
  
      res.status(200).json({ status: true, codes })
    } catch (error) {
      console.error('Error creating activation codes:', error)
      res.status(500).json({ error: 'An unexpected error occurred.' })
    }
  }

export const createRewards = async (req: Request, res: Response) => {
    const {name, description, level, amount} = req.body;

    if (!name || !description || !level || !amount) {
        res.status(400).json({message: "All fields are required"});
        return
    }

    try {
        await prisma.reward.create({
            data: {
                name,
                description,
                level,
                amount
            }
        });

        res.status(201).json({ message: "Reward created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while creating reward", error });
    }
}