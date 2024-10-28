"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdNoAccounts } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = localStorage.getItem("localId");
      if (!userId) {
        alert("User not authenticated. Please log in to continue.");
        return;
      }

      const response = await fetch(`/api/gettransactions?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setTransactions(result);
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (transactionId) => {
    const response = await fetch(`/api/deletetransaction`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('localId')}`,
      },
      body: JSON.stringify({ id: transactionId, userId: localStorage.getItem('localId') }),
    });

    if (response.ok) {
      const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
      setTransactions(updatedTransactions);
      setMessage("Transaction deleted successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } else {
      console.error("Failed to delete transaction.");
    }
  };

  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.category.toLowerCase() === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.category.toLowerCase() === "expenses") {
        totalExpenses += transaction.amount;
      }
    });

    const savings = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, savings };
  };

  const { totalIncome, totalExpenses, savings } = calculateSummary();

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Transaction Summary</h1>
      
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-lg shadow-sm text-center bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-600">Total Income</h3>
          <p className="text-lg font-bold text-gray-900">₦{totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm text-center bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-600">Total Expenses</h3>
          <p className="text-lg font-bold text-gray-900">₦{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm text-center bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-600">Savings</h3>
          <p className="text-lg font-bold text-gray-900">₦{savings.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Transaction List</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{transaction.description}</h3>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                  <p className="text-sm text-gray-600">₦{transaction.amount}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <button onClick={() => handleDelete(transaction.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/dashboard/transactions/new">
        <button className="mt-8 px-4 py-2 bg-indigo-600 hover:bg-indigo-400 text-white rounded-lg flex items-center justify-center">
          Add New Transaction
        </button>
      </Link>
    </div>
  );
};

export default Transactions;
