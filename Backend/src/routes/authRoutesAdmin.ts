import express from 'express';
import { registerNewAdmin, loginAdmin } from '../controllers/authController/adminAuthController';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { recoverPassword } from '../controllers/authController/recoverPassword';
import { verifyResetToken, resetPassword } from '../controllers/authController/recoverPassword';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register',verifyAdmin, registerNewAdmin);
router.post('/forgetPassword', recoverPassword);
router.get("/verifyToken/:token", verifyResetToken);
router.post("/resetPassword", resetPassword);

export default router;