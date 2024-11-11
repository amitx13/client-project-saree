import express from 'express';
import multer from "multer";
import { activateUserAccount, addProduct, createMultipleActivationCodes, createRewards, deleteProduct, dispatchOrder, getAllUsers } from '../controllers/adminController/adminController';
import { completeWithdrawalRequest, rejectWithdrawalRequest } from '../controllers/adminController/adminController';

const router = express.Router();

const upload = multer({ dest: "uploads/" });

//Get routes

router.get('/getAllUsers',getAllUsers)

//Post routes

router.post('/addproduct', upload.single("image"), addProduct)
router.post('/generateActivationCode', createMultipleActivationCodes)
router.post('/createRewards',createRewards)
router.post('/activateUserAccount',activateUserAccount)

//Put routes

router.put('/dispatchproduct', dispatchOrder)
router.put('/rejectWithdrawalRequest/:requestId', rejectWithdrawalRequest)
router.put('/completeWithdrawalRequest/:requestId', completeWithdrawalRequest)

//Delete routes

router.delete('/deleteproduct', deleteProduct)

export default router;