import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { billing } from '../controller/billingController.js';

const billingRouter = express.Router();

billingRouter.post("/",isAuth, billing);

export default billingRouter;