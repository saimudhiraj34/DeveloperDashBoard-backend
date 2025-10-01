import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import verifyToken from "../Middleware/jwt.js";
import Schedule from "../Models/Schedule.js";


dotenv.config();
const schedule = express.Router();

schedule.post("/add", verifyToken, async (req, res) => {
  try {
    const { day, topic, details } = req.body;

    if (!day || !topic || !details) {
      return res.status(400).json({ message: "Day, topic, and details are required" });
    }
    const newSchedule = new Schedule({
      day,
      topic,
      details,
      user_id: req.userId,
    });

    await newSchedule.save();
    res.status(200).json({data:newSchedule, message: "Schedule added successfully" });
  } catch (err) {
    console.error("Error saving schedule:", err);
    res.status(500).json({ message: "Server error" });
  }
});

schedule.get("/get/:day", verifyToken, async (req, res) => {
  try {
    const { day } = req.params;
    const schedules = await Schedule.find({user_id:req.userId,day:day}).sort({ day: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /schedule/delete/:id
schedule.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete schedule only if it belongs to the logged-in user
    const deletedSchedule = await Schedule.findOneAndDelete({
      _id: id,
      user_id: req.userId,
    });

    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found or unauthorized" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (err) {
    console.error("Error deleting schedule:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default schedule;