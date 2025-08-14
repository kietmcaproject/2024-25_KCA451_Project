import { User } from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const updateUser=async(req,res)=>{
    const token =req.cookies.authToken;
    const {inputName,inputNumber}= req.body;
    if(!token){
        console.log("token is invalid");
        
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId=decoded.userId
        
        const user = await User.findByIdAndUpdate(userId,{
            name:inputName,
            number:inputNumber
        } ,{$set:req.body}, {new:true, runValidators:true})
        if(!user){
            res.status(400).json("user not found")
        }
        await user.save()
res.status(200).json(user+" data updated successfully")

        
    } catch (error) {
        console.log(error+" failed updating user data");
        
        res.status(400).json("update  failed")
        
    }
}

export const userProfile=async(req,res)=>{
    const token =req.cookies.authToken;

    if(!token){
        console.log("token is invalid ");
        
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
        const userId=decoded.userId;
        const user=await User.findById(userId)  
        if(!user){
            res.status(400).json("user not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error,"error finding user");
        
        res.status(400).json("user data is not available")
    }



}