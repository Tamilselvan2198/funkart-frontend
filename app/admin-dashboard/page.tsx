"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Admin Dashboard ⚙️</h1>

          <p className="text-gray-500 mt-2">Manage your Funkart application.</p>
        </div>

        {/* MANAGEMENT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users */}

          <div className="bg-white border rounded-xl p-6">
            <div className="text-3xl mb-4">👥</div>

            <h2 className="text-xl font-semibold">Users</h2>

            <p className="text-gray-500 mt-2">Manage registered users.</p>

            <button
              onClick={() => router.push("/admin-dashboard/users")}
              className="mt-5 bg-black text-white px-4 py-2 rounded-lg"
            >
              Manage Users
            </button>
          </div>

          {/* Products */}

          <div className="bg-white border rounded-xl p-6">
            <div className="text-3xl mb-4">📦</div>

            <h2 className="text-xl font-semibold">Products</h2>

            <p className="text-gray-500 mt-2">
              Add, update and delete products.
            </p>

            <button
              onClick={() => router.push("/admin-dashboard/products")}
              className="mt-5 bg-black text-white px-4 py-2 rounded-lg"
            >
              Manage Products
            </button>
          </div>

          {/* Orders */}

          <div className="bg-white border rounded-xl p-6">
            <div className="text-3xl mb-4">🛒</div>

            <h2 className="text-xl font-semibold">Orders</h2>

            <p className="text-gray-500 mt-2">View and manage orders.</p>

            <button
              onClick={() => router.push("/admin-dashboard/orders")}
              className="mt-5 bg-black text-white px-4 py-2 rounded-lg"
            >
              Manage Orders
            </button>
          </div>

          {/* Management */}

          <div className="bg-white border rounded-xl p-6">
            <div className="text-3xl mb-4">⚙️</div>

            <h2 className="text-xl font-semibold">Management</h2>

            <p className="text-gray-500 mt-2">Manage application settings.</p>

            <button
              onClick={() => router.push("/admin-dashboard/management")}
              className="mt-5 bg-black text-white px-4 py-2 rounded-lg"
            >
              Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
