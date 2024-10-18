"use client";
import { useState } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

export default function ExpensesPage() {
	const [expenses, setExpenses] = useState([]);
	const [form, setForm] = useState({
		name: "",
		category: "",
		amount: "",
		date: "",
	});
	const [editingIndex, setEditingIndex] = useState(null);

	// Handle form input change
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Add or edit an expense
	const handleSubmit = (e) => {
		e.preventDefault();
		if (editingIndex !== null) {
			// Editing an existing expense
			const updatedExpenses = [...expenses];
			updatedExpenses[editingIndex] = form;
			setExpenses(updatedExpenses);
			setEditingIndex(null);
		} else {
			// Adding a new expense
			setExpenses([...expenses, form]);
		}
		setForm({ name: "", category: "", amount: "", date: "" });
	};

	// Handle expense deletion
	const handleDelete = (index) => {
		const updatedExpenses = expenses.filter((_, i) => i !== index);
		setExpenses(updatedExpenses);
	};

	// Handle expense edit
	const handleEdit = (index) => {
		setForm(expenses[index]);
		setEditingIndex(index);
	};

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Manage Expenses
			</h1>

			{/* Expense Form */}
			<div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">
					{editingIndex !== null ? "Edit Expense" : "Add Expense"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Expense Name"
						value={form.name}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="text"
						name="category"
						placeholder="Category (e.g., Office Supplies)"
						value={form.category}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="number"
						name="amount"
						placeholder="Amount (in $)"
						value={form.amount}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="date"
						name="date"
						value={form.date}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<button
						type="submit"
						className="w-full bg-indigo-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
					>
						{editingIndex !== null ? (
							<FaEdit className="mr-2" />
						) : (
							<FaPlus className="mr-2" />
						)}
						{editingIndex !== null ? "Update Expense" : "Add Expense"}
					</button>
				</form>
			</div>

			{/* Expense List */}
			<div className="mt-8 max-w-4xl mx-auto">
				<h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
				{expenses.length === 0 ? (
					<p className="text-gray-500 text-center">No expenses recorded yet.</p>
				) : (
					<ul className="space-y-4">
						{expenses.map((expense, index) => (
							<li
								key={index}
								className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
							>
								<div>
									<h3 className="text-lg font-bold">{expense.name}</h3>
									<p className="text-sm text-gray-600">{expense.category}</p>
									<p className="text-sm text-gray-600">{expense.date}</p>
									<p className="text-lg font-semibold text-indigo-500">
										${expense.amount}
									</p>
								</div>
								<div className="flex space-x-4">
									<button
										onClick={() => handleEdit(index)}
										className="bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500"
									>
										<FaEdit />
									</button>
									<button
										onClick={() => handleDelete(index)}
										className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
									>
										<FaTrashAlt />
									</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
