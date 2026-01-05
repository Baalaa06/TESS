import { auth } from "@/config/firebase";
import { logout as authLogout, loginWithEmail, registerWithEmail } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const FALLBACK_CURRENT_USER = "__demo_current_user__";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsub: any;
    if (auth) {
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u || null);
        setLoading(false);
      });
    } else {
      // fallback: read demo current user
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(FALLBACK_CURRENT_USER);
          setUser(raw ? JSON.parse(raw) : null);
        } catch (e) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const u = await loginWithEmail(email, password);
    setUser(u);
    return u;
  };

  const register = async (email: string, password: string) => {
    const u = await registerWithEmail(email, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
