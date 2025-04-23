"use client";
import { useState, useEffect, useCallback } from "react";
import {
	FaFileInvoiceDollar,
	FaChartPie,
	FaMoneyBillWave,
	FaFileAlt,
} from "react-icons/fa";

export default function AccountingPage() {
	const [reportType, setReportType] = useState("income");
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Extract fetchTransactions for reuse
	const fetchTransactions = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setError("User not authenticated. Please log in to continue.");
				setIsLoading(false);
				return;
			}

			const response = await fetch(`/api/mongodb-transactions?userId=${userId}`, {
				headers: {'Content-Type': 'application/json'},
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || data.error || response.statusText);

			setTransactions(data);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching transactions:", err);
			setError(`Failed to load financial data: ${err.message}`);
			setIsLoading(false);
		}
	}, []);

	// Initial fetch on mount
	useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

	// Listen for external transaction updates
	useEffect(() => {
		window.addEventListener('transactionsUpdated', fetchTransactions);
		return () => window.removeEventListener('transactionsUpdated', fetchTransactions);
	}, [fetchTransactions]);

	const handleReportChange = (type) => {
		setReportType(type);
	};

	// Calculate financial metrics from transactions
	const calculateFinancials = () => {
		// Initialize financial metrics
		const financials = {
			income: 0,
			expenses: 0,
			assets: 50000, // Starting with some default assets
			liabilities: 30000, // Starting with some default liabilities
			operatingCashFlow: 0,
			investingCashFlow: 0,
			financingCashFlow: 0
		};

		// Process each transaction
		transactions.forEach(transaction => {
			const amount = parseFloat(transaction.amount);
			
			// Categorize transactions based on their type/category
			if (transaction.category.toLowerCase().includes('income') || 
				transaction.category.toLowerCase().includes('revenue') ||
				transaction.category.toLowerCase().includes('sales')) {
				financials.income += amount;
				financials.operatingCashFlow += amount;
			} 
			else if (transaction.category.toLowerCase().includes('expense') || 
				transaction.category.toLowerCase().includes('bill') ||
				transaction.category.toLowerCase().includes('payment')) {
				financials.expenses += amount;
				financials.operatingCashFlow -= amount;
			}
			else if (transaction.category.toLowerCase().includes('investment')) {
				financials.investingCashFlow -= amount;
			}
			else if (transaction.category.toLowerCase().includes('loan') || 
				transaction.category.toLowerCase().includes('financing')) {
				financials.financingCashFlow += amount;
			}
		});

		return financials;
	};

	const financials = calculateFinancials();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Accounting Dashboard
			</h1>

			 {/* Summary Cards */}
			 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				{/* Income */}
				<div onClick={() => handleReportChange('income')} className="p-4 border rounded-lg shadow text-center bg-green-50 hover:bg-green-100 cursor-pointer">
					<h3 className="text-sm font-semibold text-gray-700">Total Income</h3>
					<p className="text-2xl font-bold text-green-600">₦{financials.income.toFixed(2)}</p>
				</div>
				{/* Expenses */}
				<div onClick={() => handleReportChange('income')} className="p-4 border rounded-lg shadow text-center bg-red-50 hover:bg-red-100 cursor-pointer">
					<h3 className="text-sm font-semibold text-gray-700">Total Expenses</h3>
					<p className="text-2xl font-bold text-red-600">₦{financials.expenses.toFixed(2)}</p>
				</div>
				{/* Balance */}
				<div onClick={() => handleReportChange('summary')} className="p-4 border rounded-lg shadow text-center bg-blue-50 hover:bg-blue-100 cursor-pointer">
					<h3 className="text-sm font-semibold text-gray-700">Balance</h3>
					<p className="text-2xl font-bold text-blue-600">₦{(financials.income - financials.expenses).toFixed(2)}</p>
				</div>
			</div>

			{/* Loading and Error States */}
			{isLoading && (
				<div className="text-center p-4">
					<p className="text-gray-600">Loading financial data...</p>
				</div>
			)}
			
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					<p>{error}</p>
				</div>
			)}

			{/* Report Navigation */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<button
					className={`flex items-center justify-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 text-sm md:text-base ${
						reportType === "income"
							? "bg-indigo-600 text-white"
							: "bg-gray-100 text-gray-800"
					}`}
					onClick={() => handleReportChange("income")}
				>
					<FaFileInvoiceDollar className="mr-2" />
					<span>Income Statement</span>
				</button>
				<button
					className={`flex items-center justify-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 text-sm md:text-base ${
						reportType === "balance"
							? "bg-indigo-600 text-white"
							: "bg-gray-100 text-gray-800"
					}`}
					onClick={() => handleReportChange("balance")}
				>
					<FaChartPie className="mr-2" />
					<span>Balance Sheet</span>
				</button>
				<button
					className={`flex items-center justify-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 text-sm md:text-base ${
						reportType === "cashflow"
							? "bg-indigo-600 text-white"
							: "bg-gray-100 text-gray-800"
					}`}
					onClick={() => handleReportChange("cashflow")}
				>
					<FaMoneyBillWave className="mr-2" />
					<span>Cash Flow</span>
				</button>
				<button
					className={`flex items-center justify-center p-4 rounded-lg shadow-md transition-transform hover:scale-105 text-sm md:text-base ${
						reportType === "summary"
							? "bg-indigo-600 text-white"
							: "bg-gray-100 text-gray-800"
					}`}
					onClick={() => handleReportChange("summary")}
				>
					<FaFileAlt className="mr-2" />
					<span>Summary Report</span>
				</button>
			</div>

			{/* Report Content */}
			{!isLoading && !error && (
				<div className="bg-white p-6 rounded-lg shadow-md">
					{reportType === "income" && <IncomeStatement financials={financials} transactions={transactions} />}
					{reportType === "balance" && <BalanceSheet financials={financials} />}
					{reportType === "cashflow" && <CashFlowStatement financials={financials} />}
					{reportType === "summary" && <SummaryReport financials={financials} transactions={transactions} />}
				</div>
			)}
		</div>
	);
}

