import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { comparePassword } from "./lib/hash";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

const authOptions = ({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isValid = await comparePassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Invalid credentials');
                }

                return user;

            }

        })
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
    },
    pages: {
        error: '/auth/error', // Custom error page
    },
});

export default authOptions;