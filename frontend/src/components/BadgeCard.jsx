import React from 'react';

export default function BadgeCard({ badge }) {
  return (
    <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="text-2xl">🏅</div>
      <div className="font-semibold">{badge.name}</div>
      <div className="text-sm text-gray-500">{badge.description}</div>
    </div>
  );
}
