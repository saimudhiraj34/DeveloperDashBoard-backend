import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import verifyToken from "../Middleware/jwt.js";
import Questions from "../Models/Questions.js";
import Syllabus from "../Models/Syllabus.js";
dotenv.config();
const syllabus = express.Router();

syllabus.post("/add_skill", verifyToken, async (req, res) => {
  try {
    const { category, skills } = req.body;
    const userId = req.userId;

    if (!category || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ msg: "Category and skills are required" });
    }

    const categoryKey = category.trim().toLowerCase();
    let syllabusDoc = await Syllabus.findOne({ user_id: userId });

    if (!syllabusDoc) {
      syllabusDoc = new Syllabus({ user_id: userId, categories: {} });
    }

    const allExistingSkills = [];
    for (let [cat, catSkills] of syllabusDoc.categories) {
      allExistingSkills.push(...catSkills);
    }

    const newSkills = [];
    const existingSkillsInCategory = syllabusDoc.categories.get(categoryKey) || [];

    for (let skill of skills) {
      if (allExistingSkills.includes(skill)) {
        return res.status(400).json({ msg: `Skill "${skill}" already exists in another category` });
      } else {
        newSkills.push(skill);
      }
    }

    syllabusDoc.categories.set(categoryKey, [...existingSkillsInCategory, ...newSkills]);
    await syllabusDoc.save();

    res.json({ msg: "Skill(s) added successfully", data: syllabusDoc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

syllabus.get("/all_skills", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const syllabusDoc = await Syllabus.findOne({ user_id: userId });

    if (!syllabusDoc) {
      return res.status(404).json({ msg: "No syllabus found", data: {} });
    }

    res.json({ msg: "Syllabus fetched successfully", data: syllabusDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

syllabus.delete("/delete_skill", verifyToken, async (req, res) => {
  try {
    const { category, skill } = req.body;
    const userId = req.userId;

    if (!category && !skill) {
      return res.status(400).json({ msg: "Category or skill is required" });
    }

    const syllabusDoc = await Syllabus.findOne({ user_id: userId });
    if (!syllabusDoc) {
      return res.status(404).json({ msg: "Syllabus not found" });
    }

    // Delete a specific skill
    if (skill) {
      const existingSkills = syllabusDoc.categories.get(category);
      if (!existingSkills || !existingSkills.includes(skill)) {
        return res.status(404).json({ msg: `Skill "${skill}" not found in ${category}` });
      }

      // Remove the skill from Syllabus
      const updatedSkills = existingSkills.filter((s) => s !== skill);
      syllabusDoc.categories.set(category, updatedSkills);
      await syllabusDoc.save();

      // Remove all Questions with subject_name = skill
      await Questions.deleteMany({ user_id: userId, subject_name: skill });

      // Delete category if it becomes empty after removing the skill
      if (updatedSkills.length === 0) {
        syllabusDoc.categories.delete(category);
        await syllabusDoc.save();
        return res.json({ msg: `Skill "${skill}" and empty category "${category}" deleted successfully`, data: syllabusDoc });
      }

      return res.json({ msg: `Skill "${skill}" and its questions deleted successfully`, data: syllabusDoc });
    }

    // Only delete entire category if it is empty
    const existingSkills = syllabusDoc.categories.get(category);
    if (!existingSkills) {
      return res.status(404).json({ msg: "Category not found" });
    }

    if (existingSkills.length > 0) {
      return res.status(400).json({ msg: `Category "${category}" is not empty. Delete all skills first.` });
    }

    syllabusDoc.categories.delete(category);
    await syllabusDoc.save();

    res.json({ msg: `Empty category "${category}" deleted successfully`, data: syllabusDoc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default syllabus;