// Income Statement Component
const IncomeStatement = ({ financials, transactions }) => {
	// Calculate net income
	const netIncome = financials.income - financials.expenses;
	
	// Get latest transactions for this report
	const recentTransactions = transactions
		.filter(t => t.category.toLowerCase().includes('income') || 
				t.category.toLowerCase().includes('expense') || 
				t.category.toLowerCase().includes('revenue'))
		.slice(0, 5);
	
	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Income Statement</h2>
			<p className="text-gray-600 mb-6">
				An income statement is a financial statement that shows your business's
				revenues and expenses during a specific period.
			</p>
			
			<div className="bg-gray-100 p-4 rounded-lg mb-6">
				<p className="text-gray-700 font-semibold mb-2">Revenue: ₦{financials.income.toFixed(2)}</p>
				<p className="text-gray-700 font-semibold mb-2">Expenses: ₦{financials.expenses.toFixed(2)}</p>
				<p className="text-gray-700 font-bold mb-0">Net Income: ₦{netIncome.toFixed(2)}</p>
			</div>
			
			{/* Recent Transactions */}
			<h3 className="text-lg font-semibold mb-3 mt-6">Recent Revenue & Expense Transactions</h3>
			{recentTransactions.length === 0 ? (
				<p className="text-gray-500">No recent income or expense transactions found.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white">
						<thead>
							<tr className="bg-gray-200 text-gray-700">
								<th className="py-2 px-4 text-left">Date</th>
								<th className="py-2 px-4 text-left">Description</th>
								<th className="py-2 px-4 text-left">Category</th>
								<th className="py-2 px-4 text-right">Amount</th>
							</tr>
						</thead>
						<tbody>
							{recentTransactions.map((transaction, index) => (
								<tr key={index} className="border-b border-gray-200">
									<td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
									<td className="py-2 px-4">{transaction.description}</td>
									<td className="py-2 px-4">{transaction.category}</td>
									<td className="py-2 px-4 text-right">₦{parseFloat(transaction.amount).toFixed(2)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

// Balance Sheet Component
const BalanceSheet = ({ financials }) => {
	// Calculate equity
	const equity = financials.assets - financials.liabilities;
	
	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Balance Sheet</h2>
			<p className="text-gray-600 mb-6">
				A balance sheet provides a snapshot of your business's financial condition
				at a specific moment in time.
			</p>
			
			<div className="bg-gray-100 p-4 rounded-lg">
				<p className="text-gray-700 font-semibold mb-2">Assets: ₦{financials.assets.toFixed(2)}</p>
				<p className="text-gray-700 font-semibold mb-2">Liabilities: ₦{financials.liabilities.toFixed(2)}</p>
				<p className="text-gray-700 font-bold mb-0">Equity: ₦{equity.toFixed(2)}</p>
			</div>
		</div>
	);
};

// Cash Flow Statement Component
const CashFlowStatement = ({ financials }) => {
	// Calculate net cash flow
	const netCashFlow = financials.operatingCashFlow + financials.investingCashFlow + financials.financingCashFlow;
	
	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				Cash Flow Statement
			</h2>
			<p className="text-gray-600 mb-6">
				A cash flow statement shows how changes in the balance sheet and income
				affect cash and cash equivalents.
			</p>
			
			<div className="bg-gray-100 p-4 rounded-lg">
				<p className="text-gray-700 font-semibold mb-2">Operating Cash Flow: ₦{financials.operatingCashFlow.toFixed(2)}</p>
				<p className="text-gray-700 font-semibold mb-2">Investing Cash Flow: ₦{financials.investingCashFlow.toFixed(2)}</p>
				<p className="text-gray-700 font-semibold mb-2">Financing Cash Flow: ₦{financials.financingCashFlow.toFixed(2)}</p>
				<p className="text-gray-700 font-bold mb-0">Net Cash Flow: ₦{netCashFlow.toFixed(2)}</p>
			</div>
		</div>
	);
};

// Summary Report Component
const SummaryReport = ({ financials, transactions }) => {
	// Calculate key financial metrics
	const netIncome = financials.income - financials.expenses;
	const grossProfit = financials.income * 0.7; // Simplified calculation
	
	// Get transaction activity
	const transactionCount = transactions.length;
	const lastTransactionDate = transactions.length > 0 
		? new Date(transactions[0].date).toLocaleDateString() 
		: 'N/A';
	
	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Summary</h2>
			<p className="text-gray-600 mb-6">
				A high-level summary of your company's overall financial performance.
			</p>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-gray-100 p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-3">Revenue & Profitability</h3>
					<p className="text-gray-700 mb-2">Total Revenue: ₦{financials.income.toFixed(2)}</p>
					<p className="text-gray-700 mb-2">Total Expenses: ₦{financials.expenses.toFixed(2)}</p>
					<p className="text-gray-700 mb-2">Gross Profit: ₦{grossProfit.toFixed(2)}</p>
					<p className="text-gray-700 font-bold">Net Profit: ₦{netIncome.toFixed(2)}</p>
				</div>
				
				<div className="bg-gray-100 p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-3">Activity Summary</h3>
					<p className="text-gray-700 mb-2">Total Transactions: {transactionCount}</p>
					<p className="text-gray-700 mb-2">Last Transaction Date: {lastTransactionDate}</p>
					<p className="text-gray-700 mb-2">Cash Position: ₦{(financials.assets - financials.liabilities).toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
};
