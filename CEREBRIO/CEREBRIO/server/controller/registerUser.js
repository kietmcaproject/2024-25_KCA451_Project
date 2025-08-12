// const UserModel = require("../models/UserModel")
// const bcryptjs = require('bcryptjs')

// async function registerUser(request,response){
//     try {
//         const { name, email , password, profile_pic } = request.body

//         const checkEmail = await UserModel.findOne({ email }) //{ name,email}  // null

//         if(checkEmail){
//             return response.status(400).json({
//                 message : "Already user exits",
//                 error : true,
//             }) 
//         }

//         //password into hashpassword
//         const salt = await bcryptjs.genSalt(10)
//         const hashpassword = await bcryptjs.hash(password,salt)

//         const payload = {
//             name,
//             email,
//             profile_pic,
//             password : hashpassword
//         }

//         const user = new UserModel(payload)
//         const userSave = await user.save()

//         return response.status(201).json({
//             message : "User created successfully",
//             data : userSave,
//             success : true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true
//         })
//     }
// }

// module.exports = registerUser



const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

// async function registerUser(req, res) {
//     try {
//         const { name, email, password } = req.body;
//         const profilePic = req.file; // Access file from multer

//         // Check if user already exists
//         const checkEmail = await UserModel.findOne({ email });
//         if (checkEmail) {
//             return res.status(400).json({
//                 message: "User already exists",
//                 error: true,
//             });
//         }

//         // Hash the password
//         const salt = await bcryptjs.genSalt(10);
//         const hashPassword = await bcryptjs.hash(password, salt);

//         // Upload profile_pic to Cloudinary if provided
//         let uploadedImageUrl = null;
//         if (profilePic) {
//             try {
//                 const uploadedImage = await cloudinary.uploader.upload(profilePic.path, {
//                     folder: "user_profiles",
//                     transformation: { width: 500, height: 500, crop: "limit" },
//                 });
//                 uploadedImageUrl = uploadedImage.secure_url;
//             } catch (uploadError) {
//                 console.error("Error uploading image:", uploadError);
//                 return res.status(500).json({
//                     message: "Failed to upload profile picture.",
//                     error: true,
//                 });
//             }
//         }

//         // Prepare user data
//         const payload = {
//             name,
//             email,
//             profile_pic: uploadedImageUrl,
//             password: hashPassword,
//         };

//         // Save user to database
//         const user = new UserModel(payload);
//         const userSave = await user.save();

//         return res.status(201).json({
//             message: "User created successfully",
//             data: userSave,
//             success: true,
//         });
//     // } catch (error) {
//     //     console.error("Error in registerUser:", error);
//     //     return res.status(500).json({
//     //         message: "Internal server error",
//     //         error: true,
//     //     });
//     // }
//      } catch (error) {
//         console.error("Error in registerUser:", error); // Log the full error object for debugging
      
//         // Check for duplicate email error (MongoDB code 11000)
//         if (error.code === 11000) {
//           return response.status(400).json({
//             message: "Email already registered. Please use a different email.",
//             error: true
//           });
//         }
      
//         // Check for Mongoose validation errors
//         if (error.name === 'ValidationError') {
//           const errors = Object.values(error.errors).map(err => err.message);
//           return response.status(400).json({
//             message: errors.join(', '), // Combine error messages for easy display
//             error: true
//           });
//         }
      
//         // Fallback for any other errors
//         return response.status(500).json({
//           message: "Internal server error",
//           error: true
//         });
//       }


// }

// module.exports = { registerUser };
// const UserModel = require("../models/UserModel");
// const bcryptjs = require("bcryptjs");
// const cloudinary = require("cloudinary").v2;

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
       
       //cloud 
        const profilePic = req.file; // File from multer middleware

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                error: true,
            });
        }

        // Hash the user's password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Upload profile picture to Cloudinary if provided
        let profilePicUrl = "";
        if (profilePic) {
            try {
                const uploadedImage = await cloudinary.uploader.upload(profilePic.path, {
                    folder: "user_profiles",
                    transformation: { width: 500, height: 500, crop: "limit" },
                });
                profilePicUrl = uploadedImage.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload profile picture.",
                    error: true,
                });
            }
        }

        // Prepare user data for saving
        const newUser = new UserModel({
            name,
            email,
            profile_pic: profilePicUrl,
            password: hashedPassword,
        });

        // Save user to database
        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            data: savedUser,
            success: true,
        });
    } catch (error) {
        console.error("Error in registerUser:", error);

        // Duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already registered. Please use a different email.",
                error: true,
            });
        }

        // Validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                message: validationErrors.join(', '),
                error: true,
            });
        }

        // General server error
        return res.status(500).json({
            message: "Internal server error",
            error: true,
        });
    }
}

module.exports = { registerUser };
