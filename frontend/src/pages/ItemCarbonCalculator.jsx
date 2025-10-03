import React, { useState } from "react";
import api from "../api/axios";

export default function ItemCarbonCalculator() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [alts, setAlts] = useState([]);

  const buttonClass =
    "col-span-1 sm:col-span-2 px-5 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 " +
    "bg-[linear-gradient(159deg,#0892d0,#4b0082)] hover:opacity-90";

  const search = async (e) => {
    e.preventDefault();
    const res = await api.get("/emissions/search-item", { params: { q } });
    setItems(res.data.items || []);
    setAlts(res.data.alternatives || []);
  };

  return (
    <section className="w-full">
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-3xl shadow-xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4 px-0">
          Item Carbon Calculator
        </h2>
        <form
          onSubmit={search}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <input
            className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Search an item (e.g. cycling, bus_km)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className={buttonClass} type="submit">
            Search
          </button>
        </form>

        {/* Search Results */}
        {items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              Results for "{q}"
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700"
                >
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-gray-400">CO₂e: {item.co2e} kg</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Greener Alternatives */}
        {alts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">
              Greener Alternatives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alts.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700"
                >
                  <h4 className="font-semibold text-white">{alt.name}</h4>
                  <p className="text-gray-400">CO₂e: {alt.co2e} kg</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
