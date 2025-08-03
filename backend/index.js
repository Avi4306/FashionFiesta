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
import productRouter from './routes/productRoutes.js';
import authRouter from './routes/authRoutes.js'
import cartRouter from './routes/cartRoutes.js';
import './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js';
import donationRouter from './routes/donationRoutes.js';
import outfitRouter from './routes/outfitRoutes.js';

dotenv.config();
const app = express();

app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors()); // Enable CORS for all routes (should be above routes)
app.use(cors({
  origin: 'https://fashion-fiesta-gl17.vercel.app'
}));
app.use(express.json());
app.use('/',router)
app.use('/style-diaries', styleDiariesRouter)
app.use('/user', userRouter)
app.use('/products', productRouter)
app.use('/auth', authRouter)
app.use('/cart', cartRouter)
app.use('/admin', adminRouter)
app.use('/donations', donationRouter)
app.use('/outfit-of-the-week', outfitRouter)


app.listen(process.env.PORT, () => {
    connectDB();
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});
