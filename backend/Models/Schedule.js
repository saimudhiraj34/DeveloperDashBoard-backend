import mongoose from "mongoose";
 const scheduleSchema=new mongoose.Schema({
   user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
   day:{type:String,required:true},
   topic:{type:String,required:true},
   details:{type:String,required:true},
 })

 export default mongoose.model("Schedule",scheduleSchema);