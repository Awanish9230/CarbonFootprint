import React from 'react';

export default function ForecastCard({ data, loading }) {
  if (loading) return <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-white">Loading forecast...</div>;
  if (!data) return null;

  const { forecast = {}, insights } = data;
  const n7 = forecast.next7 || { total: 0, byCategory: {} };
  const n30 = forecast.next30 || { total: 0, byCategory: {} };

  const catOrder = ['transport', 'food', 'energy', 'waste'];

  const CatList = ({ cats }) => (
    <ul className="text-sm text-gray-300 space-y-1">
      {catOrder.map((c) => (
        <li key={c} className="flex justify-between">
          <span className="capitalize">{c}</span>
          <span className="text-emerald-400 font-semibold">{Number(cats[c] || 0).toFixed(2)} kg</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Forecast</h3>
      {insights && <p className="text-gray-300 mb-4">{insights}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold mb-2">Next 7 days</h4>
          <p className="text-2xl font-bold text-blue-400 mb-2">{Number(n7.total || 0).toFixed(2)} kg CO₂e</p>
          {n7.pctChangeVsPrev !== undefined && (
            <p className="text-sm mb-2">Change vs prev 7: <span className={n7.pctChangeVsPrev >= 0 ? 'text-red-400' : 'text-emerald-400'}>{Number(n7.pctChangeVsPrev).toFixed(2)}%</span></p>
          )}
          <CatList cats={n7.byCategory || {}} />
        </div>
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700">
          <h4 className="font-semibold mb-2">Next 30 days</h4>
          <p className="text-2xl font-bold text-blue-400 mb-2">{Number(n30.total || 0).toFixed(2)} kg CO₂e</p>
          {n30.pctChangeVsPrev !== undefined && (
            <p className="text-sm mb-2">Change vs prev 30: <span className={n30.pctChangeVsPrev >= 0 ? 'text-red-400' : 'text-emerald-400'}>{Number(n30.pctChangeVsPrev).toFixed(2)}%</span></p>
          )}
          <CatList cats={n30.byCategory || {}} />
        </div>
      </div>
    </div>
  );
}