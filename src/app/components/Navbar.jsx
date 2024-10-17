// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

export default function Navbar() {
	const [nav, setNav] = useState(false);

	const handleNav = () => {
		setNav(!nav);
	};

	return (
		<nav className="bg-white shadow-md fixed w-full z-20">
			<div className="container mx-auto flex justify-between items-center p-4">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Image
						src="/images/logo.svg"
						alt="SmartFin Logo"
						width={40}
						height={40}
					/>
					<span className="text-2xl font-bold text-indigo-600">SmartFin</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden md:flex space-x-6">
					<Link href="/dashboard" className="hover:text-indigo-600">
						Dashboard
					</Link>
					<Link href="#transactions" className="hover:text-indigo-600">
						Transactions
					</Link>
					<Link href="#insights" className="hover:text-indigo-600">
						Insights
					</Link>
					<Link href="#support" className="hover:text-indigo-600">
						Support
					</Link>
					<Link href="#register" className="hover:text-indigo-600">
						Business Registration
					</Link>
				</div>

				{/* Desktop Login/Get Started */}
				<div className="hidden md:flex items-center space-x-4">
					<Link href="#login" className="hover:text-indigo-600">
						Log in
					</Link>
					<Link
						href="#get-started"
						className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
					>
						Get Started
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center">
					<button onClick={handleNav}>
						{nav ? (
							<AiOutlineClose size={24} className="bg-white" />
						) : (
							<AiOutlineMenu size={24} className="bg-white" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed top-0 left-0 w-full h-full bg-white transition-transform transform ${
					nav ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="p-4 space-y-4">
					<div className="flex justify-between items-center">
						<Link href="/" className="flex items-center space-x-2">
							<Image
								src="/images/logo.svg"
								alt="SmartFin Logo"
								width={40}
								height={40}
							/>
							<span className="text-2xl font-bold text-indigo-600">
								SmartFin
							</span>
						</Link>
						<button onClick={handleNav}>
							<AiOutlineClose size={24} className="bg-white" />
						</button>
					</div>
					<Link
						href="/dashboard"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Dashboard
					</Link>
					<Link
						href="#transactions"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Transactions
					</Link>
					<Link
						href="#insights"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Insights
					</Link>
					<Link
						href="#support"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Support
					</Link>
					<Link
						href="#register"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Business Registration
					</Link>
					<Link
						href="#login"
						onClick={handleNav}
						className="block py-2 hover:text-indigo-600"
					>
						Log in
					</Link>
					<Link
						href="#get-started"
						onClick={handleNav}
						className="block py-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700"
					>
						Get Started
					</Link>
				</div>
			</div>
		</nav>
	);
}
