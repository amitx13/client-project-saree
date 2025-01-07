import express from 'express';
import { createOrder, getAllReceivedCodes, getUserOrderStatus, transferActivationCode } from '../controllers/userController/userOrderController';
import { createWithdrawalRequest } from '../controllers/userController/userWithdrawController';
import { activateAccountWithCode } from '../controllers/userController/userActivateAccountController';
import { getProfileData, getUserData, getUserRewardData, getUserTeamData, getUserWalletData, getuserWelcomedata } from '../controllers/userController/getUserData';
import { claimReward } from '../controllers/userController/userRewardController';
import { addTransactionDetails, getUserTransactionData, updateUserData } from '../controllers/userController/updateUserData';
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get('/getdata/:id',getUserData);
router.get('/profiledata/:id',getProfileData);
router.get('/myTeamData/:id',getUserTeamData);
router.get('/getWalletData/:id',getUserWalletData);
router.get('/getUserRewardData/:userid',getUserRewardData);
router.get('/userOrderStatus/:id',getUserOrderStatus);
router.get('/getAllReceivedCode/:id',getAllReceivedCodes);
router.get('/getuserWelcomedata/:id',getuserWelcomedata)
router.get('/transactionData/:id',getUserTransactionData);

router.post('/order',createOrder);
router.post('/withdraw',createWithdrawalRequest);
router.post('/claimReward',claimReward);
router.post('/activateAccount',activateAccountWithCode);
router.post('/TransferActivationCode', transferActivationCode)
router.post('/updateUserData',updateUserData);
router.post('/transferActivationCode', transferActivationCode)
router.post('/transactionDetails', upload.single("image"), addTransactionDetails);
export default router;
