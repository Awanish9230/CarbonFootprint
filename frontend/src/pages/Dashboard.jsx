import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChartCard from '../components/ChartCard';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    (async () => {
      const s = await api.get('/emissions/summary', { params: { range: 'monthly' } });
      setSummary(s.data);
      const r = await api.get('/emissions/recommendations');
      setRecs(r.data.recommendations || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {summary && <ChartCard data={summary.entries} />}
      <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="font-semibold mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {recs.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
