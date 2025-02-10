import React, { createContext, useContext, useEffect, useState } from 'react';
import * as jose from 'jose';
import { User } from '@/app/common/interfaces/user-interface';

const AuthContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
    if (token) {
      try {
        const decoded = jose.decodeJwt(token);
        setUser(decoded as unknown as User);
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
