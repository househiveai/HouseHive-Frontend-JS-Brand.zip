import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Auth, Account } from "../lib/api";
import { getAccessToken, clearSession } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("hh_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("hh_user");
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      const token = getAccessToken();
      if (!token) {
        setLoaded(true);
        return;
      }
      try {
        const u = await Auth.me();
        setUser(u);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("hh_user", JSON.stringify(u));
        }
      } catch {
        clearSession();
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("hh_user");
        }
      }
      setLoaded(true);
    }
    load();
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await Auth.me();
    setUser(me);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hh_user", JSON.stringify(me));
    }
    return me;
  }, []);

  const logout = useCallback(
    (redirect = true) => {
      clearSession();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("hh_user");
      }
      setUser(null);
      if (redirect) router.push("/login");
    },
    [router]
  );

  const login = useCallback(
    async (email, password) => {
      await Auth.login(email, password);
      return refreshUser();
    },
    [refreshUser]
  );

  const updateProfile = useCallback(
    async (values) => {
      const updated = await Account.updateProfile(values);
      await refreshUser();
      return updated;
    },
    [refreshUser]
  );

  const updateEmail = useCallback(
    async (values) => {
      const updated = await Account.updateEmail(values);
      await refreshUser();
      return updated;
    },
    [refreshUser]
  );

  const updatePassword = useCallback((values) => Account.updatePassword(values), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loaded,
        login,
        logout,
        refreshUser,
        updateProfile,
        updateEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
