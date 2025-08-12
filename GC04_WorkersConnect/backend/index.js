import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import { cloudinary, upload } from "./utils/multerAndCloudinary.js";
import fs from "fs";
import { log } from "console";
const app = express();
app.use(express.json());
app.use(cors());

// 🛠️ Cloudinary Config

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "WorkerConnect",
  password: "sa",
  port: 5432,
});

// Route to add a user
app.post("/api/addUser", async (req, res) => {
  // Changed app.use() to app.post()
  try {
    const { name, email, age, password } = req.body;

    if (!name || !email || !age || !password) {
      return res.status(400).json({
        msg: "EMAIL, NAME, AGE, or PASSWORD is missing",
        success: false,
      });
    }

    // Check if user already exists
    const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (checkUser.rows.length > 0) {
      return res.status(409).json({
        msg: "User already exists",
        success: false,
      });
    }

    // Insert user (no password hashing)
    const newUser = await pool.query(
      "INSERT INTO users(name, email, age, password) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, age, password], // Raw password, just for testing
    );

    res.status(201).json({
      msg: "User added successfully",
      user: newUser.rows[0],
      success: true,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});


app.post("/api/updateUser/:id", async (req, res) => {
  try {
    const { name, email, age, password, address, phone_number, username } =
      req.body;
    const userid = req.params.id;

    if (
      !name ||
      !email ||
      !age ||
      !password ||
      !address ||
      !username ||
      !phone_number
    ) {
      return res.status(400).json({
        msg: "EMAIL, NAME, AGE, PASSWORD, or ADDRESS is missing",
        success: false,
      });
    }

    // Check if user exists
    const checkUser = await pool.query("SELECT * FROM users WHERE id=$1", [
      userid,
    ]);

    if (checkUser.rows.length < 1) {
      return res.status(404).json({
        // Fix: Use 404 for "User not found"
        msg: "User does not exist",
        success: false,
      });
    }

    // Update user information
    const updatedUser = await pool.query(
      "UPDATE users SET name=$1, email=$2, password=$3, address=$4, age=$5 , username=$6,phone_number=$7 WHERE id=$8 RETURNING *", // Fix: "UPDATE" spelling
      [name, email, password, address, age, username, phone_number, userid],
    );

    if (updatedUser.rowCount === 0) {
      // Fix: Check if update was successful
      return res.status(500).json({
        msg: "Failed to update user",
        success: false,
      });
    }

    res.status(200).json({
      // Fix: Use 200 for a successful update
      msg: "User updated successfully",
      user: updatedUser.rows[0], // Return updated user data
      success: true,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

//TODO: Update profile_pic_url , by accepting an image using multer and cloudinary

// 🛠️ Upload API
app.post(
  "/api/uploadProfilePic/:id",
  upload.single("profile_pic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          msg: "No image received in request",
          success: false,
        });
      }

      const userid = req.params.id;
      // Check if user exists
      const checkUser = await pool.query("SELECT * FROM users WHERE id=$1", [
        userid,
      ]);

      if (checkUser.rows.length < 1) {
        return res.status(404).json({
          msg: "User does not exist",
          success: false,
        });
      }

      console.log("Uploading file:", req.file.path);

      // 🚀 Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "march1",
      });

      console.log("Upload successful:", result);

      // Delete file after upload completes
      fs.unlinkSync(req.file.path);

      const dbUploader = result.secure_url; // ✅ Fixed variable name
      console.log(dbUploader);

      // 🛠️ Update user profile picture URL in DB
      const updateProfile = await pool.query(
        "UPDATE users SET profile_pic_url=$1 WHERE id=$2 RETURNING *",
        [dbUploader, userid],
      );

      if (updateProfile.rowCount === 0) {
        return res.status(404).json({
          msg: "User not found",
          success: false,
        });
      }

      res.status(200).json({
        msg: "Profile picture updated successfully",
        url: result.secure_url,
        user: updateProfile.rows[0], // ✅ Return updated user
        success: true,
      });
    } catch (error) {
      console.error("Upload failed:", error);

      // 🛑 Ensure we delete the file even if Cloudinary upload fails
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        error: "Upload failed",
        success: false,
      });
    }
  },
);

// 🛠️ Create a Post (With Optional Images)
app.post("/api/upload/post", upload.array("images", 5), async (req, res) => {
  try {
    const { user_id, text_content, location, price_per_hour, servicetype } =
      req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ msg: "User ID is required", success: false });
    }

    // 🛠️ Insert post into database
    const postResult = await pool.query(
      "INSERT INTO posts (user_id, text_content,price_per_hour,servicetype,location) VALUES ($1, $2,$3,$4,$5) RETURNING *",
      [user_id, text_content, price_per_hour, servicetype, location],
    );

    const postId = postResult.rows[0].id;
    let uploadedImages = [];

    console.log(`====================Req.files=================`, req.files);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // 🌥️ Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "posts",
        });

        // 🚀 Save URL in database
        const imageResult = await pool.query(
          "INSERT INTO post_images (post_id, image_url) VALUES ($1, $2) RETURNING *",
          [postId, result.secure_url],
        );

        uploadedImages.push(imageResult.rows[0]);

        // 🗑️ Delete file after Cloudinary upload
        fs.unlinkSync(file.path);
      }
    }

    res.status(201).json({
      msg: "Post created successfully",
      post: postResult.rows[0],
      images: uploadedImages,
      success: true,
    });
  } catch (error) {
    //TODO: kcuh karo failed ifles ka
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Post upload failed:", error);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
});

// ✅ Get all users with their posts and images
app.get("/api/getALL", async (req, res) => {
  try {
    // 🛠️ Fetch all users with their posts and images
    const allUsers = await pool.query(`
      SELECT 
        u.id AS user_id, 
        u.name, 
        u.email, 
        u.profile_pic_url, 
        u.username,
        u.phone_number,
        p.id AS post_id, 
        p.text_content, 
        p.location,p.servicetype,p.price_per_hour,
        pi.image_url
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN post_images pi ON p.id = pi.post_id
      ORDER BY u.id, p.id;
    `);

    // 🔄 Restructure data for easier readability
    const usersMap = new Map();

    allUsers.rows.forEach((row) => {
      if (!usersMap.has(row.user_id)) {
        usersMap.set(row.user_id, {
          user_id: row.user_id,
          name: row.name,
          email: row.email,
          profile_pic_url: row.profile_pic_url,
          posts: [],
        });
      }

      if (row.post_id) {
        let user = usersMap.get(row.user_id);
        let postIndex = user.posts.findIndex((p) => p.post_id === row.post_id);

        if (postIndex === -1) {
          user.posts.push({
            post_id: row.post_id,
            text_content: row.text_content,
            images: row.image_url ? [row.image_url] : [],
          });
        } else {
          user.posts[postIndex].images.push(row.image_url);
        }
      }
    });

    // ✅ Send response
    res.status(200).json({
      msg: "Fetched all users with posts and images",
      success: true,
      data: Array.from(usersMap.values()),
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
