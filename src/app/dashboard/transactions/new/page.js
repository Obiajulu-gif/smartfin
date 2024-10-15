"use client";
import { useState } from "react";
import {
	FaArrowCircleDown,
	FaArrowCircleUp,
	FaDollarSign,
	FaCalendarAlt,
	FaFileInvoiceDollar,
	FaUserTie,
} from "react-icons/fa";

const TransactionForm = () => {
	const [transactionType, setTransactionType] = useState("in");

	// Handler to toggle between Money In and Money Out
	const handleToggle = (type) => {
		setTransactionType(type);
	};

	return (
		<div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
			<div className="flex space-x-4 mb-6">
				{/* Toggle Buttons */}
				<button
					onClick={() => handleToggle("in")}
					className={`flex items-center px-4 py-2 ${
						transactionType === "in"
							? "bg-indigo-600 text-white"
							: "bg-gray-200 text-gray-600"
					} rounded-md`}
				>
					<FaArrowCircleUp className="mr-2" /> Money In
				</button>
				<button
					onClick={() => handleToggle("out")}
					className={`flex items-center px-4 py-2 ${
						transactionType === "out"
							? "bg-indigo-600 text-white"
							: "bg-gray-200 text-gray-600"
					} rounded-md`}
				>
					<FaArrowCircleDown className="mr-2" /> Money Out
				</button>
			</div>

			<div>
				{/* Money In Form */}
				{transactionType === "in" && (
					<form className="space-y-4">
						<h3 className="text-lg font-semibold mb-4">
							Transaction ID: 123456
						</h3>
						<div>
							<label className="block mb-2">Choose Transaction Type</label>
							<select className="w-full p-2 border rounded">
								<option>Sales</option>
								<option>Other</option>
							</select>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaFileInvoiceDollar className="mr-2" /> Product/Service Name
							</label>
							<input
								type="text"
								placeholder="Input Product/Service name"
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaDollarSign className="mr-2" /> Selling Price
							</label>
							<input
								type="number"
								placeholder="0.00"
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaFileInvoiceDollar className="mr-2" /> Quantity
							</label>
							<input
								type="number"
								placeholder="1"
								className="w-full p-2 border rounded"
							/>
						</div>
						<button className="w-full mt-4 py-2 bg-blue-600 text-white rounded">
							Create Transaction
						</button>
					</form>
				)}

				{/* Money Out Form */}
				{transactionType === "out" && (
					<form className="space-y-4">
						<h3 className="text-lg font-semibold mb-4">
							Transaction ID: 123456
						</h3>
						<div>
							<label className="block mb-2">Choose Expense Type</label>
							<select className="w-full p-2 border rounded">
								<option>Expenses</option>
								<option>Other</option>
							</select>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaUserTie className="mr-2" /> Vendor Name
							</label>
							<input
								type="text"
								placeholder="Enter vendor name"
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block mb-2">Description</label>
							<textarea
								placeholder="Enter description"
								className="w-full p-2 border rounded"
							></textarea>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaDollarSign className="mr-2" /> Amount
							</label>
							<input
								type="number"
								placeholder="0.00"
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block mb-2 flex items-center">
								<FaCalendarAlt className="mr-2" /> Date
							</label>
							<input type="date" className="w-full p-2 border rounded" />
						</div>
						<button className="w-full mt-4 py-2 bg-blue-600 text-white rounded">
							Create Transaction
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default TransactionForm;
