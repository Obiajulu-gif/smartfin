"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PrivateRoute from "../PrivateRoute";

export default function DashboardLayout({ children }) {
	return (
		<PrivateRoute>
			<div className="flex min-h-screen">
				{" "}
				{/* Sidebar */} <Sidebar />
				<div className="flex-1 bg-gray-100">
					{" "}
					{/* Topbar */} <Navbar /> {/* Main Content */}{" "}
					<main className="p-6 space-y-6"> {children} </main>{" "}
				</div>{" "}
			</div>{" "}
		</PrivateRoute>
	);
}
