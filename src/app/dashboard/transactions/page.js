"use client";
import { useState } from "react";
import Link from "next/link";
import { MdNoAccounts } from "react-icons/md";

const Transactions = () => {
	// State for search and filter
	const [search, setSearch] = useState("");
	const [dateRange, setDateRange] = useState("This month");
	const [date, setDate] = useState("");
	const [type, setType] = useState("All");
	const [subtype, setSubtype] = useState("All");
	const [channel, setChannel] = useState("All");
	const [staff, setStaff] = useState("All");
	const [paymentMethod, setPaymentMethod] = useState("All");
	const [tag, setTag] = useState("");

	return (
		<div className="p-6 bg-white">
			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				{["Sales", "Purchases", "Expenses", "Account Balances"].map((label) => (
					<div
						key={label}
						className="p-4 border rounded-lg shadow-sm text-center bg-gray-50"
					>
						<h3 className="text-sm font-semibold text-gray-600">{label}</h3>
						<p className="text-lg font-bold text-gray-900">₦0.00</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<input
					type="text"
					placeholder="Search transactions..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="p-2 border rounded"
				/>
				<select
					value={dateRange}
					onChange={(e) => setDateRange(e.target.value)}
					className="p-2 border rounded"
				>
					<option>This month</option>
					<option>Last month</option>
					<option>Custom</option>
				</select>
				<input
					type="text"
					placeholder="Select date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="p-2 border rounded"
				/>
				{/* Additional Filters */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3 text-indigo-600">
					<select
						value={type}
						onChange={(e) => setType(e.target.value)}
						className="p-2 border rounded"
					>
						<option>All</option>
						<option>Income</option>
						<option>Expense</option>
					</select>
					<select
						value={subtype}
						onChange={(e) => setSubtype(e.target.value)}
						className="p-2 border rounded"
					>
						<option>All</option>
						<option>Type 1</option>
						<option>Type 2</option>
					</select>
					<select
						value={channel}
						onChange={(e) => setChannel(e.target.value)}
						className="p-2 border rounded"
					>
						<option>All</option>
						<option>Online</option>
						<option>Offline</option>
					</select>
					<select
						value={staff}
						onChange={(e) => setStaff(e.target.value)}
						className="p-2 border rounded"
					>
						<option>All</option>
						<option>Staff 1</option>
						<option>Staff 2</option>
					</select>
					<select
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
						className="p-2 border rounded"
					>
						<option>All</option>
						<option>Cash</option>
						<option>Credit</option>
					</select>
					<input
						type="text"
						placeholder="Select tag"
						value={tag}
						onChange={(e) => setTag(e.target.value)}
						className="p-2 border rounded"
					/>
				</div>
			</div>

			{/* No Transaction Message */}
			<div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg bg-gray-50">
				<MdNoAccounts className="mb-4 w-24 h-24 text-gray-500" />
				<p className="text-gray-500">No transaction recorded</p>

				<Link href="/dashboard/transactions/new">
					<button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-400 text-white rounded-lg">
						+ Add transaction
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Transactions;
