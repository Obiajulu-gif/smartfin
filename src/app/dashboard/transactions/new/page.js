"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from '../../../components/Loader';

const NewTransaction = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Get the user ID from localStorage
    const userId = localStorage.getItem("localId");
    if (!userId) {
      setError("User not authenticated. Please log in to continue.");
      setIsLoading(false);
      return;
    }

    try {
      // Use the direct MongoDB connection API
      const response = await fetch("/api/mongodb-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to add transaction");
      }

      // Notify transactions page to refresh summary
      window.dispatchEvent(new Event('transactionsUpdated'));

      // Redirect to transactions page after successful addition
      router.push("/dashboard/transactions");
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add New Transaction
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 font-medium mb-2"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Income">Income</option>
            <option value="Expenses">Expenses</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="date"
            className="block text-gray-700 font-medium mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard/transactions")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isLoading ? <Loader /> : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTransaction;
