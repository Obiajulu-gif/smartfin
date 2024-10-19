"use client";
import { useState } from "react";
import {
	signinWithEmailPassword,
	signupWithGoogle,
} from "../../lib/firebaseAuth"; // Make sure to import signupWithGoogle
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaSpinner } from "react-icons/fa"; // Importing React icons
import Head from "next/head"; // Importing Head for metadata

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true); // Show loader
		try {
			const userSession = await signinWithEmailPassword(email, password);
			localStorage.setItem("userSession", JSON.stringify(userSession)); // Store user session in localStorage
			router.push("/dashboard"); // Redirect to the dashboard
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false); // Hide loader
		}
	};

	const handleGoogleSignup = async () => {
		setLoading(true); // Show loader when Google signup starts
		try {
			const userSession = await signupWithGoogle();

			// Store Google session data in localStorage
			localStorage.setItem("userSession", JSON.stringify(userSession));

			// Redirect to the dashboard
			router.push("/dashboard");
		} catch (err) {
			// Handle specific Firebase Auth error codes for better UX
			switch (err.code) {
				case "auth/popup-closed-by-user":
					setError(
						"The sign-in popup was closed before completing the process. Please try again."
					);
					break;
				case "auth/user-not-found":
					setError(
						"No user found with this email. Please check your email or sign up."
					);
					break;
				case "auth/wrong-password":
					setError("Incorrect password. Please try again.");
					break;
				case "auth/network-request-failed":
					setError(
						"Network error. Please check your connection and try again."
					);
					break;
				default:
					setError("An unexpected error occurred. Please try again later.");
			}
		} finally {
			setLoading(false); // Hide loader after processing
		}
	};

	return (
		<>
			<Head>
				<title>Login - SmartFin</title>
				<meta name="description" content="Login to your SmartFin account" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta property="og:title" content="Login to SmartFin" />
				<meta
					property="og:description"
					content="Access your SmartFin dashboard and manage your financial activities efficiently."
				/>
				<meta property="og:image" content="/images/logo.png" />
				<meta property="og:url" content="https://yourdomain.com/login" />
			</Head>

			<div className="signup-container bg-gray-50 p-6 min-h-screen flex items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
					<h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">
						Login
					</h1>

					{/* Form */}
					<form
						onSubmit={handleLogin} // Fixed invocation
						className="space-y-4"
					>
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

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className={`w-full py-3 rounded-lg bg-indigo-600 text-white flex items-center justify-center transition-transform duration-300 hover:bg-indigo-400 transform hover:scale-105 ${
								loading ? "cursor-not-allowed opacity-70" : ""
							}`}
						>
							{loading ? (
								<FaSpinner className="animate-spin mr-2" />
							) : (
								<span>Login</span>
							)}
						</button>
					</form>

					{/* Google Signup Button */}
					<button
						onClick={handleGoogleSignup}
						disabled={loading}
						className={`w-full mt-4 py-3 rounded-lg bg-red-500 text-white flex items-center justify-center transition-transform duration-300 hover:bg-red-600 transform hover:scale-105 ${
							loading ? "cursor-not-allowed opacity-70" : ""
						}`}
					>
						<FaGoogle className="mr-2" />
						{loading ? (
							<FaSpinner className="animate-spin mr-2" />
						) : (
							"Login with Google"
						)}
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
						Don’t have an account?{" "}
						<Link
							href="/signup"
							className="text-orange-500 font-semibold hover:underline"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
