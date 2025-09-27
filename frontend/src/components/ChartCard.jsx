import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ChartCard({ data = [], range = 'monthly' }) {
  // Format dates based on the selected range
  const chartData = data.map((d) => {
    const date = new Date(d.date);
    let label = '';

    switch (range) {
      case 'daily':
        label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case 'weekly':
      case 'monthly':
        label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        break;
      case 'yearly':
        label = date.toLocaleDateString([], { month: 'short' });
        break;
      default:
        label = date.toLocaleDateString();
    }

    return { ...d, date: label };
  });

  return (
    <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Emissions Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" tick={{ fill: '#fff' }} />
            <YAxis tick={{ fill: '#fff' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="totalCO2"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
