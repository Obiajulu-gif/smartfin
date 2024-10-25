"use client";
import { useState } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

const AddTransactionForm = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: "", category: "income", description: "", date: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("localId"); // Fetch userId from localStorage
    const newTransaction = { userId, ...form, amount: parseFloat(form.amount) };

    if (editingIndex !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[editingIndex] = newTransaction;
      setTransactions(updatedTransactions);
      setEditingIndex(null);
    } else {
      const result = await addTransaction(newTransaction);
      if (result) {
        setTransactions([...transactions, newTransaction]);
      }
    }

    setForm({ amount: "", category: "income", description: "", date: "" });
  };

  const handleDelete = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleEdit = (index) => {
    setForm(transactions[index]);
    setEditingIndex(index);
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

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{editingIndex !== null ? "Edit Transaction" : "Add Transaction"}</h2>
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
            {editingIndex !== null ? (
              <FaEdit className="mr-2" />
            ) : (
              <FaPlus className="mr-2" />
            )}
            {editingIndex !== null ? "Update Transaction" : "Add Transaction"}
          </button>
        </form>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Transaction List</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions added yet.</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                  <p className="text-sm text-gray-600">${transaction.amount}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => handleEdit(index)} className="bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(index)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
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
};

export default AddTransactionForm;
