import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
export const googleAuth=async(req,res)=>{
    try {
        const {name: rawName,email,avtar} = req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }

        const name = rawName || email.split('@')[0] || 'User';

        let user = await User.findOne({email});
        if(!user){
            user = await User.create({name,email,avtar}); 
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        });

        return res.status(200).json({message:"User authenticated successfully",user,token});

    } catch (error) {
        console.error('googleAuth error:', error);
        return res.status(500).json({message:"Server Error", error: error.message});
    }
}

export const logout=async(req,res)=>{
    try{
            res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
           })

           return res.status(200).json({message:"User logged out successfully"});
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}