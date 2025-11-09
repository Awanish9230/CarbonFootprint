import React from 'react';

export default function ReductionPlanCard({ data, loading }) {
  if (loading) return <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-white">Loading reduction plan...</div>;
  if (!data) return null;

  const { context, plan, note } = data;

  const PlanList = ({ title, items }) => (
    <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700">
      <h4 className="font-semibold mb-2">{title}</h4>
      {(!items || items.length === 0) ? (
        <p className="text-gray-400">No suggestions.</p>
      ) : (
        <ul className="space-y-2 text-gray-300">
          {items.map((it, idx) => (
            <li key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{it.category}</span>
                <span className="text-emerald-400">{it.estimated_reduction_pct}%</span>
              </div>
              <div className="text-sm">{it.action}</div>
              <div className="text-xs text-gray-400">Difficulty: {it.difficulty}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Personalized Reduction Plan</h3>
      {context?.top_categories?.length ? (
        <p className="text-gray-300 mb-4">Top categories to focus: {context.top_categories.join(', ')}</p>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanList title="Short-term (1 week)" items={plan?.shortTerm} />
        <PlanList title="Medium-term (1 month)" items={plan?.mediumTerm} />
        <PlanList title="Long-term (6 months)" items={plan?.longTerm} />
      </div>
      {note && <p className="text-sm text-gray-400 mt-4">{note}</p>}
    </div>
  );
}