import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "@/api/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_PRODUCTION_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//Attach Token on refresh
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Refresh Token after expire
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const requestConfig = error.config;
    if (
      error.response?.status === 401 &&
      !requestConfig.url.includes("/auth/refresh")
    ) {
      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        requestConfig.headers.Authorization = `Bearer ${newToken}`;
        return api(requestConfig);
      } catch (error) {
        console.error("Refreshing Access Token failed, ", error);
      }
    }
    return Promise.reject(error);
  }
);
export default api;
