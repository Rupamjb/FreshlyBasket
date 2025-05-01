import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    }
    catch (error) {
        console.error(`MongoDB connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.log('Continuing without database connection. Some features may not work.');
        return false;
    }
};
connectDB().then((connected) => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        if (!connected) {
            console.log('Warning: Server running without database connection. Authentication will not work.');
        }
    });
});
//# sourceMappingURL=index.js.map