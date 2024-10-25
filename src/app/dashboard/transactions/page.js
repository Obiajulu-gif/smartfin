"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdNoAccounts } from "react-icons/md";

const Transactions = () => {
  // State for transactions and search and filter
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch transactions from localStorage or an API endpoint
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);
  }, []);

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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* No Transaction Message */}
      <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg bg-gray-50">
        <MdNoAccounts className="mb-4 w-24 h-24 text-gray-500" />
        <p className="text-gray-500">No transaction recorded</p>
        <Link href="/dashboard/transactions/new">
          <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-400 text-white rounded-lg">+ Add transaction</button>
        </Link>
      </div>
    </div>
  );
};

export default Transactions;
