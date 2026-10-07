"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMyOrders, Order } from "@/lib/order";
import Sidebar from "../components/Sidebar";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);

        const data = await getMyOrders();

        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);

        if (error instanceof Error && error.message.includes("403")) {
          router.replace("/login");
          return;
        }

        setError(
          error instanceof Error ? error.message : "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">My Orders 📦</h1>

          <p className="mt-6 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <Sidebar showFilters={false} />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Orders 📦</h1>

                <p className="text-gray-500 mt-1">View your order history</p>
              </div>

              <button
                onClick={() => router.push("/products")}
                className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800"
              >
                Continue Shopping
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* NO ORDERS */}
            {orders.length === 0 && !error ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">📦</div>

                <h2 className="text-xl font-semibold">No orders yet</h2>

                <p className="text-gray-500 mt-2 mb-6">
                  You haven't placed any orders yet.
                </p>

                <button
                  onClick={() => router.push("/products")}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              /* ORDERS */
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* ORDER ID */}
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>

                        <h2 className="text-lg font-bold">#{order.id}</h2>
                      </div>

                      {/* ORDER DATE */}
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>

                        <p className="font-medium">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                      {/* TOTAL */}
                      <div>
                        <p className="text-sm text-gray-500">Total</p>

                        <p className="font-bold">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div>
                        <p className="text-sm text-gray-500">Status</p>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "CONFIRMED"
                                ? "bg-green-100 text-green-700"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* VIEW DETAILS */}
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
