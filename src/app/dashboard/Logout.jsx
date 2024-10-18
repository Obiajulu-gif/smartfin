"use client"
import { useRouter } from "next/navigation";
const Logout = () => {
	const router = useRouter();

	const handleLogout = () => {
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
