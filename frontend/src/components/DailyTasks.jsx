// components/DailyTasks.jsx
import { useState } from "react";
import api from "../api/axios";

export default function DailyTasks({ user, refreshUser }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  const completeTask = async (taskId) => {
    if (completedTasks.includes(taskId)) return;

    try {
      await api.post("/gamification/log-action", { userId: user._id, actions: [taskId] });
      setCompletedTasks((prev) => [...prev, taskId]);
      refreshUser();
    } catch (err) {
      console.error("Error completing task:", err.response?.data || err.message);
    }
  };

  if (!user.challenges || user.challenges.length === 0)
    return <p className="text-gray-400">No daily tasks available.</p>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Daily Tasks ✅</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.challenges.map((t) => (
          <div
            key={t._id}
            className={`p-4 rounded-lg shadow ${
              completedTasks.includes(t._id) ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <h3 className="font-semibold text-black dark:text-white">{t.title}</h3>
            <p className="text-black dark:text-white">{t.description}</p>
            {!completedTasks.includes(t._id) && (
              <button
                className="mt-2 px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                onClick={() => completeTask(t._id)}
              >
                Complete Task
              </button>
            )}
            {completedTasks.includes(t._id) && <span className="text-green-700 font-bold">Completed ✅</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
