import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://sumitrawat1923:9958529762@cluster0.jfxat.mongodb.net/food-donations';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;
