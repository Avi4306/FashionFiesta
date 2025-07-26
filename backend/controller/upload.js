// controllers/upload.js
import { v2 as cloudinary } from 'cloudinary';

export const uploadImageToCloudinary = async (req, res) => {
    try {
        // Assume the request body now contains a field called 'folderName'
        const { fileData, folderName } = req.body; 
        
        if (!fileData || !folderName) {
            return res.status(400).json({ message: "Image data and folder name are required." });
        }
        
        // Use a whitelist to ensure only valid folder names are used
        const validFolders = ["posts", "products"];
        if (!validFolders.includes(folderName)) {
            return res.status(400).json({ message: "Invalid folder name provided." });
        }

        const result = await cloudinary.uploader.upload(fileData, {
            folder: `your_app_name/${folderName}`, // A good practice is to namespace your folders
        });

        res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ message: "Image upload failed." });
    }
};