// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const dotenv = require('dotenv');
// const cloudinary = require('cloudinary').v2;
// const connectDB = require('./config/connectDB');
// const router = require('./routes/index');
// const cookiesParser = require('cookie-parser');
// const { getChatCompletion } = require('./groqChat'); // Import chat function
// const { app, server } = require('./socket/index');
// require('dotenv').config();

// dotenv.config();

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }));
// app.use(express.json());
// app.use(cookiesParser());


// cloudinary.config({
//     cloud_name: process.env.your_cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret
// });



// // Serve static files for the chatbot UI
// app.use(express.static(path.join(__dirname, '../client/public')));

// const PORT = process.env.PORT || 8080;

// // Chatbot API endpoint
// // app.post('/api/chat', async (req, res) => {
// //     const { content } = req.body;
// //     try {
// //         const chatCompletion = await getChatCompletion(content);
// //         res.json({ message: chatCompletion.choices[0]?.message?.content || "No response" });
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // });
// app.post('/api/chat', async (req, res) => {
//     console.log("Received content:", req.body.content); // Debug log
//     const { content } = req.body;
//     try {
//         const chatCompletion = await getChatCompletion(content);
//         console.log(chatCompletion.choices[0]?.message?.content);
//         res.json({ message: chatCompletion.choices[0]?.message?.content || "No response" });
//     } catch (error) {
//         console.error("Error in /api/chat:", error); // Debug log
//         res.status(500).json({ message: error.message });
//     }
// });


// // API Endpoints
// app.use('/api', router);

// connectDB().then(() => {
//     console.log("Database connected");
//     server.listen(PORT, () => {
//         console.log("Server running at " + PORT);
//     });
// });




const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/connectDB');
const cookiesParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { getChatCompletion } = require('./groqChat');
const { app, server } = require('./socket/index');

// Load .env variables
dotenv.config();

// Passport config
require('./config/passport');

// CORS setup for frontend
app.use(cors({
    origin: "http://localhost:3000", // your frontend origin
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookiesParser());

// Session setup (important: before passport.session)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // change to true when deploying with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Static file serving (optional frontend assets or chatbot UI)
app.use(express.static(path.join(__dirname, '../client/public')));

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    console.log("Received content:", req.body.content);
    const { content } = req.body;

    try {
        const chatCompletion = await getChatCompletion(content);
        const response = chatCompletion.choices[0]?.message?.content || "No response";
        console.log("Chat Response:", response);
        res.json({ message: response });
    } catch (error) {
        console.error("Error in /api/chat:", error);
        res.status(500).json({ message: error.message });
    }
});

// Your app API routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Google OAuth routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Connect to DB and start server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    console.log("✅ Database connected");
    server.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
