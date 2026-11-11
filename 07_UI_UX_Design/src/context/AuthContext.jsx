
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  getCurrentUser,
  loginDemo,
  logoutDemo,
  registerUser,
} from "../utils/localStore.js";

import { DEMO_PIN } from "../data/demoAccount.js";

// DEMO ONLY: This is not real authentication.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const login = useCallback((phone, pin) => {
    const result = loginDemo(phone, pin);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  }, []);

  const register = useCallback((values) => {
    const result = registerUser(values);

    if (!result.ok) return result;

    const loginResult = loginDemo(result.user.phone, DEMO_PIN);

    if (loginResult.ok) {
      setUser(loginResult.user);
    }

    return result;
  }, []);

  const logout = useCallback(() => {
    logoutDemo();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
