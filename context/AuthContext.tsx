// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as jose from 'jose';
import { useLocalStorage } from 'usehooks-ts';
import { set } from 'react-hook-form';

const AuthContext = createContext({
  user: null as any,
  setUser: (user: any) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
    if (token) {
      try {
        console.log('yay');
        const decoded = jose.decodeJwt(token);
        console.log(decoded);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);
  console.log('rerender ', user?.sub);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
