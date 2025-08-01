import express from 'express';
<<<<<<< HEAD
=======
// import { createUser, getUser, updateUser, deleteUser } from '../controller/user.controller.js';
import { createProduct, getProduct, updateProduct, deleteProduct} from '../controller/product.controller.js';
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import FormData from 'form-data';
<<<<<<< HEAD
import { uploadImageToCloudinary } from '../controller/upload.js';
import { getFeaturedDesigners } from '../controller/user.controller.js';
// import {genotp , sendotp} from '../controller/auth.controller'
=======

>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ dest: 'temp_uploads/' });

<<<<<<< HEAD
router.post('/upload', uploadImageToCloudinary);
router.get('/users/featured-designers', getFeaturedDesigners)
=======

>>>>>>> 64722959962531026d09982e49c0503bfb053ecf

router.get("/", (req, res) => {
  res.send("🔥 Server is alive");
});

router.get("/user",(req,res)=>
{
    res.send("!USER PAGE");
})


<<<<<<< HEAD
router.post('/recommend/:id',async (req,res)=>{

    const {id} = req.params
    console.log("Received ID from frontend:", id);
=======
// router.delete('/user/:id',deleteUser);
// router.put('/user/:id',updateUser);
// router.get('/user/:name',getUser);


router.post('/product',createProduct);

router.delete('/product/:id',deleteProduct);
router.put('/product/:id',updateProduct);
router.get('/product/:name',getProduct);

router.post('/recommend/:id',async (req,res)=>{

    const {id} = req.body

>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
     try {
    const response = await axios.post('http://localhost:5000/recommend', { id });
    res.json(response.data);
  } catch (error) {
<<<<<<< HEAD
    console.error('Error calling Flask server:');
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
    }
    res.status(500).json({ error: 'Recommendation failed' });
}
=======
    console.error('Flask error:', error.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
});

router.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '../../flask/scan_and_search/templates/index.html'));
});

router.post('/search', upload.single('image'), async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const form = new FormData();
    console.log("cheackpoint1")
    form.append('image', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
     console.log("cheackpoint2")
    const response = await axios.post('http://localhost:5000/search', form, {
      headers: form.getHeaders(), // ✅ Don't manually set Content-Length unless needed
      maxBodyLength: Infinity
    });
     console.log("cheackpoint3")
    fs.unlinkSync(filePath);
     console.log("cheackpoint4")
    res.json(response.data);
     console.log("cheackpoint5")
  } catch (error) {
    console.error('❌ Flask /search error:', error.message);
    if (error.response) {
      console.error('🪵 Response:', error.response.data);
    }
    res.status(500).json({ error: 'Search failed' });
  }
});

<<<<<<< HEAD
// const otpcache = {};

// router.post('/signup', async (req, res) => {
//   const { email, otp, skipVerify, ...rest } = req.body;

//   if (skipVerify) {
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//     await sendEmail(email, otpCode); // Use nodemailer or similar
//     await OTP.create({ email, code: otpCode }); // store OTP temporarily
//     return res.json({ otpSent: true, otp: otpCode }); // return otp in dev
//   }

//   const existingOtp = await OTP.findOne({ email });
//   if (!existingOtp || existingOtp.code !== otp) {
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }

//   // proceed with actual signup
//   const user = await User.create({ email, ...rest });
//   res.status(201).json({ result: user });
// });

=======
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf



export default router;
