import express from 'express';
import 'dotenv/config';
import loginrouter from './router/login.js';
import roomrouter from './router/roomdetails.js';
import connectDB from './db.js'
import cors from 'cors';
import orderrouter from './router/order.js';

const port = process.env.PORT || 3008;
const HOST = process.env.HOST
const app = express();
app.use(express.json());

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests from specific origins or all origins during development
        const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://roomwala.vercel.app'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send(`<h1>Hello ${req.ip}, welcome to the Roomwala Backend Server!</h1>`);
});

app.use('/api/v1/user', loginrouter);

app.use('/api/v1/room', roomrouter);

app.use('/api/v1/order', orderrouter);

connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port},  ${HOST}:${port}`);
});