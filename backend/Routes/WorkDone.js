import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import verifyToken from "../Middleware/jwt.js";

import { WorkDone } from "../Models/WorkDone.js";

dotenv.config();
const work = express.Router();

work.get("/getToday", verifyToken, async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA"); 
    const tasks = await WorkDone.find({
      userId: req.userId,
      date: today,
    }).sort({ startTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

work.get("/get", verifyToken, async (req, res) => {
  try {
    const tasks = await WorkDone.find({ userId: req.userId }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

work.post("/task", verifyToken, async (req, res) => {
  const { date, topic, startTime, endTime, notes } = req.body;

  if (!date || !topic || !startTime || !endTime) {
    return res.status(400).json({ message: "Please fill in all required fields (date, topic, startTime, endTime)" });
  }
  console.log(date,topic,startTime,endTime,notes);

  if (startTime >= endTime) {
    return res.status(400).json({ message: "End Time must be after Start Time" });
  }
    const formattedDate = new Date(date).toLocaleDateString("en-CA");
  try {
    const task = new WorkDone({
      userId: req.userId,
      date:formattedDate,
      topic,
      startTime,
      endTime,
      notes,
      completed: false,
    });
    const newTask = await task.save();
    res.status(201).json({ message: "Task added successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

work.delete("/task/:id", verifyToken, async (req, res) => {
  try {
    const task = await WorkDone.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found or you are not authorized to delete it." 
      });
    }

    // Success response
    res.status(200).json({ 
      success: true, 
      message: "Task deleted successfully!" 
    });
  } catch (err) {
    // Error response
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting task: " + err.message 
    });
  }
});

work.post("/check", verifyToken, async (req, res) => {
  const { id, completed } = req.body;

  if (!id || typeof completed !== "boolean") {
    return res.status(400).json({ message: "Task ID and completed status are required" });
  }

  try {
    const updatedTask = await WorkDone.findOneAndUpdate(
      { _id: id, userId: req.userId },   // ensure only owner can update
      { completed: completed },
      { new: true } // return updated doc
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(200).json({
      message: "Task status updated successfully!",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating status: " + err.message });
  }
});


export default work;