import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"; // App Router response
import { hashPassword } from "../../lib/hash";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user
        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            //return NextResponse.redirect('/'); // Redirect to login page
            return NextResponse.json(user, {status: 201} && {message: 'User created successfully'}); // Return the user object
            //console.log('login succefull')
            //res.status(201).json(user);
        } catch (error) {
            console.error("User creation failed:", error);
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
           // res.status(500).json({ error: 'User creation failed' });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json({ error: 'Error during registration' }, { status: 500 });
        //res.status(500).json({ error: 'Error during registration' });
    }
};

// Catch all other HTTP methods
export async function GET() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}