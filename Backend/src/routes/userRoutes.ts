import express from 'express';
import { createOrder } from '../controllers/userController/userOrderController';
import { createWithdrawalRequest } from '../controllers/userController/userWithdrawController';
import { activateAccountWithCode } from '../controllers/userController/userActivateAccountController';
import { getUserData, getUserRewardData, getUserTeamData, getUserWalletData } from '../controllers/userController/getUserData';
import { claimReward } from '../controllers/userController/userRewardController';

const router = express.Router();

router.get('/getdata/:id',getUserData);
router.get('/myTeamData/:id',getUserTeamData);
router.get('/getWalletData/:id',getUserWalletData);
router.get('/getUserRewardData/:id',getUserRewardData);
router.post('/order',createOrder);
router.post('/withdraw',createWithdrawalRequest);
router.post('/claimReward',claimReward);
router.post('/activateAccount',activateAccountWithCode);

export default router;
