import express from 'express';
import router from './routes/routes.js';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import path from 'path';


dotenv.config();
const app = express();


app.use(express.json());
app.use('/',router)



app.listen(process.env.PORT, () => {
    connectDB();
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
