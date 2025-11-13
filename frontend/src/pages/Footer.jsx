import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-gray-700 dark:bg-[#0B1E3F] dark:text-gray-300 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* About Section */}
        <div>
          <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4">CarbonTracker</h3>
          <p className="text-gray-400 text-sm">
            Helping you monitor and reduce your carbon footprint with actionable insights, tips, and AI-powered recommendations.
          </p>
          <div className="flex flex-wrap mt-4 gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl"><FaFacebookF /></a>
            <a href="https://x.com/Awanish9230" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl"><SiX /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/awanish-kumar-verma-33740b295" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl"><FaLinkedinIn /></a>
            <a href="https://github.com/Awanish9230" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl"><FaGithub /></a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
            <li><Link to="/community" className="hover:text-white">Community</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/#quick-log" className="hover:text-white">Quick Log</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Subscribe</h4>
          <p className="text-gray-400 text-sm mb-3">Get the latest tips to reduce your carbon footprint.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-lg text-black focus:outline-none w-full sm:flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0892d0] to-[#4b0082] text-white font-semibold hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 sm:mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CarbonTracker. All rights reserved.
      </div>
    </footer>

  );
}
