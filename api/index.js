import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

mongoose
.connect(process.env.MONGO)  //conexión base datos
.then (() => {
    console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    })

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');  
    }
)

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use('/api/comment', commentRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success : false,
        status: statusCode,
        message,

    });

});