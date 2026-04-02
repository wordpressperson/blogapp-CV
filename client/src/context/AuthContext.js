import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info (no need to call backend)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        
        // Set default axios header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/'; // optional redirect
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
