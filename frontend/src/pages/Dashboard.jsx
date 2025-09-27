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

  return (
    <div className="space-y-6 p-4">
      {/* Range Selector */}
      <div className="flex gap-2 mb-4">
        {['daily', 'weekly', 'monthly', 'yearly'].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-lg ${
              range === r
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      {summary && <ChartCard data={summary.entries} range={range} />}

      {/* Breakdown */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(summary.breakdown).map(([key, value]) => (
            <div
              key={key}
              className="bg-[#111111] p-4 rounded-2xl border border-gray-800 text-white shadow-md"
            >
              <h4 className="capitalize font-medium">{key}</h4>
              <p className="text-emerald-400 font-semibold text-lg">{value.toFixed(2)} kg CO₂e</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {loadingRecs ? (
        <p className="text-white font-semibold">Loading recommendations...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rule-Based */}
          {ruleRecs.length > 0 && (
            <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 shadow-md">
              <h3 className="font-semibold text-blue-400 mb-2">Rule-Based Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-white">
                {ruleRecs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {/* AI-Based */}
          {aiRecs.length > 0 && (
            <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 shadow-md">
              <h3 className="font-semibold text-green-400 mb-2">AI-Powered Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-white">
                {aiRecs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
