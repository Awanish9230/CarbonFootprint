// src/pages/DashboardGame.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import DailyTasks from "../components/DailyTasks";
import Challenges from "../components/Challenges";
import Marketplace from "../components/Marketplace";
import treeImg from "../assets/tree.png"

export default function DashboardGame() {
  const [user, setUser] = useState({
    name: "User",
    dailyGoal: 2,
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
  const [actions, setActions] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyGoalReached, setDailyGoalReached] = useState(false);
  const [showStreakReminder, setShowStreakReminder] = useState(false);
  const [isLoggingAction, setIsLoggingAction] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User ID not found");

      // Fetch user data
      const res = await api.get(`/gamification/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = res.data || {};

      // Generate daily challenges
      await api.post(
        "/gamification/generate-daily-challenges",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh user after generating challenges
      const refreshRes = await api.get(`/gamification/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data = refreshRes.data || {};

      // Calculate daily goal completion
      const todayStr = new Date().toISOString().split("T")[0];
      const todayLog = (data.dailyLogs || []).find(
        (log) => log.date.split("T")[0] === todayStr
      );

      const safeUser = {
        _id: data._id || userId,
        name: data.name || "User",
        dailyGoal: data.dailyGoal || 2,
        streak: data.streak || 0,
        points: data.points || 0,
        carbonSaved: data.carbonSaved || 0,
        badges: data.badges || [],
        milestones: data.milestones || [],
        rewards: data.rewards || [],
        challenges: data.challenges || [],
        dailyTasks: data.dailyTasks || [],
        dailyLogs: data.dailyLogs || [],
        virtualGarden: {
          treesPlanted: data.virtualGarden?.treesPlanted || 0,
          gardenLevel: data.virtualGarden?.gardenLevel || 1,
        },
      };

      setUser(safeUser);
      setShowStreakReminder(safeUser.streak === 0);
      setDailyGoalReached(todayLog?.actionsCompleted >= safeUser.dailyGoal);
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logAction = async () => {
    // Prevent double submissions
    if (isLoggingAction) {
      console.log("Already logging an action, please wait...");
      return;
    }

    // Validate all conditions
    if (!actions || actions === "") {
      toast.error("Please select an action first");
      return;
    }
    
    if (!user?._id) {
      toast.error("User not found");
      return;
    }
    
    if (dailyGoalReached) {
      toast.error("Daily goal already reached!");
      return;
    }

    setIsLoggingAction(true);
    console.log("Logging action:", actions, "for user:", user._id);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/gamification/log-action",
        { userId: user._id, actionType: actions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Action logged successfully:", response.data);
      toast.success("Action logged successfully!");
      setActions("");
      setShowStreakReminder(false);
      await fetchUser();
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      console.error("Error logging action:", err.response?.data || err.message);

      if (backendMsg === "Action already logged today!") {
        toast.error(
          "You already logged this action today. Each action type can only be logged once per day."
        );
      } else if (backendMsg === "Daily goal already reached!") {
        toast.error(backendMsg);
        setDailyGoalReached(true);
      } else {
        toast.error(backendMsg || "Failed to log action");
      }
    } finally {
      setIsLoggingAction(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-xl space-y-6">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6 animate-pulse"></div>
        
        {/* Main Card Skeleton */}
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6 border-2 border-gray-200 dark:border-gray-600 animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-600 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );

  const { virtualGarden, badges, milestones, dailyTasks, carbonSaved } = user;

  return (
    <motion.div
      className="min-h-screen p-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-xl space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
        🌱 Gamified Carbon Tracker
      </h1>

      {/* Daily Goal Reached */}
      {dailyGoalReached && (
        <div className="p-4 bg-green-500 rounded-2xl shadow mb-4 text-white text-center">
          🎉 You have reached your daily goal!
        </div>
      )}

      {/* Daily Streak Reminder */}
      <AnimatePresence>
        {showStreakReminder && !dailyGoalReached && (
          <motion.div
            className="p-4 bg-red-500 rounded-2xl shadow mb-4 text-white animate-pulse text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            🔔 Don’t forget to log your actions today to maintain your streak!
            <button
              className="ml-4 underline"
              onClick={() => setShowStreakReminder(false)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Streak & Actions */}
      <div className="p-8 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white rounded-2xl shadow-xl space-y-6 border-2 border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-xl font-semibold">Hello, {user.name}!</p>

            {/* Daily Goal with progress */}         
            <p>
              Daily Goal:{" "}
              <span className="font-bold">
                {user.dailyGoal} {dailyGoalReached ? "✅ (Completed)" : "actions"}
              </span>
            </p>

            {/* Progress display (e.g., 1 / 2 actions completed) */}
            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const todayLog =
                user.dailyLogs?.find(
                  (log) => log.date.split("T")[0] === todayStr
                ) || {};
              const completed = todayLog.actionsCompleted || 0;
              const goal = user.dailyGoal || 1;
              const progressPercent = Math.min((completed / goal) * 100, 100);

              return (
                <div className="mt-2">
                  <p className="text-sm">
                    {completed} / {goal} actions completed
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-1">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-green-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            <p className="mt-3">
              Streak: <span className="font-bold">{user.streak}</span> days 🔥
            </p>
            <p>
              Points: <span className="font-bold">{user.points}</span>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Note: Each action type can be logged only once per day. Try different eco-actions to reach your
              daily goal.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          <select
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            disabled={dailyGoalReached}
            className="flex-1 border border-gray-600 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <option value="">-- Select an action --</option>
            <option value="used_public_transport">Used Public Transport 🚆</option>
            <option value="cycled_or_walked">Cycled or Walked 🚴‍♂️</option>
            <option value="recycled_waste">Recycled Waste ♻️</option>
            <option value="avoided_plastic">Avoided Single-use Plastic 🚯</option>
            <option value="used_renewable_energy">Used Renewable Energy ⚡</option>
            <option value="planted_tree">Planted a Tree 🌳</option>
            <option value="saved_water">Saved Water 💧</option>
          </select>

          <button
            onClick={logAction}
            disabled={!actions || dailyGoalReached || isLoggingAction}
            className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base md:text-lg
             bg-[linear-gradient(159deg,#0892d0,#4b0082)]
             hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingAction ? "Logging..." : "Log Action"}
          </button>
        </div>
      </div>


      {/* Daily Tasks */}
      <DailyTasks user={user} refreshUser={fetchUser} />

      {/* Challenges */}
      <Challenges user={user} userId={user._id} refreshUser={fetchUser} />

      {/* Virtual Garden */}
      <motion.div
        className="p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-700 rounded-2xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Your Garden 🌳
        </h2>
        <p>Trees Planted: {user.virtualGarden.treesPlanted}</p>
        <p>Garden Level: {user.virtualGarden.gardenLevel}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from({ length: user.virtualGarden.treesPlanted }).map((_, i) => (
            <img key={i} src={treeImg} alt="tree" className="w-12 h-12" />
          ))}
        </div>
      </motion.div>

      {/* Carbon Saved */}
      <motion.div
        className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-700 rounded-2xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Carbon Saved 🌱
        </h2>
        <p className="text-lg font-bold">{carbonSaved} kg CO₂</p>
      </motion.div>

      {/* Badges */}
      <motion.div
        className="p-6 bg-yellow-100 dark:bg-yellow-900 rounded-2xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Badges 🏅</h2>
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {badges.map((badge, i) => (
              <motion.div
                key={badge.name || i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-3 rounded-2xl font-semibold text-gray-900 dark:text-gray-100 ${badge.unlocked ? "bg-yellow-300 dark:bg-yellow-700" : "bg-gray-200 dark:bg-gray-800"
                  }`}
              >
                {badge.name || "Unnamed Badge"}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div
        className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-700 rounded-2xl shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Milestones 🎉</h2>
        <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
          {milestones.map((m, i) => (
            <li key={i}>
              {m.title || "Untitled"} {m.achieved ? "✅" : "❌"}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Marketplace */}
      <Marketplace user={user} userId={user._id} refreshUser={fetchUser} />
    </motion.div>
  );
}
