import { registerUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useState } from "react";

export const Route =
  createFileRoute("/(auth)/register/")({
    component: RegisterPage,
  });

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

function RegisterPage() {
  const {
    setAccessToken,
    setUser,
  } = useAuth();

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

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
      data: RegisterInput
    ) => {
      return registerUser(
        data.name,
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
        name,
        email,
        password,
      });
    };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Register
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

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
            ? "Registering..."
            : "Register"}
        </button>

        <p>
          Already have account?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;