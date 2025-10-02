
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


app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true}));



// {
//   origin: function (origin, callback) {
//     // allow requests with no origin (like Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // allow cookies/auth headers
// }
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
   serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

mongoose.connection.on("connecting", () => {
  console.log("🔄 MongoDB is connecting...");
});
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection established");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
mongoose.connection.on("reconnected", () => {
  console.log("♻️ MongoDB reconnected");
});
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
  res.json("this is not work");
});

// In your server.js
app.get("/test-db", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    // Mask the Mongo URI for security (hide password)
    let maskedUri = process.env.MONGO_URI
      ? process.env.MONGO_URI.replace(/:\/\/(.*?):(.*?)@/, "://$1:****@")
      : null;

    res.json({
      status: states[dbState],
      hasMongoUri: !!process.env.MONGO_URI,
      mongoUriFormat: maskedUri,
      error: mongoose.connection.error ? mongoose.connection.error.message : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
