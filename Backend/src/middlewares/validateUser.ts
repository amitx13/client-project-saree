import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../controllers/authController/userAuthController";


export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization")
    if (!header) {
        res.status(401).json({ message: "No authorization token provided" })
        return
    }
    const token = header.split(" ")[1]
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        if (payload) {
            next()
        } else {
            res.status(403).json({ error: "Unauthorized" })
        }
    } catch(e) {
        if(e instanceof jwt.JsonWebTokenError){
            res.status(403).json({ error: "Unauthorized" });
            return
        }
        res.status(500).json({ error: "Internal Server Error in validate User" });
    }
}

