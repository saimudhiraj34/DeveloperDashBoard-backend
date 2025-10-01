import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

import verifyToken from "../Middleware/jwt.js";
import progress from "../Models/Progress.js";

dotenv.config();
const pro=express.Router();


pro.post("/:title", verifyToken, async (req, res) => {
  try {
    const title = req.params.title;
    const { phase, ans } = req.body; // frontend sends only ans

    let project = await progress.findOne({ user_id: req.userId, title });

    if (!project) {
      project = new progress({ user_id: req.userId, title });
    }

    if (!project[phase]) {
      project[phase] = { status: false, ans: "" }; 
    }

    project[phase].ans = ans;

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

pro.post("/check/:title", verifyToken, async (req, res) => {
  try {
    const title = req.params.title;
    const { phase, status } = req.body; 

    let project = await progress.findOne({ user_id: req.userId, title });

   
    if (!project) {
      project = new progress({ user_id: req.userId, title });
    }

    // Update only the status of the specified phase
    if (!project[phase]) {
      project[phase] = { status: status, ans: "" };
    } else {
      project[phase].status = status;
    }

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

pro.get("/:title", verifyToken, async (req, res) => {
  try {
    const title = req.params.title;

    // Find the progress for the logged-in user and project title
    const project = await progress.findOne({ user_id: req.userId, title });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Send only the progress part
    const { Planning, Development, Testing, Review, Deployment } = project;

    res.json({ Planning, Development, Testing, Review, Deployment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default pro;