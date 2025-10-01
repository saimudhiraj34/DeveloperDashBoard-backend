
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./Routes/User.js";
import syllabus from "./Routes/Syllabus.js";
import question from "./Routes/questions.js";
import work from "./Routes/WorkDone.js";
import remainder from "./Routes/remainder.js";
import imp from "./Routes/Impdates.js";
import schedule from "./Routes/schedule.js";
import note from "./Routes/Notes.js";
import project from "./Routes/Project.js";
import pro from "./Routes/progress.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // must be false if origin is "*"
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true}));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
 

  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


  app.use("/user", user);
  app.use("/syllabus",syllabus)
  app.use("/questions",question)
  app.use("/work",work)
  app.use("/remainder",remainder)
  app.use("/imp",imp)
  app.use("/schedule",schedule)
  app.use("/note",note)
  app.use("/project",project)
  app.use("/pro",pro)
app.get("/get", (req, res) => {
  res.json("this is work");
});


export default app; 