import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { disconnectSocket } from "../api/socket";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const normalizeUser = (user) => user ? { ...user, id: user.id || user._id } : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get("/auth/me").then(({ data }) => setUser(normalizeUser(data.user))).catch(() => {
      disconnectSocket();
      setToken(null);
      localStorage.removeItem("token");
    }).finally(() => setLoading(false));
  }, [token]);

  const login = async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    disconnectSocket();
    localStorage.setItem("token", data.token); setToken(data.token); setUser(normalizeUser(data.user));
    return normalizeUser(data.user);
  };
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    disconnectSocket();
    localStorage.setItem("token", data.token); setToken(data.token); setUser(normalizeUser(data.user));
    return normalizeUser(data.user);
  };
  const logout = () => { disconnectSocket(); localStorage.removeItem("token"); setToken(null); setUser(null); };

  return <Ctx.Provider value={{ user, token, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
