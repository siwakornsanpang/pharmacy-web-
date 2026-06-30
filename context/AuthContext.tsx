"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: "",
  userId: "",
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn");
    if (saved === "true") {
      setIsLoggedIn(true);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("isLoggedIn", isLoggedIn.toString());
      // Set cookie for middleware (expires in 7 days)
      if (isLoggedIn) {
        document.cookie = "isLoggedIn=true; path=/; max-age=" + 60 * 60 * 24 * 7;
      } else {
        document.cookie = "isLoggedIn=; path=/; max-age=0";
      }
    }
  }, [isLoggedIn, isLoaded]);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    document.cookie = "isLoggedIn=true; path=/; max-age=" + (60 * 60 * 24 * 7);
    setIsLoggedIn(true);
    window.location.href = "/home";
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; path=/; max-age=0";
    window.location.href = "/home";
  };

  if (!isLoaded) return null; // Avoid flicker

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,

        userName: "ภก. สมชาย รักชาติ",
        userId: "ภ.12345",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
