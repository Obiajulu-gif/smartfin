"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	// Toggle menu open/close
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
			{/* Logo and Title */}
			<h1 className="text-lg font-bold px-10">Dashboard</h1>

			{/* Menu for larger screens */}
			<div className=" md:flex items-center space-x-4">
				<Link href="#help" className="hover:underline">
					Help Center
				</Link>
				<button className="px-4 py-2 bg-yellow-500 text-indigo-600 rounded-lg">
					Quick Action
				</button>
			</div>

		</header>
	);
};

export default Navbar;
