import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "mlmsupersecret"; 

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, mobile, password, address, referralCode, bankDetails } = req.body;

    if (!name || !email || !mobile || !password || !address || !address.houseNo || !address.city || !address.state || !address.pinCode || !bankDetails || !bankDetails.accountNo || !bankDetails.ifscCode || !bankDetails.bankName) {
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

        if(referrer && !referrer.membershipStatus){
            res.status(404).json({ message: "Referrer account is not active." });
            return;
        }
        const LowerCaseEmail = email.toLowerCase()

        const existingUserByEmail = await prisma.user.findUnique({ where: { email:LowerCaseEmail } });
        const existingUserByMobile = await prisma.user.findUnique({ where: { mobile } });
        if (existingUserByEmail || existingUserByMobile) {
            res.status(409).json({ message: "User already exists with this email or mobile." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "10"));

        let referrerId = null;
        if (referralCode) {
            const referrer = await prisma.user.findUnique({ where: { id: referralCode } });
            if (!referrer) {
                res.status(422).json({ message: "Invalid referral code." });
                return;
            }
            referrerId = referrer.id;
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email:LowerCaseEmail,
                mobile,
                password: hashedPassword,
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
            include: { address: true,BankDetails: true },
        });

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "24h" } 
        );
        const { password: _,referrerId:__,address:___,BankDetails:____,networkSize:_____,role:______,levelIncome:________,walletBalance:_________,createdAt:__________, ...userInfo } = newUser;

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: userInfo
        });

    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }
    const LowerCaseEmail = email.toLowerCase();
    try {
        const user = await prisma.user.findUnique({
            where: { email:LowerCaseEmail },
        });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password." });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" } 
        );

        const { password: _,referrerId:__,networkSize:_____,role:______,levelIncome:________,walletBalance:_________,createdAt:__________, ...userInfo } = user;
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

