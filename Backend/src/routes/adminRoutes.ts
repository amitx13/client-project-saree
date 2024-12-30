import express from 'express';
import multer from "multer";
import { activateUserAccount, addProduct, createMultipleActivationCodes, createMultipleActivationCodesAndTransfer, createRewards, deleteProduct, dispatchOrder, getAllCodes, getAllOrdersDetails, getAllProducts, getAllUsers, getAllWithdrawalRequests, getDashboardData, updateProductStock, updateUserData } from '../controllers/adminController/adminController';
import { completeWithdrawalRequest, rejectWithdrawalRequest } from '../controllers/adminController/adminController';

const router = express.Router();

const upload = multer({ dest: "uploads/" });

//Get routes

router.get('/getAllUsers',getAllUsers)
router.get('/getAllOrdersDetails',getAllOrdersDetails)
router.get('/getAllWithdrawalRequests',getAllWithdrawalRequests)
router.get('/fetchAllProducts',getAllProducts)
router.get('/fetchDashboardData',getDashboardData)
router.get('/getAllAdminCodes',getAllCodes)
//Post routes

router.post('/addproduct', upload.single("image"), addProduct)
router.post('/generateActivationCode', createMultipleActivationCodes)
router.post('/TransferActivationCode', createMultipleActivationCodesAndTransfer)
router.post('/createRewards',createRewards)
router.post('/activateUserAccount',activateUserAccount)

//Put routes
router.put('/updateUserData',updateUserData)
router.put('/updateProductStock',updateProductStock)
router.put('/dispatchproduct', dispatchOrder)
router.put('/rejectWithdrawalRequest', rejectWithdrawalRequest)
router.put('/completeWithdrawalRequest', completeWithdrawalRequest)

//Delete routes

router.delete('/deleteproduct/:id', deleteProduct)

export default router;