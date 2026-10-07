"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    setIsLoggedIn(true);

    try {
      // JWT = header.payload.signature
      const payload = JSON.parse(atob(token.split(".")[1]));

      console.log("JWT Payload:", payload);

      const role = payload.role;

      setIsAdmin(role === "ADMIN");
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      setIsAdmin(false);
    }
  }, [pathname]);

  // Don't show navbar on login/register
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* =====================================
            LOGO
        ===================================== */}

        <Link
          href={isAdmin ? "/admin" : "/products"}
          className="text-2xl font-extrabold tracking-tight text-black"
        >
          Funkart
        </Link>

        {/* =====================================
            ADMIN NAVBAR
        ===================================== */}

        {isLoggedIn && isAdmin ? (
          <div className="flex items-center gap-7">
            <Link
              href="/profile"
              className={`transition ${
                pathname === "/profile"
                  ? "font-semibold text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              👤 Profile
            </Link>
          </div>
        ) : (
          /* =====================================
             CUSTOMER / GUEST NAVBAR
          ===================================== */

          <div className="flex items-center gap-7">
            {/* PRODUCTS */}

            <Link
              href="/products"
              className={`transition ${
                pathname === "/products"
                  ? "font-semibold text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              🛍️ Products
            </Link>

            {/* LOGGED-IN CUSTOMER */}

            {isLoggedIn && (
              <>
                {/* CART */}

                <Link
                  href="/cart"
                  className={`transition ${
                    pathname === "/cart"
                      ? "font-semibold text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  🛒 Cart
                </Link>

                {/* ORDERS */}

                <Link
                  href="/orders"
                  className={`transition ${
                    pathname.startsWith("/orders")
                      ? "font-semibold text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  📦 Orders
                </Link>

                {/* PROFILE */}

                <Link
                  href="/profile"
                  className={`transition ${
                    pathname === "/profile"
                      ? "font-semibold text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  👤 Profile
                </Link>
              </>
            )}

            {/* GUEST */}

            {!isLoggedIn && (
              <>
                <Link href="/login" className="text-gray-600 hover:text-black">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
