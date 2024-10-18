"use client";
import { useState } from "react";
import {
	FaFileInvoiceDollar,
	FaChartPie,
	FaMoneyBillWave,
	FaFileAlt,
} from "react-icons/fa";

export default function AccountingPage() {
	const [reportType, setReportType] = useState("income");

	const handleReportChange = (type) => {
		setReportType(type);
	};

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Accounting Dashboard
			</h1>

			{/* Report Navigation */}
			<div className="flex justify-center space-x-4 mb-8">
				<button
					className={`flex items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
						reportType === "income" ? "bg-indigo-600 text-white" : "bg-gray-100"
					}`}
					onClick={() => handleReportChange("income")}
				>
					<FaFileInvoiceDollar className="mr-2" />
					Income Statement
				</button>
				<button
					className={`flex items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
						reportType === "balance"
							? "bg-indigo-600 text-white"
							: "bg-gray-100"
					}`}
					onClick={() => handleReportChange("balance")}
				>
					<FaChartPie className="mr-2" />
					Balance Sheet
				</button>
				<button
					className={`flex items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
						reportType === "cashflow"
							? "bg-indigo-600 text-white"
							: "bg-gray-100"
					}`}
					onClick={() => handleReportChange("cashflow")}
				>
					<FaMoneyBillWave className="mr-2" />
					Cash Flow
				</button>
				<button
					className={`flex items-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
						reportType === "summary"
							? "bg-indigo-600 text-white"
							: "bg-gray-100"
					}`}
					onClick={() => handleReportChange("summary")}
				>
					<FaFileAlt className="mr-2" />
					Summary Report
				</button>
			</div>

			{/* Report Content */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				{reportType === "income" && <IncomeStatement />}
				{reportType === "balance" && <BalanceSheet />}
				{reportType === "cashflow" && <CashFlowStatement />}
				{reportType === "summary" && <SummaryReport />}
			</div>
		</div>
	);
}

// Income Statement Component
const IncomeStatement = () => (
	<div>
		<h2 className="text-2xl font-bold text-gray-800 mb-4">Income Statement</h2>
		<p className="text-gray-600 mb-6">
			An income statement is a financial statement that shows your business's
			revenues and expenses during a specific period.
		</p>
		{/* Placeholder for real data */}
		<div className="bg-gray-100 p-4 rounded-lg">
			<p className="text-gray-500">Revenue: $20,000</p>
			<p className="text-gray-500">Expenses: $12,000</p>
			<p className="text-gray-500">Net Income: $8,000</p>
		</div>
	</div>
);

// Balance Sheet Component
const BalanceSheet = () => (
	<div>
		<h2 className="text-2xl font-bold text-gray-800 mb-4">Balance Sheet</h2>
		<p className="text-gray-600 mb-6">
			A balance sheet provides a snapshot of your business's financial condition
			at a specific moment in time.
		</p>
		{/* Placeholder for real data */}
		<div className="bg-gray-100 p-4 rounded-lg">
			<p className="text-gray-500">Assets: $50,000</p>
			<p className="text-gray-500">Liabilities: $30,000</p>
			<p className="text-gray-500">Equity: $20,000</p>
		</div>
	</div>
);

// Cash Flow Statement Component
const CashFlowStatement = () => (
	<div>
		<h2 className="text-2xl font-bold text-gray-800 mb-4">
			Cash Flow Statement
		</h2>
		<p className="text-gray-600 mb-6">
			A cash flow statement shows how changes in the balance sheet and income
			affect cash and cash equivalents.
		</p>
		{/* Placeholder for real data */}
		<div className="bg-gray-100 p-4 rounded-lg">
			<p className="text-gray-500">Operating Cash Flow: $10,000</p>
			<p className="text-gray-500">Investing Cash Flow: -$5,000</p>
			<p className="text-gray-500">Financing Cash Flow: $2,000</p>
			<p className="text-gray-500">Net Cash Flow: $7,000</p>
		</div>
	</div>
);

// Summary Report Component
const SummaryReport = () => (
	<div>
		<h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Summary</h2>
		<p className="text-gray-600 mb-6">
			A high-level summary of your company's overall financial performance.
		</p>
		{/* Placeholder for real data */}
		<div className="bg-gray-100 p-4 rounded-lg">
			<p className="text-gray-500">Total Revenue: $100,000</p>
			<p className="text-gray-500">Total Expenses: $80,000</p>
			<p className="text-gray-500">Net Profit: $20,000</p>
		</div>
	</div>
);
