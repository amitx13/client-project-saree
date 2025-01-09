import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const getAllUsersTransactionDetails = async (req: Request, res: Response) => {
    try {
        const users = await prisma.requestCodeTransactionDetails.findMany()
        if (!users) {
            res.status(404).json({ success:false, message: "No Users Found" })
            return
        }
        res.status(200).json({success:true, users})
    }
    catch (e:any) {
        res.status(500).json({ success: false, message: e.message })
    }
}

export const updateRequestCodeTransactionDetails = async (req: Request, res: Response) => {
    const { id, userId , approved } = req.body
    try {
        const user = await prisma.requestCodeTransactionDetails.update({
            where: {
                id,
                userId
            },
            data: {
                approved
            }
        })
        if (!user) {
            res.status(404).json({ success:false, message: "No Users Found" })
            return
        }
        res.status(200).json({success:true, user})
    }
    catch (e:any) {
        res.status(500).json({ success: false, message: e.message })
    }
}