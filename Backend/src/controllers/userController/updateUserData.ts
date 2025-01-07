import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const prisma = new PrismaClient();

export const updateUserData = async (req:Request, res:Response) => {
    const { id, UserDetails } = req.body;

    if (!id || !UserDetails) {
        res.status(400).json({ success:false, message: "Invalid User or UserDetails." });
        return
    }

    const { fullName, email, password, mobile, address, BankDetails } = UserDetails;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                fullName,
                email,
                mobile,
                password,
                address: {
                    update: {
                        where: { id: address[0].id },
                        data:{
                            houseNo: address[0].houseNo,
                            city: address[0].city,
                            state: address[0].state,
                            pinCode: address[0].pinCode,
                        }
                    },
                },
                BankDetails: {
                    update: {
                        where: { id: BankDetails[0].id },
                        data:{
                            accountNo: BankDetails[0].accountNo,
                            BankName: BankDetails[0].BankName,
                            ifscCode: BankDetails[0].ifscCode,
                        }
                    },
                },
            },
        });

        res.status(200).json({ success:true, message: "User data updated successfully." });

    } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ success:false, message: "Something went wrong while updating user data." });
    }
}

export const addTransactionDetails = async (req:Request, res:Response) => {
    const { userId } = req.body;
    console.log(req.body);
    if(!userId){
        res.status(400).json({ success:false, message: "Invalid User." });
        return
    }
    if(!req.file){
        res.status(400).json({ success:false, message: "No Image found." });
        return
    }
    try{
        const userExists = await prisma.transactionDetails.findUnique({
            where: { userId },
        })
        if(userExists){
            res.status(400).json({ success:false, message: "Transaction Details already exists." });
            return
        }
        const imagepath = path.join("public", "uploads", `${Date.now()}-${req.file.originalname}`);
        await sharp(req.file.path).toFile(imagepath);
        fs.unlinkSync(req.file.path);
        await prisma.transactionDetails.create({
            data: {
                userId,
                image: imagepath,
            }
        });
        res.status(200).json({ success:true, message: "Transaction Details added successfully." });
    } catch (error) {
        console.error("Error adding transaction details:", error);
        res.status(500).json({ success:false, message: "Something went wrong while adding transaction details." });

    }
}

export const getUserTransactionData = async (req:Request, res:Response) => {
    const { id } = req.params;
    if(!id){
        res.status(400).json({ success:false, message: "Invalid User." });
        return
    }
    try{
        const user = await prisma.transactionDetails.findUnique({
            where: { userId: id },
        });

        if(user){
            res.status(200).json({ success:true, data: user });
        } else {
            res.status(200).json({ success:false, message: "User Transaction Details not found." });
        }

    } catch (error) {
        console.error("Error getting user transaction data:", error);
        res.status(500).json({ success:false, message: "Something went wrong while getting user transaction data." });
    }
}