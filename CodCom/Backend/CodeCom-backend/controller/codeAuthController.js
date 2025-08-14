import { sendResetPasswordEmail, sendSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../Email/email.js";
import { User } from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import crypto  from 'crypto';

import dotenv from 'dotenv'
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
dotenv.config()

export const signup=async(req,res)=>{
    
    const {email,password,name} = req.body;
    try {
        if(!email||!name||!password){
           throw new Error("All fields are required")
        }

        const userAlreadyExist=await User.findOne({email})
        
        if(userAlreadyExist){
          return   res.status(400).json({success: false,message: "User already exists"})
        }
        console.log("1");
        const hashedPassword =  await bcryptjs.hash(password,10);  
        const verificationToken= Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          
          const user= new User(
            {
                email,
                password: hashedPassword,
                name,
                verificationToken:verificationToken,
                verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000,
            }
          )
          await user.save();
          await generateTokenAndSetCookie(res,user._id)
         sendVerificationEmail(user.email,verificationToken)
           res.status(201).json({success:true, message:"User created successfully",
            user:{
                ...user._doc,
                 password:undefined
            }
          })


        
    } catch (error) {
   res.status(400).json({success: false,message:error.message})
        
        
    }
}
export const forgotPassword=async(req,res)=>{
    const {email}= req.body;
    try {
            const user= await User.findOne({email})

            if(!user){
                return res.status(400).json({success: false,message:"User not found"})
            }
            const resetToken= crypto.randomBytes(20).toString('hex')
            const resetTokenExpires= Date.now()+1*60*60*1000
            user.resetToken=resetToken
            user.resetTokenExpiration=resetTokenExpires
            await user.save();
            await sendResetPasswordEmail(user.email,`${process.env.RESET_URL}/forgot-password/${resetToken}`)
            res.status(200).json({success:true, message:"Reset password link sent successfully"})

    } catch (error) {
console.log("Error sending mail",error);

        res.status(400).json({success: false,message:error.message})
        
    }
}
export const resetPassword=async(req,res)=>{
    const {token}=req.params;
    const {password}=req.body;
    try {
        const user= await User.findOne(
            {
                resetToken:token,
                resetTokenExpiration:{$gt:Date.now()}
            }
        )
        if(!user) {
            return res.status(400).json({success: false,message:"Invalid or Expired Token"})
        }
        const hashedPassword =  await bcryptjs.hash(password,10);
        user.password=hashedPassword;
        user.resetToken=undefined;
        user.resetTokenExpiration=undefined;
        await user.save();
        await sendSuccessEmail(user.email)


        res.status(200).json({success:true, message:"Password reset successfully"})

    } catch (error) {
        console.log("error reseting password",error);
        res.status(400).json({success: false,message:"Password reset failed"})
        
        
    }
}

export const verifyEmail=async(req,res)=>{
    const {code}=req.body;
    try {
        const user= await User.findOne(
            {
                verificationToken:code,
                verificationTokenExpiresAt:{$gt:Date.now()}
            }
        )
        if(!user){
            return res.status(400).json({success: false,message:"Invalid or Expired Token"})
        }
        user.isVerified = true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined;
        await user.save()
        await sendWelcomeEmail(user.name, user.email)
        
        res.status(200).json({success:true, message:"Email verified successfully"})
    } catch (error) {
            res.status(400).json({success:false, message:"Verification failed"})        
    }
      

}
export const checkAuth=async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user)
          return res
            .status(401)
            .json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user });
      } catch (error) {
        console.log("error in checkAuth", error);
    
        res
          .status(500)
          .json({ success: false, message: "Error checking authentication" });
      }
}

export const login=async(req,res)=>{
    const {email , password}=req.body;
    console.log(req.body);
    
    if(!email||!password){
        return res.status(400).json({success: false,message:"All fields are required"})
    }
    try {
        const user=await User.findOne({email})
        if(!user){
            console.log("user not found");
            
            return res.status(400).json({success: false,message:"User not found"})
        }
        if(!user.isVerified){
            return res.status(400).json({success: false,message:"Email is not Verified"})

        }
    console.log(user.password);
    const isPasswordValid= await bcryptjs.compare(password,user.password);
    if(!isPasswordValid){
        console.log("not valid");
        
        return res.status(400).json({success: false,message:"Invalid credentials"})
    }
    console.log("pass check successful");
    
    await generateTokenAndSetCookie(res,user._id)
    user.lastLogin = new Date()
    await user.save();
    res.status(200).json({success:true, message:"Logged in successfully",
        user:{
            ...user._doc,
             password:undefined
        }
    })
    }
     catch (error) {
        console.log("Login Failed",error);
        
        res.status(400).json({success: false,message:error.message})
        
    }

}
export const logout=async(req,res)=>{
    res.clearCookie('authToken')
    res.json({success:true, message:"Logged out successfully"})

}