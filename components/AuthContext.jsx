import { createContext, useContext, useEffect, useState } from "react";
import { apiMe } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoaded(true);
        return;
      }
      try {
        const u = await apiMe();
        setUser(u);
      } catch {
        localStorage.removeItem("token");
      }
      setLoaded(true);
    }
    load();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
