import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('cft_theme');
    if (saved === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const linkClasses = (path) =>
    `relative group px-2 py-1 transition ${
      location.pathname === path
        ? 'text-blue-400 font-semibold'
        : 'text-white hover:text-blue-400'
    }`;

  return (
    <nav className="bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-bold text-xl text-blue-400 hover:text-blue-300 transition"
        >
          EcoReduce
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClasses('/')}>
            Home
            <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          {token && (
            <>
              <Link to="/dashboard" className={linkClasses('/dashboard')}>
                Dashboard
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/dashboard' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/leaderboard" className={linkClasses('/leaderboard')}>
                Leaderboard
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/leaderboard' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/community" className={linkClasses('/community')}>
                Community
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/community' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/about" className={linkClasses('/about')}>
                About Us
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link to="/profile" className={linkClasses('/profile')}>
                Profile
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all ${location.pathname === '/profile' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
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
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition"
            >
              Logout
            </button>
          )}

           <DarkModeToggle /> 
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none text-2xl"
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 border-t border-gray-800">
          <div className="flex flex-col gap-4 px-4 py-4 text-white">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={location.pathname === '/' ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'}
            >
              Home
            </Link>

            {token && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={location.pathname === '/dashboard' ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'}>
                  Dashboard
                </Link>
                <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className={location.pathname === '/leaderboard' ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'}>
                  Leaderboard
                </Link>
                <Link to="/community" onClick={() => setMenuOpen(false)} className={location.pathname === '/community' ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'}>
                  Community
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={location.pathname === '/profile' ? 'text-blue-400 font-semibold' : 'hover:text-blue-400'}>
                  Profile
                </Link>
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
