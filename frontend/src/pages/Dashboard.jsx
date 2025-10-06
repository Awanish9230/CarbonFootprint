import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChartCard from '../components/ChartCard';

export default function Dashboard({ refreshKey }) {
  const [range, setRange] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [ruleRecs, setRuleRecs] = useState([]);
  const [aiRecs, setAiRecs] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const fetchData = async () => {
    try {
      const s = await api.get('/emissions/summary', { params: { range } });
      setSummary(s.data);

      const r = await api.get('/emissions/recommendations');
      const { ruleBased = [], aiBased = [] } = r.data || {};
      setRuleRecs(ruleBased);
      setAiRecs(aiBased);
      setLoadingRecs(false);
    } catch (err) {
      console.error(err);
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, refreshKey]);

  const calculateTotals = (entries) => {
    if (!entries || entries.length === 0) return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };

    const now = new Date();
    const total = { daily: 0, weekly: 0, monthly: 0, yearly: 0 };

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) total.daily += entry.totalCO2;
      if (diffDays <= 7) total.weekly += entry.totalCO2;
      if (diffDays <= 30) total.monthly += entry.totalCO2;
      if (diffDays <= 365) total.yearly += entry.totalCO2;
    });

    return total;
  };


  return (
    <div className="space-y-8 p-6 md:p-12 bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen rounded-2xl">

      {/* Range Selector */}
      <div className="flex gap-3 mb-6 justify-center md:justify-start">
        {['daily', 'weekly', 'monthly', 'yearly'].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${range === r
              ? 'bg-[linear-gradient(159deg,#0892d0,#4b0082)] text-white shadow-lg'
              : 'bg-[linear-gradient(315deg,#003153_0%,#1B1B1B_74%)] text-white hover:bg-[linear-gradient(159deg,_rgba(0,51,102,1)_0%,_rgba(15,82,186,1)_100%)]'
              }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>


      {/* Chart */}
      {summary && (
        <ChartCard data={summary.entries} range={range} />
      )}


      {/* Total Emissions Section */}
      {summary && (
        <div className="mt-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white">
          <h3 className="text-center font-bold text-xl mb-4 text-emerald-400">Emission Totals</h3>

          {(() => {
            const totals = calculateTotals(summary.entries);
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
                >
                  <h4 className="text-lg font-semibold">Daily</h4>
                  <p className="text-2xl font-bold text-blue-400">{totals.daily.toFixed(2)} kg CO₂e</p>
                </div>
                <div
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
                >
                  <h4 className="text-lg font-semibold">Weekly</h4>
                  <p className="text-2xl font-bold text-yellow-400">{totals.weekly.toFixed(2)} kg CO₂e</p>
                </div>
                <div
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
                >
                  <h4 className="text-lg font-semibold">Monthly</h4>
                  <p className="text-2xl font-bold text-pink-400">{totals.monthly.toFixed(2)} kg CO₂e</p>
                </div>
                <div
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
                >
                  <h4 className="text-lg font-semibold">Yearly</h4>
                  <p className="text-2xl font-bold text-green-400">{totals.yearly.toFixed(2)} kg CO₂e</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}


      {/* Emission Breakdown */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(summary.breakdown).map(([key, value]) => (
            <div
              key={key}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
            >
              <h4 className="capitalize text-xl font-semibold mb-2">{key}</h4>
              <p className="text-emerald-400 font-bold text-2xl">{value.toFixed(2)} kg CO₂e</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {loadingRecs ? (
        <p className="text-white font-semibold text-lg text-center mt-6">
          Loading recommendations...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Rule-Based Suggestions */}
          {ruleRecs.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700">
              <h3 className="font-bold text-blue-400 text-xl mb-3">Rule-Based Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {ruleRecs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {/* AI-Based Suggestions */}
          {aiRecs.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700">
              <h3 className="font-bold text-green-400 text-xl mb-3">AI-Powered Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {aiRecs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
