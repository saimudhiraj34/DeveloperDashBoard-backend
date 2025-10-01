import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

import verifyToken from "../Middleware/jwt.js";


import Questions from "../Models/Questions.js";

dotenv.config();
const question = express.Router();
question.post("/add_question",verifyToken,async(req,res)=>{
    try{
    const{sub,newQuestion}=req.body;
    
     if (!sub || !newQuestion || !newQuestion.id || !newQuestion.text) {
      return res.status(400).json({ msg: "Subject, id, and question text are required" });
    }
    const { id, text } = newQuestion;
    console.log(sub,id,text);
    let subjectDoc=await Questions.findOne({user_id:req.userId,subject_name:sub});
        if (!subjectDoc) {
      subjectDoc = new Questions({
        user_id:req.userId,
        subject_name: sub,
        questions: []
      });
    }
    subjectDoc.questions.push({
      id,
      text,
    });
     await subjectDoc.save();
    res.status(201).json({ msg: "Question added",data: { id, text } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET all questions for a subject
question.get("/:sub", verifyToken, async (req, res) => {
  try {
    const { sub } = req.params;
    const subjectDoc = await Questions.findOne({ user_id: req.userId, subject_name: sub });
    if (!subjectDoc) return res.status(404).json({ msg: "Subject not found" });

    res.json(subjectDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// Save or update answer for a question
question.post("/save_answer", verifyToken, async (req, res) => {
  try {
    const { id, ans } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "Question id is required" });
    }

    // Find the subject doc that contains this question
    const subjectDoc = await Questions.findOneAndUpdate(
      { user_id: req.userId, "questions.id": id },
      { $set: { "questions.$.ans": ans } },  // update answer
      { new: true } // return updated doc
    );

    if (!subjectDoc) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.json({ msg: "Answer saved successfully", id, ans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

question.delete("/delete_question/:sub/:id", verifyToken, async (req, res) => {
  try {
    const { sub, id } = req.params;
    const userId = req.userId;

    const subjectDoc = await Questions.findOneAndUpdate(
      { user_id: userId, subject_name: sub },
      { $pull: { questions: { id: parseInt(id) } } },
      { new: true }
    );

    if (!subjectDoc) return res.status(404).json({ msg: "Subject or question not found" });

    res.json({ msg: "Question deleted", updated: subjectDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

question.post("/update_status", verifyToken, async (req, res) => {
  try {
    const { sub, id, status } = req.body;
    if (!sub || !id) return res.status(400).json({ msg: "Subject and question id required" });

    const subjectDoc = await Questions.findOneAndUpdate(
      { user_id: req.userId, subject_name: sub, "questions.id": parseInt(id) },
      { $set: { "questions.$.status": status } },
      { new: true }
    );

    if (!subjectDoc) return res.status(404).json({ msg: "Question not found" });

    res.json({ msg: "Status updated", updated: subjectDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default question;