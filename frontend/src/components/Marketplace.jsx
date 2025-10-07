// src/components/Marketplace.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function Marketplace({ user, userId, refreshUser }) {
  const [redeemingItem, setRedeemingItem] = useState(null);
  const [redeemModalItem, setRedeemModalItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const redeemReward = async (item) => {
    if (redeemingItem) return;
    try {
      setRedeemingItem(item);
      setErrorMsg("");
      const res = await api.post("/gamification/redeem-reward", { userId, item });
      setRedeemModalItem(item);
      refreshUser();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setErrorMsg(msg); // show error message
    } finally {
      setRedeemingItem(null);
    }
  };

  if (!user.rewards || user.rewards.length === 0) {
    return <p className="text-gray-400">No rewards available yet.</p>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Marketplace 🛒</h2>

      {errorMsg && (
        <p className="mb-4 text-red-500 dark:text-red-400 font-semibold">{errorMsg}</p>
      )}

      <div className="flex flex-wrap gap-4">
        {user.rewards.map((r) => {
          const canRedeem = user.points >= r.pointsRequired;
          return (
            <div
              key={r.item}
              className={`p-4 rounded-lg shadow flex flex-col items-start ${r.redeemed
                  ? "bg-green-100 dark:bg-green-900"
                  : canRedeem
                    ? "bg-orange-100 dark:bg-orange-900"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
            >
              {/* Reward Image */}
              {r.image && (
                <img
                  src={r.image}
                  alt={r.item}
                  className="w-16 h-16 object-contain mb-2"
                />
              )}

              {/* Reward Name */}
              <p className="font-semibold mb-1 text-black dark:text-white">{r.item}</p>

              {/* Points Info */}
              <p className="mb-2 text-black dark:text-white">
                {r.redeemed
                  ? "Redeemed ✅"
                  : canRedeem
                    ? `Points Required: ${r.pointsRequired}`
                    : `Need ${r.pointsRequired - user.points} more points`}
              </p>

              {/* Redeem Button */}
              {!r.redeemed && (
                <button
                  disabled={redeemingItem === r.item || !canRedeem}
                  onClick={() => redeemReward(r.item)}
                  className={`px-3 py-1 rounded text-white ${redeemingItem === r.item || !canRedeem
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-600"
                    }`}
                >
                  {redeemingItem === r.item ? "Redeeming..." : "Redeem"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {redeemModalItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">🎉 Reward Redeemed!</h3>
              <p className="text-black dark:text-white">{redeemModalItem}</p>
              <button
                className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded"
                onClick={() => setRedeemModalItem(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
