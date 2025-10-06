// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  points: Number,
  carbonReduction: Number,
});

module.exports = mongoose.model("Task", taskSchema);
