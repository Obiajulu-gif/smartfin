"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BusinessForm = () => {
    const router = useRouter();
    const [businessName, setBusinessName] = useState("");
    const [businessEmail, setBusinessEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        
        // Here would go your registration logic
        // For now, just redirect to the dashboard or success page
        router.push("/dashboard");
    };

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form
                className="mt-8 space-y-6"
                onSubmit={handleSubmit}
            >
                <div className="rounded-md shadow-sm space-y-3">
                    <div>
                        <label htmlFor="businessName" className="sr-only">Business Name</label>
                        <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Business Name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                        />
                    </div>
                      <div>
                        <label htmlFor="businessEmail" className="sr-only">Business Email</label>
                        <input
                            id="businessEmail"
                            name="businessEmail"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Business Email"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="businessType" className="sr-only">Business Type</label>
                        <input
                            id="businessType"
                            name="businessType"
                            type="text"
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"                            placeholder="Business Type"
                        />
                    </div>
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessForm;
			/>
			<input
				type="password"
				placeholder="Password"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				className="w-full p-3 border border-black rounded-lg focus:outline-none focus:border-orange-500"
			/>
			<button
				type="submit"
				className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors"
			>
				Continue
			</button>
		</form>
	</div>
);

export default BusinessForm;
