'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const ExpenseList = ({ expenses, onDelete, onRefresh }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No expenses found. Add your first expense above!</p>
      </div>
    );
  }
  
  const handleDelete = async (id) => {
    try {
      // Get user ID from local storage or your auth context
      const userId = localStorage.getItem('userId') || 'default-user';
      
      // Delete from API
      const response = await fetch(`/api/mongodb-expenses?id=${id}&userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      
      // Notify parent component
      if (onDelete) {
        onDelete(id);
      }
      
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };
  
  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <li key={expense._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {expense.name}
                  </p>
                  {expense.category && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {expense.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="px-2 text-sm text-gray-500">
                    {formatCurrency(expense.amount)}
                  </p>
                  
                  {confirmDelete === expense._id ? (
                    <div className="flex items-center ml-2">
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded mr-1"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(expense._id)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {expense.description && expense.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {expense.date ? formatDate(expense.date) : 'No date'}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList; 