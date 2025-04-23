"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaPlus, FaFileInvoiceDollar, FaSearch, FaFilter, FaSort, 
  FaSortUp, FaSortDown, FaTrash, FaEdit, FaDownload, FaCalendarAlt,
  FaArrowUp, FaArrowDown, FaExchangeAlt, FaMoneyBillWave,
  FaChartBar, FaTable, FaUser, FaListUl, FaTags
} from "react-icons/fa";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [viewMode, setViewMode] = useState("table");
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [period, setPeriod] = useState("monthly");
  const [categoryData, setCategoryData] = useState([]);
  const [transactionTrends, setTransactionTrends] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Fetch transactions
  useEffect(() => {
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
      
    try {
      const userId = localStorage.getItem("localId");
      if (!userId) {
        setError("User not authenticated. Please log in to continue.");
        setIsLoading(false);
        return;
      }
        
        const response = await fetch(`/api/mongodb-transactions?userId=${userId}`, {
          headers: {'Content-Type': 'application/json'},
        });
        
      const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || response.statusText);
        
        // Process transactions
        const processedTransactions = data.map(transaction => ({
          ...transaction,
          // Ensure date is in a consistent format
          date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Ensure amount is a number
          amount: parseFloat(transaction.amount || 0),
          // Identify transaction type
          transactionType: transaction.category?.toLowerCase().includes('income') ? 'income' : 'expense'
        }));
        
        setTransactions(processedTransactions);
        setFilteredTransactions(processedTransactions);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(processedTransactions.map(t => t.category))].filter(Boolean);
        setCategories(uniqueCategories);
        
        // Calculate summary
        let income = 0, expenses = 0;
        processedTransactions.forEach(t => {
          if (t.transactionType === 'income') {
            income += t.amount;
          } else {
            expenses += t.amount;
          }
        });
        setSummary({ income, expenses, balance: income - expenses });
        
        // Calculate category data for charts
        calculateCategoryData(processedTransactions);
        
        // Calculate transaction trends
        calculateTransactionTrends(processedTransactions, 'monthly');
        
        setIsLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(`Failed to load transactions: ${err.message}`);
      setIsLoading(false);
    }
  };

    fetchTransactions();
  }, []);

  // Calculate category data for charts
  const calculateCategoryData = (data) => {
    const categoryAmounts = {};
    
    data.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      if (!categoryAmounts[category]) {
        categoryAmounts[category] = 0;
      }
      categoryAmounts[category] += transaction.amount;
    });
    
    const categoryChartData = Object.entries(categoryAmounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setCategoryData(categoryChartData);
  };
  
  // Calculate transaction trends over time
  const calculateTransactionTrends = (data, timePeriod) => {
    const trends = {};
    const now = new Date();
    
    data.forEach(transaction => {
      const date = new Date(transaction.date);
      let periodKey;
      
      if (timePeriod === 'monthly') {
        // Format: "Jan 2023"
        periodKey = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
      } else if (timePeriod === 'weekly') {
        // Calculate week number
        const startDate = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil(days / 7);
        periodKey = `Week ${weekNumber}, ${date.getFullYear()}`;
      } else if (timePeriod === 'daily') {
        // Format: "Jan 1"
        periodKey = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
      } else {
        periodKey = date.getFullYear().toString();
      }
      
      if (!trends[periodKey]) {
        trends[periodKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.transactionType === 'income') {
        trends[periodKey].income += transaction.amount;
      } else {
        trends[periodKey].expenses += transaction.amount;
      }
    });
    
    // Convert to array and sort by date
    const trendArray = Object.entries(trends).map(([period, values]) => ({
      period,
      income: values.income,
      expenses: values.expenses,
      net: values.income - values.expenses
    }));
    
    // Sort based on time period
    if (timePeriod === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      trendArray.sort((a, b) => {
        const [aMonth, aYear] = a.period.split(' ');
        const [bMonth, bYear] = b.period.split(' ');
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      });
    } else if (timePeriod === 'weekly') {
      trendArray.sort((a, b) => {
        const aWeek = parseInt(a.period.split(',')[0].replace('Week ', ''));
        const bWeek = parseInt(b.period.split(',')[0].replace('Week ', ''));
        const aYear = parseInt(a.period.split(', ')[1]);
        const bYear = parseInt(b.period.split(', ')[1]);
        if (aYear !== bYear) return aYear - bYear;
        return aWeek - bWeek;
      });
    } else if (timePeriod === 'yearly') {
      trendArray.sort((a, b) => parseInt(a.period) - parseInt(b.period));
    } else {
      // Daily
      trendArray.sort((a, b) => {
        const aDate = new Date(`${a.period}, ${new Date().getFullYear()}`);
        const bDate = new Date(`${b.period}, ${new Date().getFullYear()}`);
        return aDate - bDate;
      });
    }
    
    // Limit to last 12 periods
    setTransactionTrends(trendArray.slice(-12));
  };
  
  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    calculateTransactionTrends(transactions, newPeriod);
  };
  
  // Filter transactions based on criteria
  useEffect(() => {
    let result = [...transactions];
    
    // Filter by transaction type
    if (filterType !== "all") {
      result = result.filter(t => t.transactionType === filterType);
    }
    
    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter(t => t.category === filterCategory);
    }
    
    // Filter by date range
    if (filterDateRange !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filterDateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      result = result.filter(t => new Date(t.date) >= cutoffDate);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        (t.description && t.description.toLowerCase().includes(lowercasedSearch)) ||
        (t.category && t.category.toLowerCase().includes(lowercasedSearch)) ||
        (t.recipient && t.recipient.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Sort transactions
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, filterType, filterCategory, filterDateRange, sortConfig]);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="ml-1 text-indigo-600" /> : <FaSortDown className="ml-1 text-indigo-600" />;
  };
  
  // Export transactions as CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Date,Category,Description,Amount,Type\n";
    
    // Add rows
    filteredTransactions.forEach(t => {
      csvContent += `${t.date || 'N/A'},${t.category || 'N/A'},"${t.description || 'N/A'}",${t.amount || 0},${t.transactionType || 'expense'}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transactions</h1>
          <p className="text-gray-600">Track your financial activities and analyze spending patterns</p>
        </div>
        
        <Link href="/dashboard/transactions/new">
          <button className="mt-4 md:mt-0 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300">
            <FaPlus className="mr-2" /> New Transaction
          </button>
        </Link>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">TOTAL INCOME</h3>
              <p className="text-2xl font-bold text-gray-800">₦{summary.income.toLocaleString('en-NG')}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaArrowUp className="text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">TOTAL EXPENSES</h3>
              <p className="text-2xl font-bold text-gray-800">₦{summary.expenses.toLocaleString('en-NG')}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaArrowDown className="text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">NET BALANCE</h3>
              <p className="text-2xl font-bold text-gray-800">₦{summary.balance.toLocaleString('en-NG')}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaExchangeAlt className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transaction Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">Transaction Trends</h2>
            <div className="flex space-x-1 rounded-md shadow-sm">
              <button 
                className={`px-3 py-1 text-sm ${period === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-l-md`}
                onClick={() => handlePeriodChange('daily')}
              >
                Daily
              </button>
              <button 
                className={`px-3 py-1 text-sm ${period === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => handlePeriodChange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-1 text-sm ${period === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-r-md`}
                onClick={() => handlePeriodChange('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-72">
            {transactionTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₦${value.toLocaleString('en-NG')}`} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10B981" />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
                  <Bar dataKey="net" name="Net" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No transaction data available
              </div>
            )}
          </div>
                    </div>
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h2>
          <div className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₦${value.toLocaleString('en-NG')}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Type Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaMoneyBillWave className="text-gray-400" />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaTags className="text-gray-400" />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Date Range Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
          </div>

            {/* View Mode */}
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-3 py-2 rounded-l-md border ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('table')}
              >
                <FaTable className="inline" />
              </button>
              <button
                className={`px-3 py-2 rounded-r-md border-t border-b border-r ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('list')}
              >
                <FaListUl className="inline" />
              </button>
          </div>

            {/* Export Button */}
            <button 
              onClick={exportCSV}
              className="flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition duration-300"
            >
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Transactions Display */}
      {!isLoading && !error && (
        <>
          {filteredTransactions.length > 0 ? (
            viewMode === 'table' ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                          <div className="flex items-center">
                            Date
                            {getSortIcon('date')}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('category')}>
                          <div className="flex items-center">
                            Category
                            {getSortIcon('category')}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('transactionType')}>
                          <div className="flex items-center">
                            Type
                            {getSortIcon('transactionType')}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                          <div className="flex items-center justify-end">
                            Amount
                            {getSortIcon('amount')}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.date || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.category || 'Uncategorized'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description || 'No description'}
                            {transaction.recipient && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <FaUser className="mr-1" /> {transaction.recipient}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.transactionType === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.transactionType === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                            <span className={transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.transactionType === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString('en-NG')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/dashboard/transactions/edit/${transaction.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  <FaEdit />
                                </button>
                              </Link>
                              <button className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${
                          transaction.transactionType === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.transactionType === 'income' ? (
                            <FaArrowUp className="text-green-600" />
                          ) : (
                            <FaArrowDown className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{transaction.description || 'No description'}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="mr-1" /> {transaction.date || 'N/A'}
                          </div>
                          {transaction.recipient && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaUser className="mr-1" /> {transaction.recipient}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaTags className="mr-1" /> {transaction.category || 'Uncategorized'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-medium ${
                          transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transactionType === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString('en-NG')}
                        </span>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Link href={`/dashboard/transactions/edit/${transaction.id}`}>
                            <button className="p-1 text-indigo-600 hover:text-indigo-900">
                              <FaEdit />
                            </button>
                          </Link>
                          <button className="p-1 text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <FaFileInvoiceDollar className="mx-auto text-gray-300 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters or add new transactions.</p>
              <Link href="/dashboard/transactions/new">
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <FaPlus className="mr-2" /> Add New Transaction
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
