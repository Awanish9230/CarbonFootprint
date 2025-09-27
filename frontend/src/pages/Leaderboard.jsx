import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import LeaderboardCard from '../components/LeaderboardCard';

export default function Leaderboard() {
  const [scope, setScope] = useState('national');
  const [stateFilter, setStateFilter] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (scope === 'national') {
        const res = await api.get('/leaderboard/national');
        setData(res.data.results || []);
      } else {
        const res = await api.get(`/leaderboard/state/${encodeURIComponent(stateFilter || 'Maharashtra')}`);
        setData(res.data.results || []);
      }
    })();
  }, [scope, stateFilter]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Leaderboard</h2>
      <div className="flex items-center gap-2">
        <button className={`px-3 py-1 rounded ${scope==='national'?'bg-emerald-600 text-white':'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setScope('national')}>National</button>
        <button className={`px-3 py-1 rounded ${scope==='state'?'bg-emerald-600 text-white':'bg-gray-200 dark:bg-gray-700'}`} onClick={() => setScope('state')}>State-wise</button>
        {scope === 'state' && (
          <input className="input ml-2" placeholder="State (e.g., Karnataka)" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} />
        )}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {data.map((entry, idx) => (
          <LeaderboardCard key={idx} entry={entry} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
}
