'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Navbar from '../components/Navbar';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user ID from local storage or your auth context
      const userId = localStorage.getItem('userId') || 'default-user';
      
      // Fetch expenses from API
      const response = await fetch(`/api/mongodb-expenses?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExpenseAdded = (newExpense) => {
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };
  
  const handleExpenseDeleted = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Page Content */}
      <div className="pt-4">
        {/* Header */}
        <header className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Manage Expenses</h1>
            <p className="mt-1 text-indigo-100">
              Track and categorize your spending to improve your financial health
            </p>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Expense Form */}
            <section>
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </section>
            
            {/* Expense List */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
                <button
                  onClick={fetchExpenses}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              {isLoading && expenses.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <p className="text-gray-500">Loading expenses...</p>
                </div>
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onDelete={handleExpenseDeleted}
                  onRefresh={fetchExpenses}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
} 