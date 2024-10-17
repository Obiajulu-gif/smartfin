import NextAuth from "next-auth";
import authOptions from "../../../auth";

// Export the NextAuth handlers
export const GET = async (req, res) => {
	console.log("GET request received at /api/auth/[...nextauth]");
	return NextAuth(authOptions)(req, res);
};

export const POST = async (req, res) => {
	console.log("POST request received at /api/auth/[...nextauth]");
	return NextAuth(authOptions)(req, res);
};
