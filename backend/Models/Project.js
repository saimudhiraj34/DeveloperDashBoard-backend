import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true, // title will act as key (no duplicates)
      trim: true,
    },
    planningDate: {
      type: Date,
    },
    testingDate: {
      type: Date,
    },
    reviewDate: {
      type: Date,
    },
    deploymentDate: {
      type: Date,
    },
    skills: {
      type: [String], // array of technologies/features
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // if tied to a user
    },
  },

);

export default mongoose.model("Project", projectSchema);
