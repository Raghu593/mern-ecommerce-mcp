import express from "express";
const router=express.Router();
import {initiatePayment,verifyPayment} from '../controllers/PaymentController.js'
import {protect} from '../middleware/authMiddleware.js'

// router.post('/login',authUser);
// router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
// router.route('/').post(registerUser);

router.route('/initiatepayment').post(protect,initiatePayment);
router.route('/verifypayment').post(protect,verifyPayment);

export default router