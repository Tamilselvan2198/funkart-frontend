"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/components/SnackbarProvider";

function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    return decodedPayload.role || null;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { showMessage } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const token = await response.text();

      const role = getRoleFromToken(token);

      if (!role) {
        throw new Error("User role not found");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        router.push("/admin");
        showMessage("Admin login successfully", "success");
      } else {
        router.push("/products");
        showMessage("login successfully", "success");
      }
    } catch (error) {
      showMessage("Login failed", "error");
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
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden md:flex bg-black text-white p-12 flex-col justify-center">
            <div className="max-w-md">
              <div className="text-4xl font-bold mb-6">Funkart 🛍️</div>

              <h2 className="text-4xl font-bold leading-tight mb-5">
                Welcome back!
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Login to your account and continue shopping your favorite
                products.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    ✓
                  </div>

                  <span className="text-gray-300">
                    Discover amazing products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    ✓
                  </div>

                  <span className="text-gray-300">
                    Easy and secure checkout
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    ✓
                  </div>

                  <span className="text-gray-300">Track your orders</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Login</h1>

                <p className="text-gray-500 mt-2">
                  Enter your details to access your account.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-gray-600 hover:text-black"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 accent-black"
                  />

                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-black py-3.5 text-white font-semibold transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Register */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="font-semibold text-black hover:underline"
                  >
                    Create account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
