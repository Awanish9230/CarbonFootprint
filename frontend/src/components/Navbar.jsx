import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('cft_theme');
    if (saved === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold">Carbon Footprint Tracker</Link>
        <div className="flex items-center gap-2">
          <button className="sm:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setOpen(!open)} aria-label="Toggle Menu">☰</button>
          <DarkModeToggle />
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <Link to="/">Home</Link>
          {token && <Link to="/dashboard">Dashboard</Link>}
          {token && <Link to="/leaderboard">Leaderboard</Link>}
          {token && <Link to="/community">Community</Link>}
          {token && <Link to="/profile">Profile</Link>}
          {!token ? (
            <Link to="/login" className="px-3 py-1 rounded bg-emerald-600 text-white">Login</Link>
          ) : (
            <button onClick={() => { logout(); navigate('/'); }} className="px-3 py-1 rounded bg-rose-600 text-white">Logout</button>
          )}
        </div>
      </div>
      {open && (
        <div className="sm:hidden px-4 pb-3 flex flex-col gap-2">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {token && <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}
          {token && <Link to="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</Link>}
          {token && <Link to="/community" onClick={() => setOpen(false)}>Community</Link>}
          {token && <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>}
          {!token ? (
            <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-1 rounded bg-emerald-600 text-white inline-block w-max">Login</Link>
          ) : (
            <button onClick={() => { logout(); setOpen(false); }} className="px-3 py-1 rounded bg-rose-600 text-white w-max">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
