import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    auth: {
      user: process.env.MJ_APIKEY_PUBLIC as string, 
      pass: process.env.MJ_APIKEY_PRIVATE as string,
    },
  });
  
  export const sendPasswordResetEmail = async (
    email: string,
    resetLink: string
): Promise<boolean> => {
    try {
        const info = await transporter.sendMail({
            from: '"mlmSaree" <no-reply@mlmsaree.com>',
            to: email,
            subject: "Password Reset Request",
            text: `To reset your password, please click the following link: ${resetLink}`,
            html: `<p>To reset your password, please click the following link: <a href="${resetLink}">Reset Password</a></p>`,
        });
        
        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return false;
    }
};