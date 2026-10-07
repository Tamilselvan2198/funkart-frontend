"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/navbar/Navbar";
import AuthGuard from "@/app/AuthGuard";
import { SnackbarProvider } from "@/app/components/SnackbarProvider";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <AuthGuard>
      {!isAuthPage && <Navbar />}

      <SnackbarProvider>
        <main className={isAuthPage ? "" : "pt-[72px]"}>{children}</main>
      </SnackbarProvider>
    </AuthGuard>
  );
}
