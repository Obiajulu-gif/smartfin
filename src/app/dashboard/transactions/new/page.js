"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import Link from 'next/link';

const AddTransactionForm = () => {
  const [form, setForm] = useState({ amount: "", category: "income", description: "", date: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("localId"); // Fetch userId from localStorage
    const newTransaction = { userId, ...form, amount: parseFloat(form.amount) };

    const result = await addTransaction(newTransaction);
    if (result) {
      setMessage("Transaction added successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }

    setForm({ amount: "", category: "income", description: "", date: "" });
  };

  const addTransaction = async (transactionData) => {
    try {
      const idToken = localStorage.getItem("idToken");
      if (!idToken) {
        alert("User is not authenticated. Please log in to continue.");
        return;
      }

      const response = await fetch('/api/addtransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error adding transaction:", error.message);
      alert(`Failed to add transaction: ${error.message}`);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Transactions</h1>
      
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
          </select>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
            <FaPlus className="mr-2" /> Add Transaction
          </button>
        </form>
      </div>

      <div className="mt-8 max-w-xl mx-auto">
        <Link href="/dashboard/transactions">
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
            Go to Summary
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddTransactionForm;
