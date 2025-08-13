import { MongoClient } from "mongodb";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoURI = process.env.MONGO_URI;
const dbName = "test";
const collectionName = "products";
const imageDir = path.join(__dirname, "../flask/scan_and_search/static/dataset_images");

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

async function downloadImage(url, filename) {
    const encodedUrl = encodeURI(url);
    try {
        const response = await axios({
            url: encodedUrl,
            method: "GET",
            responseType: "stream",
            timeout: 10000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const filePath = path.join(imageDir, filename);
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log(`✅ Image saved: ${filePath}`);
                resolve();
            });
            writer.on("error", (err) => {
                console.error("❌ Error writing image:", err);
                reject(err);
            });
        });
    } catch (err) {
        console.error(`❌ Failed to download image from ${url}:`, err.message);
    }
}

function getValidImageExtension(imageUrl) {
    let ext = path.extname(imageUrl.split("?")[0]).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
}

function getImageUrls(product) {
    // Try different possible field names for images
    const possibleFields = [
        'imageURL',
        'images',
        'imageUrls',
        'image_urls',
        'imageLinks',
        'photos',
        'pictures'
    ];
    
    for (const field of possibleFields) {
        if (product[field]) {
            const urls = product[field];
            
            // If it's a string, convert to array
            if (typeof urls === 'string') {
                return [urls];
            }
            
            // If it's already an array, return it
            if (Array.isArray(urls)) {
                return urls;
            }
        }
    }
    
    // If no image fields found, return empty array
    return [];
}

async function downloadAllExistingImages(collection) {
    const products = await collection.find({}).toArray();
    console.log(`🔍 Found ${products.length} products in DB. Starting image download...`);

    let totalImages = 0;
    let downloadedImages = 0;
    let skippedImages = 0;

    for (const product of products) {
        const imageURLs = getImageUrls(product);
        
        if (imageURLs.length > 0) {
            totalImages += imageURLs.length;
            console.log(`📦 Product ${product._id} has ${imageURLs.length} image(s)`);
            
            for (let i = 0; i < imageURLs.length; i++) {
                const url = imageURLs[i];
                if (typeof url === "string" && /^https?:\/\//i.test(url)) {
                    const ext = getValidImageExtension(url);
                    const imageName = `${product._id}_${i}${ext}`;
                    const imagePath = path.join(imageDir, imageName);
                    
                    if (!fs.existsSync(imagePath)) {
                        console.log(`⬇️ Downloading image: ${url} → ${imageName}`);
                        await downloadImage(url, imageName);
                        downloadedImages++;
                        
                        // Add a small delay to avoid overwhelming the server
                        await new Promise(resolve => setTimeout(resolve, 100));
                    } else {
                        console.log(`🟡 Already exists: ${imageName}`);
                        skippedImages++;
                    }
                } else {
                    console.log(`⚠️ Product ${product._id} has invalid image URL at index ${i}:`, url);
                }
            }
        } else {
            console.log(`⚠️ Product ${product._id} has no valid image fields. Available fields:`, Object.keys(product));
        }
    }
    
    console.log("✅ Finished downloading existing images.");
    console.log(`📊 Summary: ${totalImages} total images, ${downloadedImages} downloaded, ${skippedImages} skipped`);
}

async function main() {
    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        console.log("🔗 Connected to MongoDB");
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // First, let's check what fields the products actually have
        const sampleProduct = await collection.findOne({});
        if (sampleProduct) {
            console.log("🔍 Sample product fields:", Object.keys(sampleProduct));
            console.log("🖼️ Image-related fields found:");
            
            const imageFields = Object.keys(sampleProduct).filter(key => 
                key.toLowerCase().includes('image') || 
                key.toLowerCase().includes('photo') || 
                key.toLowerCase().includes('picture')
            );
            
            imageFields.forEach(field => {
                console.log(`  - ${field}:`, typeof sampleProduct[field], Array.isArray(sampleProduct[field]) ? `(array with ${sampleProduct[field].length} items)` : '');
            });
        }

        await downloadAllExistingImages(collection);

        console.log("👀 Watching MongoDB for new product inserts...");
        const changeStream = collection.watch([{ $match: { operationType: "insert" } }]);
        
        changeStream.on("change", async (change) => {
            const newProduct = change.fullDocument;
            console.log(`🆕 New product detected: ${newProduct._id}`);
            
            const imageURLs = getImageUrls(newProduct);
            
            if (imageURLs.length > 0) {
                console.log(`📦 New product has ${imageURLs.length} image(s)`);
                
                for (let i = 0; i < imageURLs.length; i++) {
                    const url = imageURLs[i];
                    if (typeof url === "string" && /^https?:\/\//i.test(url)) {
                        const ext = getValidImageExtension(url);
                        const imageName = `${newProduct._id}_${i}${ext}`;
                        console.log(`⬇️ Downloading new image: ${url} → ${imageName}`);
                        await downloadImage(url, imageName);
                    } else {
                        console.log(`⚠️ New product ${newProduct._id} has invalid image URL at index ${i}:`, url);
                    }
                }
            } else {
                console.log(`⚠️ New product ${newProduct._id} has no valid image fields. Available fields:`, Object.keys(newProduct));
            }
        });

        changeStream.on("error", (error) => {
            console.error("❌ Change stream error:", error);
        });

    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        
        // If connection fails, still create the directory structure
        console.log("📁 Creating image directory structure for sample data...");
        
        // You can add some sample images here if needed
        console.log(`📁 Image directory ready: ${imageDir}`);
    }
}

main().catch(console.error);