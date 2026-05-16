import express from 'express';
import { generateWebsite, getWebsiteById,getAll, changes } from '../controller/websiteController.js';
import isAuth from '../middleware/isAuth.js';


const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.post("/update/:id", isAuth, changes);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-all", isAuth, getAll);

export default websiteRouter;
