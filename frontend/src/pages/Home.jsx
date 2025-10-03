import React, { useState, useEffect } from 'react';
import EmissionForm from '../components/EmissionForm';
import Dashboard from './Dashboard';
import TeamSection from '../components/TeamSection';
import ItemCarbonCalc from './ItemCarbonCalculator';
import Calculator from './Calculator';
import api from '../api/axios';
import './Hero.css';
import kl_9 from '../assets/kl_9.jpg';
import { motion } from "framer-motion";
import ItemCarbonCalculator from './ItemCarbonCalculator';

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

  useEffect(() => {
    if (window.location.hash === "#quick-log") {
      const el = document.getElementById("quick-log");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const buttonClass =
    "col-span-1 sm:col-span-2 px-5 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 " +
    "bg-[linear-gradient(159deg,#0892d0,#4b0082)] hover:opacity-90";

  return (
    <div className="space-y-10 w-full">
      {/* Hero Section */}
      <section
        className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:h-screen bg-cover bg-center flex items-center justify-center snap-start rounded-2xl overflow-hidden"
        style={{ backgroundImage: `url(${kl_9})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center py-16 sm:py-24 md:py-32">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white typing">
            Track & Reduce Your{' '}
            <span className="text-blue-400">Carbon Footprint</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover greener alternatives and make sustainable choices every day.
          </p>

          {/* Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document.getElementById("quick-log")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base md:text-lg
                   bg-[linear-gradient(315deg,#003153_0%,#1B1B1B_74%)]
                   hover:scale-105 hover:shadow-blue-500/50 transition-all duration-300"
            >
              Quick Log
            </button>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold text-sm sm:text-base md:text-lg
                   bg-[linear-gradient(159deg,#0892d0,#4b0082)]
                   hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300"
            >
              Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Quick Log Section */}
      <motion.section
        id="quick-log"
        className="h-screen w-full flex flex-col justify-center items-center snap-start
             bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 sm:px-6 md:px-12 rounded-2xl"
        initial={{ opacity: 0, rotateX: -15, y: 80 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, rotateX: 15, y: -80 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false, amount: 0.5 }}
      >
        {/* Quick Log Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 sm:mb-12 relative text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
            Quick Log
          </span>
          <span className="block mt-2 sm:mt-3 w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto opacity-70 shadow-lg"></span>
        </h2>

        {/* Form Container */}
        <motion.div
          className="bg-[#1c1c1c] p-4 sm:p-6 md:p-10 rounded-3xl border border-gray-700 shadow-xl w-full max-w-md sm:max-w-2xl md:max-w-4xl"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <EmissionForm onLogged={handleLogged} />
        </motion.div>
      </motion.section>

      {/* Example/Insights Section */}
      <motion.section
        className="h-screen w-full flex flex-col justify-center items-center snap-start
             bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 sm:px-6 md:px-12 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        viewport={{ once: false, amount: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center">
          Insights
        </h2>
        <p className="max-w-md sm:max-w-2xl md:max-w-3xl text-center text-base sm:text-lg md:text-xl opacity-90">
          View your trends, reports, and compare your carbon footprint with others.
        </p>
      </motion.section>


      {/* Item Carbon Calculator Section */}
      {/* <div>
        <ItemCarbonCalc />
      </div> */}
      <div>
        <Calculator />
      </div>

      <div id="team-section">
        {/* Other About Sections */}
        <TeamSection />
      </div>
    </div>
  );
}
