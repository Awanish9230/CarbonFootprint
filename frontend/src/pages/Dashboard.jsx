import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChartCard from '../components/ChartCard';
import { getForecast, getReductionPlan, getBenchmark } from '../api/insights';
import ForecastCard from '../components/ForecastCard';
import ReductionPlanCard from '../components/ReductionPlanCard';
import BenchmarkCard from '../components/BenchmarkCard';
import AssistantCard from '../components/AssistantCard';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Dashboard({ refreshKey = 0, newLog = null }) {
  const [range, setRange] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [ruleRecs, setRuleRecs] = useState([]);
  const [aiRecs, setAiRecs] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [plan, setPlan] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState({ forecast: true, plan: true, benchmark: true });

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

  useEffect(() => {
    fetchSummary();
    fetchRecommendations();
    (async () => {
      try {
        setLoadingInsights((s) => ({ ...s, forecast: true }));
        const f = await getForecast();
        setForecast(f);
      } catch (e) {
        console.error('Forecast load error:', e);
      } finally {
        setLoadingInsights((s) => ({ ...s, forecast: false }));
      }
      try {
        setLoadingInsights((s) => ({ ...s, plan: true }));
        const p = await getReductionPlan();
        setPlan(p);
      } catch (e) {
        console.error('Plan load error:', e);
      } finally {
        setLoadingInsights((s) => ({ ...s, plan: false }));
      }
      try {
        setLoadingInsights((s) => ({ ...s, benchmark: true }));
        const b = await getBenchmark();
        setBenchmark(b);
      } catch (e) {
        console.error('Benchmark load error:', e);
      } finally {
        setLoadingInsights((s) => ({ ...s, benchmark: false }));
      }
    })();
  }, [range, refreshKey]);

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
    return (
      <div className="space-y-8 p-6 md:p-12 bg-white text-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white min-h-screen rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Range Selector Skeleton */}
        <div className="flex gap-3 mb-6 justify-center md:justify-start">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        {/* Chart Skeleton */}
        <SkeletonLoader type="chart" />
        
        {/* Stats Skeleton */}
        <SkeletonLoader type="stats" count={4} />
        
        {/* Breakdown Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <SkeletonLoader type="card" count={3} />
        </div>
        
        {/* Insights Skeleton */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    );

  return (
    <div className="space-y-8 p-6 md:p-12 bg-white text-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white min-h-screen rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">

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
              className="p-6 rounded-2xl shadow-lg border text-center bg-white text-gray-900 border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white dark:border-gray-700"
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
              className="p-6 rounded-2xl shadow-lg border text-center bg-white text-gray-900 border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white dark:border-gray-700"
            >
              <h4 className="capitalize text-xl font-semibold mb-2">{key.replace(/_/g, ' ')}</h4>
              <p className="text-emerald-400 font-bold text-2xl">{Number(value || 0).toFixed(2)} kg CO₂e</p>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <ForecastCard data={forecast} loading={loadingInsights.forecast} />
        <ReductionPlanCard data={plan} loading={loadingInsights.plan} />
        <BenchmarkCard data={benchmark} loading={loadingInsights.benchmark} />
        {/* Existing Recommendations */}
        {loadingRecs ? (
          <p className="text-center text-lg font-semibold text-gray-800 dark:text-white">Loading recommendations...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ruleRecs.length > 0 && (
              <div className="p-6 rounded-2xl shadow-lg border bg-white text-gray-900 border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white dark:border-gray-700">
                <h3 className="font-bold text-blue-400 text-xl mb-3">Rule-Based Suggestions</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {ruleRecs.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {aiRecs.length > 0 && (
              <div className="p-6 rounded-2xl shadow-lg border bg-white text-gray-900 border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white dark:border-gray-700">
                <h3 className="font-bold text-green-400 text-xl mb-3">AI-Powered Suggestions</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {aiRecs.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Assistant */}
        <AssistantCard />
      </div>
    </div>
  );
}
