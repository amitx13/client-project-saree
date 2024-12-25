import express from 'express';
import { registerUser, loginUser, sendOtp, verifyOtp, sendOtpLimiter, verifyOtpLimiter } from '../controllers/authController/userAuthController';
import { checkUserName, recoverPassword, resetPassword, verifyResetToken } from '../controllers/authController/recoverPassword';

const router = express.Router();

router.get('/checkUserName/:userName', checkUserName);
router.post('/login', loginUser);
router.post('/register', registerUser);

router.post('/send-otp', sendOtpLimiter ,sendOtp);
router.post('/verify-otp',verifyOtpLimiter, verifyOtp);

router.post('/forgetPassword', recoverPassword);
router.get("/verifyToken/:token", verifyResetToken);
router.post("/resetPassword", resetPassword);


export default router;