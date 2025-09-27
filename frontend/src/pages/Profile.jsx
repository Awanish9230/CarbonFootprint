import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BadgeCard from '../components/BadgeCard';

export default function Profile() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    setBadges([
      { name: '100 km Cycling', description: 'Completed 100 km of cycling' },
      { name: '5 Days Vegetarian', description: 'Stayed vegetarian for 5 days' }
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div><b>Name:</b> {user?.name}</div>
        <div><b>Email:</b> {user?.email}</div>
        <div><b>State:</b> {user?.state || '—'}</div>
      </div>
      <h3 className="font-semibold">Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.map((b, i) => (
          <BadgeCard key={i} badge={b} />
        ))}
      </div>
    </div>
  );
}
