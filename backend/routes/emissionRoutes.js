const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const EmissionLog = require('../models/EmissionLog');
const EmissionFactor = require('../models/EmissionFactor');
const { computeFromInput } = require('../utils/calculator');
const { getRecommendationsWithGemini } = require('../services/recommendationService');

const router = express.Router();

// --- Updated schema to include new inputs ---
const logSchema = Joi.object({
  date: Joi.date().optional(),
  vehicleKm: Joi.number().min(0).default(0),
  electricityKwh: Joi.number().min(0).default(0),
  shoppingSpend: Joi.number().min(0).default(0),
  foodKgCO2e: Joi.number().min(0).default(0),
  other: Joi.number().min(0).default(0),

  // New fields
  flightsKm: Joi.number().min(0).default(0),
  waterLiters: Joi.number().min(0).default(0),
  wasteKg: Joi.number().min(0).default(0)
});


// --- Log emission entry ---
router.post('/log', auth, validate(logSchema), async (req, res) => {
  try {
    const { totalCO2, breakdown } = computeFromInput(req.body);
    const log = await EmissionLog.create({
      user: req.user.id,
      date: req.body.date || new Date(),
      totalCO2,
      breakdown
    });
    res.json(log);
  } catch (err) {
    console.error('Error logging emission:', err);
    res.status(500).json({ error: 'Failed to log emission' });
  }
});

// --- Summary endpoint ---
router.get('/summary', auth, async (req, res) => {
  try {
    const range = (req.query.range || 'monthly').toLowerCase();
    const now = new Date();
    const start = new Date(now);

    if (range === 'daily') start.setDate(now.getDate() - 1);
    else if (range === 'weekly') start.setDate(now.getDate() - 7);
    else if (range === 'yearly') start.setFullYear(now.getFullYear() - 1);
    else start.setMonth(now.getMonth() - 1);

    const logs = await EmissionLog.find({ user: req.user.id, date: { $gte: start } }).sort({ date: 1 });
    const totals = logs.map(l => ({ date: l.date, totalCO2: l.totalCO2, breakdown: l.breakdown }));

    const sum = totals.reduce((acc, e) => acc + e.totalCO2, 0);
    const aggregateBreakdown = totals.reduce(
      (acc, e) => ({
        vehicleKm: acc.vehicleKm + e.breakdown.vehicleKm,
        electricityKwh: acc.electricityKwh + e.breakdown.electricityKwh,
        shoppingSpend: acc.shoppingSpend + e.breakdown.shoppingSpend,
        foodKgCO2e: acc.foodKgCO2e + e.breakdown.foodKgCO2e,
       
        flightsKm: (acc.flightsKm || 0) + (e.breakdown.flightsKm || 0),
        waterLiters: (acc.waterLiters || 0) + (e.breakdown.waterLiters || 0),
        wasteKg: (acc.wasteKg || 0) + (e.breakdown.wasteKg || 0),
        other: acc.other + e.breakdown.other,
      }),
      { vehicleKm: 0, electricityKwh: 0, shoppingSpend: 0, foodKgCO2e: 0, other: 0, flightsKm: 0, waterLiters: 0, wasteKg: 0 }
    );

    res.json({ range, from: start, to: now, totalCO2: sum, breakdown: aggregateBreakdown, entries: totals });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// --- Search emission factors ---
router.get('/search-item', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ items: [], alternatives: [] });

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const items = await EmissionFactor.find({ name: regex }).limit(10);

    const categories = [...new Set(items.map(i => i.category))];
    const alternatives = await EmissionFactor.find({ category: { $in: categories } }).limit(12);

    res.json({
      items,
      alternatives: alternatives.filter(a => !items.some(i => i.id === a.id)).slice(0, 8)
    });
  } catch (err) {
    console.error('Error searching items:', err);
    res.status(500).json({ error: 'Failed to search items' });
  }
});

// --- Recommendations endpoint using Gemini ---
router.get('/recommendations', auth, async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1); // last month

    const logs = await EmissionLog.find({ user: req.user.id, date: { $gte: start } });
    const summary = logs.reduce(
      (acc, l) => {
        acc.totalCO2 += l.totalCO2;
        acc.breakdown.vehicleKm += l.breakdown.vehicleKm;
        acc.breakdown.electricityKwh += l.breakdown.electricityKwh;
        acc.breakdown.shoppingSpend += l.breakdown.shoppingSpend;
        acc.breakdown.foodKgCO2e += l.breakdown.foodKgCO2e;
        acc.breakdown.other += l.breakdown.other;
        acc.breakdown.flightsKm += l.breakdown.flightsKm || 0;
        acc.breakdown.waterLiters += l.breakdown.waterLiters || 0;
        acc.breakdown.wasteKg += l.breakdown.wasteKg || 0;
        return acc;
      },
      { totalCO2: 0, breakdown: { vehicleKm: 0, electricityKwh: 0, shoppingSpend: 0, foodKgCO2e: 0, other: 0, flightsKm: 0, waterLiters: 0, wasteKg: 0 } }
    );

    // Fetch recommendations from Gemini + rule-based separately
    const { ruleBased, aiBased } = await getRecommendationsWithGemini(summary);

    res.json({
      range: 'monthly',
      ruleBased,
      aiBased
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
