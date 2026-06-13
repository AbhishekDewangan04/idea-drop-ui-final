import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import React, { useState } from "react";

export const Route =
  createFileRoute("/(auth)/login/")({
    component: LoginPage,
  });

function LoginPage() {
  const {
    setAccessToken,
    setUser,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const {
    mutateAsync,
    isPending,
  } = useMutation({
    mutationFn: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      loginUser(
        email,
        password
      ),

    onSuccess: (data) => {
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
      error
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

      try {
        await mutateAsync({
          email,
          password,
        });
      } catch {}
    };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Login
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-2"
      >
        <input
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          placeholder="Password"
          className="w-full border p-2 rounded"
        />

        <button
          disabled={
            isPending
          }
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {isPending
            ? "Logging in..."
            : "Log in"}
        </button>

        <p>
          Don't have account?{" "}
          <Link
            to="/register"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;