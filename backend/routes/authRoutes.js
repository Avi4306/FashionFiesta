import express from 'express'
import {requestOtpSignup, verifyOtpAndSignup} from '../controller/user.controller.js'
const authRouter = express.Router()

authRouter.post("/signup/send-otp", requestOtpSignup);
authRouter.post("/signup/verify", verifyOtpAndSignup);

export default authRouter