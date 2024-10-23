"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader"

export default function PrivateRoute({ children }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);

	// Check if the user is authenticated by checking localStorage
	useEffect(() => {
		const checkAuth = () => {
			// Fetch the session from localStorage
			const userSession = localStorage.getItem("userSession");

			// If session exists, set authenticated to true, else redirect to login
			if (userSession) {
				setAuthenticated(true);
			} else {
				router.push("/login"); // Redirect to login page if not authenticated
			}
			setLoading(false);
		};

		checkAuth();
	}, [router]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader />
			</div>
		);
	}

	if (!authenticated) {
		return null; // Don't render the children if the user is not authenticated
	}

	return <>{children}</>; // Render the content (dashboard) if authenticated
}
