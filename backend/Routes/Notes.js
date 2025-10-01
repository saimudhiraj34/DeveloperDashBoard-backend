import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

import verifyToken from "../Middleware/jwt.js";
import Notes from "../Models/Notes.js";

dotenv.config();
const note=express.Router();

note.post("/add_title", verifyToken, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new Notes({
      user_id: req.userId, // from verifyToken
      title,
      description: "", // initially empty
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

note.post("/add_ans", verifyToken, async (req, res) => {
  try {
    const { id, description } = req.body;

    if (!id || !description) {
      return res
        .status(400)
        .json({ message: "Note ID and description are required" });
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, user_id: req.userId }, // ensure only owner can update
      { description },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /note/get
note.get("/get", verifyToken, async (req, res) => {
  try {
    const notes = await Notes.find({ user_id: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

note.delete("/delete/:id",verifyToken, async (req, res) => {
  try {
      const task = await Notes.findOneAndDelete({
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


export default note;