// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  points: Number,
  carbonReduction: Number,
});

export default mongoose.model("Task", taskSchema);
