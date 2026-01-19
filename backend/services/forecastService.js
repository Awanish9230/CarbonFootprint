// backend/services/forecastService.js
// const EmissionLog = require('../models/EmissionLog');
// const { breakdownToFourCategories } = require('../utils/categoryMapping');
import EmissionLog from "../models/EmissionLog.js";
import { breakdownToFourCategories } from "../utils/categoryMapping.js";

function toISODate(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10); // YYYY-MM-DD
}

function linearRegression(y = []) {
  const n = y.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const x = Array.from({ length: n }, (_, i) => i);
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - xMean) * (y[i] - yMean);
    den += (x[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function pctChange(newVal, oldVal) {
  const n = Number(newVal || 0);
  const o = Number(oldVal || 0);
  if (o === 0) return n === 0 ? 0 : 100;
  return ((n - o) / o) * 100;
}

async function getDailySeries(userId, windowDays = 60) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - windowDays);

  const logs = await EmissionLog.find({ user: userId, date: { $lte: now, $gte: start } })
    .sort({ date: 1 })
    .lean();

  const byDay = new Map();
  for (const l of logs) {
    const key = toISODate(l.date);
    const totalCO2 = Number(l.totalCO2 || 0);
    const breakdown = Object.fromEntries(
      Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)])
    );
    const cat4 = breakdownToFourCategories(breakdown);
    if (!byDay.has(key)) {
      byDay.set(key, { total: 0, categories: { transport: 0, food: 0, energy: 0, waste: 0 } });
    }
    const rec = byDay.get(key);
    rec.total += totalCO2;
    rec.categories.transport += cat4.transport;
    rec.categories.food += cat4.food;
    rec.categories.energy += cat4.energy;
    rec.categories.waste += cat4.waste;
  }

  const days = Array.from(byDay.keys()).sort();
  const series = days.map((d) => ({ date: d, ...byDay.get(d) }));
  return { series, start, end: now };
}

function forecastSeries(values = [], horizon = 7) {
  if (values.length === 0) return { total: 0, daily: Array(horizon).fill(0) };
  const W = Math.min(14, values.length);
  const tail = values.slice(-W);
  const mean = sum(tail) / tail.length;
  const { slope } = linearRegression(tail);
  const last = values[values.length - 1];
  const alpha = 0.6; // weight on trend
  const daily = [];
  for (let i = 1; i <= horizon; i++) {
    const trendPred = last + i * slope;
    const blended = alpha * trendPred + (1 - alpha) * mean;
    daily.push(Math.max(0, blended));
  }
  return { total: sum(daily), daily };
}

async function buildForecast(userId) {
  const { series } = await getDailySeries(userId, 120);
  if (series.length === 0) {
    return {
      forecast: {
        next7: { total: 0, byCategory: { transport: 0, food: 0, energy: 0, waste: 0 }, pctChangeVsPrev: 0, byCategoryChangePct: { transport: 0, food: 0, energy: 0, waste: 0 } },
        next30: { total: 0, byCategory: { transport: 0, food: 0, energy: 0, waste: 0 }, pctChangeVsPrev: 0, byCategoryChangePct: { transport: 0, food: 0, energy: 0, waste: 0 } },
      },
      insights: 'Not enough data to forecast yet.'
    };
  }

  const totals = series.map((d) => d.total);
  const cats = {
    transport: series.map((d) => d.categories.transport),
    food: series.map((d) => d.categories.food),
    energy: series.map((d) => d.categories.energy),
    waste: series.map((d) => d.categories.waste),
  };

  const prev7 = sum(totals.slice(-7));
  const prev30 = sum(totals.slice(-30));

  const f7_total = forecastSeries(totals, 7);
  const f30_total = forecastSeries(totals, 30);

  const f7_cats = {
    transport: forecastSeries(cats.transport, 7).total,
    food: forecastSeries(cats.food, 7).total,
    energy: forecastSeries(cats.energy, 7).total,
    waste: forecastSeries(cats.waste, 7).total,
  };
  const f30_cats = {
    transport: forecastSeries(cats.transport, 30).total,
    food: forecastSeries(cats.food, 30).total,
    energy: forecastSeries(cats.energy, 30).total,
    waste: forecastSeries(cats.waste, 30).total,
  };

  const prev7_cats = {
    transport: sum(cats.transport.slice(-7)),
    food: sum(cats.food.slice(-7)),
    energy: sum(cats.energy.slice(-7)),
    waste: sum(cats.waste.slice(-7)),
  };
  const prev30_cats = {
    transport: sum(cats.transport.slice(-30)),
    food: sum(cats.food.slice(-30)),
    energy: sum(cats.energy.slice(-30)),
    waste: sum(cats.waste.slice(-30)),
  };

  const next7 = {
    total: Number(f7_total.total.toFixed(2)),
    byCategory: {
      transport: Number(f7_cats.transport.toFixed(2)),
      food: Number(f7_cats.food.toFixed(2)),
      energy: Number(f7_cats.energy.toFixed(2)),
      waste: Number(f7_cats.waste.toFixed(2)),
    },
    pctChangeVsPrev: Number(pctChange(f7_total.total, prev7).toFixed(2)),
    byCategoryChangePct: {
      transport: Number(pctChange(f7_cats.transport, prev7_cats.transport).toFixed(2)),
      food: Number(pctChange(f7_cats.food, prev7_cats.food).toFixed(2)),
      energy: Number(pctChange(f7_cats.energy, prev7_cats.energy).toFixed(2)),
      waste: Number(pctChange(f7_cats.waste, prev7_cats.waste).toFixed(2)),
    },
  };

  const next30 = {
    total: Number(f30_total.total.toFixed(2)),
    byCategory: {
      transport: Number(f30_cats.transport.toFixed(2)),
      food: Number(f30_cats.food.toFixed(2)),
      energy: Number(f30_cats.energy.toFixed(2)),
      waste: Number(f30_cats.waste.toFixed(2)),
    },
    pctChangeVsPrev: Number(pctChange(f30_total.total, prev30).toFixed(2)),
    byCategoryChangePct: {
      transport: Number(pctChange(f30_cats.transport, prev30_cats.transport).toFixed(2)),
      food: Number(pctChange(f30_cats.food, prev30_cats.food).toFixed(2)),
      energy: Number(pctChange(f30_cats.energy, prev30_cats.energy).toFixed(2)),
      waste: Number(pctChange(f30_cats.waste, prev30_cats.waste).toFixed(2)),
    },
  };

  // Build concise insight
  const deltas7 = Object.entries(next7.byCategoryChangePct).sort((a, b) => b[1] - a[1]);
  const incCat = deltas7[0];
  const decCat = deltas7[deltas7.length - 1];
  const toLabel = (c) => ({ transport: 'transport', food: 'food', energy: 'energy', waste: 'waste' }[c] || c);
  const insight = `Over the next week, ${toLabel(incCat[0])} is likely to increase by ${incCat[1]}%, while ${toLabel(decCat[0])} may decrease by ${Math.abs(decCat[1])}%`;

  return { forecast: { next7, next30 }, insights: insight };
}

// module.exports = { buildForecast };
export { buildForecast };
