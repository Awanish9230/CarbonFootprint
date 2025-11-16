import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function BadgeCard({ badge = {}, justUnlocked = false }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // avoid SSR warning by only showing confetti on client
    setIsClient(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (justUnlocked && isClient) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [justUnlocked, isClient]);

  const sparkleVariants = {
    animate: {
      y: [0, -6, 0],
      x: [0, 6, 0],
      rotate: [0, 8, -8, 0],
      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative">
      {showConfetti && isClient && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={100} recycle={false} />}

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative p-5 rounded-3xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-50 dark:from-yellow-900 dark:via-yellow-800 dark:to-yellow-700 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transform transition duration-300"
      >
        <motion.div variants={sparkleVariants} animate="animate" className="absolute top-2 left-3 text-yellow-400 text-xl">✨</motion.div>
        <motion.div variants={sparkleVariants} animate="animate" className="absolute bottom-2 right-4 text-yellow-400 text-xl">✨</motion.div>

        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-5xl mb-2 drop-shadow-lg"
        >
          {badge.icon || "🏅"}
        </motion.div>

        <div className="font-extrabold text-xl text-gray-900 dark:text-white mb-1 drop-shadow-md">{badge.name}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{badge.description}</div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
          className="px-4 py-1 bg-yellow-200 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100 rounded-full text-xs font-semibold uppercase tracking-wide shadow-inner"
        >
          Achieved!
        </motion.div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-yellow-200/20 dark:bg-yellow-600/30 blur-2xl animate-pulse pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
