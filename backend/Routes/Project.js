import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

import verifyToken from "../Middleware/jwt.js";
import Project from "../Models/Project.js";
import Progress from "../Models/Progress.js";

dotenv.config();
const project=express.Router();

project.post("/add",verifyToken,async (req, res) => {
  try {
    const {
      projectTitle,
      planningDate,
      testingDate,
      reviewDate,
      deploymentDate,
      skills,
      description,
    } = req.body;
   const existing=await Project.findOne({user_id:req.userId,projectTitle:projectTitle});
   if(existing){
     return res.status(400).json({ message: "already existing" });
   }
    const newProject = new Project({
      user_id: req.userId,  // comes from your auth middleware
      projectTitle,
      planningDate,
      testingDate,
      reviewDate,
      deploymentDate,
      skills,
      description, // store current date
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📥 Get Project by Title
project.get("/get/:title", verifyToken, async (req, res) => {
  try {
    const { title } = req.params;

    const projectData = await Project.findOne({
      user_id: req.userId,
      projectTitle: title,
    });

    if (!projectData) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(projectData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

project.get("/get", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ user_id: req.userId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });    }

    res.json(projects); // send array of projects
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

project.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const exist=await Project.findOne({_id: id,user_id: req.userId,})
    const process=await Progress.findOne({user_id:req.userId,title:exist.projectTitle});
    if(process){
    await Progress.findOneAndDelete({user_id:req.userId,title:exist.projectTitle});
    }
    const deletedProject = await Project.findOneAndDelete({
      _id: id,
      user_id: req.userId,
    });
    
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting project" });
  }
});



export default project;