import axios from "axios";

export const BACKEND_API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
export const HAS_BACKEND_API = Boolean(BACKEND_API_URL);

export const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

export const publicRecipesApi = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("catalogo_food_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
