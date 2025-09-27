import React, { useState } from 'react';
import EmissionForm from '../components/EmissionForm';
import api from '../api/axios';

export default function Home() {
  const [result, setResult] = useState(null);
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [alts, setAlts] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    const res = await api.get('/emissions/search-item', { params: { q } });
    setItems(res.data.items || []);
    setAlts(res.data.alternatives || []);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Quick Log</h2>
        <EmissionForm onLogged={(log) => setResult(log)} />
        {result && (
          <div className="mt-3 p-3 rounded bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700">
            Logged: <b>{result.totalCO2.toFixed(2)} kg CO₂e</b>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Item Carbon Calculator</h2>
        <form onSubmit={search} className="flex gap-2">
          <input className="input flex-1" placeholder="Search an item (e.g., beef, bus_km)" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <h3 className="font-semibold mb-1">Results</h3>
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it._id} className="p-2 rounded border border-gray-200 dark:border-gray-700 flex justify-between">
                  <span>{it.name} ({it.unit})</span>
                  <span className="font-mono">{it.factor} kg CO₂e/unit</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Alternatives</h3>
            <ul className="space-y-2">
              {alts.map((it) => (
                <li key={it._id} className="p-2 rounded border border-gray-200 dark:border-gray-700 flex justify-between">
                  <span>{it.name} ({it.unit})</span>
                  <span className="font-mono">{it.factor} kg CO₂e/unit</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
