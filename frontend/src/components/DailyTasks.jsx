// components/DailyTasks.jsx
import { useState } from "react";
import api from "../api/axios";

export default function DailyTasks({ user, refreshUser }) {
  const [loadingTasks, setLoadingTasks] = useState([]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysTasks = (user.challenges || []).filter((t) => {
    if (!t.startDate) return false;
    const d = new Date(t.startDate).toISOString().split("T")[0];
    return d === todayStr;
  });

  const completedCount = todaysTasks.filter((t) => t.completed).length;
  const totalCount = todaysTasks.length;

  const completeTask = async (taskId) => {
    if (loadingTasks.includes(taskId)) return;

    try {
      setLoadingTasks((prev) => [...prev, taskId]);
      await api.post("/gamification/complete-challenge", {
        userId: user._id,
        challengeId: taskId,
      });
      await refreshUser();
    } catch (err) {
      console.error("Error completing task:", err.response?.data || err.message);
    } finally {
      setLoadingTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  if (totalCount === 0)
    return <p className="text-gray-400">No daily tasks for today.</p>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Daily Tasks ✅</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {completedCount > 0
          ? `${completedCount} / ${totalCount} task(s) completed today`
          : "No task completed yet today."}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todaysTasks.map((t) => (
          <div
            key={t._id}
            className={`p-4 rounded-lg shadow ${
              t.completed ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <h3 className="font-semibold text-black dark:text-white">{t.title}</h3>
            <p className="text-black dark:text-white">{t.description}</p>
            {!t.completed && (
              <button
                className="mt-2 px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => completeTask(t._id)}
                disabled={loadingTasks.includes(t._id)}
              >
                {loadingTasks.includes(t._id) ? "Completing..." : "Complete Task"}
              </button>
            )}
            {t.completed && <span className="text-green-700 font-bold">Completed ✅</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
