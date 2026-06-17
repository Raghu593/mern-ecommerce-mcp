import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import {protect} from '../middleware/authMiddleware.js'
import dotenv from 'dotenv';
import uniqid from 'uniqid';

dotenv.config()

const keyid=process.env.key_id
const keysecret=process.env.key_secret


//Create PaymentOrder
//route POST /initiatepayment
//@access Private
const initiatePayment = asyncHandler(async(req,res)=>{
  try{
    var instance = new Razorpay({ key_id: keyid, key_secret: keysecret })
    var options = {
      amount: req.body.amount*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options,(error, order)=>{
      if(error){
        console.log(error)
          return res.status(500).json({
              message:"Something went wrong!"
          })
      }
        res.status(200).json({data:order});
    });
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Internal Server Error"});
   }
  })


//Create verifyPayment
//route POST /createOrder
//@access Private
const verifyPayment = asyncHandler(async(req,res)=>{
                try{

                    const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature}=req.body

                const sign=razorpay_order_id+ "|" + razorpay_payment_id ;
                
                const expectedSign = crypto
                .createHmac("sha256", process.env.KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

                // const generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, keysecret);
                if (razorpay_signature === expectedSign) {
                  return res.status(200).json({message:"Payment verified Successfully"})
                  }else{
                    return res.status(400).json({message:"Invalid signature Sent"})
                  }
                }catch(error){
                    console.log(error)
                    res.status(500).json({message:"Internal Server Error"});
                }
     })

     export {initiatePayment,verifyPayment}