import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { sendOTPEmail } from "../../service/mail";
import rateLimit from 'express-rate-limit';
import { RateLimitInfo } from 'express-rate-limit';
import { time } from "console";


export const JWT_SECRET = process.env.JWT_SECRET || "mlmsupersecret";

const prisma = new PrismaClient();

const keyGenerator = (req: Request): string => {
    const email = req.body.email;
    return `otp:${email}`;
};

export const sendOtpLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 50, // 5 requests per windowMs per email
    keyGenerator,
    standardHeaders: true,
    message: { 
        success: false, 
        message: "Too many OTP requests for this email. Please try again after 24 hours." 
    },
});

export const verifyOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 3 attempts per windowMs per email
    keyGenerator,
    standardHeaders: true,
    message: { 
        success: false, 
        message: "Too many verification attempts for this email. Please try again after 15 minutes." 
    },
});



const generateNumbers = (digits: number): string => {
    // Generate a random number between 0 and 99999
    const randomBytes = crypto.randomBytes(4);
    const number = Math.abs(randomBytes.readInt32BE(0) % Math.pow(10, digits));
    // Pad with leading zeros to ensure the correct number of digits
    return number.toString().padStart(digits, '0');
};

export async function generateUserId() {
    let userId:string;
    let isUnique = false;
    const batchSize = 10; // Increased batch size for better efficiency

    while (!isUnique) {
        // Generate a larger batch of IDs
        const userIds = Array.from({ length: batchSize }, () => `JD${generateNumbers(5)}`);

        // Use a single database query with batching
        const existingUsers = await prisma.$transaction(async (prisma) => {
            return await prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true }
            });
        });

        const existingUserIds = new Set(existingUsers.map(user => user.id));
        userId = userIds.find(id => !existingUserIds.has(id)) || '';

        if (userId) {
            isUnique = true;
            return userId;
        }
    }
}


export const registerUser = async (req: Request, res: Response) => {
    const { fullName, userName, email, mobile, password, address, referralCode, bankDetails } = req.body;

    if (!fullName || !userName || !email || !mobile || !password || !address || !address.houseNo || !address.city || !address.state || !address.pinCode || !bankDetails || !bankDetails.accountNo || !bankDetails.ifscCode || !bankDetails.bankName) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    if (password.length < 8) {
        res.status(404).json({ message: "Password must be at least 8 characters long." });
        return
    }

    if (mobile.length !== 10) {
        res.status(404).json({ message: "Mobile number must be 10 digits long." });
        return
    }

    try {
        const referrer = await prisma.user.findUnique({ where: { id: referralCode } });

        if (referrer && !referrer.membershipStatus) {
            res.status(404).json({ message: "Referrer account is not active." });
            return;
        }

        let referrerId = null;
        if (referralCode) {
            const referrer = await prisma.user.findUnique({ where: { id: referralCode } });
            if (!referrer) {
                res.status(422).json({ message: "Invalid referral code." });
                return;
            }
            referrerId = referrer.id;
        }

        const adminEmail = await prisma.user.findFirst({ where: { email: email, role: "ADMIN" } });
        if (adminEmail) {
            res.status(404).json({ message: "Email already exists." });
            return
        }

        const userId = await generateUserId();

        if (userId === undefined) {
            res.status(500).json({ message: "Error generating user ID. TryAgain" });
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                id: userId,
                fullName,
                Username: userName,
                email: email.toLowerCase(),
                mobile,
                password: password,
                referrerId,
                address: {
                    create: {
                        houseNo: address.houseNo,
                        city: address.city,
                        state: address.state,
                        pinCode: address.pinCode,
                    },
                },
                BankDetails: {
                    create: {
                        accountNo: bankDetails.accountNo,
                        ifscCode: bankDetails.ifscCode,
                        BankName: bankDetails.bankName,
                    },
                },
            },
            include: { address: true, BankDetails: true },
        });

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        const { password: _, referrerId: __, address: ___, BankDetails: ____, role: ______, levelIncome: ________, walletBalance: _________, createdAt: __________, ...userInfo } = newUser;

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: userInfo
        });

    } catch (error: any) {
        if (error.code === "P2002") {
            res.status(409).json({ message: "Username already exists." });
            return;
        }
        const errorMessage = error.message.match(/message: "(.*?)"/)?.[1];
        if (errorMessage) {
            res.status(500).json({ message: errorMessage });
            return;
        }
        res.status(500).json({ message: "Internal server error while registering user." });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { nameOrId, password } = req.body;

    if (!nameOrId || !password) {
        res.status(400).json({ message: "Username/Id or password are required." });
        return;
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { Username: nameOrId },
                    { id: nameOrId }
                ],
                role: 'USER'
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.password !== password) {
            res.status(400).json({ message: "Invalid password." });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        const { password: _, referrerId: __, role: ______, levelIncome: ________, walletBalance: _________, createdAt: __________, ...userInfo } = user;
        res.status(200).json({
            message: "Login successful",
            token,
            user: userInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error while login" });
    }
}


export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success:false, message: "Email is required." });
        return;
    }
    try {

        const existingOtp = await prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: "desc" }, 
        });

        let timeLeft = 0;
        if (existingOtp) {
            timeLeft =
                2 * 60 - Math.floor((new Date().getTime() - new Date(existingOtp.createdAt).getTime()) / 1000);

            if (timeLeft > 0) {
                res.status(429).json({
                    success: false,
                    message: "OTP already sent. Please wait before requesting again.",
                    timeLeft,
                });
                return;
            }
        }

        const otp = generateNumbers(4);

        const response = await sendOTPEmail(email, otp);

        if (!response) {
            res.status(500).json({ success: false, message: "Error sending OTP email. Try again later." });
            return;
        }
        await prisma.oTP.create({
            data: {
                email,
                otp,
            },
        });

        timeLeft = 2 * 60;

        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            timeLeft,
        });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Server error while sending OTP. Try again later.",
        });
    }
};


export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400).json({ success: false, message: "Email and OTP are required." });
        return;
    }
    try {
        const existingOtp = await prisma.oTP.findFirst({
            where: {
                email
            },
            orderBy: { createdAt: "desc" },
        })

        if (!existingOtp) {
            res.status(404).json({ success: false, message: "No valid OTP found." });
            return;
        }

        if (existingOtp.otp !== otp) {
            res.status(400).json({ success: false, message: "Invalid OTP." });
            return;
        }

        await prisma.oTP.delete({
            where: { id: existingOtp.id },
        });
        res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch {
        res.status(500).json({ success: false, message: "Server error while verifying OTP. Try again after sometimes" });
        return;
    }
};
