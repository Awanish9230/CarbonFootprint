// backend/routes/gamification.js
import express from "express";
import User from "../models/User.js";
import { generateDailyChallenges } from "../utils/generateChallenges.js";

const router = express.Router();

// --------------------- Helpers ---------------------
const getTodayString = () => new Date().toISOString().split("T")[0];

// --------------------- Log Daily Actions ---------------------
router.post("/log-action", async (req, res, next) => {
  try {
    const { userId, actions } = req.body;
    if (!userId || typeof actions !== "number")
      return res.status(400).json({ message: "Missing userId or actions" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Safe defaults
    user.virtualGarden = user.virtualGarden || { treesPlanted: 0, gardenLevel: 1 };
    user.dailyLogs = user.dailyLogs || [];
    user.badges = user.badges || [];
    user.milestones = user.milestones || [];
    user.points = user.points || 0;
    user.streak = user.streak || 0;
    user.dailyGoal = user.dailyGoal || 1;
    user.carbonSaved = user.carbonSaved || 0;
    if (!user.lastStreakDate) user.lastStreakDate = null; // Track streak updates

    // --- Update today's log ---
    const today = getTodayString();
    let todayLog = user.dailyLogs.find(log => log.date.toISOString().split("T")[0] === today);

    const actionsCompletedToday = todayLog
      ? todayLog.actionsCompleted + actions
      : actions;

    if (todayLog) {
      todayLog.actionsCompleted += actions;
    } else {
      user.dailyLogs.push({ date: new Date(), actionsCompleted: actions });
    }

    // --- Update streak only once per day ---
    const lastStreakDate = user.lastStreakDate ? user.lastStreakDate.toISOString().split("T")[0] : null;
    if (actionsCompletedToday >= user.dailyGoal && lastStreakDate !== today) {
      user.streak += 1;
      user.lastStreakDate = new Date();
    }

    // --- Update points, virtual garden, carbon saved ---
    user.points += actions * 10;
    user.virtualGarden.treesPlanted += Math.floor(actions / 3);
    user.virtualGarden.gardenLevel = Math.floor(user.virtualGarden.treesPlanted / 5) + 1;
    user.carbonSaved += actions * 2;

    // --- Badges ---
    if (user.streak >= 7 && !user.badges.find(b => b.name === "7-day Streak")) {
      user.badges.push({ name: "7-day Streak", unlocked: true, date: new Date() });
    }

    // --- Milestones ---
    if (user.carbonSaved >= 100 && !user.milestones.find(m => m.title === "100kg CO2 Saved")) {
      user.milestones.push({ title: "100kg CO2 Saved", achieved: true, date: new Date() });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error in /log-action:", err.message);
    next(err);
  }
});

// --------------------- Complete a Challenge ---------------------
router.post("/complete-challenge", async (req, res, next) => {
  try {
    const { userId, challengeId } = req.body;
    if (!userId || !challengeId)
      return res.status(400).json({ message: "Missing userId or challengeId" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.challenges = user.challenges || [];
    const challenge = user.challenges.id(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    if (!challenge.completed) {
      challenge.completed = true;
      // Update points, carbon, and unlock badge if exists
      user.points += challenge.pointsReward || 50;
      user.carbonSaved += challenge.carbonReduction || 10;

      if (challenge.badgeReward && !user.badges.find(b => b.name === challenge.badgeReward)) {
        user.badges.push({ name: challenge.badgeReward, unlocked: true, date: new Date() });
      }
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Error in /complete-challenge:", err.message);
    next(err);
  }
});

// backend/routes/gamification.js (or authRoutes.js if merged)
router.post("/redeem-reward", async (req, res, next) => {
  try {
    const { userId, item } = req.body;
    if (!userId || !item) return res.status(400).json({ message: "Missing userId or item" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const reward = user.rewards.find(r => r.item === item);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    if (reward.redeemed) {
      return res.status(400).json({ message: "Reward already redeemed" });
    }

    if (user.points < reward.pointsRequired) {
      return res.status(400).json({
        message: `You need ${reward.pointsRequired - user.points} more points to redeem this reward`,
      });
    }

    // Deduct points & mark as redeemed
    user.points -= reward.pointsRequired;
    reward.redeemed = true;

    await user.save();
    res.json({ user, message: "Reward redeemed successfully" });
  } catch (err) {
    console.error("Error redeeming reward:", err.message);
    next(err);
  }
});

// --------------------- Get User Profile ---------------------
router.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Safe defaults
    user.virtualGarden = user.virtualGarden || { treesPlanted: 0, gardenLevel: 1 };
    user.badges = user.badges || [];
    user.milestones = user.milestones || [];
    user.rewards = user.rewards || [];
    user.challenges = user.challenges || [];
    user.carbonSaved = user.carbonSaved || 0;
    user.points = user.points || 0;
    user.streak = user.streak || 0;
    user.dailyGoal = user.dailyGoal || 1;

    res.json(user);
  } catch (err) {
    console.error("Error in /user/:id:", err.message);
    next(err);
  }
});

// --------------------- Generate Daily Challenges ---------------------
router.post("/generate-daily-challenges", async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const user = await generateDailyChallenges(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error in /generate-daily-challenges:", err.message);
    next(err);
  }
});

export default router;
