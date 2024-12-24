import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const updateUserData = async (req:Request, res:Response) => {
    const { id, UserDetails } = req.body;

    if (!id || !UserDetails) {
        res.status(400).json({ success:false, message: "Invalid User or UserDetails." });
        return
    }

    const { fullName, email, mobile, address, BankDetails } = UserDetails;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                fullName,
                email,
                mobile,
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