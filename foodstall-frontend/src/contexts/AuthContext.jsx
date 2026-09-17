import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Optionally fetch user data
      // authAPI.getMe().then(r => setUser(r.data.user));
    }
    setLoading(false);
  }, []);

  const login = async (mobile, password) => {
    try {
      const response = await authAPI.login(mobile, password);
      const { accessToken, user: userData } = response.data;

      // Store token
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);

      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}