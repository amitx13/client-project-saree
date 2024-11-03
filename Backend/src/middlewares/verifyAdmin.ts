import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../controllers/authController/userAuthController";


export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) {
        res.status(401).json({ message: "No authorization token provided" });
        return;
    }

    const token = header.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Authorization token format is incorrect" });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        
        if (payload && typeof payload === "object" && payload.Role === "Admin") {
            next();
        } else {
            res.status(403).json({ error: "Unauthorized - Admin access required" });
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ error: "Invalid or expired token" });
        } else {
            res.status(500).json({ error: "Internal Server Error in validateUser" });
        }
    }
};