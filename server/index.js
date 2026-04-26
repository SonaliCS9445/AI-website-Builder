import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");



import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from './routes/useRoutes.js';




const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.use(express.json());



app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});