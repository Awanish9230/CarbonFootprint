import express from "express";
import User from "../models/User.js";
import { generateDailyChallenges } from "../utils/generateChallenges.js";

const router = express.Router();

// --------------------- Helpers ---------------------
const getTodayString = () => new Date().toISOString().split("T")[0];

// --------------------- Log Action ---------------------
router.post("/log-action", async (req, res, next) => {
  try {
    const { userId, actionType } = req.body;
    if (!userId || !actionType)
      return res.status(400).json({ message: "Missing userId or actionType" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Safe defaults
    user.virtualGarden = user.virtualGarden || { treesPlanted: 0, gardenLevel: 1 };
    user.dailyLogs = user.dailyLogs || [];
    user.badges = user.badges || [];
    user.milestones = user.milestones || [];
    user.points = user.points || 0;
    user.streak = user.streak || 0;
    user.dailyGoal = user.dailyGoal || 2;
    user.carbonSaved = user.carbonSaved || 0;
    if (!user.lastStreakDate) user.lastStreakDate = null;

    const today = new Date();
    const todayStr = getTodayString();

    // Find today's log index
    const todayLogIndex = user.dailyLogs.findIndex(
      (log) => log.date.toISOString().split("T")[0] === todayStr
    );

    let todayLog;
    if (todayLogIndex === -1) {
      // Create new log for today
      todayLog = { date: today, actionsCompleted: 0, loggedActions: [] };
      user.dailyLogs.push(todayLog);
      console.log('Created new daily log for today');
    } else {
      // Use existing log
      todayLog = user.dailyLogs[todayLogIndex];
      console.log(`Found existing log with ${todayLog.actionsCompleted} actions`);
    }

    // ✅ Limit: check if daily goal reached
    if (todayLog.actionsCompleted >= user.dailyGoal) {
      return res.status(400).json({ message: "Daily goal already reached!" });
    }

    // Optional: prevent logging same action multiple times
    if (todayLog.loggedActions.find((a) => a.actionType === actionType)) {
      return res.status(400).json({ message: "Action already logged today!" });
    }

    // Action rewards
    const actionRewards = {
      used_public_transport: { points: 20, carbon: 5 },
      cycled_or_walked: { points: 25, carbon: 6 },
      recycled_waste: { points: 15, carbon: 4 },
      avoided_plastic: { points: 10, carbon: 3 },
      used_renewable_energy: { points: 30, carbon: 8 },
      planted_tree: { points: 40, carbon: 10 },
      saved_water: { points: 12, carbon: 2 },
    };

    const reward = actionRewards[actionType] || { points: 10, carbon: 2 };

    // Log the action
    todayLog.actionsCompleted += 1;
    todayLog.loggedActions.push({ actionType, date: today });
    console.log(`Action logged: ${actionType}, Total today: ${todayLog.actionsCompleted}`);

    // Update streak only if daily goal reached today
    const lastStreakDate = user.lastStreakDate
      ? user.lastStreakDate.toISOString().split("T")[0]
      : null;

    if (todayLog.actionsCompleted >= user.dailyGoal && lastStreakDate !== todayStr) {
      user.streak += 1;
      user.lastStreakDate = today;
      console.log(`Streak updated to: ${user.streak}`);
    }

    // Update points, carbon, and virtual garden
    user.points += reward.points;
    user.carbonSaved += reward.carbon;
    if (actionType === "planted_tree") user.virtualGarden.treesPlanted += 1;
    user.virtualGarden.gardenLevel = Math.floor(user.virtualGarden.treesPlanted / 5) + 1;

    // Unlock badges/milestones
    if (user.streak >= 7 && !user.badges.find((b) => b.name === "7-day Streak")) {
      user.badges.push({ name: "7-day Streak", unlocked: true, date: today });
    }
    if (
      user.carbonSaved >= 100 &&
      !user.milestones.find((m) => m.title === "100kg CO₂ Saved")
    ) {
      user.milestones.push({ title: "100kg CO₂ Saved", achieved: true, date: today });
    }

    // Mark the document as modified to ensure Mongoose saves subdocuments
    user.markModified('dailyLogs');
    user.markModified('badges');
    user.markModified('milestones');
    user.markModified('virtualGarden');

    const savedUser = await user.save();
    console.log(`User saved successfully. Actions completed: ${savedUser.dailyLogs.find(log => log.date.toISOString().split('T')[0] === todayStr)?.actionsCompleted}`);
    res.json(savedUser);
  } catch (err) {
    console.error("Error in /log-action:", err.message);
    next(err);
  }
});

// --------------------- Complete Challenge ---------------------
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
      user.points += challenge.pointsReward || 50;
      user.carbonSaved += challenge.carbonReduction || 10;

      if (challenge.badgeReward && !user.badges.find((b) => b.name === challenge.badgeReward)) {
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

// --------------------- Redeem Reward ---------------------
router.post("/redeem-reward", async (req, res, next) => {
  try {
    const { userId, item } = req.body;
    if (!userId || !item) return res.status(400).json({ message: "Missing userId or item" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const reward = user.rewards.find((r) => r.item === item);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    if (reward.redeemed) {
      return res.status(400).json({ message: "Reward already redeemed" });
    }

    if (user.points < reward.pointsRequired) {
      return res.status(400).json({
        message: `You need ${reward.pointsRequired - user.points} more points to redeem this reward`,
      });
    }

    user.points -= reward.pointsRequired;
    reward.redeemed = true;

    await user.save();
    res.json({ user, message: "Reward redeemed successfully" });
  } catch (err) {
    console.error("Error redeeming reward:", err.message);
    next(err);
  }
});

// --------------------- Get User ---------------------
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

    // ✅ Auto-upgrade users with low daily goal
    if (!user.dailyGoal || user.dailyGoal < 2) {
      user.dailyGoal = 2;
      await user.save();
    }

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
