import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/DashboardGame";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import LoginSignup from "./pages/LoginSignup";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading)
    return <div className="text-center mt-10">Loading...</div>;

  return token ? children : <Navigate to="/login" replace />;
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white transition-colors duration-200">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 min-h-[calc(100vh-200px)]">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route
              path="/dashboard"
              element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>}
            />
            <Route
              path="/leaderboard"
              element={<PrivateRoute><PageTransition><Leaderboard /></PageTransition></PrivateRoute>}
            />
            <Route
              path="/community"
              element={<PrivateRoute><PageTransition><Community /></PageTransition></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>}
            />
            <Route
              path="/about"
              element={<PrivateRoute><PageTransition><AboutUs /></PageTransition></PrivateRoute>}
            />
            <Route
              path="/game"
              element={<PrivateRoute><PageTransition><Game /></PageTransition></PrivateRoute>}
            />
            <Route path="/login" element={<PageTransition><LoginSignup /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
