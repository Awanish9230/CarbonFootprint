import React from 'react';

export default function BenchmarkCard({ data, loading }) {
  if (loading) return <div className="bg-white text-gray-900 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-6 dark:text-white">Loading benchmark...</div>;
  if (!data) return null;

  const catOrder = ['transport', 'food', 'energy', 'waste'];
  const { cluster, community, highlight, summary, byCategory = {}, total } = data;

  return (
    <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:border-gray-700 dark:text-white">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Community Benchmark</h3>
      <p className="mb-2 text-gray-700 dark:text-gray-300">Cluster: <span className="font-semibold">{cluster || '—'}</span></p>
      {community && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">Percentile: <span className="font-semibold">{community.percentile ?? '—'}th</span> {community.state ? `in ${community.state}` : ''}</p>
      )}
      {highlight && (
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-200">Highlight: <span className="capitalize font-semibold text-yellow-500 dark:text-yellow-300">{highlight}</span></p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-4 border bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-900/40 dark:border-gray-700 dark:text-white">
          <h4 className="font-semibold mb-2">Your last 30 days</h4>
          <p className="text-2xl font-bold text-blue-400 mb-2">{Number(total || 0).toFixed(2)} kg CO₂e</p>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {catOrder.map((c) => (
              <li key={c} className="flex justify-between">
                <span className="capitalize">{c}</span>
                <span className="text-emerald-400 font-semibold">{Number(byCategory[c] || 0).toFixed(2)} kg</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl p-4 border bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-900/40 dark:border-gray-700 dark:text-white">
          <h4 className="font-semibold mb-2">Community average</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {catOrder.map((c) => {
              const avg = community?.avg_by_category?.[c] || 0;
              const mine = byCategory[c] || 0;
              const diff = mine - avg;
              return (
                <li key={c} className="flex justify-between">
                  <span className="capitalize">{c}</span>
                  <span className={diff > 0 ? 'text-red-400' : 'text-emerald-400'}>
                    {Number(avg).toFixed(2)} kg avg ({diff > 0 ? '+' : ''}{Number(diff).toFixed(2)})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {summary && <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">{summary}</p>}
    </div>
  );
}