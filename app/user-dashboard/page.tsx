"use client";

import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Funkart 🛍️</h1>

            <p className="text-gray-500 mt-2">
              Browse our products and find what you need.
            </p>
          </div>

          <button
            onClick={() => router.push("/products")}
            className="bg-black text-white px-5 py-3 rounded-lg"
          >
            Browse Products
          </button>
        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-5">Shop Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Price */}

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>

              <select className="w-full border rounded-lg px-3 py-2">
                <option>All Prices</option>
                <option>Under ₹10,000</option>
                <option>₹10,000 - ₹50,000</option>
                <option>₹50,000 - ₹1,00,000</option>
                <option>Above ₹1,00,000</option>
              </select>
            </div>

            {/* Category */}

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>

              <select className="w-full border rounded-lg px-3 py-2">
                <option>All Categories</option>
                <option>Mobiles</option>
                <option>Laptops</option>
                <option>Electronics</option>
                <option>Accessories</option>
              </select>
            </div>

            {/* Brand */}

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>

              <select className="w-full border rounded-lg px-3 py-2">
                <option>All Brands</option>
                <option>Samsung</option>
                <option>Apple</option>
                <option>OnePlus</option>
                <option>HP</option>
                <option>Dell</option>
              </select>
            </div>

            {/* Rating */}

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>

              <select className="w-full border rounded-lg px-3 py-2">
                <option>All Ratings</option>
                <option>4★ & above</option>
                <option>3★ & above</option>
                <option>2★ & above</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
