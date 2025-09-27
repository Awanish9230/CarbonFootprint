import React, { useState } from 'react';
import EmissionForm from '../components/EmissionForm';
import Dashboard from './Dashboard';
import api from '../api/axios';
import './Hero.css';
import kl_9 from '../assets/kl_9.jpg';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0); // Trigger dashboard refresh
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [alts, setAlts] = useState([]);

  const handleLogged = () => {
    setRefreshKey(prev => prev + 1); // Increment to refetch dashboard data
  };

  const search = async (e) => {
    e.preventDefault();
    const res = await api.get('/emissions/search-item', { params: { q } });
    setItems(res.data.items || []);
    setAlts(res.data.alternatives || []);
  };

  return (
    <div className="space-y-10 w-full">
      {/* Hero Section */}
      <section
        className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen bg-cover bg-center flex items-center justify-center rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${kl_9})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center py-16 sm:py-24 md:py-32">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white typing">
            Track & Reduce Your{' '}
            <span className="text-blue-400">Carbon Footprint</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover greener alternatives and make sustainable choices every day.
          </p>
        </div>
      </section>

      {/* Quick Log Section */}
      <section className="w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4 px-4">
          Quick Log
        </h2>
        <div className="bg-[#111111] p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-800 shadow-md mx-4 sm:mx-0">
          <EmissionForm onLogged={handleLogged} />
        </div>
      </section>

      {/* Dashboard Section */}
      {/* <section className="w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4 px-4">
          Dashboard
        </h2>
        <Dashboard refreshKey={refreshKey} />
      </section> */}

      {/* Item Carbon Calculator Section */}
      <section className="w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4 px-4">
          Item Carbon Calculator
        </h2>
        <form
          onSubmit={search}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <input
            className="flex-1 px-4 py-2 sm:py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Search an item (e.g., beef, bus_km)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Search
          </button>
        </form>
      </section>
    </div>
  );
}
