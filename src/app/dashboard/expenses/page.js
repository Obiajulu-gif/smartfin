"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaEdit, FaExchangeAlt, FaShoppingCart, FaHome, FaUtensils, FaCar, FaPlane, FaLaptop, FaMedkit, FaTshirt, FaGraduationCap, FaMoneyBillWave, FaGamepad } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";
import { BsFillGridFill } from "react-icons/bs";

// Predefined expense categories with icons and colors
const EXPENSE_CATEGORIES = [
	{ id: "food", name: "Food & Dining", icon: <FaUtensils />, color: "bg-orange-100 text-orange-600 border-orange-200" },
	{ id: "groceries", name: "Groceries", icon: <FaShoppingCart />, color: "bg-green-100 text-green-600 border-green-200" },
	{ id: "housing", name: "Housing", icon: <FaHome />, color: "bg-blue-100 text-blue-600 border-blue-200" },
	{ id: "transportation", name: "Transportation", icon: <FaCar />, color: "bg-indigo-100 text-indigo-600 border-indigo-200" },
	{ id: "entertainment", name: "Entertainment", icon: <FaGamepad />, color: "bg-purple-100 text-purple-600 border-purple-200" },
	{ id: "travel", name: "Travel", icon: <FaPlane />, color: "bg-teal-100 text-teal-600 border-teal-200" },
	{ id: "technology", name: "Technology", icon: <FaLaptop />, color: "bg-gray-100 text-gray-600 border-gray-200" },
	{ id: "healthcare", name: "Healthcare", icon: <FaMedkit />, color: "bg-red-100 text-red-600 border-red-200" },
	{ id: "clothing", name: "Clothing", icon: <FaTshirt />, color: "bg-pink-100 text-pink-600 border-pink-200" },
	{ id: "education", name: "Education", icon: <FaGraduationCap />, color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
	{ id: "business", name: "Business", icon: <MdBusiness />, color: "bg-cyan-100 text-cyan-600 border-cyan-200" },
	{ id: "fastfood", name: "Fast Food", icon: <IoFastFood />, color: "bg-amber-100 text-amber-600 border-amber-200" },
	{ id: "investing", name: "Investing", icon: <FaMoneyBillWave />, color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
	{ id: "other", name: "Other", icon: <BsFillGridFill />, color: "bg-slate-100 text-slate-600 border-slate-200" },
];

export default function ExpensesPage() {
	const [expenses, setExpenses] = useState([]);
	const [form, setForm] = useState({
		name: "",
		category: "",
		amount: "",
		date: "",
	});
	const [editingId, setEditingId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [notification, setNotification] = useState({ message: "", type: "" });
	const [converting, setConverting] = useState(false);
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
	const [customCategory, setCustomCategory] = useState("");

	// Fetch expenses from MongoDB when component mounts
	useEffect(() => {
		fetchExpenses();
	}, []);

	// Function to fetch all expenses from MongoDB
	const fetchExpenses = async () => {
		setIsLoading(true);
		try {
			// Get userId from localStorage (assuming it's stored there after login)
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setError("User not authenticated. Please log in.");
				setIsLoading(false);
				return;
			}

			const response = await fetch(`/api/mongodb-expenses?userId=${userId}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || errorData.error || "Failed to fetch expenses");
			}

			const data = await response.json();
			setExpenses(data);
		} catch (err) {
			console.error("Error fetching expenses:", err);
			setError(err.message || "Failed to load expenses");
		} finally {
			setIsLoading(false);
		}
	};

	// Handle form input change
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Handle category selection
	const handleCategorySelect = (categoryName) => {
		setForm({ ...form, category: categoryName });
		setShowCategoryDropdown(false);
	};

	// Handle custom category input
	const handleCustomCategoryChange = (e) => {
		setCustomCategory(e.target.value);
	};

	// Handle custom category submission
	const handleCustomCategorySubmit = () => {
		if (customCategory.trim()) {
			setForm({ ...form, category: customCategory.trim() });
			setCustomCategory("");
			setShowCategoryDropdown(false);
		}
	};

	// Add or edit an expense
	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			// Get userId from localStorage
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setError("User not authenticated. Please log in.");
				return;
			}

			if (editingId !== null) {
				// Editing an existing expense
				const response = await fetch("/api/mongodb-expenses", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						...form,
						userId,
						id: editingId
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || errorData.error || "Failed to update expense");
				}

				setNotification({
					message: "Expense updated successfully!",
					type: "success"
				});
				setEditingId(null);
			} else {
				// Adding a new expense
				const response = await fetch("/api/mongodb-expenses", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						...form,
						userId
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || errorData.error || "Failed to add expense");
				}

				setNotification({
					message: "Expense added successfully!",
					type: "success"
				});
			}
			
			// Reset form and refresh expenses
			setForm({ name: "", category: "", amount: "", date: "" });
			fetchExpenses();
		} catch (err) {
			console.error("Error saving expense:", err);
			setNotification({
				message: err.message || "Failed to save expense",
				type: "error"
			});
		}
	};

	// Find the category object for a given category name
	const getCategoryByCatName = (catName) => {
		return EXPENSE_CATEGORIES.find(cat => cat.name === catName) || 
				EXPENSE_CATEGORIES.find(cat => catName && catName.includes(cat.name)) || 
				EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]; // Default to "Other"
	};

	// Handle expense deletion
	const handleDelete = async (id) => {
		try {
			// Get userId from localStorage
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setError("User not authenticated. Please log in.");
				return;
			}

			const response = await fetch(`/api/mongodb-expenses?id=${id}&userId=${userId}`, {
				method: "DELETE"
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || errorData.error || "Failed to delete expense");
			}

			setNotification({
				message: "Expense deleted successfully!",
				type: "success"
			});
			
			// Refresh expenses list
			fetchExpenses();
		} catch (err) {
			console.error("Error deleting expense:", err);
			setNotification({
				message: err.message || "Failed to delete expense",
				type: "error"
			});
		}
	};

	// Handle expense edit
	const handleEdit = (expense) => {
		setForm({
			name: expense.name,
			category: expense.category,
			amount: expense.amount.toString(),
			date: new Date(expense.date).toISOString().split('T')[0]
		});
		setEditingId(expense._id);
	};

	// Handle converting an expense to a transaction
	const handleConvertToTransaction = async (expense) => {
		setConverting(true);
		try {
			// Get userId from localStorage
			const userId = localStorage.getItem("localId");
			if (!userId) {
				setError("User not authenticated. Please log in.");
				return;
			}

			// Create a new transaction from the expense data
			const transactionData = {
				userId,
				amount: expense.amount,
				category: expense.category,
				description: expense.name, // Use expense name as the description
				date: new Date(expense.date).toISOString()
			};

			// Send request to create a new transaction
			const response = await fetch("/api/mongodb-transactions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(transactionData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || errorData.error || "Failed to convert expense to transaction");
			}

			setNotification({
				message: "Expense successfully converted to transaction!",
				type: "success"
			});

			// Refresh the expenses list to reflect conversion
			fetchExpenses();

			// Notify transactions page to refresh
			window.dispatchEvent(new Event('transactionsUpdated'));

		} catch (err) {
			console.error("Error converting expense to transaction:", err);
			setNotification({
				message: err.message || "Failed to convert expense to transaction",
				type: "error"
			});
		} finally {
			setConverting(false);
		}
	};

	// Clear notification after 3 seconds
	useEffect(() => {
		if (notification.message) {
			const timer = setTimeout(() => {
				setNotification({ message: "", type: "" });
			}, 3000);
			
			return () => clearTimeout(timer);
		}
	}, [notification]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Manage Expenses
			</h1>

			{/* Notification Banner */}
			{notification.message && (
				<div className={`p-4 mb-4 rounded-lg ${
					notification.type === "success"
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700"
				}`}>
					{notification.message}
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			)}

			{/* Expense Form */}
			<div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">
					{editingId !== null ? "Edit Expense" : "Add Expense"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="expense-name" className="block text-sm font-medium text-gray-700">Expense Name</label>
						<input
							id="expense-name"
							type="text"
							name="name"
							placeholder="What did you spend on?"
							value={form.name}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							required
						/>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="category-display" className="block text-sm font-medium text-gray-700">Category</label>
						<div className="relative">
							<div 
								id="category-display"
								onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
								className={`flex items-center justify-between w-full p-3 border ${form.category ? 
									(getCategoryByCatName(form.category).color.split(' ').slice(0, 2).join(' ') + ' border-' + getCategoryByCatName(form.category).color.split('border-')[1]) : 
									'border-gray-300'} rounded-lg cursor-pointer`}
							>
								<div className="flex items-center">
									{form.category ? (
										<>
											<span className="mr-2">{getCategoryByCatName(form.category).icon}</span>
											<span>{form.category}</span>
										</>
									) : (
										<span className="text-gray-500">Select a category</span>
									)}
								</div>
								<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</div>
							
							{/* Category Dropdown */}
							{showCategoryDropdown && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
									<div className="p-2 grid grid-cols-1 gap-1">
										{EXPENSE_CATEGORIES.map(category => (
											<button
												key={category.id}
												type="button"
												onClick={() => handleCategorySelect(category.name)}
												className={`flex items-center p-2 hover:bg-gray-100 rounded text-left ${category.color}`}
											>
												<span className="mr-2">{category.icon}</span>
												<span>{category.name}</span>
											</button>
										))}
										
										{/* Custom category option */}
										<div className="border-t border-gray-200 mt-1 pt-2">
											<div className="flex items-center p-2">
												<input
													type="text"
													value={customCategory}
													onChange={handleCustomCategoryChange}
													placeholder="Enter custom category"
													className="flex-1 p-1 border border-gray-300 rounded mr-2"
													onClick={(e) => e.stopPropagation()}
												/>
												<button
													type="button"
													onClick={handleCustomCategorySubmit}
													className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
												>
													Add
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
							
							{/* Hidden input for form submission */}
							<input
								type="hidden"
								name="category"
								value={form.category}
								required
							/>
						</div>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700">Amount</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
							<input
								id="expense-amount"
								type="number"
								name="amount"
								placeholder="0.00"
								step="0.01"
								min="0"
								value={form.amount}
								onChange={handleChange}
								className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								required
							/>
						</div>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="expense-date" className="block text-sm font-medium text-gray-700">Date</label>
						<input
							id="expense-date"
							type="date"
							name="date"
							value={form.date}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							required
						/>
					</div>
					
					<button
						type="submit"
						className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{editingId !== null ? (
							<FaEdit className="mr-2" />
						) : (
							<FaPlus className="mr-2" />
						)}
						{editingId !== null ? "Update Expense" : "Add Expense"}
					</button>
				</form>
			</div>

			{/* Expense List */}
			<div className="mt-8 max-w-4xl mx-auto">
				<h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
				{isLoading ? (
					<div className="text-center p-4">
						<p className="text-gray-500">Loading expenses...</p>
					</div>
				) : expenses.length === 0 ? (
					<p className="text-gray-500 text-center p-8 bg-white rounded-lg shadow-sm">No expenses recorded yet.</p>
				) : (
					<ul className="space-y-4">
						{expenses.map((expense) => {
							const category = getCategoryByCatName(expense.category);
							return (
							<li
								key={expense._id}
								className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-center">
									<div className="flex items-start space-x-3">
										<div className={`p-2 rounded-full ${category.color} flex-shrink-0`}>
											{category.icon}
										</div>
										<div>
											<h3 className="text-lg font-bold">{expense.name}</h3>
											<p className={`text-sm ${category.color.split(' ')[1]}`}>
												{expense.category}
											</p>
											<p className="text-sm text-gray-500">
												{new Date(expense.date).toLocaleDateString('en-US', { 
													year: 'numeric', 
													month: 'short', 
													day: 'numeric' 
												})}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end">
										<p className="text-xl font-semibold text-indigo-600 mb-2">
											${expense.amount.toFixed(2)}
										</p>
										<div className="flex space-x-2">
											<button
												onClick={() => handleConvertToTransaction(expense)}
												disabled={converting}
												className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
												title="Convert to Transaction"
											>
												<FaExchangeAlt />
											</button>
											<button
												onClick={() => handleEdit(expense)}
												className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
												title="Edit"
											>
												<FaEdit />
											</button>
											<button
												onClick={() => handleDelete(expense._id)}
												className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
												title="Delete"
											>
												<FaTrashAlt />
											</button>
										</div>
									</div>
								</div>
							</li>
						)})}
					</ul>
				)}
			</div>
		</div>
	);
}