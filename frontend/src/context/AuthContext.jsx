import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Backend API URL
const API_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Set JWT in axios headers and localStorage
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

  // Fetch user profile from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`);
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    if (token) {
      setToken(token); // ensures axios header set
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("Login error:", err);
      throw err.response?.data?.message || "Login failed";
    }
  };

  // Register
  const register = async ({ name, email, password, state }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        state,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("Register error:", err);
      throw err.response?.data?.message || "Registration failed";
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
