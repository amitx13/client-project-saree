import { PrismaClient } from "@prisma/client";
import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "mlmsupersecret"; 

const prisma = new PrismaClient();


export const registerNewAdmin = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    console.log(email, name, password);

    if (!email || !name || !password) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters long." });
        return
    }

    try{
        // Create a new admin user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            res.status(400).json({ message: "Admin already exists with this email." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
    
        res.status(201).json({ message: "Admin registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error while registering admin" });
    }
};


export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }

        if (user.role !== 'ADMIN') {
            res.status(401).json({ message: "Unauthorized access." });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password." });
            return;
        }

        const token = jwt.sign(
            { Role: user.role, email: user.email },
            JWT_SECRET,
        );

        const { id  } = user;

        const data = {Id:id , token: token}

        res.status(200).json({
            message: "Login successful",
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error while login" });
    }
}