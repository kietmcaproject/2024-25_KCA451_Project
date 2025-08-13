const mongoose = require("mongoose");

const uri = "mongodb+srv://anurag2325mca1020:2325MCA1020@cluster0.jluvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("database error :",err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
