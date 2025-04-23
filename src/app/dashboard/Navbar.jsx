"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import Logout from "./Logout"
const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	// Toggle menu open/close
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
			{/* Logo and Title */}
			<h1 className="text-lg font-bold px-10 text-white">Dashboard</h1>

			{/* Menu for larger screens */}
			<div className=" md:flex items-center space-x-2">
				<Logout/>
			</div>
		</header>
	);
};

export default Navbar;
