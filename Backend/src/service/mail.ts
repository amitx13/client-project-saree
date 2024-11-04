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
            from: '"mlmSaree" <amitkvs981@gmail.com>',
            to: email,
            subject: "Password Reset Request",
            text: `To reset your password, please click the following link: ${resetLink} . The link will expire in 1 hour.`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Request</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 30px; text-align: center; background-color: #8B0000;">
                                        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">mlmSaree</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Password Reset Request</h2>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">To reset your password, please click the button below:</p>
                                        <table role="presentation" style="margin: 30px auto;">
                                            <tr>
                                                <td style="border-radius: 4px; background-color: #8B0000;" align="center">
                                                    <a href="${resetLink}" target="_blank" style="border: none; color: #ffffff; padding: 12px 25px; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold;">Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
                                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                                        <p style="color: #0066cc; font-size: 14px; line-height: 1.5; word-break: break-all;">${resetLink}</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px; text-align: center; background-color: #f8f8f8; color: #999999; font-size: 14px;">
                                        <p style="margin: 0;">© 2023 mlmSaree. All rights reserved.</p>
                                        <p style="margin: 10px 0 0;">If you have any questions, please contact our support team.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
        });

        if(info.accepted.includes(email)){
            return true;
        }
        return false

    } catch (error) {
        console.error("Error sending password reset email:", error);
        return false;
    }
};