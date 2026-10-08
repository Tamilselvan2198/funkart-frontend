"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/app/components/Sidebar";
import { getDashboardStats } from "@/lib/adminDashboardApi";

export default function AdminPage() {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      const stats = await getDashboardStats();

      setUsers(stats.users);
      setProducts(stats.products);
      setOrders(stats.orders);
      setRevenue(stats.revenue);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar showFilters={false} />

        {/* ADMIN CONTENT */}
        <main className="flex-1 min-w-0 p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
            {/* USERS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Users</p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : users}
              </h2>
            </div>

            {/* PRODUCTS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Products</p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : products}
              </h2>
            </div>

            {/* ORDERS */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Orders</p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : orders}
              </h2>
            </div>

            {/* REVENUE */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500">Revenue</p>

              <h2 className="text-3xl font-bold mt-2">
                {loading ? "..." : `₹${revenue.toLocaleString("en-IN")}`}
              </h2>
            </div>
          </div>

          {/* MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* USERS */}
            <Link
              href="/admin/users"
              className="bg-black text-white rounded-xl p-6 hover:bg-gray-800 transition"
            >
              <h2 className="text-xl font-bold">User Management 👥</h2>

              <p className="text-gray-300 mt-2">Manage registered users</p>
            </Link>

            {/* PRODUCTS */}
            <Link
              href="/admin/products"
              className="bg-black text-white rounded-xl p-6 hover:bg-gray-800 transition"
            >
              <h2 className="text-xl font-bold">Product Management 📦</h2>

              <p className="text-gray-300 mt-2">Manage products</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
