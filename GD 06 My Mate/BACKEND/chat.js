const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Change this for production to allow only specific origins
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages
  socket.on('send_message', (message) => {
    console.log('New message:', message);

    // Broadcast the message to all users
    io.emit('receive_message', message);
  });

  socket.on("typing", ({ senderName }) => {
    socket.broadcast.emit("typing", { senderName }); // broadcasts to everyone except sender
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = 7000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
