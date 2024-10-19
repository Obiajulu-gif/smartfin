"use client";
import { useState } from "react";
import {
	signupWithEmailPassword,
	signupWithGoogle,
} from "../../lib/firebaseAuth"; // Import the actual signup function here
import { useRouter } from "next/navigation";
import { FaGoogle, FaSpinner } from "react-icons/fa"; // For UI enhancement
import Link from "next/link"
export default function EmailForm({ onContinue }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	// This will prevent multiple signups by checking if the process has already started
	const [signupComplete, setSignupComplete] = useState(false);

	// Function to handle form submission and actual signup
	const handleSignup = async (e) => {
		e.preventDefault();

		// Check if signup is already complete to prevent multiple signups
		if (signupComplete) return;

		setLoading(true); // Show loading spinner
		try {
			// Store email and password in localStorage temporarily
			localStorage.setItem("signupData", JSON.stringify({ email, password }));

			// Trigger the actual signup with Firebase
			const userSession = await signupWithEmailPassword(email, password);

			// Store the user session in localStorage
			localStorage.setItem("userSession", JSON.stringify(userSession));

			// Mark signup as complete
			setSignupComplete(true);

			// Proceed to the next step (SuccessMessage will just show the success message)
			onContinue();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false); // Hide the loader
		}
	};

	// Google signup functionality
	const handleGoogleSignup = async () => {
		setLoading(true); // Show loader when Google signup starts
		try {
			const userSession = await signupWithGoogle();

			// Store Google session data in localStorage
			localStorage.setItem("userSession", JSON.stringify(userSession));

			// Redirect to dashboard
			router.push("/dashboard");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false); // Hide loader after processing
		}
	};

	return (
		<div className="signup-container p-6 min-h-screen flex items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
				<h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">
					Sign Up
				</h1>
				<form onSubmit={handleSignup} className="space-y-4">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300 ease-in-out"
						required
						autoComplete="email"
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300 ease-in-out"
						required
						autoComplete="current-password"
					/>
					<button
						type="submit"
						disabled={loading}
						className={`w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-300 transform hover:scale-105 ${
							loading ? "cursor-not-allowed opacity-70" : ""
						}`}
					>
						{loading ? (
							<FaSpinner className="animate-spin mr-2" />
						) : (
							<span>Sign Up</span>
						)}
					</button>
				</form>

				{/* Google Signup Button */}
				<button
					onClick={handleGoogleSignup}
					disabled={loading}
					className={`w-full mt-4 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 flex justify-center items-center transition duration-300 transform hover:scale-105 ${
						loading ? "cursor-not-allowed opacity-70" : ""
					}`}
				>
					<FaGoogle className="mr-2" />
					{loading ? "Processing..." : "Sign Up with Google"}
				</button>

				{/* Error Message */}
				{error && <p className="text-red-500 mt-4 text-center">{error}</p>}

				{/* Terms and Conditions */}
					<p className="text-xs text-gray-500 text-center mt-4">
						By continuing, you agree to our{" "}
						<Link href="#" className="text-orange-500 hover:underline">
							terms and conditions
						</Link>{" "}
						and{" "}
						<Link
							href="#"
							className="text-orange-500 hover:underline"
						>
							privacy policy
						</Link>
						.
					</p>

					{/* Sign Up Link */}
					<p className="text-center mt-4 text-gray-600">
						Do have an account with us?{" "}
						<Link
							href="/Login"
							className="text-orange-500 font-semibold hover:underline"
						>
							Login
						</Link>
					</p>
			</div>
		</div>
	);
}
