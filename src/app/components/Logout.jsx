'use client';
import { signOut } from 'next-auth/react';

const Logout = () => {
    const handleLogout = async (event) => {
        event.preventDefault();
        await signOut({ callbackUrl: "/" });  // Redirect to homepage after logging out
    };

    return (
        <button 
            className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default Logout;
