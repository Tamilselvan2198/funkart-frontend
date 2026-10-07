"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getUserProfile } from "@/lib/profile";
import Sidebar from "../components/Sidebar";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUserProfile();

      setUser(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("accessToken");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-32 rounded bg-gray-200" />

            <div className="rounded-lg border bg-white p-8">
              <div className="mb-8 flex items-center gap-5">
                <div className="h-20 w-20 rounded-full bg-gray-200" />

                <div>
                  <div className="mb-2 h-6 w-40 rounded bg-gray-200" />
                  <div className="h-4 w-52 rounded bg-gray-200" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="h-16 rounded bg-gray-100" />
                <div className="h-16 rounded bg-gray-100" />
                <div className="h-16 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <h1 className="text-2xl font-bold">Funkart</h1>

            <div className="flex items-center gap-6">
              <a href="/products" className="text-gray-600 hover:text-black">
                Products
              </a>

              <a href="/cart" className="text-gray-600 hover:text-black">
                🛒 Cart
              </a>

              <button
                onClick={handleLogout}
                className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">⚠️</div>

            <h2 className="mb-2 text-xl font-semibold">
              Unable to load profile
            </h2>

            <p className="mb-6 text-gray-500">{error}</p>

            <button
              onClick={fetchUserProfile}
              className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <Sidebar showFilters={false} />
        {/* ================= MAIN ================= */}
        <main className="mx-auto max-w-5xl px-6 py-10">
          {/* Page title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

            <p className="mt-2 text-gray-500">View your account information</p>
          </div>

          {/* ================= PROFILE CARD ================= */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Profile Header */}
            <div className="border-b px-8 py-8">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                {/* User name */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {user.name}
                  </h3>

                  <p className="mt-1 text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* ================= USER DETAILS ================= */}
            <div className="px-8 py-8">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Personal Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Name */}
                <div className="rounded-lg border bg-gray-50 p-5">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Full Name
                  </p>

                  <p className="text-lg font-medium text-gray-900">
                    {user.name}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-lg border bg-gray-50 p-5">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Email Address
                  </p>

                  <p className="break-all text-lg font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>

                {/* User ID */}
                <div className="rounded-lg border bg-gray-50 p-5">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    User ID
                  </p>

                  <p className="text-lg font-medium text-gray-900">
                    #{user.id}
                  </p>
                </div>

                {/* Role */}
                <div className="rounded-lg border bg-gray-50 p-5">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    Account Role
                  </p>

                  <span className="inline-flex rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= ACCOUNT SECTION ================= */}
            <div className="border-t px-8 py-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Account
              </h3>

              <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-5">
                <div>
                  <p className="font-medium text-gray-900">
                    Logout from your account
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    You will be redirected to the login page.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
