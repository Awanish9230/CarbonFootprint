import React from 'react';

export default function LeaderboardCard({ entry, rank }) {
  return (
    <div className="p-3 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white">{rank}</div>
        <div>
          <div className="font-semibold">{entry.user?.name || 'User'}</div>
          <div className="text-sm text-gray-500">{entry.user?.state || '—'}</div>
        </div>
      </div>
      <div className="font-mono">{entry.totalCO2.toFixed(2)} kg CO₂e</div>
    </div>
  );
}
