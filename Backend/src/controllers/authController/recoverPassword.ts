import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sendPasswordResetEmail } from "../../service/mail";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const recoverPassword = async (req: Request, res: Response) => {
    const { userNameorId } = req.body;

    if (!userNameorId) {
        res.status(400).json({ success:false, message: "Email or UserId is required." });
        return;
    }

    try {

        const user = await prisma.user.findFirst({
            where: { 
                OR: [
                    { Username: userNameorId },
                    { id: userNameorId }
                ]
             },
        });
        
        if (!user) {
            res.status(404).json({ success:false, message: "User not found." });
            return;
        }

        const resetToken = generateResetToken();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const status = await sendPasswordResetEmail(user.email, resetLink);

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600000),
          },
        });

        if (!status) {
            res.status(500).json({ success:false, message: "Error sending password reset email. Try after sometime." });
            return;
        }
        res.status(200).json({success:true, message: "Password reset link sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: "Internal server error while recovering password" });
    }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({success:false, message: "Token is required." });
    return
  }

  try {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      res.status(400).json({ success:false, message: "Invalid or expired token." });
      return
    }

    res.status(200).json({success:true, message: "Token is valid.", userId: tokenRecord.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message:"Server error while verifying token." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ success:false, message: "Token and new password are required." });
    return
  }

  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ success:false, message:"Password must be at least 8 characters long." });
    return
  }

  try {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      res.status(400).json({ success:false, message:"Invalid or expired token." });
      return
    }


    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: newPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    res.status(200).json({ success:true, message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Server error while resetting password." });
  }
};

export const checkUserName = async (req: Request, res: Response) => {
    const { userName } = req.params;

    if (!userName) {
        res.status(400).json({ success:false, message: "Username is required." });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { Username: userName },
        });

        if (user) {
            res.status(200).json({ success:false, message: "Username already exists." });
        } else {
            res.status(200).json({ success:true, message: "Username available." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: "Internal server error while checking username." });
    }
}