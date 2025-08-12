import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛠️ Cloudinary Config
cloudinary.config({
  cloud_name: "dl2voyvek",
  api_key: "585564895938448",
  api_secret: "VXOqMXDurrbOjEgA_OgkcZAPnl4",
});

// 🛠️ Multer Config (Temporary Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };

