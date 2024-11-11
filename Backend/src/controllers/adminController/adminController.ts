import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import crypto from 'crypto'
import { createLevelReward, updateNetworkSizeAndRewards, updateUserRewardStatus } from "../userController/userActivateAccountController";


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
    const {id} = req.body;
    if (!id) {
        res.status(400).json({success:false, message: "Order Id is required"});
        return
    }
    try {
        await prisma.order.update({
            where: {
                id,
            },
            data: {
                dispatch: true
            }
        });
        res.status(200).json({success:true, message: "Order dispatched successfully" });
    } catch (error) {
        res.status(500).json({success:false, message: "Internal server error while dispatching order" });
    }
}

export const completeWithdrawalRequest = async (req: Request, res: Response) => {
    const { requestId } = req.body;

    // Validate requestId
    if (!requestId) {
        res.status(400).json({ success:false, message: "Invalid request. Please provide a valid requestId." });
        return
    }

    try {
        const request = await prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            res.status(404).json({ success:false, message: "Withdrawal request not found." });
            return
        }

        await prisma.withdrawalRequest.update({
            where: { id: requestId },
            data: { status: "COMPLETED" },
        });

        res.status(200).json({ success:true, message: "Withdrawal request completed." });
    } catch (error) {
        console.error("Error completing withdrawal request:", error);
        res.status(500).json({ success:false, message: "An unexpected error occurred." });
    }
};

export const rejectWithdrawalRequest = async (req: Request, res: Response) => {
    const { requestId } = req.body;

    // Validate requestId
    if (!requestId) {
        res.status(400).json({ success:false, message: "Invalid request. Please provide a valid requestId." });
        return
    }

    try {
        const request = await prisma.withdrawalRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            res.status(404).json({ success:false, message: "Withdrawal request not found." });
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

        res.status(200).json({ success:true, message: "Withdrawal request REJECTED." });
    } catch (error) {
        console.error("Error completing withdrawal request:", error);
        res.status(500).json({ success:false, message: "An unexpected error occurred." });
    }
};

function generateActivationCode(): string {
    return crypto.randomBytes(8).toString('hex')
  }
  
export const createMultipleActivationCodes = async (req: Request, res: Response) => {
    const { count } = req.body
  
    if (!count || typeof count !== 'number' || count <= 0) {
      res.status(400).json({ success:false ,message: "Invalid request. Please provide a valid positive integer for 'count'." })
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
  
      res.status(200).json({ success: true, codes })
    } catch (error) {
      console.error('Error creating activation codes:', error)
      res.status(500).json({ success:false ,message: 'An unexpected error occurred.' })
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


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                referrals: true,
            }
        });
        const usersData = users.filter(user => user.role !== "ADMIN");
        const userData = usersData.map(user => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                registrationDate: user.createdAt,          
                status: user.membershipStatus,
                referrer: user.referrerId,
                referrals: user.referrals.map(referral => ({
                    email: referral.email,
                    status: referral.membershipStatus
                })),
                walletBalance: user.walletBalance,
            }
        })

        res.status(200).json({success:true, userData });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while fetching users", error });
    }
}

export const activateUserAccount = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID is required" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ success: false, message:"User not found" });
            return;
        }

        if (user.membershipStatus) {
            res.status(400).json({ success: false, message: "Account is already activated" });
            return;
        }

        await prisma.user.update({ where: { id: userId }, data: { membershipStatus: true } });

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
        res.status(500).json({ success: false, message: "An error occurred while activating the account" });
    }
}


export const getAllOrdersDetails = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                saree: true,
                user: true
            }
        });

        const ordersData = orders.map(order => {
            return {
                id: order.id,
                userName: order.user.name,
                sareeName: order.saree.name,
                orderPlacedAt: order.createdAt,
                price: order.saree.price,
                image: order.saree.image,
                status: order.dispatch
            }
        })

        res.status(200).json({ success:true, ordersData });
    } catch (error) {
        res.status(500).json({ success:false, message: "Internal server error while fetching orders", error });
    }
}

export const getAllWithdrawalRequests = async (req: Request, res: Response) => {
    try {
        const requests = await prisma.withdrawalRequest.findMany({
            include: { 
            user: {
                include: {
                    BankDetails: true
                }
            }
            }
        });

        const data = requests.map(request => {
            return {
                id: request.id,
                userName: request.user.name,
                mobile: request.user.mobile,
                amount: request.amount,
                status: request.status,
                bankDetails: request.user.BankDetails,
                requestedAt: request.createdAt
            }
        })

        res.status(200).json({ success:true, data });
    } catch (error) {
        res.status(500).json({ success:false, message: "Internal server error while fetching withdrawal requests" });
    }
}