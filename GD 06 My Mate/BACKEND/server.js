const express = require('express');
const cors = require('cors'); // Import cors
const http = require('http'); // Import http to create server
const socketIo = require('socket.io'); // Import socket.io
const dbConnect = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth');
const postRoutes = require('./Routes/post');
const userRoutes = require('./Routes/user');
const { isLoggedIn } = require("./Middlewares/isLoggedIn");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL, // Frontend URL
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
dbConnect();

// Initialize server
const server = http.createServer(app);

// Initialize Socket.IO and bind it to the server
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Chat functionality with socket.io
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle sending messages
  socket.on('send_message', (message) => {
    console.log("Message received:", message);
    io.emit('receive_message', message); // Broadcast the message to all connected users
  });

  // Handle user typing event
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data); // Notify other users that someone is typing
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Set up routes
app.get('/', (req, res) => {
  res.send("Home");
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
