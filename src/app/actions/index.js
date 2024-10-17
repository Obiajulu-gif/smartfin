'use server';

import { signIn, signOut } from 'next-auth/react';

export async function CredentialsProvider({ email, password }) {
    try {
        // Call the signIn function for credentials provider
        const response = await signIn('credentials', {
            redirect: false, // We handle redirection manually
            email,
            password,
        });

        if (response?.error) {
            throw new Error(response.error);  // Handle login error
        }

        return response;  // Return the result for successful login
    } catch (error) {
        console.error("Error logging in:", error);
        return null; // Return null on error
    }
}


export async function doLogout () {
    await signOut({ callbackUrl: "/" });

}
