import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// Helper function to escape regex special characters
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Search by name (safe for special characters)
router.get("/search", async (req, res) => {
  try {
    let { q } = req.query;
    if (!q) return res.json([]);

    q = escapeRegex(q); // escape special regex characters
    const items = await Item.find({ name: { $regex: q, $options: "i" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// GET suggestions for autocomplete (safe for special characters)
router.get("/suggestions", async (req, res) => {
  let { q } = req.query;
  if (!q) return res.json([]);

  try {
    q = escapeRegex(q); // escape special regex characters
    const regex = new RegExp(q, "i"); // case-insensitive search
    const items = await Item.find({ name: regex }).limit(10); // limit to 10 suggestions
    const suggestions = items.map(item => item.name);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

export default router;
