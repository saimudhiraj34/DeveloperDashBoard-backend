import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
title:{type:String},
  Planning: {
    status: { type: Boolean, default: false },
    ans: { type: String, default: "" },
  },
  Development: {
    status: { type: Boolean, default: false },
    ans: { type: String, default: "" },
  },
  Testing: {
    status: { type: Boolean, default: false },
    ans: { type: String, default: "" },
  },
  Review: {
    status: { type: Boolean, default: false },
    ans: { type: String, default: "" },
  },
  Deployment: {
    status: { type: Boolean, default: false },
    ans: { type: String, default: "" },
  },
});

export default mongoose.model("progress",progressSchema);