// backend/services/benchmarkService.js
import EmissionLog from '../models/EmissionLog.js';
import User from '../models/User.js';
import { breakdownToFourCategories } from '../utils/categoryMapping.js';

function sum(o) { return Object.values(o).reduce((a, b) => a + b, 0); }

async function user30d(userId) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  const logs = await EmissionLog.find({ user: userId, date: { $gte: start, $lte: now } }).lean();
  const cat = { transport: 0, food: 0, energy: 0, waste: 0 };
  for (const l of logs) {
    const b = Object.fromEntries(Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)]));
    const four = breakdownToFourCategories(b);
    cat.transport += four.transport;
    cat.food += four.food;
    cat.energy += four.energy;
    cat.waste += four.waste;
  }
  return { byCat: cat, total: sum(cat) };
}

async function peers30d({ scope = 'state', state = null } = {}) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);

  let usersFilter = {};
  if (scope === 'state' && state) usersFilter.state = state;
  const users = await User.find(usersFilter, '_id').lean();
  const userIds = users.map((u) => u._id);
  if (userIds.length === 0) return { avgByCat: { transport: 0, food: 0, energy: 0, waste: 0 }, totalsPerUser: [] };

  const logs = await EmissionLog.find({ user: { $in: userIds }, date: { $gte: start, $lte: now } }).lean();
  const byUser = new Map();
  for (const l of logs) {
    const uid = String(l.user);
    const b = Object.fromEntries(Object.entries(l.breakdown || {}).map(([k, v]) => [k, Number(v || 0)]));
    const four = breakdownToFourCategories(b);
    if (!byUser.has(uid)) byUser.set(uid, { transport: 0, food: 0, energy: 0, waste: 0 });
    const acc = byUser.get(uid);
    acc.transport += four.transport;
    acc.food += four.food;
    acc.energy += four.energy;
    acc.waste += four.waste;
  }
  const totalsPerUser = Array.from(byUser.values()).map((c) => ({ byCat: c, total: sum(c) }));
  const n = totalsPerUser.length || 1;
  const avgByCat = totalsPerUser.reduce((acc, r) => {
    acc.transport += r.byCat.transport / n;
    acc.food += r.byCat.food / n;
    acc.energy += r.byCat.energy / n;
    acc.waste += r.byCat.waste / n;
    return acc;
  }, { transport: 0, food: 0, energy: 0, waste: 0 });

  return { avgByCat, totalsPerUser };
}

function percentileRank(value, arr) {
  if (arr.length === 0) return 50;
  const sorted = [...arr].sort((a, b) => a - b);
  const below = sorted.filter((v) => v <= value).length;
  return Math.round((below / sorted.length) * 100);
}

function clusterFromShares(shares) {
  const entries = Object.entries(shares).sort((a, b) => b[1] - a[1]);
  const top = entries[0][0];
  if (top === 'transport') return 'Transport-heavy commuter';
  if (top === 'energy') return 'Energy-intensive household';
  if (top === 'food') return 'Food-driven footprint';
  return 'Balanced lifestyle';
}

export async function buildBenchmark(user) {
  const u = await user30d(user._id || user.id);
  const peers = await peers30d({ scope: 'state', state: user.state });

  const userShares = {
    transport: u.total ? (u.byCat.transport / u.total) : 0,
    food: u.total ? (u.byCat.food / u.total) : 0,
    energy: u.total ? (u.byCat.energy / u.total) : 0,
    waste: u.total ? (u.byCat.waste / u.total) : 0,
  };
  const cluster = clusterFromShares(userShares);
  const totalsList = peers.totalsPerUser.map((r) => r.total);
  const percentile = percentileRank(u.total, totalsList);

  // Compare categories
  const catComparison = {};
  for (const key of ['transport','food','energy','waste']) {
    const avg = peers.avgByCat[key] || 0;
    const my = u.byCat[key] || 0;
    catComparison[key] = {
      user: Number(my.toFixed(2)),
      community_avg: Number(avg.toFixed(2)),
      diff: Number((my - avg).toFixed(2)),
      higher_than_peers: my > avg,
    };
  }
  const worseCat = Object.entries(catComparison).sort((a, b) => (b[1].diff) - (a[1].diff))[0]?.[0] || null;

  return {
    cluster,
    total: Number(u.total.toFixed(2)),
    byCategory: Object.fromEntries(Object.entries(u.byCat).map(([k, v]) => [k, Number(v.toFixed(2))])),
    community: {
      scope: 'state',
      state: user.state || null,
      avg_by_category: Object.fromEntries(Object.entries(peers.avgByCat).map(([k, v]) => [k, Number(v.toFixed(2))])),
      percentile: percentile, 
    },
    highlight: worseCat,
    summary: `You are in the "${cluster}" group. Your 30-day total is at the ${percentile}th percentile among similar users. ${worseCat ? `Your ${worseCat} emissions are higher than peers.` : ''}`.trim(),
  };
}

