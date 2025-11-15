import React from "react";
import { motion } from "framer-motion";

export default function ItemCard({ item }) {
  return (
    <motion.div
      className="rounded-2xl shadow-lg overflow-hidden p-6 transition-all duration-300bg-white text-gray-900   hover:shadow-blue-400/40 
       dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black  dark:text-white dark:hover:shadow-blue-500/40"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Category: {item.category} | Unit: {item.unit}
      </p>
      <p className="mt-2 text-gray-800 dark:text-gray-100">
        Carbon Footprint: <b>{item.carbon} kg CO₂e</b>
      </p>

      {item.notes && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.notes}</p>
      )}

      {item.alternatives && item.alternatives.length > 0 && (
        <div className="mt-3">
          <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">🌱 Greener Alternatives:</h3>
          <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-200">
            {item.alternatives.map((alt, idx) => (
              <li key={idx}>
                {alt.name} - <b>{alt.carbon} kg CO₂e</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
