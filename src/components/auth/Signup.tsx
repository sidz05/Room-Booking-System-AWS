import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-xl w-80"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-500 text-white p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
