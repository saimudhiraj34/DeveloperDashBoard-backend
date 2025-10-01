import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import verifyToken from "../Middleware/jwt.js";
import Remainder from "../Models/Remainders.js";

dotenv.config();
const remainder = express.Router();

remainder.post("/set",verifyToken, async (req, res) => {
  const { text, remainder:isRemainder, time } = req.body;

  if (!text || !time) {
    return res.status(400).json({ message: "Text and time are required" });
  }

  try {
    const newRemainder = new Remainder({
    user_id:req.userId, 
    text:text,
    remainder:isRemainder, 
    time:time });
    const savedRemainder = await newRemainder.save();
    res.status(201).json(savedRemainder);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

remainder.get("/get",verifyToken,async (req, res) => {
  try {
    const remainders = await Remainder.find({user_id:req.userId}).sort({ time: 1 });
    res.json(remainders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

remainder.delete("/delete/:id",verifyToken, async (req, res) => {
  try {
      const task = await Remainder.findOneAndDelete({
          _id: req.params.id,
          user_id: req.userId,
        });

    if (!task) {
      return res.status(404).json({ message: "Remainder not found" });
    }

    res.status(200).json({ message: "Remainder deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

remainder.post("/update_status",verifyToken, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Remainder ID is required" });
    }

    // find remainder by id and toggle its status
    const remainderItem = await Remainder.findOne({ _id: id, user_id: req.userId });

    if (!remainderItem) {
      return res.status(404).json({ message: "Remainder not found" });
    }

    // toggle status
    remainderItem.remainder = !remainderItem.remainder;
    await remainderItem.save();

    res.status(200).json({ message: "Remainder status updated", remainder: remainderItem });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error while updating status" });
  }
});

export default remainder;