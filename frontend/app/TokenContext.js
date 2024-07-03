'use client'

import { useRouter } from 'next/navigation';
// TokenContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const TokenContext = createContext();

// Custom hook to use the TokenContext
export const useToken = () => useContext(TokenContext);

// TokenProvider component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const router = useRouter();

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Save token to localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/login')
  };

  return (
    <TokenContext.Provider value={{ token, login, logout }}>
      {children}
    </TokenContext.Provider>
  );
};