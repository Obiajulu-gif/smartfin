"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Registration from "./Registration";
import { login } from "../actions";

export default function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(formData) {
		setIsLoading(true);
		setError("");

		try {
			const result = await login(formData);

			if (result.error) {
				setError(result.error);
				setIsLoading(false);
			} else {
				// Redirect to dashboard on successful login
				router.push("/dashboard");
				router.refresh();
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("An unexpected error occurred. Please try again.");
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full max-w-md space-y-8">
			<div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to your account
				</h2>
			</div>

			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
					{error}
				</div>
			)}

			<form action={handleSubmit} className="mt-8 space-y-6">
				<div className="rounded-md shadow-sm -space-y-px">
					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Password"
						/>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember_me"
							name="remember_me"
							type="checkbox"
							className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="remember_me"
							className="ml-2 block text-sm text-gray-900"
						>
							Remember me
						</label>
					</div>

					<div className="text-sm">
						<Link
							href="/forgot-password"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Forgot your password?
						</Link>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={isLoading}
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</div>
			</form>

			<Registration />
		</div>
	);
}
