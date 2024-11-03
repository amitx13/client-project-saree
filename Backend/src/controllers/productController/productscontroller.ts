import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getProductsData = async (req: Request, res: Response) => {
    try {
        const products = await prisma.saree.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error while fetching products", error });
    }
}