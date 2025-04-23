"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
	// i added the typewrite effect here
	const [text, setText] = useState("");
	const fullText = "  Simplify your business accounting with SmartFin";

	useEffect(() => {
		let index = 0;
		const interval = setInterval(() => {
			if (index < fullText.length - 1) {
				setText((prev) => prev + fullText[index]);
				index++;
			} else {
				clearInterval(interval);
			}
		}, 50);
		return () => clearInterval(interval);
	}, [fullText]);

	return (
		<section className="relative  bg-gradient-to-br from-white to-purple-50 p-8 md:p-16 flex flex-col md:flex-row items-center">
			{/* Text Content */}
			<div className="md:w-1/2 space-y-4 z--10">
				<div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-sm">
					🔥 AI-IN-ONE FINANCE TOOL
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-gray-900">{text}</h1>
				<p className="text-gray-700">
					Record transactions, manage finances, track inventory, and create
					reports—all in one place
				</p>
				<p className="italic text-gray-500">
					No more record books, no more errors, just time saved.
				</p>
				<div className="flex space-x-4">
					<Link href="/signup" passHref>
						<button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 animate-bounce">
							Get Started
						</button>
					</Link>
					<button className="px-6 py-3 bg-transparent text-gray-900 border border-gray-400 rounded-lg font-medium hover:border-gray-900">
						Book Demo
					</button>
				</div>
			</div>

			{/* Image Content for Desktop Only */}
			<div className="hidden md:flex md:w-1/2 relative justify-center">
				<div className="relative rounded overflow-hidden p-1">
					<Image
						src="/images/hero.png"
						alt="Person using a POS system"
						width={1000}
						height={1000}
						className="rounded-full"
					/>
					{/* Overlay Graph */}
					<div className="absolute z-10 top-0 left-10 bg-white p-4 rounded-lg shadow-lg transform -translate-x-8 translate-y-8">
						<h3 className="text-xs font-bold text-gray-600">Expenses</h3>
						<p className="text-xs text-gray-500">Last 7 days</p>
						<div className="mt-2 flex space-x-1">
							<div className="w-2 h-8 bg-gray-300 rounded"></div>
							<div className="w-2 h-10 bg-gray-300 rounded"></div>
							<div className="w-2 h-6 bg-gray-300 rounded"></div>
							<div className="w-2 h-8 bg-gray-300 rounded"></div>
							<div className="w-2 h-12 bg-orange-500 rounded"></div>
							<div className="w-2 h-6 bg-gray-300 rounded"></div>
						</div>
						<p className="text-xs text-green-500 mt-1">+0.5%</p>
					</div>
					{/* Overlay Text */}
					<div className="absolute z-10 bottom-4 right-4 bg-white py-1 px-3 rounded-full shadow-lg flex items-center space-x-2 text-xs font-semibold">
						<div className="w-2 h-2 bg-green-500 rounded-full"></div>
						<p>Invoice sent to Emmanuel Ekene</p>
					</div>
				</div>
			</div>

			{/* Mobile Background Image */}
			<div
				className="absolute z-10 inset-0 md:hidden bg-cover bg-center bg-no-repeat  opacity-10"
				style={{ backgroundImage: "url(/images/hero.png)" }}
			>
				{/* This is the background image. Replace 'mobile-background.jpg' with the path to your actual background image */}
			</div>
		</section>
	);
}
