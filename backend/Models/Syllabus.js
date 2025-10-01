import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  categories: {
    type: Map,
    of: [String], 
    required: true
  }
});

export default mongoose.model("Syllabus", SyllabusSchema);
