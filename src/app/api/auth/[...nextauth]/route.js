import NextAuth from "next-auth";
import authOptions from "../../../auth";

// Create a single handler for all HTTP methods
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("GET request received at /api/auth/[...nextauth]");
    return NextAuth(authOptions)(req, res);
  } else if (req.method === "POST") {
    console.log("POST request received at /api/auth/[...nextauth]");
    return NextAuth(authOptions)(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
