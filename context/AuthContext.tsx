// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as jose from 'jose';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null as any,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
    console.log(token);
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jose.decodeJwt(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  return <AuthContext.Provider value={{ isLoggedIn, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
