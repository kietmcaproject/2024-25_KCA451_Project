import mongoose from "mongoose"

export const  connectDb=async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb Connected");
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
        
    }
}


