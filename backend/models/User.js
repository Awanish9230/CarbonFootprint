// backend/models/User.js
// const mongoose = require("mongoose");
import mongoose from "mongoose";

// -------------------- Sub-schemas --------------------

// Daily log schema
const dailyLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  actionsCompleted: { type: Number, default: 0 },
  loggedActions: [
    {
      actionType: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});


// Challenge schema
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }, // 0-100%
  pointsReward: { type: Number, default: 10 }, // points earned on completion
  badgeReward: { type: String, default: "" },  // optional badge unlocked
  carbonReduction: { type: Number, default: 0 } // kg CO₂ reduced on completion
});

// Badge schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// Milestone schema
const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  achieved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

// Reward schema
const rewardSchema = new mongoose.Schema({
  item: { type: String, required: true },
  redeemed: { type: Boolean, default: false },
  pointsRequired: { type: Number, default: 100 },
  image: { type: String, default: "" }
});

// Goal schema (for "Goals for Reducing Emissions")
const goalSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// -------------------- Main User schema --------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  state: { type: String, default: "" },
  photoURL: { type: String, default: "" },

  // Points, level, streak, daily goals
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastStreakDate: { type: Date, default: null }, // <--- NEW: Tracks last streak update
  dailyGoal: { type: Number, default: 2 },
  dailyLogs: { type: [dailyLogSchema], default: [] },

  // Virtual Eco Garden
  virtualGarden: {
    treesPlanted: { type: Number, default: 0 },
    gardenLevel: { type: Number, default: 1 },
    carbonSaved: { type: Number, default: 0 } // optional, synced with main carbonSaved
  },

  // Carbon Savings
  carbonSaved: { type: Number, default: 0 },

  // Gamified challenges & badges
  challenges: { type: [challengeSchema], default: [] },
  badges: { type: [badgeSchema], default: [] },

  // Milestones & rewards
  milestones: { type: [milestoneSchema], default: [] },
  rewards: { type: [rewardSchema], default: [] },

  // Goals for reducing emissions
  goals: { type: [goalSchema], default: [] },
}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);

export default User;
