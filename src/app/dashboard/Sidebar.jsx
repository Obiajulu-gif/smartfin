"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
	FaBell,
	FaCog,
	FaComments,
	FaFileInvoiceDollar,
	FaFolder,
	FaTachometerAlt,
	FaTimes,
	FaBars,
	FaChartLine,
	FaPeopleArrows,
	FaBoxOpen,
	FaReceipt,
	FaRobot,
	FaToolbox,
} from "react-icons/fa";
import Image from "next/image";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	// Toggle sidebar open/close
	const sidebarHandler = (flag) => {
		setIsOpen(flag);
	};

	// Close sidebar when a link is clicked (for mobile view)
	const handleLinkClick = () => {
		setIsOpen(false);
	};

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<div
				className={`absolute sm:relative z-20 w-64 bg-gray-800 text-gray-300 shadow-lg md:h-full flex-col justify-between ${
					isOpen ? "flex" : "hidden"
				} sm:flex`}
			>
				<div className="px-11 py-4">
					{/* Sidebar Header */}
					<div className="flex items-center h-16 ">
						<Image
							src="/images/logo.svg"
							alt="SmartFin Logo"
							width={60}
							height={60}
						/>
						<h2 className="ml-3 text-xl font-bold text-white">SmartFin</h2>
					</div>
					{/* Sidebar Links */}
					<nav className="mt-10 space-y-4">
						<Link
							href="/dashboard"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaTachometerAlt />
							<span>Dashboard</span>
						</Link>
						<Link
							href="/dashboard/transactions"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaFileInvoiceDollar />
							<span>Transactions</span>
						</Link>
						<Link
							href="#expenses"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaChartLine />
							<span>Expenses</span>
						</Link>
						<Link
							href="#contacts"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaPeopleArrows />
							<span>Contacts</span>
						</Link>
						<Link
							href="#products"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaBoxOpen />
							<span>Products & Services</span>
						</Link>
						<Link
							href="#accounting"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaReceipt />
							<span>Accounting</span>
						</Link>
						<Link
							href="#transactions"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaRobot />
							<span>AI Insights</span>
						</Link>
						<Link
							href="#pos"
							className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-700 transition-colors duration-200"
							onClick={handleLinkClick}
						>
							<FaToolbox />
							<span>Point of Sale</span>
						</Link>
					</nav>
				</div>
				{/* Bottom Icons */}
				<div className="px-8 border-t border-gray-700 py-3 flex justify-between">
					<FaBell className="text-white cursor-pointer" />
					<FaComments className="text-white cursor-pointer" />
					<FaCog className="text-white cursor-pointer" />
					<FaFolder className="text-white cursor-pointer" />
				</div>
			</div>

			{/* Mobile Sidebar Toggle Button */}
			<button
				className="absolute sm:hidden top-6 left-4 z-30 bg-gray-800 text-white p-2 rounded-full shadow-lg"
				onClick={() => sidebarHandler(!isOpen)}
				aria-label="Toggle Sidebar"
			>
				{isOpen ? <FaTimes /> : <FaBars />}
			</button>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black opacity-50 z-10 sm:hidden"
					onClick={() => sidebarHandler(false)}
				></div>
			)}
		</div>
	);
};

export default Sidebar;
