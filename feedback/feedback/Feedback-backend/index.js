import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./routes/users.js";
import answerRoutes from "./routes/Answers.js";
import questionRoutes from "./routes/Questions.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"] 
  }
});
// dotenv.config();

const users = {};



io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  socket.on("register", ({ curUserId }) => {
    users[curUserId] = socket.id;
    console.log(`✅ Registered user ${curUserId} with socket ${socket.id}`);
    console.log("Current users map:", users);
    
  });
  
  socket.on("sendMessage", ({ to, message }) => {
    const recipientSocketId = users[to];
    console.log(`📨 Message from ${message.from} to ${to}`);
    console.log("recep: " + recipientSocketId)
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`❌ User ${userId} disconnected.`);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});


app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("This is a Feedback loop");
});

app.use("/user", userRoutes);
app.use("/answer", answerRoutes);
app.use("/questions", questionRoutes);


const PORT =  5000;
const DATABASE_URL = `mongodb+srv://shivamkiet1710:PhPQOQ2uHQMxtF9i@cluster0.rvh64m1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", true);
mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));

