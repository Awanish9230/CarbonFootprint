// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// const API_URL = "http://localhost:5000/api/auth";
const API_URL = "https://ecotracker-backenddata.onrender.com/api/auth";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Configure axios auth header & persist token
  const setToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setTokenState(token);
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setTokenState(null);
    }
  };

  // ✅ Fetch current logged-in user profile
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`);
      const u = res.data;

      if (!u || !u._id) throw new Error("User ID not found");

      // ✅ Save userId for gamification & dashboard
      localStorage.setItem("userId", u._id);

      // ✅ Safely define virtualGarden defaults
      const vg = u.virtualGarden || {};
      const simplifiedUser = {
        _id: u._id,
        name: u.name || "User",
        email: u.email || "",
        state: u.state || "",
        photoURL: u.photoURL || "",
        points: u.points || 0,
        streak: u.streak || 0,
        dailyGoal: u.dailyGoal || 1,
        virtualGarden: {
          treesPlanted: vg.treesPlanted || 0,
          gardenLevel: vg.gardenLevel || 1,
          carbonSaved: vg.carbonSaved || 0,
        },
        carbonSaved: u.carbonSaved || 0,
        challenges: u.challenges || [],
        badges: u.badges || [],
        level: u.level || 1,
        milestones: u.milestones || [],
        rewards: u.rewards || [],
        goals: u.goals || [],
        dailyLogs: u.dailyLogs || [],
      };

      setUser(simplifiedUser);
    } catch (err) {
      console.error("❌ Error fetching user profile:", err.message || err);
      logout(); // token invalid → logout
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run on mount or token change
  useEffect(() => {
    if (token) {
      setToken(token); // set axios header
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;

      if (!user || !token) throw new Error("Invalid response from server");

      // Save both token and userId
      setToken(token);
      localStorage.setItem("userId", user._id);
      setUser(user);

      return user;
    } catch (err) {
      console.error("Login error:", err);
      throw err.response?.data?.message || err.message || "Login failed";
    }
  };

  // ✅ Register
  const register = async ({ name, email, password, state }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        state,
      });
      const { token, user } = res.data;

      if (!user || !token) throw new Error("Invalid response from server");

      // Save both token and userId
      setToken(token);
      localStorage.setItem("userId", user._id);
      setUser(user);

      return user;
    } catch (err) {
      console.error("Register error:", err);
      throw err.response?.data?.message || err.message || "Registration failed";
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
