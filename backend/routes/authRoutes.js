import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

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

      // ✅ Default Marketplace rewards with images
      rewards: [
        { item: "Eco Mug", pointsRequired: 50, image: "https://images.prestogifts.com/upload/New-Product-Listing/Utility-Gifts-Catalogue/MG-6009/1431x1431/66ded57255874_6009-1431-BG.webp" },
        { item: "Reusable Bag", pointsRequired: 75, image: "https://daksindia.com/wp-content/uploads/2021/08/web1.jpeg" },
        { item: "Plant a Tree Kit", pointsRequired: 100, image: "https://images-cdn.ubuy.co.in/63b3fd57eb8ac71eb86f244a-bonsai-tree-kit-nifsel-bonsai-starter.jpg" },
        { item: "Solar Charger", pointsRequired: 150, image: "https://variety.com/wp-content/uploads/2025/04/blavor-charger-deal.jpg?w=731&h=476&crop=1" },
        { item: "Water Bottle", pointsRequired: 30, image: "https://homafy.com/wp-content/uploads/2023/03/school-water-bottle.jpeg" },
        { item: "Seed Pack", pointsRequired: 40, image: "https://organicbazar.net/cdn/shop/files/45_vegetable_seed_kit_vegetables_seeds_organic_bazar_all_season_vegetable_seeds_seeds_kit_all_vegetable_seeds_kit.jpg?v=1755175866&width=1946" },
        { item: "Eco Notebook", pointsRequired: 60, image: "https://seedballs.in/cdn/shop/files/EcoFriendly-_Custom_Printed-Spiral_Notebook_2.jpg?v=1739765460" },
        { item: "Bamboo Toothbrush", pointsRequired: 25, image: "https://5.imimg.com/data5/SELLER/Default/2021/11/RP/GI/TL/140258896/natural-bamboo-tooth-brush.png" },
        { item: "Metal Straw Set", pointsRequired: 35, image: "https://m.media-amazon.com/images/I/61I1pFPxNXL._SX425_.jpg" },
        { item: "Cloth Shopping Kit", pointsRequired: 80, image: "https://m.media-amazon.com/images/I/81piLxtUxPL._SX679_.jpg" },
        { item: "Home Compost Bin", pointsRequired: 120, image: "https://m.media-amazon.com/images/I/71C5i7NysxL._SX679_.jpg" },
        { item: "Solar Lantern", pointsRequired: 90, image: "https://m.media-amazon.com/images/I/61h2qT9XyOL._SX679_.jpg" }
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
      photoURL: user.photoURL || "",
      points: user.points || 0,
      level: user.level || 1,
      dailyGoal: user.dailyGoal,
      streak: user.streak,
      virtualGarden: user.virtualGarden || { treesPlanted: 0, gardenLevel: 1 },
      carbonSaved: user.carbonSaved || 0,
      challenges: user.challenges || [],
      rewards: user.rewards || [],
      milestones: user.milestones || [],
      badges: user.badges || [],
      goals: user.goals || [],
      dailyLogs: user.dailyLogs || [],
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- UPDATE PROFILE ----------------------
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, state } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (typeof state === "string") {
      user.state = state.trim();
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
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

export default router;
