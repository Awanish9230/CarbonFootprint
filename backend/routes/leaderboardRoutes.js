const express = require('express');
const User = require('../models/User');
const EmissionLog = require('../models/EmissionLog');

const router = express.Router();

async function aggregateByUsers(match = {}) {
  const agg = await EmissionLog.aggregate([
    { $match: match },
    { $group: { _id: '$user', totalCO2: { $sum: '$totalCO2' } } },
    { $sort: { totalCO2: 1 } },
    { $limit: 100 }
  ]);
  const users = await User.find({ _id: { $in: agg.map((a) => a._id) } }, 'name state');
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  return agg.map((a) => ({ user: userMap.get(String(a._id)), totalCO2: a.totalCO2 }));
}

router.get('/national', async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(now.getMonth() - 1);
  const results = await aggregateByUsers({ date: { $gte: start } });
  res.json({ scope: 'national', from: start, to: now, results });
});

router.get('/state/:state', async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(now.getMonth() - 1);

  // Case-insensitive match for state name
  const stateParam = req.params.state.trim();
  const usersInState = await User.find(
    { state: { $regex: new RegExp(`^${stateParam}$`, 'i') } },
    '_id'
  );
  const userIds = usersInState.map((u) => u._id);
  const results = await aggregateByUsers({ date: { $gte: start }, user: { $in: userIds } });
  res.json({ scope: 'state', state: stateParam, from: start, to: now, results });
});

module.exports = router;
