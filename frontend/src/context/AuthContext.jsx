import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5000/api/auth'; // Backend URL

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // Loading state to check user auth

  // Set JWT in axios headers and localStorage
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setTokenState(token);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setTokenState(null);
    }
  };

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        setToken(localToken);
        try {
          const res = await axios.get(`${API_URL}/me`);
          setUser(res.data);
        } catch (err) {
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async ({ name, email, password, state }) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password, state });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
