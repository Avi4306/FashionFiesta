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

async function downloadAllExistingImages(collection) {
    const products = await collection.find({}).toArray();
    console.log(`🔍 Found ${products.length} products in DB. Starting image download...`);

    for (const product of products) {
        const imageURLs = product.imageURL;
        if (Array.isArray(imageURLs) && imageURLs.length > 0) {
            for (let i = 0; i < imageURLs.length; i++) {
                const url = imageURLs[i];
                if (typeof url === "string" && /^https?:\/\//i.test(url)) {
                    const ext = getValidImageExtension(url);
                    const imageName = `${product._id}_${i}${ext}`;
                    const imagePath = path.join(imageDir, imageName);
                    if (!fs.existsSync(imagePath)) {
                        console.log(`⬇️ Downloading image: ${url} → ${imageName}`);
                        await downloadImage(url, imageName);
                    } else {
                        console.log(`🟡 Already downloaded: ${imageName}`);
                    }
                } else {
                    console.log(`⚠️ Product ${product._id} has invalid imageURL at index ${i}:`, url);
                }
            }
        } else {
            console.log(`⚠️ Product ${product._id} missing or invalid imageURL field:`, imageURLs);
        }
    }
    console.log("✅ Finished downloading existing images.");
}

async function main() {
    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await downloadAllExistingImages(collection);

        console.log("👀 Watching MongoDB for new product inserts...");
        const changeStream = collection.watch([{ $match: { operationType: "insert" } }]);
        changeStream.on("change", async (change) => {
            const newProduct = change.fullDocument;
            const imageURLs = newProduct.imageURL;
            if (Array.isArray(imageURLs) && imageURLs.length > 0) {
                for (let i = 0; i < imageURLs.length; i++) {
                    const url = imageURLs[i];
                    if (typeof url === "string" && /^https?:\/\//i.test(url)) {
                        const ext = getValidImageExtension(url);
                        const imageName = `${newProduct._id}_${i}${ext}`;
                        console.log(`⬇️ Downloading new image: ${url} → ${imageName}`);
                        await downloadImage(url, imageName);
                    } else {
                        console.log(`⚠️ New product ${newProduct._id} has invalid imageURL at index ${i}:`, url);
                    }
                }
            } else {
                console.log(`⚠️ New product ${newProduct._id} missing or invalid imageURL field:`, imageURLs);
            }
        });
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
    }
}
main();
