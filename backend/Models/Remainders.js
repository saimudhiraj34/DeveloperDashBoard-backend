import mongoose from "mongoose";

const RemainderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  remainder: { type: Boolean, required: true },
  time: { type: String, required: true },
});

export default mongoose.model("Remainder", RemainderSchema);
