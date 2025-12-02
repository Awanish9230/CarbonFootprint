import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 animate-pulse"
          >
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'chart') {
    return (
      <div className="p-6 rounded-2xl shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 animate-pulse"
          >
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skeletons.map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
      ))}
    </div>
  );
}
