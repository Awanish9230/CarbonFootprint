import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('cft_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cft_token', token);
      api.get('/auth/me').then((res) => setUser(res.data)).catch(() => setUser(null));
    } else {
      localStorage.removeItem('cft_token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
