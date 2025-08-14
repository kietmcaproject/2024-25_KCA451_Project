import jwt from 'jsonwebtoken';
export const verifyToken=async(req,res,next)=>{
    const token=req.cookies.authToken;
  
    
if(!token) {
    console.log("token not provided");
    
    return res.status(401).json({success: false, message:"Token not provided"})
}

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decoded) {
                return res.status(401).json({success: false, message:"Token not valid"})
        }
        req.userId=decoded.userId;
        next();

        
        
    } catch (error) {
        console.log("error verifying token", error);
        res.status(500).json({success: false, message:"Internal server error"})
        
        
    }
}