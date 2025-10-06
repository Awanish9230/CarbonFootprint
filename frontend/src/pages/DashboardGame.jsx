// src/pages/DashboardGame.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import DailyTasks from "../components/DailyTasks";
import Challenges from "../components/Challenges";
import Marketplace from "../components/Marketplace";

export default function DashboardGame() {
  const [user, setUser] = useState({
    name: "User",
    dailyGoal: 1,
    streak: 0,
    points: 0,
    carbonSaved: 0,
    badges: [],
    milestones: [],
    rewards: [],
    challenges: [],
    dailyTasks: [],
    virtualGarden: { treesPlanted: 0, gardenLevel: 1 },
  });
  const [actions, setActions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showStreakReminder, setShowStreakReminder] = useState(false);

  // Fetch user data and generate daily tasks
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) throw new Error("User ID not found");

      // Fetch user
      const res = await api.get(`/gamification/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data || {};

      // Generate today's tasks if none exist
      await api.post(
        "/gamification/generate-daily-challenges",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh user data after generating tasks
      const refreshRes = await api.get(`/gamification/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data = refreshRes.data || {};

      const safeUser = {
        _id: data._id || userId,
        name: data.name || "User",
        dailyGoal: data.dailyGoal || 1,
        streak: data.streak || 0,
        points: data.points || 0,
        carbonSaved: data.carbonSaved || 0,
        badges: data.badges || [],
        milestones: data.milestones || [],
        rewards: data.rewards || [],
        challenges: data.challenges || [],
        dailyTasks: data.dailyTasks || [],
        virtualGarden: {
          treesPlanted: data.virtualGarden?.treesPlanted || 0,
          gardenLevel: data.virtualGarden?.gardenLevel || 1,
        },
      };

      setUser(safeUser);
      setShowStreakReminder(safeUser.streak === 0);
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
      setUser({
        name: "User",
        dailyGoal: 1,
        streak: 0,
        points: 0,
        carbonSaved: 0,
        badges: [],
        milestones: [],
        rewards: [],
        challenges: [],
        dailyTasks: [],
        virtualGarden: { treesPlanted: 0, gardenLevel: 1 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Log generic action manually
  const logAction = async () => {
    if (actions < 1 || !user?._id) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/gamification/log-action",
        { userId: user._id, actions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActions(0);
      setShowStreakReminder(false);
      fetchUser();
    } catch (err) {
      console.error("Error logging actions:", err.response?.data || err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-lg font-medium">Loading...</p>;

  const { virtualGarden, badges, milestones, rewards, challenges, dailyTasks, carbonSaved } = user;

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black text-white p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌱 Gamified Carbon Tracker</h1>

      {/* Daily Streak Reminder */}
      <AnimatePresence>
        {showStreakReminder && (
          <motion.div
            className="p-4 bg-red-500 rounded shadow mb-4 text-white animate-pulse"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            🔔 Don’t forget to log your actions today to maintain your streak!
            <button className="ml-4 underline" onClick={() => setShowStreakReminder(false)}>
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Streak & Actions */}
      <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-black dark:text-white">Hello, {user.name}!</p>
          <p className="text-black dark:text-white">
            Daily Goal: <span className="font-bold">{user.dailyGoal}</span> actions
          </p>
          <p className="text-black dark:text-white">
            Streak: <span className="font-bold">{user.streak}</span> days 🔥
          </p>
          <p className="text-black dark:text-white">
            Points: <span className="font-bold">{user.points}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={actions}
            onChange={(e) => setActions(Number(e.target.value))}
            className="border p-2 rounded w-24 text-black"
          />
          <button
            onClick={logAction}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Log Actions
          </button>
        </div>
      </div>

      {/* Daily Tasks */}
      <DailyTasks user={user} refreshUser={fetchUser} />

      {/* Challenges */}
      <Challenges user={user} userId={user._id} refreshUser={fetchUser} />

      {/* Virtual Garden */}
      <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Your Garden 🌳</h2>
        <p className="text-black dark:text-white">Trees Planted: {virtualGarden.treesPlanted}</p>
        <p className="text-black dark:text-white">Garden Level: {virtualGarden.gardenLevel}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from({ length: virtualGarden.treesPlanted }).map((_, i) => (
            <img key={i} src="/tree.png" alt="tree" className="w-12 h-12" />
          ))}
        </div>
      </div>

      {/* Carbon Saved */}
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Carbon Saved 🌱</h2>
        <p className="text-lg font-bold text-black dark:text-white">{carbonSaved} kg CO₂</p>
      </div>

      {/* Badges */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Badges 🏅</h2>
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {badges.map((badge, i) => (
              <motion.div
                key={badge.name || i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-3 rounded-lg font-semibold text-black dark:text-white ${
                  badge.unlocked ? "bg-yellow-300 dark:bg-yellow-700" : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                {badge.name || "Unnamed Badge"}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Milestones */}
      <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Milestones 🎉</h2>
        <ul className="list-disc list-inside text-black dark:text-white">
          {milestones.map((m, i) => (
            <li key={i}>
              {m.title || "Untitled"} {m.achieved ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      </div>

      {/* Marketplace */}
      <Marketplace user={user} userId={user._id} refreshUser={fetchUser} />
    </div>
  );
}
