"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "@/app/components/SnackbarProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { showMessage } = useSnackbar();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showMessage("Invalid password reset link", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        },
      );

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message);
      }

      showMessage("Password reset successfully", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error ? error.message : "Failed to reset password",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>

          <p className="mt-2 text-gray-500">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NEW PASSWORD */}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3.5 text-white font-semibold transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
