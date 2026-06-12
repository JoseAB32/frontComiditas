import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AppUser, LoginCredentials, RegisterValues } from "../interfaces/auth.interface";
import * as authService from "../services/authService";
import { STORAGE_KEYS } from "../config/storageKeys";
import { readStorage, removeStorage, writeStorage } from "../utils/storage";

interface AuthContextValue {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (values: RegisterValues) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = readStorage<AppUser | null>(STORAGE_KEYS.user, null);
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    function handleAuthError() {
      removeStorage(STORAGE_KEYS.user);
      removeStorage(STORAGE_KEYS.token);
      setUser(null);
      setToken(null);
    }

    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, []);

  async function loginUser(credentials: LoginCredentials) {
    const session = await authService.login(credentials);
    writeStorage(STORAGE_KEYS.user, session.user);
    localStorage.setItem(STORAGE_KEYS.token, session.token);
    setUser(session.user);
    setToken(session.token);
  }

  async function registerUser(values: RegisterValues) {
    const session = await authService.register(values);
    writeStorage(STORAGE_KEYS.user, session.user);
    localStorage.setItem(STORAGE_KEYS.token, session.token);
    setUser(session.user);
    setToken(session.token);
  }

  function logoutUser() {
    removeStorage(STORAGE_KEYS.user);
    removeStorage(STORAGE_KEYS.token);
    setUser(null);
    setToken(null);
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === "admin",
    loginUser,
    registerUser,
    logoutUser
  }), [user, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
