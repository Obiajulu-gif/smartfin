import NextAuth from "next-auth";
import authOptions from "../../../auth";

// You don't need custom GET and POST handlers; NextAuth handles both.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
