// models/Task.js
// const mongoose = require("mongoose");
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  points: Number,
  carbonReduction: Number,
});

// module.exports = mongoose.model("Task", taskSchema);
const Task = mongoose.model("Task", taskSchema);

export default Task;

