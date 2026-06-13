import axios from "axios";
import { getStoredAccessToken } from "./authToken";

const api = axios.create({
  baseURL:
    "https://idea-drop-ui-final-production.up.railway.app/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token =
      getStoredAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) =>
    response,

  (error) =>
    Promise.reject(error)
);

export default api;