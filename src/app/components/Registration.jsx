'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const Registration = () => {

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const router = useRouter(); // Initialize useRouter


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('all feild are neccesary');
            return;
        }

        try {
            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push('/login'); // Redirect to login page
            } else {
                console.log("user registration failed.");
            }
        } catch (error) {
            console.log("error during registration: ", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='my-5 flex flex-col items-center border p-3 border-grey-200 rounded-md'>
                <div className='my-2'>
                    <label htmlFor="name">full name:</label>
                    <input onChange={(e) => setName(e.target.value)} className='border mx-2 border-gray-500 rounded' type="text" id="name" name="name" required />
                </div>
                <div className='my-2'>
                    <label htmlFor="email">Email:</label>
                    <input onChange={(e) => setEmail(e.target.value)} className='border mx-2 border-gray-500 rounded' type="email" id="email" name="email" required />
                </div>
                <div className='my-2'>
                    <label htmlFor="password">Password:</label>
                    <input onChange={(e) => setPassword(e.target.value)} className='border mx-2 border-gray-500 rounded' type="password" id="password" name="password" required />
                </div>
                <button type="submit">Register</button>
            </form>
            <p className='my-2'>
                Already have an account? <Link href="/login" className='text-blue-500'>Login here</Link>
            </p>

            {error && (
            <p className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
                {error}
            </p>
            )}
        </>

    );
};

export default Registration;