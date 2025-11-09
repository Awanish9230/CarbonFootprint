import React from 'react';

export default function BenchmarkCard({ data, loading }) {
  if (loading) return <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-white">Loading benchmark...</div>;
  if (!data) return null;

  const catOrder = ['transport', 'food', 'energy', 'waste'];
  const { cluster, community, highlight, summary, byCategory = {}, total } = data;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Community Benchmark</h3>
      <p className="text-gray-300 mb-2">Cluster: <span className="font-semibold">{cluster || '—'}</span></p>
      {community && (
        <p className="text-gray-300 mb-4">Percentile: <span className="font-semibold">{community.percentile ?? '—'}th</span> {community.state ? `in ${community.state}` : ''}</p>
      )}
      {highlight && (
        <p className="text-sm mb-4">Highlight: <span className="capitalize font-semibold text-yellow-300">{highlight}</span></p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold mb-2">Your last 30 days</h4>
          <p className="text-2xl font-bold text-blue-400 mb-2">{Number(total || 0).toFixed(2)} kg CO₂e</p>
          <ul className="text-sm text-gray-300 space-y-1">
            {catOrder.map((c) => (
              <li key={c} className="flex justify-between">
                <span className="capitalize">{c}</span>
                <span className="text-emerald-400 font-semibold">{Number(byCategory[c] || 0).toFixed(2)} kg</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold mb-2">Community average</h4>
          <ul className="text-sm text-gray-300 space-y-1">
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

      {summary && <p className="text-sm text-gray-400 mt-4">{summary}</p>}
    </div>
  );
}