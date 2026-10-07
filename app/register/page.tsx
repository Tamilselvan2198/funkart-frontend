"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
      }

      alert("Registration successful 🎉");

      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
      }}
    >
      {/* Optional dark overlay */}
      <div className="min-h-screen bg-black/30 flex items-center justify-center">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-[50vh] h-[75vh] rounded-2xl max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white text-2xl font-bold">
              F
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

            <p className="mt-2 text-sm text-gray-500">
              Join Funkart and start shopping 🛍️
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-semibold text-black hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
