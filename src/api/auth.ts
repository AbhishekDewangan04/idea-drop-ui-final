import api from "@/lib/axios";
import type { AuthResponseType } from "@/types";

// LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponseType> => {
  const res = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return res.data;
};

// REGISTER
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponseType> => {
  const res = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return res.data;
};

// REFRESH TOKEN
export const refreshAccessToken =
async (): Promise<AuthResponseType> => {

  try {
    const res =
      await api.post(
        "/auth/refresh"
      );

    return res.data;

  } catch {

    return {
      accessToken: "",
      user: {
        id: "",
        name: "",
        email: "",
      },
    };
  }
};

// LOGOUT ← THIS WAS MISSING
export const logoutUser =
async (): Promise<void> => {

  try {
    await api.post(
      "/auth/logout"
    );

  } catch (err) {
    console.error(err);
  }
};