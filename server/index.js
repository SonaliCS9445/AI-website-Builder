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
import websiteRouter from './routes/websiteRoutes.js';
import billingRouter from "./routes/billingRoutes.js";
import { stripeWebhook } from "./controller/stripeWebhookController.js";




const app = express();

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }),
  stripeWebhook)
app.use(cookieParser());
const allowedOrigins = [process.env.CLIENT_URL || "https://ai-website-builder-2-yg8d.onrender.com"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.use(express.json());



app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
