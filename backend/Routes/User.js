import express from "express";
import bcrypt from "bcrypt";
import Users from "../Models/User.js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifyToken from "../Middleware/jwt.js";

dotenv.config();
const user=express.Router();

user.post("/register", async (req, res) => {
  try {
    const { username, password ,phone,linkedin,github } = req.body;

   if (!username || !password || !phone ) {
      return res.status(400).json({ success: false, message: "Enter all the fields" });
    }
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      username,
      password: hashedPassword,
      phone,
      linkedin,
      github,
    });

     await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server issue",error:err.message });
  }
});

user.post("/login",async(req,res)=>{
    try{
        const{username,password}=req.body;
        console.log(username,password);
        if(!username || !password){
            return res.status(400).json({success:false,message:"Username Or password Incorrect"});
        }
         const existingUser = await Users.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "Invalid username" });
    }
      const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }
         const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  return res.status(200).json({ success: true, message: "Success", token, existingUser });
} catch (err) {
    return res.status(500).json({ success: false, message: "Server issue", err });
  }
    });

user.post("/logout",verifyToken,async(req,res)=>{
     res.status(200).json({success:true,message:"logout"})
})

user.get("/get", verifyToken, async (req, res) => {
  try {
    // req.userId is set by verifyToken middleware
    const user = await Users.findById(req.userId).select("-password"); 
    // exclude password for security

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default user;
