import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useState } from "react";

export const Route =
  createFileRoute("/(auth)/login/")({
    component: LoginPage,
  });

type LoginInput = {
  email: string;
  password: string;
};

function LoginPage() {
  const {
    setAccessToken,
    setUser,
  } = useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const {
    mutateAsync,
    isPending,
  } = useMutation({
    mutationFn: (
      data: LoginInput
    ) => {
      return loginUser(
        data.email,
        data.password
      );
    },

    onSuccess: (
      data
    ) => {
      setAccessToken(
        data.accessToken
      );

      setUser(
        data.user
      );

      navigate({
        to: "/ideas",
      });
    },

    onError: (
      error: Error
    ) => {
      setError(
        error.message
      );
    },
  });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      await mutateAsync({
        email,
        password,
      });
    };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Login
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-2"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

        <button
          disabled={isPending}
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          {isPending
            ? "Logging in..."
            : "Login"}
        </button>

        <p>
          Don't have account?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;