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
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='my-5 flex flex-col items-center border p-3 border-grey-200 rounded-md'>
                <div className='my-2'>
                    <label htmlFor="email">Email:</label>
                    <input onChange={(e) => setEmail(e.target.value)} className='border mx-2 border-gray-500 rounded' type="email" id="email" name="email" required />
                </div>
                <div className='my-2'>
                    <label htmlFor="password">Password:</label>
                    <input onChange={(e) => setPassword(e.target.value)} className='border mx-2 border-gray-500 rounded' type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            
            <p className='my-2'>
                Don't have an account? <Link href="/register" className='text-blue-500'>Register here</Link>
            </p>

            { error && ( 
                <p className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
                {error}
            </p>)}
        </>

    );
};

export default LoginForm;