"use client"
import { useRouter } from "next/navigation";
import { logout } from "../../lib/firebaseAuth";

const Logout = () => {
	const router = useRouter();

	const handleLogout = () => {
		// Use the logout function from firebaseAuth which now logs to MongoDB
		logout();

		// Remove the user session from localStorage
		localStorage.removeItem("userSession");

		// Redirect to the landing page
		router.push("/");
	};

	return (
		<button
			onClick={handleLogout}
			className="bg-red-500 text-white px-4 py-2 rounded"
		>
			Logout
		</button>
	);
};

export default Logout;
