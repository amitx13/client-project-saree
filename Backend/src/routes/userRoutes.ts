import express from 'express';
import { createOrder, getUserOrderStatus } from '../controllers/userController/userOrderController';
import { createWithdrawalRequest } from '../controllers/userController/userWithdrawController';
import { activateAccountWithCode } from '../controllers/userController/userActivateAccountController';
import { getProfileData, getUserData, getUserRewardData, getUserTeamData, getUserWalletData } from '../controllers/userController/getUserData';
import { claimReward } from '../controllers/userController/userRewardController';
import { updateUserData } from '../controllers/userController/updateUserData';

const router = express.Router();

router.get('/getdata/:id',getUserData);
router.get('/profiledata/:id',getProfileData);
router.get('/myTeamData/:id',getUserTeamData);
router.get('/getWalletData/:id',getUserWalletData);
router.get('/getUserRewardData/:userid',getUserRewardData);
router.get('/userOrderStatus/:id',getUserOrderStatus);

router.post('/order',createOrder);
router.post('/withdraw',createWithdrawalRequest);
router.post('/claimReward',claimReward);
router.post('/activateAccount',activateAccountWithCode);
router.post('/updateUserData',updateUserData);

export default router;
