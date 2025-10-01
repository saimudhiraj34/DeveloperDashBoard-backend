import mongoose from "mongoose";
 const notesSchema=new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:{type:String,required:true},
    description:{type:String}
 })
 export default mongoose.model("notes",notesSchema);