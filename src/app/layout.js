import "./globals.css";
import dynamic from "next/dynamic";
// Dynamically import the client-side Navbar to avoid server component errors
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: false });

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				<main className="pt-16"> {children} </main>{" "}
			</body>{" "}
		</html>
	);
}
