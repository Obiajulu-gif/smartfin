"use client"
import Link from 'next/link';
import Registration from './Registration';
//import { doCredentialLogin } from '../actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CredentialsProvider } from '../actions';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
    const router = useRouter(); // Hook to programmatically navigate
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        try {
            // Call NextAuth's signIn function with the credentials provider
            const result = await signIn('credentials', {
                redirect: false, //Prevent automatic redirection
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password.'); // Display error message
            } else {
                router.push('/dashboard'); // Redirect to home page upon successful login
            }
        } catch (err) {
            setError('An error occurred during login.'); // Display error message
        }
    };    return (
        <>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            autoComplete="email" 
                            required 
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            autoComplete="current-password" 
                            required 
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button 
                        type="submit" 
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </>
        </>

    );
};

export default LoginForm;