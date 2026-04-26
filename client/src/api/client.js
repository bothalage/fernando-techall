import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export default api;
