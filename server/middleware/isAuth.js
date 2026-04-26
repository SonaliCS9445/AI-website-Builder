import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';

const isAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user=await User.findById(decoded.id)
        next();
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

export default isAuth;