// backend/routes/insightRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';
import EmissionLog from '../models/EmissionLog.js';
import { buildForecast } from '../services/forecastService.js';
import { buildReductionPlan } from '../services/reductionPlanService.js';
import { buildBenchmark } from '../services/benchmarkService.js';
import { generateAssistantReply } from '../services/assistantService.js';

const router = express.Router();

// GET /api/insights/forecast
router.get('/forecast', auth, async (req, res) => {
  try {
    const result = await buildForecast(req.user._id || req.user.id);
    res.json(result);
  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: 'Failed to build forecast' });
  }
});

// GET /api/insights/reduction-plan
router.get('/reduction-plan', auth, async (req, res) => {
  try {
    const plan = await buildReductionPlan(req.user._id || req.user.id);
    res.json(plan);
  } catch (err) {
    console.error('Reduction plan error:', err);
    res.status(500).json({ error: 'Failed to build reduction plan' });
  }
});

// GET /api/insights/benchmark
router.get('/benchmark', auth, async (req, res) => {
  try {
    const bench = await buildBenchmark(req.user);
    res.json(bench);
  } catch (err) {
    console.error('Benchmark error:', err);
    res.status(500).json({ error: 'Failed to build benchmark' });
  }
});

// POST /api/insights/assistant
router.post('/assistant', auth, async (req, res) => {
  try {
    const question = req.body?.question || 'How am I doing?';

    // Build context pieces
    // History: reuse /summary logic inline for last 30 days
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    const logs = await EmissionLog.find({ user: req.user.id, date: { $gte: start } }).sort({ date: 1 }).lean();
    const entries = logs.map((l) => ({
      date: l.date,
      totalCO2: Number(l.totalCO2 || 0),
      breakdown: Object.fromEntries(Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)])),
    }));
    const totalCO2 = entries.reduce((a, e) => a + e.totalCO2, 0);
    const breakdown = entries.reduce((acc, e) => {
      for (const k in e.breakdown) acc[k] = (acc[k] || 0) + e.breakdown[k];
      return acc;
    }, {});

    const forecast = (await buildForecast(req.user.id)).forecast;
    const plan = await buildReductionPlan(req.user.id);
    const bench = await buildBenchmark(req.user);

    const reply = await generateAssistantReply({
      history30d: { totalCO2, breakdown },
      forecast,
      plan,
      benchmark: bench,
      question,
    });
    res.type('text/plain').send(reply);
  } catch (err) {
    console.error('Assistant error:', err);
    res.status(500).json({ error: 'Failed to generate assistant reply' });
  }
});

export default router;
