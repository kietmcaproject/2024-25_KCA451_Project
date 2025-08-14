import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from "socket.io";
import authRoutes from './router/codeAuth.js'
import userRoute from './router/userRoute.js'
import communityRoute from './router/communityRoute.js'
import { connectDb } from './db/connectDb.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import Community from './models/communityModel.js';
dotenv.config();
const port = process.env.PORT

const corsOptions = {
  origin: 'http://localhost:5173',  // Replace with your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute)
app.use('/api/community', communityRoute)


const onlineUsers = new Map();
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("joinCommunity", (communityCode) => {
    socket.join(communityCode);
    console.log(`User ${socket.id} joined community: ${communityCode}`);
  });


  socket.on("sendMessage", async ({ code, userId, message }) => {
    try {
      const community = await Community.findOne({ code });
      if (!community) return;

      const newMessage = { user: userId, message };
      community.messages.push(newMessage);
      await community.save();

      io.to(code).emit("receiveMessage", { user: userId, message });
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  });

  socket.on("sendCode", async ({ code, newCode }) => {
    try {
      io.to(code).emit("receiveCode", {newCode});
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

  });
});
export default io;

server.listen(port, () => {
  connectDb()
  console.log("server is live");

})
