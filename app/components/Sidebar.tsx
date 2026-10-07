"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  showFilters?: boolean;
  category?: string;
  brand?: string;
  price?: string;
  rating?: string;
  setCategory?: (value: string) => void;
  setBrand?: (value: string) => void;
  setPrice?: (value: string) => void;
  setRating?: (value: string) => void;
  clearFilters?: () => void;
}

export default function Sidebar({
  showFilters = false,
  category = "all",
  brand = "all",
  price = "all",
  rating = "all",
  setCategory,
  setBrand,
  setPrice,
  setRating,
  clearFilters,
}: SidebarProps) {
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  const isProducts = pathname === "/products";

  // Get role from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRole(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      console.log("Sidebar role:", payload.role);

      setRole(payload.role);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setRole(null);
    }
  }, [pathname]);

  const isAdmin = role === "ADMIN";

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        borderRight: "1px solid #ddd",
        minHeight: "calc(100vh - 70px)",
        background: "#fff",
        padding: "20px 16px",
      }}
    >
      {/* MENU */}
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "#888",
            marginBottom: "12px",
            fontWeight: "500",
          }}
        >
          MENU
        </p>

        {/* ==========================================
            ADMIN MENU
        ========================================== */}

        {isAdmin ? (
          <>
            {/* PROFILE */}

            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname === "/admin" ? "#000" : "transparent",
                color: pathname === "/admin" ? "#fff" : "#333",
              }}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            {/* PROFILE */}

            <Link
              href="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname === "/profile" ? "#000" : "transparent",
                color: pathname === "/profile" ? "#fff" : "#333",
              }}
            >
              <span>👤</span>
              <span>Profile</span>
            </Link>
          </>
        ) : (
          /* ==========================================
             CUSTOMER MENU
          ========================================== */

          <>
            {/* PRODUCTS */}

            <Link
              href="/products"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname === "/products" ? "#000" : "transparent",
                color: pathname === "/products" ? "#fff" : "#333",
              }}
            >
              <span>🛍️</span>
              <span>Products</span>
            </Link>

            {/* CART */}

            <Link
              href="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname === "/cart" ? "#000" : "transparent",
                color: pathname === "/cart" ? "#fff" : "#333",
              }}
            >
              <span>🛒</span>
              <span>Cart</span>
            </Link>

            {/* PROFILE */}

            <Link
              href="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname === "/profile" ? "#000" : "transparent",
                color: pathname === "/profile" ? "#fff" : "#333",
              }}
            >
              <span>👤</span>
              <span>Profile</span>
            </Link>

            {/* ORDERS */}

            <Link
              href="/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "6px",
                textDecoration: "none",
                background: pathname.startsWith("/orders")
                  ? "#000"
                  : "transparent",
                color: pathname.startsWith("/orders") ? "#fff" : "#333",
              }}
            >
              <span>📦</span>
              <span>Orders</span>
            </Link>
          </>
        )}
      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}

      {/* Only CUSTOMER + PRODUCTS page */}
      {!isAdmin && showFilters && isProducts && (
        <div style={{ marginTop: "28px" }}>
          {/* FILTER HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#888",
                margin: 0,
                fontWeight: "500",
              }}
            >
              FILTERS
            </p>

            <button
              onClick={clearFilters}
              style={{
                border: "none",
                background: "none",
                color: "#777",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Clear
            </button>
          </div>

          {/* CATEGORY */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory?.(e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              <option value="all">All Categories</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Laptops">Laptops</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* BRAND */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Brand
            </label>

            <select
              value={brand}
              onChange={(e) => setBrand?.(e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              <option value="all">All Brands</option>
              <option value="Samsung">Samsung</option>
              <option value="Apple">Apple</option>
              <option value="OnePlus">OnePlus</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Google">Google</option>
            </select>
          </div>

          {/* PRICE */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Price
            </label>

            <select
              value={price}
              onChange={(e) => setPrice?.(e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              <option value="all">All Prices</option>
              <option value="0-10000">Under ₹10,000</option>
              <option value="10000-30000">₹10,000 - ₹30,000</option>
              <option value="30000-50000">₹30,000 - ₹50,000</option>
              <option value="50000+">Above ₹50,000</option>
            </select>
          </div>

          {/* RATING */}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) => setRating?.(e.target.value)}
              style={{
                width: "100%",
                height: "38px",
                border: "1px solid #ddd",
                borderRadius: "7px",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              <option value="all">All Ratings</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
            </select>
          </div>
        </div>
      )}
    </aside>
  );
}
