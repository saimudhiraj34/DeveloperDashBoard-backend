import mongoose from "mongoose";
 const datesSchema=new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Date:{type:String,required:true},
    message:{type:String,required:true}
 })
 export default mongoose.model("impdates",datesSchema);