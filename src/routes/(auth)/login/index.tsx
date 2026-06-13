```tsx
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
    mutationFn: async ({
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
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Login
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
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
          type="text"
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
          disabled={
            isPending
          }
          type="submit"
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
```
