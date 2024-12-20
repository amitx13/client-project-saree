import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserData = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "Email is required." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{referrals:true}
        });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ error: "Something went wrong while getting user data." });
    }
}

export const getUserTeamData = async (req:Request, res:Response) => {
    const { id } = req.params;
    
    if (!id ) {
        res.status(400).json({ message: "All fields are required" });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{referrals:true}
        });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }

        const referrals = await prisma.user.findMany({
            where: { referrerId: id },
        })

        const referralsData = referrals.map(referral => ({
            name: referral.name,
            mobile: referral.mobile
        }));

        if(user.referrerId){
            const sponsored = await prisma.user.findUnique({
            where: { id: user.referrerId },
            })

            if (sponsored) {
                const sponsoredData = {
                    name: sponsored.name,
                    email: sponsored.email,
                    phone: sponsored.mobile
                }

                res.status(200).json({ networkSize: user.networkSize, sponsored:sponsoredData, referrals: referralsData });
            } else {
                res.status(200).json({  networkSize: user.networkSize, sponsored:null, referrals:referralsData });
            }
            return;
        
        } else {
            res.status(200).json({  networkSize: user.networkSize, sponsored:null, referrals:referralsData });
            return;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ error: "Something went wrong while getting user team data." });
    }
}

export const getUserWalletData = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id ) {
        res.status(400).json({ message: "Id is required" });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{withdrawalRequests:true}
        });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }

        res.status(200).json({ userId:user.id, walletBalance: user.walletBalance, withdrawalRequests: user.withdrawalRequests });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ error: "Something went wrong while getting user wallet data." });
    }
}

export const getUserRewardData = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id ) {
        res.status(400).json({ success:false, message: "Id is required" });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{userRewards:true}
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const rewards = await prisma.reward.findMany();

        res.status(200).json({ success:true, rewards:rewards, userData:user.userRewards ,networkSize:user.networkSize});

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ success:false, message: "Something went wrong while getting user reward data." });
    }
}