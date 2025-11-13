import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function ChartCard({ data = [], range = 'monthly' }) {
  if (!data || data.length === 0) return <p className="text-center mt-4 text-gray-800 dark:text-white">No emission data available.</p>;

  // Prepare chart data
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

    return {
      date: label,
      totalCO2: Number(d.totalCO2 || 0),
      ...Object.fromEntries(
        Object.entries(d.breakdown || {}).map(([k, v]) => [k, Number(v) || 0])
      ),
    };
  });

  // Extract breakdown keys with non-zero total across all entries
  const breakdownKeys = Object.keys(data[0].breakdown || {}).filter((key) => {
    return chartData.some((d) => Number(d[key] || 0) > 0);
  });

  return (
    <div className="p-4 rounded border bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Emissions Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
            <XAxis dataKey="date" tick={{ fill: '#374151' }} stroke="#9ca3af" />
            <YAxis tick={{ fill: '#374151' }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                color: '#111827',
              }}
              formatter={(value, name) => [`${Number(value).toFixed(2)} kg CO₂e`, name.replace(/_/g, ' ')]}
            />
            <Legend wrapperStyle={{ color: '#374151' }} />

            {/* Total CO2 Line */}
            <Line
              type="monotone"
              dataKey="totalCO2"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Total CO₂"
            />

            {/* Individual breakdown lines */}
            {breakdownKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                dot={false}
                stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                strokeWidth={1.5}
                name={key.replace(/_/g, ' ')}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
