import { registerUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  //states
  const { setUser, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      navigate({ to: "/ideas" });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({name,email, password});
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to Register with unknown Error'
      console.log(message)
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 w-full rounded text-center mb-4">
          {error}
        </div>
      )}
      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-400 px-2 py-1 rounded focus:outline-0 focus:ring ring-gray-500"
          type="text"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-400 px-2 py-1 rounded focus:outline-0 focus:ring ring-gray-500"
          type="text"
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-400 px-2 py-1 rounded focus:outline-0 focus:ring ring-gray-500"
          type="text"
        />
        <button
          disabled={isPending}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md w-full hover:bg-blue-700 transition cursor-pointer mt-1 disabled:opacity-50"
          type="submit"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
        <p className="text-sm text-center text-gray-600">Already have account? {"  "} <Link className="text-blue-500 hover:text-blue-700 hover:underline transition" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
