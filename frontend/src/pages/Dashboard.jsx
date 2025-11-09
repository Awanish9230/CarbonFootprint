import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChartCard from '../components/ChartCard';

export default function Dashboard({ refreshKey = 0, newLog = null }) {
  const [range, setRange] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [ruleRecs, setRuleRecs] = useState([]);
  const [aiRecs, setAiRecs] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Fetch summary
  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get('/emissions/summary', { params: { range } });
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setLoadingRecs(true);
      const res = await api.get('/emissions/recommendations');
      const { ruleBased = [], aiBased = [] } = res.data || {};
      setRuleRecs(ruleBased);
      setAiRecs(aiBased);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoadingRecs(false);
    }
  };

  // Fetch on mount / range / refreshKey change
  useEffect(() => {
    fetchSummary();
    fetchRecommendations();
  }, [range, refreshKey]);

  // Update summary reactively when a new log is added
  useEffect(() => {
    if (newLog && summary) {
      const updatedEntries = [...summary.entries, newLog];

      const aggregateBreakdown = updatedEntries.reduce((acc, e) => {
        for (const key in e.breakdown) {
          acc[key] = (acc[key] || 0) + (Number(e.breakdown[key]) || 0);
        }
        return acc;
      }, {});

      const totalCO2 = updatedEntries.reduce(
        (sum, e) => sum + (Number(e.totalCO2) || 0),
        0
      );

      setSummary({
        ...summary,
        entries: updatedEntries,
        breakdown: aggregateBreakdown,
        totalCO2,
      });
    }
  }, [newLog]);

  // Calculate totals for each range
  // const calculateTotals = (entries) => {
  //   const totals = { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  //   if (!entries || entries.length === 0) return totals;

  //   const now = new Date();
  //   entries.forEach((entry) => {
  //     const date = new Date(entry.date);
  //     const diffDays = (now - date) / (1000 * 60 * 60 * 24);

  //     if (diffDays <= 1) totals.daily += Number(entry.totalCO2) || 0;
  //     if (diffDays <= 7) totals.weekly += Number(entry.totalCO2) || 0;
  //     if (diffDays <= 30) totals.monthly += Number(entry.totalCO2) || 0;
  //     if (diffDays <= 365) totals.yearly += Number(entry.totalCO2) || 0;
  //   });

  //   return totals;
  // };

  const calculateTotals = (entries) => {
    const totals = { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
    if (!entries || entries.length === 0) return totals;

    const now = new Date();

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) {
        totals.daily += Number(entry.totalCO2) || 0;
      } else if (diffDays <= 7) {
        totals.weekly += Number(entry.totalCO2) || 0;
      } else if (diffDays <= 30) {
        totals.monthly += Number(entry.totalCO2) || 0;
      } else if (diffDays <= 365) {
        totals.yearly += Number(entry.totalCO2) || 0;
      }
    });

    return totals;
  };


  if (loadingSummary)
    return <p className="text-white text-center mt-4">Loading dashboard...</p>;

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
      {summary && <ChartCard data={summary.entries} range={range} />}

      {/* Total Emissions */}
      {summary && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Object.entries(calculateTotals(summary.entries)).map(([key, value]) => (
            <div
              key={key}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
            >
              <h4 className="text-lg font-semibold capitalize">{key}</h4>
              <p className="text-2xl font-bold text-blue-400">{Number(value).toFixed(2)} kg CO₂e</p>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {Object.entries(summary.breakdown).map(([key, value]) => (
            <div
              key={key}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700 text-white text-center"
            >
              <h4 className="capitalize text-xl font-semibold mb-2">{key.replace(/_/g, ' ')}</h4>
              <p className="text-emerald-400 font-bold text-2xl">{Number(value || 0).toFixed(2)} kg CO₂e</p>
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
          {ruleRecs.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg border border-gray-700">
              <h3 className="font-bold text-blue-400 text-xl mb-3">Rule-Based Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {ruleRecs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

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
