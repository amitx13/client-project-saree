import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserData = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({  success:false, message: "userId is required." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{levelRewards:true}
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const { password, referrerId, mobile, createdAt, ...userData } = user;
        res.status(200).json({ user: userData });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({  success:false, error: "Something went wrong while getting user data." });
    }
}

export const getProfileData = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({  success:false, message: "userId is required." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{
                address:true,
                BankDetails:true,
            }
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const { referrerId, createdAt,levelIncome,orderStatus,role, ...userData } = user;

        res.status(200).json({ userData });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({  success:false, message: "Something went wrong while getting user data." });
    }
}

export const getUserTeamData = async (req:Request, res:Response) => {
    const { id } = req.params;
    
    if (!id ) {
        res.status(400).json({ success:false, message: "All fields are required" });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include:{levelRewards:true}
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const referrals = await prisma.user.findMany({
            where: { 
                referrerId: id,
             },
        })

        const referralsData = referrals.map(referral => ({
            name: referral.fullName,
            mobile: referral.mobile,
            userId: referral.id,
            status:referral.membershipStatus
        }));

        if(user.referrerId){
            const sponsored = await prisma.user.findUnique({
            where: { id: user.referrerId },
            })

            if (sponsored) {
                const sponsoredData = {
                    name: sponsored.fullName,
                    userId: sponsored.id,
                    phone: sponsored.mobile
                }

                res.status(200).json({ level: user.levelRewards, sponsored:sponsoredData, referrals: referralsData });
            } else {
                res.status(200).json({  level: user.levelRewards, sponsored:null, referrals:referralsData });
            }
            return;
        
        } else {
            res.status(200).json({  level: user.levelRewards, sponsored:null, referrals:referralsData });
            return;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({success:false, message: "Something went wrong while getting user team data." });
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
    const { userid } = req.params;

    if (!userid ) {
        res.status(400).json({ success:false, message: "Id is required" });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id:userid },
            include:{
                userRewards:true,
                levelRewards:true
            }
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const rewards = await prisma.reward.findMany();

        const {id, userId,updatedAt, ...userData} = user.levelRewards[0];

        res.status(200).json({ success:true, rewards:rewards, userData:user.userRewards ,levelRewards:userData });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ success:false, message: "Something went wrong while getting user reward data." });
    }
}

export const getuserWelcomedata = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ success:false, message: "userId is required." });
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return
        }

        const {membershipStatus,levelIncome,referrerId,orderStatus,role,walletBalance,  ...userData } = user;

        if(user.referrerId){
            const sponsored = await prisma.user.findUnique({
            where: { id: user.referrerId },
            })

            if (sponsored) {
                const sponsoredData = {
                    sponsorId: sponsored.id,
                    name: sponsored.fullName,
                    email: sponsored.email,
                    phone: sponsored.mobile
                }

                res.status(200).json({success:true, userData, sponsoredData });

            } else {
                res.status(200).json({success:true, userData});
            }
            return;
        }

        res.status(200).json({success:true, userData });

    } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).json({ success:false, error: "Something went wrong while getting user data." });
    }
}