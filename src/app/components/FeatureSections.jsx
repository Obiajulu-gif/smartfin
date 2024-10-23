// components/FeatureSections.js
"use client";
import Image from "next/image";
import {
	FaFilePdf,
	FaPaperPlane,
	FaChartPie,
	FaClipboardList,
} from "react-icons/fa";

export default function FeatureSections() {
	return (
		<section className="bg-gray-50 py-16 px-8 md:px-24 space-y-16">
			{/* Invoicing Section */}
			<div className="flex flex-col md:flex-row items-center md:space-x-8">
				<div className="md:w-1/2 mb-8 md:mb-0">
					<div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
						<Image
							src="/images/laptop.png" // Replace with your actual image path
							alt="SmartFin Invoice on Laptop and Mobile"
							width={500}
							height={400}
							className="w-full rounded-lg"
						/>
					</div>
					<div className="flex justify-around mt-4">
						<div className="text-center">
							<FaFilePdf className="text-2xl text-gray-600" />
							<p>Save as PDF</p>
						</div>
						<div className="text-center">
							<FaPaperPlane className="text-2xl text-gray-600" />
							<p>Send Invoice</p>
						</div>
					</div>
				</div>
				<div className="md:w-1/2 text-left">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Create and send professional invoices to your customers
					</h2>
					<p className="text-gray-600 mb-4">
						Simplify your invoicing with SmartFin. Generate and send invoices
						instantly to keep your cash flow healthy and up-to-date.
					</p>
					<ul className="text-gray-600 list-disc list-inside mb-8">
						<li>Multiple reminders at one click</li>
						<li>Share payment reminders via email, WhatsApp & SMS</li>
						<li>Up to 50% reduction in payment delays</li>
						<li>Avoid cash flow issues due to delayed payments</li>
					</ul>
					<button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
						Learn More
					</button>
				</div>
			</div>

			{/* Expense Tracking Section */}
			<div className="flex flex-col md:flex-row items-center md:space-x-8">
				<div className="md:w-1/2 text-left md:order-1">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Track, manage, and control your expenses
					</h2>
					<p className="text-gray-600 mb-4">
						Gain control over your spending with SmartFin's intuitive expense
						tracking. Record and track all expenses from one location.
					</p>
					<ul className="text-gray-600 list-disc list-inside mb-8">
						<li>Record expenses, from office supplies to utility bills</li>
						<li>Generate detailed reports to analyze spending patterns</li>
					</ul>
				</div>
				<div className="md:w-1/2 mb-8 md:mb-0 md:order-2">
					<div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
						<Image
							src="/images/track.png" // Replace with your actual image path
							alt="SmartFin Expense Tracking on Tablet"
							width={500}
							height={400}
							className="w-full rounded-lg"
						/>
					</div>
				</div>
			</div>

			{/* Business Growth Section */}
			<div className="flex flex-col md:flex-row items-center md:space-x-8">
				<div className="md:w-1/2 mb-8 md:mb-0">
					<div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center">
						<Image
							src="/images/tablet.png"
							alt="SmartFin Business Growth on Mobile"
							width={500}
							height={400}
							className="w-full rounded-lg"
						/>
					</div>
				</div>
				<div className="md:w-1/2 text-left">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Record, track and grow your business
					</h2>
					<p className="text-gray-600 mb-4">
						Use SmartFin's powerful tools to keep track of all aspects of your
						business. Make informed decisions based on detailed reports and
						insights.
					</p>
					<ul className="text-gray-600 list-disc list-inside mb-8">
						<li>Create Sales Invoices, Orders, and Receipts</li>
						<li>Track Expenses, Purchases, and Payments</li>
						<li>Manage other inflows like investments and loans</li>
					</ul>
					<button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
						Learn More
					</button>
				</div>
			</div>
		</section>
	);
}
