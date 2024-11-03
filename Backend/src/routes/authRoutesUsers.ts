import express from 'express';
import { registerUser, loginUser } from '../controllers/authController/userAuthController';
import { recoverPassword, resetPassword, verifyResetToken } from '../controllers/authController/recoverPassword';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgetPassword', recoverPassword);
router.get("/verifyToken/:token", verifyResetToken);
router.post("/resetPassword", resetPassword);


export default router;