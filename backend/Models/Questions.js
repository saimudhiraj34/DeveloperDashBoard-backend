  import mongoose from "mongoose";

  const SubjectSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject_name: { type: String, required: true },
    questions: [
      {
        id: { type: Number, required: true },   // unique id from frontend
        text: { type: String, required: true }, // question text
        ans: { type: String, default: "" },    
        status: { type: Boolean, default: false }  
      }
    ],
  });

  export default mongoose.model("Subject", SubjectSchema);
