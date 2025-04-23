"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import DashboardLayout from "./dashboard/DashboardLayout";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname for rendering different page layouts
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <SessionProvider>
      {isDashboard ? (
        // For dashboard routes, render the dashboard layout
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        // For other routes, render the standard layout with navbar
        <>
          <Navbar />
          <main className="pt-16">{children}</main>
        </>
      )}
    </SessionProvider>
  );
}