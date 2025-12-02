import React, { useState, useEffect } from 'react';
import EmissionForm from '../components/EmissionForm';
import TeamSection from '../components/TeamSection';
import Calculator from './Calculator';
import './Hero.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Images
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import img7 from '../assets/img7.jpg';
import img8 from '../assets/img8.jpg';
import img9 from '../assets/img9.jpg';
import img10 from '../assets/img10.jpg';
import img11 from '../assets/img11.jpg';
import img12 from '../assets/img12.jpg';
import img13 from '../assets/img13.jpg';
import img14 from '../assets/img14.jpg';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [newLog, setNewLog] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const handleLogged = (log) => {
    setNewLog({
      date: log.date,
      totalCO2: log.totalCO2,
      breakdown: log.breakdown,
    });
    setRefreshKey(prev => prev + 1);
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (window.location.hash === "#quick-log") {
      const el = document.getElementById("quick-log");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const images = [
    img1, img2, img3, img4, img5, img6, img7,
    img8, img9, img10, img11, img12, img13, img14
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="space-y-10 w-full">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] lg:h-screen flex items-center justify-center snap-start overflow-hidden"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 overflow-hidden">
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                opacity: currentImage === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
              }}
            ></motion.div>
          ))}
          <div className="absolute inset-0 bg-black/50"></div> 
        </div>

        {/* Hero Content */}
        <div className="relative text-center py-16 sm:py-24 md:py-32 z-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white typing">
            Track & Reduce Your{' '}
            <span className="text-blue-400">Carbon Footprint</span>
          </h1>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover greener alternatives and make sustainable choices every day.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document.getElementById("quick-log")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold
                         bg-[linear-gradient(315deg,#003153_0%,#1B1B1B_74%)]
                         hover:scale-105 hover:shadow-blue-500/50 transition-all duration-300"
            >
              Quick Log
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg text-white font-semibold
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
        className="w-full flex flex-col justify-center items-center snap-start
             bg-white text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-white
             px-4 sm:px-6 md:px-12 py-12 md:py-24 rounded-2xl shadow-sm"
        initial={{ opacity: 0, rotateX: -15, y: 80 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, rotateX: 15, y: -80 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        viewport={{ once: false, amount: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 sm:mb-12 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
            Quick Log
          </span>
        </h2>

        <motion.div
          className="bg-white dark:bg-[#1c1c1c] p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-4xl flex flex-col gap-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <EmissionForm onLogged={handleLogged} />
        </motion.div>
      </motion.section>

      {/* Calculator Section */}
      <Calculator />

      {/* Team Section */}
      <div id="team-section">
        <TeamSection />
      </div>
    </div>
  );
}
