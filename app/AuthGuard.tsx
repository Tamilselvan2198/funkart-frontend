"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicPages = ["/login", "/register"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      // Login and register are public
      if (publicPages.includes(pathname)) {
        setChecking(false);
        return;
      }

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // No token → login
      if (!token) {
        router.replace("/login");
        return;
      }

      // ADMIN trying to access user pages
      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        if (
          pathname === "/products" ||
          pathname === "/cart" ||
          pathname === "/orders"
        ) {
          router.replace("/admin");
          return;
        }
      }

      // USER trying to access admin pages
      if (pathname.startsWith("/admin")) {
        if (role !== "ADMIN" && role !== "ROLE_ADMIN") {
          router.replace("/products");
          return;
        }
      }

      setChecking(false);
    };

    checkAuthentication();

    const handlePageShow = () => {
      const token = localStorage.getItem("token");

      if (!publicPages.includes(pathname) && !token) {
        router.replace("/login");
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
