import axios from "axios";
import {
  getStoredAccessToken,
  setStoredAccessToken,
} from "./authToken";

import {
  refreshAccessToken,
} from "@/api/auth";

const api = axios.create({
  baseURL:
    "https://idea-drop-ui-final-production.up.railway.app",

  headers: {
    "Content-Type":
      "application/json",
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
  }
);

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const requestConfig =
      error.config;

    if (
      error.response?.status ===
        401 &&
      !requestConfig.url.includes(
        "/auth/refresh"
      )
    ) {
      try {
        const {
          accessToken,
        } =
          await refreshAccessToken();

        setStoredAccessToken(
          accessToken
        );

        requestConfig.headers.Authorization =
          `Bearer ${accessToken}`;

        return api(
          requestConfig
        );
      } catch {
        return Promise.reject(
          error
        );
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;