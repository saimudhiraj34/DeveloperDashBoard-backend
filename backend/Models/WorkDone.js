import mongoose from "mongoose";
const Work=new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    date: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
export const WorkDone=new mongoose.model("WorkDone",Work);