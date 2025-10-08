// backend/routes/emissionRoutes.js
const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const EmissionLog = require('../models/EmissionLog');
const { computeFromInput } = require('../utils/calculator');
const { getRecommendationsWithGemini } = require('../services/recommendationService');

const router = express.Router();

// Validation schema
const logSchema = Joi.object({
  date: Joi.date().optional(),
  vehicle_km: Joi.number().min(0).default(0),
  bus_km: Joi.number().min(0).default(0),
  rail_km: Joi.number().min(0).default(0),
  flights_km: Joi.number().min(0).default(0),
  cycle_km: Joi.number().min(0).default(0),
  electricity_kwh: Joi.number().min(0).default(0),
  lpg_kg: Joi.number().min(0).default(0),
  shopping_inr: Joi.number().min(0).default(0),
  food_kgco2e: Joi.number().min(0).default(0),
  beef_kg: Joi.number().min(0).default(0),
  chicken_kg: Joi.number().min(0).default(0),
  vegetables_kg: Joi.number().min(0).default(0),
  water_liters: Joi.number().min(0).default(0),
  waste_kg: Joi.number().min(0).default(0),
  other: Joi.number().min(0).default(0),
});

// POST /log
router.post('/log', auth, validate(logSchema), async (req, res) => {
  try {
    const input = {
      vehicleKm: req.body.vehicle_km,
      busKm: req.body.bus_km,
      railKm: req.body.rail_km,
      flightsKm: req.body.flights_km,
      cycleKm: req.body.cycle_km,
      electricityKwh: req.body.electricity_kwh,
      lpgKg: req.body.lpg_kg,
      shoppingSpend: req.body.shopping_inr,
      foodKgCO2e: req.body.food_kgco2e,
      beefKg: req.body.beef_kg,
      chickenKg: req.body.chicken_kg,
      vegetablesKg: req.body.vegetables_kg,
      waterLiters: req.body.water_liters,
      wasteKg: req.body.waste_kg,
      other: req.body.other || 0,
    };

    const { totalCO2, breakdown } = computeFromInput(input);

    const log = await EmissionLog.create({
      user: req.user.id,
      date: req.body.date || new Date(),
      totalCO2,
      breakdown,
    });

    // Convert breakdown values to numbers to avoid Decimal issues
    const safeBreakdown = {};
    for (const k in breakdown) safeBreakdown[k] = Number(breakdown[k] || 0);

    res.json({
      _id: log._id,
      date: log.date,
      totalCO2: Number(log.totalCO2 || 0),
      breakdown: safeBreakdown,
    });
  } catch (err) {
    console.error('❌ Error logging emission:', err);
    res.status(500).json({ error: 'Failed to log emission' });
  }
});

// GET /summary
router.get('/summary', auth, async (req, res) => {
  try {
    const range = (req.query.range || 'monthly').toLowerCase();
    const now = new Date();
    const start = new Date(now);

    if (range === 'daily') start.setDate(now.getDate() - 1);
    else if (range === 'weekly') start.setDate(now.getDate() - 7);
    else if (range === 'yearly') start.setFullYear(now.getFullYear() - 1);
    else start.setMonth(now.getMonth() - 1);

    const logs = await EmissionLog.find({
      user: req.user.id,
      date: { $gte: start },
    }).sort({ date: 1 }).lean();

    const entries = logs.map((l) => ({
      date: l.date,
      totalCO2: Number(l.totalCO2 || 0),
      breakdown: Object.fromEntries(
        Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)])
      ),
    }));

    const aggregateBreakdown = entries.reduce((acc, e) => {
      for (const key in e.breakdown) {
        acc[key] = (acc[key] || 0) + e.breakdown[key];
      }
      return acc;
    }, {});

    const sum = entries.reduce((acc, e) => acc + e.totalCO2, 0);

    res.json({
      range,
      from: start,
      to: now,
      totalCO2: sum,
      breakdown: aggregateBreakdown,
      entries,
    });
  } catch (err) {
    console.error('❌ Error fetching summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const logs = await EmissionLog.find({ user: req.user.id }).sort({ date: 1 }).lean();
    const summary = logs.reduce(
      (acc, l) => {
        acc.totalCO2 += Number(l.totalCO2 || 0);
        for (const key in l.breakdown) {
          acc.breakdown[key] = (acc.breakdown[key] || 0) + Number(l.breakdown[key] || 0);
        }
        return acc;
      },
      { totalCO2: 0, breakdown: {} }
    );

    const { ruleBased = [], aiBased = [] } = await getRecommendationsWithGemini(summary);

    res.json({ ruleBased, aiBased });
  } catch (err) {
    console.error('❌ Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
