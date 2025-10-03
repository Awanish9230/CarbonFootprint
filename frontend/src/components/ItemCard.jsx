import React from "react";
import { motion } from "framer-motion";

export default function ItemCard({ item }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-blue-500/50 transition-all duration-300 p-6"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-sm text-gray-300">
        Category: {item.category} | Unit: {item.unit}
      </p>
      <p className="mt-2 text-gray-100">
        Carbon Footprint: <b>{item.carbon} kg CO₂e</b>
      </p>

      {item.notes && (
        <p className="text-sm text-gray-400 mt-1">{item.notes}</p>
      )}

      {item.alternatives && item.alternatives.length > 0 && (
        <div className="mt-3">
          <h3 className="font-semibold text-green-400 mb-1">🌱 Greener Alternatives:</h3>
          <ul className="list-disc list-inside text-sm text-green-100">
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
