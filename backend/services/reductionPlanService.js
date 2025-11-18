// backend/services/reductionPlanService.js
import EmissionLog from '../models/EmissionLog.js';
import { breakdownToFourCategories } from '../utils/categoryMapping.js';

async function getLast30CategoryTotals(userId) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  const logs = await EmissionLog.find({ user: userId, date: { $gte: start, $lte: now } })
    .sort({ date: 1 })
    .lean();
  const totals = { transport: 0, food: 0, energy: 0, waste: 0 };
  for (const l of logs) {
    const b = Object.fromEntries(Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)]));
    const four = breakdownToFourCategories(b);
    totals.transport += four.transport;
    totals.food += four.food;
    totals.energy += four.energy;
    totals.waste += four.waste;
  }
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  return { totals, total };
}

function actionTemplates() {
  return {
    transport: [
      { action: 'Replace two car trips per week with walking/cycling/public transport', pct: 8, difficulty: 'easy' },
      { action: 'Carpool for commute 3 days/week', pct: 10, difficulty: 'moderate' },
      { action: 'Plan routes and service vehicle to improve fuel efficiency', pct: 5, difficulty: 'easy' },
    ],
    energy: [
      { action: 'Switch 10 bulbs to LEDs and turn off idle appliances', pct: 6, difficulty: 'easy' },
      { action: 'Raise AC setpoint to 26°C and use fan mode at night', pct: 8, difficulty: 'easy' },
      { action: 'Schedule heavy appliances in off-peak and reduce standby loads', pct: 5, difficulty: 'moderate' },
    ],
    food: [
      { action: 'Go plant-based 3 days/week and cut red meat', pct: 12, difficulty: 'moderate' },
      { action: 'Reduce dairy to once/day and avoid food waste', pct: 6, difficulty: 'easy' },
      { action: 'Buy seasonal local produce', pct: 3, difficulty: 'easy' },
    ],
    waste: [
      { action: 'Start composting kitchen scraps', pct: 5, difficulty: 'moderate' },
      { action: 'Eliminate single-use plastics and recycle rigorously', pct: 4, difficulty: 'easy' },
      { action: 'Buy durable products; avoid fast fashion this month', pct: 5, difficulty: 'moderate' },
    ],
  };
}

function buildPlanFromTopCategories(topCats) {
  const templates = actionTemplates();
  const plan = { shortTerm: [], mediumTerm: [], longTerm: [] };

  for (const cat of topCats) {
    const t = templates[cat];
    if (!t) continue;
    // Short-term: first suggestion
    plan.shortTerm.push({ category: cat, action: t[0].action, estimated_reduction_pct: t[0].pct, difficulty: t[0].difficulty });
    // Medium-term: first two
    plan.mediumTerm.push({ category: cat, action: t[1].action, estimated_reduction_pct: t[1].pct, difficulty: t[1].difficulty });
    // Long-term: third
    plan.longTerm.push({ category: cat, action: t[2].action, estimated_reduction_pct: t[2].pct, difficulty: t[2].difficulty });
  }

  return plan;
}

export async function buildReductionPlan(userId) {
  const { totals, total } = await getLast30CategoryTotals(userId);
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const topCats = entries.slice(0, 2).map(([k]) => k); // focus on top 2
  const plan = buildPlanFromTopCategories(topCats);

  return {
    context: {
      current_total_30d: Number(total.toFixed(2)),
      current_by_category_30d: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Number(v.toFixed(2))])),
      top_categories: topCats,
    },
    plan,
    note: 'Small consistent changes compound. Focus on the top contributors for the biggest impact!'
  };
}

