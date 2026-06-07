import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { logoutAdmin as logoutAdminService } from "../services/authService";

type AdminUser = {
  id: number;
  email: string;
  role: string;
};

type AuthContextType = {
  admin: AdminUser | null;
  token: string | null;
  isAdminLoggedIn: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("adminToken");
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    if (!savedAdmin) {
      return null;
    }

    return JSON.parse(savedAdmin);
  });

  const login = (newToken: string, adminData: AdminUser) => {
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminUser", JSON.stringify(adminData));

    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    logoutAdminService();

    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAdminLoggedIn: Boolean(token),
        login,
        logout,
      }}
    >
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