import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function Navbar() {
  const { token, logout, user } = useAuth(); // user should have `name` property
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('cft_theme');
    if (saved === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const linkClasses = (path) =>
    `relative group px-2 py-1 transition ${
      location.pathname === path
        ? 'text-emerald-600 dark:text-blue-400 font-semibold'
        : 'text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-blue-400'
    }`;

  return (
    <nav className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-bold text-xl text-emerald-600 dark:text-blue-400 hover:text-emerald-500 dark:hover:text-blue-300 transition"
        >
          EcoReduce
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClasses('/')}>Home</Link>
          {token && (
            <>
              <Link to="/dashboard" className={linkClasses('/dashboard')}>Dashboard</Link>
              <Link to="/leaderboard" className={linkClasses('/leaderboard')}>Leaderboard</Link>
              <Link to="/community" className={linkClasses('/community')}>Community</Link>
              <Link to="/game" className={linkClasses('/game')}>Game</Link>
              <Link to="/profile" className={linkClasses('/profile')}>Profile</Link>
            </>
          )}

          {!token ? (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
            >
              Login
            </Link>
          ) : (
            // ✅ Avatar with dropdown
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer select-none overflow-hidden"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg flex flex-col">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white hover:bg-red-600 rounded-t-lg transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <DarkModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-white focus:outline-none text-2xl"
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#0a0a0a]/95 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4 px-4 py-4 text-gray-800 dark:text-white">
            <Link to="/" onClick={() => setMenuOpen(false)} className={location.pathname === '/' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Home</Link>
            {token && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={location.pathname === '/dashboard' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Dashboard</Link>
                <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className={location.pathname === '/leaderboard' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Leaderboard</Link>
                <Link to="/community" onClick={() => setMenuOpen(false)} className={location.pathname === '/community' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Community</Link>
                <Link to="/game" onClick={() => setMenuOpen(false)} className={location.pathname === '/game' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Game</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={location.pathname === '/profile' ? 'text-emerald-600 dark:text-blue-400 font-semibold' : 'hover:text-emerald-600 dark:hover:text-blue-400'}>Profile</Link>
              </>
            )}
            {!token ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition text-center"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
