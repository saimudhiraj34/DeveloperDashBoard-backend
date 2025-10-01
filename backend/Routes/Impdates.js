import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

import verifyToken from "../Middleware/jwt.js";
import Impdates from "../Models/Impdates.js";

dotenv.config();
const imp=express.Router();
imp.post("/send", verifyToken, async (req, res) => {
  try {
    const { date, message } = req.body;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const newDate = new Impdates({
     Date: new Date(date),
      message,
      user_id: req.userId, 
    });

    await newDate.save();
    res.status(200).json({ message: "Date saved successfully" });
  } catch (err) {
    console.error("Error saving date:", err);
    res.status(500).json({ message: "Server error" });
  }
});

imp.get("/get", verifyToken, async (req, res) => {
  try {
    const dates = await Impdates.find({ user_id: req.userId }).sort({ Date: 1 });
    res.status(200).json(dates);
  } catch (err) {
    console.error("Error fetching dates:", err);
    res.status(500).json({ message: "Server error" });
  }
});

imp.delete("/delete/:id",verifyToken, async (req, res) => {
  try {
      const task = await Impdates.findOneAndDelete({
          _id: req.params.id,
          user_id: req.userId,
        });

    if (!task) {
      return res.status(404).json({ message: "Date  not found" });
    }

    res.status(200).json({ message: "Date deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default imp;