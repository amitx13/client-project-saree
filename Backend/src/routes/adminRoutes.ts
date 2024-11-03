import express from 'express';
import multer from "multer";
import { addProduct, createMultipleActivationCodes, createRewards, deleteProduct, dispatchOrder } from '../controllers/adminController/adminController';
import { completeWithdrawalRequest, rejectWithdrawalRequest } from '../controllers/adminController/adminController';

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post('/addproduct', upload.single("image"), addProduct)
router.delete('/deleteproduct', deleteProduct)
router.put('/dispatchproduct', dispatchOrder)
router.put('/completeWithdrawalRequest/:requestId', completeWithdrawalRequest)
router.put('/rejectWithdrawalRequest/:requestId', rejectWithdrawalRequest)
router.post('/generateActivationCode', createMultipleActivationCodes)
router.post('/createRewards',createRewards)

export default router;