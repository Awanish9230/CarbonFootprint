import { useState } from "react";
import api from "../api/axios";

export default function Challenges({ user, userId, refreshUser }) {
  const [loadingChallenges, setLoadingChallenges] = useState([]);

  const completeChallenge = async (challengeId) => {
    if (loadingChallenges.includes(challengeId)) return;
    try {
      setLoadingChallenges((prev) => [...prev, challengeId]);
      await api.post("/gamification/complete-challenge", {
        userId,
        challengeId,
      });
      refreshUser(); // Refresh user data after completion
    } catch (err) {
      console.error("Error completing challenge:", err.response?.data || err.message);
    } finally {
      setLoadingChallenges((prev) => prev.filter((id) => id !== challengeId));
    }
  };

  if (!user.challenges || user.challenges.length === 0) {
    return <p className="text-gray-400">No challenges available right now.</p>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Time-Limited Challenges ⏳</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.challenges.map((c) => (
          <div
            key={c._id}
            className={`p-4 rounded-lg shadow ${
              c.completed ? "bg-green-100 dark:bg-green-900" : "bg-purple-100 dark:bg-purple-900"
            }`}
          >
            <h3 className="font-semibold text-lg text-black dark:text-white">{c.title}</h3>
            <p className="text-sm mb-2 text-black dark:text-white">{c.description}</p>
            <p className="mb-2 text-black dark:text-white">
              {c.completed ? "Completed ✅" : `Progress: ${c.progress}%`}
            </p>
            {!c.completed && (
              <button
                onClick={() => completeChallenge(c._id)}
                disabled={loadingChallenges.includes(c._id)}
                className={`mt-2 px-4 py-1 rounded text-white ${
                  loadingChallenges.includes(c._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600"
                }`}
              >
                {loadingChallenges.includes(c._id) ? "Completing..." : "Complete Challenge"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
