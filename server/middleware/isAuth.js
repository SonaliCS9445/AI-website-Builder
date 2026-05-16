import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';

const isAuth = async (req, res, next) => {
    try{
        // Accept token from cookie (browser) or Authorization header (Postman/testing)
        let token = req.cookies?.token;
        if(!token){
            const authHeader = req.headers?.authorization || req.headers?.Authorization;
            if(authHeader && authHeader.startsWith('Bearer ')){
                token = authHeader.split(' ')[1];
            }
        }

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

       let decoded;
       try{
         decoded = jwt.verify(token, process.env.JWT_SECRET);
       }catch(err){
         return res.status(401).json({message: 'Invalid token'});
       }

        req.user = await User.findById(decoded.id);
        if(!req.user) return res.status(401).json({ message: 'Unauthorized' });
        next();
    }catch(error){
        console.error('isAuth error:', error);
        res.status(500).json({message:"Server Error"});
    }
}

export default isAuth;