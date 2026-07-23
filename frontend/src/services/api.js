import axios from "axios";

// Backend URL from .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;