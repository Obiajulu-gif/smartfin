"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { calculateMonthlyTrends } from '../../lib/financialCalculations';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaBell, FaInfoCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

export default function DashboardPage() {
	const [userName, setUserName] = useState("");
	const [transactions, setTransactions] = useState([]);
	const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
	const [notifications, setNotifications] = useState([]);
	const [notifLoading, setNotifLoading] = useState(true);
	const [monthlyTrends, setMonthlyTrends] = useState([]);
	const [chartLoading, setChartLoading] = useState(true);

	useEffect(() => {
		// Retrieve user session from localStorage
		const userSession = JSON.parse(localStorage.getItem("userName"));
		if (userSession && userSession.displayName) {
			setUserName(userSession.displayName);
		} else {
			setUserName("User"); // Default fallback if no name is found
		}
	}, []);

	useEffect(() => {
		// Fetch transactions for summary
		const fetchTransactions = async () => {
			setChartLoading(true);
			const userId = localStorage.getItem("localId");
			if (!userId) return;
			try {
				const res = await fetch(`/api/mongodb-transactions?userId=${userId}`, {
					headers: { 'Content-Type': 'application/json' }
				});
				const data = await res.json();
				if (res.ok) {
					setTransactions(data);
					// calculate summary
					let inc = 0, exp = 0;
					data.forEach(t => {
						const amt = parseFloat(t.amount) || 0;
						if (t.type === 'income' || (t.category && t.category.toLowerCase().includes('income'))) {
							inc += amt;
						} else {
							exp += amt;
						}
					});
					setSummary({ income: inc, expenses: exp, balance: inc - exp });
					
					// Calculate monthly trends for chart
					if (data?.length) {
						// Process transactions for monthly trends - properly identifying income vs expenses
						const processedData = data.map(t => ({
							...t,
							type: t.type || (t.category && t.category.toLowerCase().includes('income') ? 'income' : 'expense'),
							amount: parseFloat(t.amount) || 0,
							date: t.date || new Date().toISOString()
						}));
						
						setMonthlyTrends(calculateMonthlyTrends(processedData, 6));
					} else {
						// Create sample data if no transactions exist
						const sampleData = generateSampleMonthlyData(6);
						setMonthlyTrends(sampleData);
					}
				}
			} catch (error) {
				console.error("Error fetching transactions:", error);
				// Create fallback data on error
				const sampleData = generateSampleMonthlyData(6);
				setMonthlyTrends(sampleData);
			} finally {
				setChartLoading(false);
			}
		};
		
		fetchTransactions();
		// listen for updates
		window.addEventListener('transactionsUpdated', fetchTransactions);
		return () => window.removeEventListener('transactionsUpdated', fetchTransactions);
	}, []);

	// Generate sample monthly data for empty states
	const generateSampleMonthlyData = (months) => {
		const now = new Date();
		const result = [];
		
		for (let i = 0; i < months; i++) {
			const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const monthName = monthNames[monthDate.getMonth()];
			
			result.unshift({
				month: monthName,
				income: '0.00',
				expenses: '0.00',
				balance: '0.00'
			});
		}
		
		return result;
	};

	// Fetch adaptive notifications
	useEffect(() => {
		const fetchNotifications = async () => {
			setNotifLoading(true);
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setNotifications([{
					id: 'auth-required',
					message: 'Please log in to see your personalized notifications.',
					type: 'info'
				}]);
				setNotifLoading(false);
				return;
			}
			try {
				const res = await fetch(`/api/notifications?userId=${userId}`);
				const json = await res.json();
				if (res.ok) setNotifications(json);
			} catch (error) {
				console.error("Error fetching notifications:", error);
				setNotifications([{
					id: 'error',
					message: 'Unable to load notifications. Please try again later.',
					type: 'alert'
				}]);
			} finally {
				setNotifLoading(false);
			}
		};
		fetchNotifications();
		
		// Set up a timer to refresh notifications every 5 minutes
		const notificationTimer = setInterval(fetchNotifications, 5 * 60 * 1000);
		
		// Clean up the timer when component unmounts
		return () => clearInterval(notificationTimer);
	}, []);

	// Custom tooltip for the chart
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded shadow-md">
					<p className="font-semibold text-gray-700">{label}</p>
					<p className="text-green-600">Income: ₦{payload[0].value}</p>
					<p className="text-red-600">Expenses: ₦{payload[1].value}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="container mx-auto p-8 ">
			{/* Financial Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div className="p-4 border rounded-lg shadow text-center bg-green-50 hover:bg-green-100 cursor-pointer" onClick={() => window.location.href = '/dashboard/accounting'}>
					<h3 className="text-sm font-semibold text-gray-700">Total Income</h3>
					<p className="text-2xl font-bold text-green-600">₦{summary.income.toFixed(2)}</p>
				</div>
				<div className="p-4 border rounded-lg shadow text-center bg-red-50 hover:bg-red-100 cursor-pointer" onClick={() => window.location.href = '/dashboard/accounting'}>
					<h3 className="text-sm font-semibold text-gray-700">Total Expenses</h3>
					<p className="text-2xl font-bold text-red-600">₦{summary.expenses.toFixed(2)}</p>
				</div>
				<div className="p-4 border rounded-lg shadow text-center bg-blue-50 hover:bg-blue-100 cursor-pointer" onClick={() => window.location.href = '/dashboard/accounting'}>
					<h3 className="text-sm font-semibold text-gray-700">Balance</h3>
					<p className="text-2xl font-bold text-blue-600">₦{summary.balance.toFixed(2)}</p>
				</div>
			</div>

			{/* Notifications Section */}
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-700 flex items-center">
						<FaBell className="mr-2 text-indigo-500" /> Notifications
					</h3>
					{notifLoading ? (
						<div className="animate-pulse flex items-center">
							<FaInfoCircle className="text-indigo-500 mr-1" />
							<span className="text-sm text-gray-500">Refreshing...</span>
						</div>
					) : (
						<span className="text-xs text-gray-500">
							{notifications.length} notification{notifications.length !== 1 ? 's' : ''}
						</span>
					)}
				</div>
				{notifications.length === 0 && !notifLoading ? (
					<div className="text-center py-6">
						<p className="text-gray-500">No new notifications.</p>
						<p className="text-gray-400 text-sm mt-1">Add transactions to get personalized insights.</p>
					</div>
				) : (
					<ul className="space-y-3 max-h-60 overflow-y-auto">
						{notifications.map(n => (
							<li 
								key={n.id} 
								className={`p-3 rounded-lg flex items-start border-l-4 ${
									n.type === 'alert' 
										? 'border-l-red-500 bg-red-50' 
										: n.type === 'insight' 
											? 'border-l-yellow-500 bg-yellow-50' 
											: 'border-l-blue-500 bg-blue-50'
								} hover:shadow-sm transition-shadow`}
							>
								{n.type === 'alert' 
									? <FaExclamationTriangle className="text-red-500 mr-2 mt-1"/> 
									: n.type === 'insight'
										? <FaLightbulb className="text-yellow-500 mr-2 mt-1"/>
										: <FaInfoCircle className="text-blue-500 mr-2 mt-1"/>}
								<div>
									<p className="text-gray-700">{n.message}</p>
									{n.timestamp && (
										<p className="text-xs text-gray-500 mt-1">
											{new Date(n.timestamp).toLocaleString()}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Monthly Trends Chart */}
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Income vs Expenses</h3>
				{chartLoading ? (
					<div className="flex justify-center items-center h-48">
						<p className="text-gray-500">Loading chart data...</p>
					</div>
				) : monthlyTrends.length > 0 ? (
					<ResponsiveContainer width="100%" height={250}>
						<LineChart data={monthlyTrends}>
							<XAxis dataKey="month" stroke="#6B7280" />
							<YAxis stroke="#6B7280" />
							<Tooltip content={<CustomTooltip />} />
							<Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
							<Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className="flex justify-center items-center h-48">
						<p className="text-gray-500">No transaction data available to display chart.</p>
					</div>
				)}
			</div>

			<h2 className="text-2xl font-bold text-gray-800 mb-2 text-center ">
				Welcome, {userName}
			</h2>
			<p className="text-gray-600 mb-8 text-center">
				What would you like to do with SmartFin today?
			</p>

			{/* Transactions Card */}
			<div className="border border-gray-200 rounded-lg mb-6 shadow-sm p-6 flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">
						Transactions
					</h3>
					<h4 className="text-xl font-semibold text-gray-800">
						Record Daily Transactions
					</h4>
					<p className="text-gray-600">
						Getting insights out of your business activities with SmartFin
						starts here.
					</p>
				</div>
				<Link href="/dashboard/transactions/new">
					<button className="px-4 py-2 border border-indigo-500 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
						Transact
					</button>
				</Link>
			</div>

			{/* Inventory Card */}
			<div className="border border-gray-200 rounded-lg shadow-sm p-6 flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Inventory</h3>
					<h4 className="text-xl font-semibold text-gray-800">
						Know your Business
					</h4>
					<p className="text-gray-600">
						Your business is as good as your inventory; manage it best with
						SmartFin.
					</p>
				</div>
				<button className="px-4 py-2 border border-indigo-500 text-white rounded-lg hover:bg-indigo-400">
					Manage
				</button>
			</div>
		</div>
	);
}