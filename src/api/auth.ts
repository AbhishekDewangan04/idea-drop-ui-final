import api from "@/lib/axios";
import type { AuthResponseType } from "@/types";
import { AxiosError } from "axios";

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponseType> => {
  try {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data.message
        : "Failed to register";
    throw new Error(message);
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponseType> => {
    try {
        const res = await api.post("/auth/login", {
            email,
            password
        })
        return res.data;
    } catch (error) {
        const message = error instanceof AxiosError ? error.response?.data.message : "Failed to login";
        throw new Error(message);
    }
};

export const logoutUser = async ()=>{
  try {
    await api.post("/auth/logout");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Logout";
    throw new Error(message);
  }
}

export const refreshAccessToken = async(): Promise<AuthResponseType>=>{
  try {
    const res = await api.post("/auth/refresh");
    return res.data;

  } catch (error) {
    const message = error instanceof AxiosError ? error.response?.data.message : "Failed to refresh access token"
    throw new Error(message);
  }
}