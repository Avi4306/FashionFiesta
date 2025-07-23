import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ dest: 'temp_uploads/' });



router.get("/", (req, res) => {
  res.send("🔥 Server is alive");
});

router.get("/user",(req,res)=>
{
    res.send("!USER PAGE");
})


router.post('/recommend/:id',async (req,res)=>{

    const {id} = req.body

     try {
    const response = await axios.post('http://localhost:5000/recommend', { id });
    res.json(response.data);
  } catch (error) {
    console.error('Flask error:', error.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
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




export default router;
