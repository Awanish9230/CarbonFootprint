const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const User = require("../models/User");
const auth = require("../middleware/auth"); // ✅ use unified middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "myVerySecretKey123!";

// ---------------------- REGISTER ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, state } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash,
      state: state || "",
      dailyGoal: 1,
      streak: 0,
      points: 0,
      carbonSaved: 0,
      virtualGarden: { treesPlanted: 0, gardenLevel: 1 },
      challenges: [],
      milestones: [],
      badges: [],
      dailyLogs: [],
      level: 1,
      // ✅ Default Marketplace rewards
      rewards: [
        { item: "Eco Mug", pointsRequired: 50 },
        { item: "Reusable Bag", pointsRequired: 75 },
        { item: "Plant a Tree Kit", pointsRequired: 100 }
      ]
    });


    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ---------------------- PROFILE ----------------------
router.get("/profile", auth, async (req, res) => {
  try {
    // ✅ req.user is already populated by middleware
    const user = req.user || (await User.findById(req.userId));

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Return simplified but consistent user object
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      state: user.state,
      dailyGoal: user.dailyGoal,
      streak: user.streak,
      virtualGarden: user.virtualGarden || { treesPlanted: 0, gardenLevel: 1 },
      carbonSaved: user.carbonSaved || 0,
      challenges: user.challenges || [],
      rewards: user.rewards || [],
      milestones: user.milestones || [],
      badges: user.badges || [],
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ---------------------- Upload Profile Image ----------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", auth, upload.single("profile"), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      user.photoURL = base64Image;
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("Profile upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- GOALS CRUD ----------------------
router.post("/goals", auth, async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal || !goal.trim()) return res.status(400).json({ message: "Goal is required" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.goals = user.goals || [];
    if (!user.goals.some(g => g.text === goal)) {
      user.goals.push({ text: goal, completed: false });
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Add goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/goals/:index", auth, async (req, res) => {
  try {
    const { index } = req.params;
    const { text, completed } = req.body;

    const user = await User.findById(req.userId);
    if (!user || !user.goals[index]) return res.status(404).json({ message: "Goal not found" });

    if (text !== undefined) user.goals[index].text = text;
    if (completed !== undefined) user.goals[index].completed = completed;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/goals/:index", auth, async (req, res) => {
  try {
    const { index } = req.params;

    const user = await User.findById(req.userId);
    if (!user || !user.goals[index]) return res.status(404).json({ message: "Goal not found" });

    user.goals.splice(index, 1);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Delete goal error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
