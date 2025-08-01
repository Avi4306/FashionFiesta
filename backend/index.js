import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import styleDiariesRouter from './routes/styleDiariesRoutes.js';
import userRouter from './routes/userRoutes.js';
<<<<<<< HEAD
import productRouter from './routes/productRoutes.js';
import authRouter from './routes/authRoutes.js'
import cartRouter from './routes/cartRoutes.js';
import './config/cloudinary.js'
=======
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

dotenv.config();
const app = express();

app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors()); // Enable CORS for all routes (should be above routes)
app.use(express.json());
app.use('/',router)
app.use('/style-diaries', styleDiariesRouter)
app.use('/user', userRouter)
<<<<<<< HEAD
app.use('/products', productRouter)
app.use('/auth', authRouter)
app.use('/cart', cartRouter)
=======

>>>>>>> 64722959962531026d09982e49c0503bfb053ecf


app.listen(process.env.PORT, () => {
    connectDB();
<<<<<<< HEAD
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
=======
  console.log(`Server is running on port http://localhost:${process.env.PORT || PORT}`);
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
});
