import express from 'express';
import multer from "multer";
import { activateUserAccount, addProduct, createMultipleActivationCodes, createMultipleActivationCodesAndTransfer, createRewards, deleteProduct, dispatchOrder, getAllCodes, getAllOrdersDetails, getAllProducts, getAllUsers, getAllWithdrawalRequests, getDashboardData, updateProductStock, updateUserData } from '../controllers/adminController/adminController';
import { completeWithdrawalRequest, rejectWithdrawalRequest } from '../controllers/adminController/adminController';
import { getAllUsersTransactionDetails, updateRequestCodeTransactionDetails } from '../controllers/adminController/getTransactionDetails';

const router = express.Router();

const upload = multer({ dest: "uploads/" });

//Get routes

router.get('/getAllUsers',getAllUsers)
router.get('/getAllOrdersDetails',getAllOrdersDetails)
router.get('/getAllWithdrawalRequests',getAllWithdrawalRequests)
router.get('/fetchAllProducts',getAllProducts)
router.get('/fetchDashboardData',getDashboardData)
router.get('/getAllAdminCodes',getAllCodes)
router.get('/getAllUsersTransactionDetails',getAllUsersTransactionDetails)
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
router.put('/updateRequestCodeTransactionDetails', updateRequestCodeTransactionDetails)

//Delete routes

router.delete('/deleteproduct/:id', deleteProduct)

export default router;