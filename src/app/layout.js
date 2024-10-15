"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import DashboardLayout from "./dashboard/DashboardLayout";

export default function RootLayout({ children }) {
	const pathname = usePathname(); // i want to get the current pathname for rendering differnt page layout
	const isDashboard = pathname.startsWith("/dashboard");
	return (
		<html lang="en">
			{isDashboard ? (
				// check if it is dashboard route , render the dashboard layout
				<body>
					<DashboardLayout>{children}</DashboardLayout>
				</body>
			) : (
				// else render the normal dashboard layout
				<body>
					<Navbar />
					<main className="pt-16">{children}</main>
				</body>
			)}
		</html>
	);
}
