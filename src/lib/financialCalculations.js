/**
 * SmartFin Financial Calculations Library
 * A collection of financial calculation utilities for the SmartFin application
 */

/**
 * Calculate summary totals from an array of transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Summary with income, expenses, and balance
 */
export function calculateTransactionSummary(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach((transaction) => {
    // Convert amount to number if it's stored as string
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
      
    if (transaction.type === 'income') {
      totalIncome += amount;
    } else if (transaction.type === 'expense') {
      totalExpenses += amount;
    }
  });
  
  return {
    income: totalIncome.toFixed(2),
    expenses: totalExpenses.toFixed(2),
    balance: (totalIncome - totalExpenses).toFixed(2)
  };
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Calculate monthly transaction trends
 * @param {Array} transactions - Array of transaction objects with date properties
 * @param {number} months - Number of months to analyze (default: 6)
 * @returns {Object} Monthly trends for income and expenses
 */
export function calculateMonthlyTrends(transactions, months = 6) {
  const now = new Date();
  const result = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize the results for the last 'months' months
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthNames[monthDate.getMonth()];
    result[monthKey] = { income: 0, expenses: 0, balance: 0 };
  }
  
  // Aggregate transactions by month
  transactions.forEach(transaction => {
    try {
      // Handle date parsing safely
      const transactionDate = new Date(transaction.date);
      if (isNaN(transactionDate.getTime())) {
        console.warn('Invalid transaction date:', transaction.date);
        return; // Skip this transaction
      }
      
      // Only process transactions from the last 'months' months
      const monthsAgo = (now.getFullYear() - transactionDate.getFullYear()) * 12 + 
                         now.getMonth() - transactionDate.getMonth();
      
      if (monthsAgo >= 0 && monthsAgo < months) {
        const monthKey = monthNames[transactionDate.getMonth()];
        
        // Ensure we have an entry for this month
        if (!result[monthKey]) {
          result[monthKey] = { income: 0, expenses: 0, balance: 0 };
        }
        
        // Determine transaction type and add to appropriate category
        const amount = typeof transaction.amount === 'string' 
          ? parseFloat(transaction.amount) 
          : transaction.amount;
        
        if (amount) {
          if (transaction.type === 'income' || 
              (transaction.category && transaction.category.toLowerCase().includes('income'))) {
            result[monthKey].income += amount;
          } else {
            result[monthKey].expenses += amount;
          }
          
          result[monthKey].balance = result[monthKey].income - result[monthKey].expenses;
        }
      }
    } catch (error) {
      console.error('Error processing transaction for monthly trends:', error);
    }
  });
  
  // Format numbers and convert to array for easier consumption by charts
  // Order from oldest to newest month
  const orderedMonths = Object.keys(result).sort((a, b) => {
    return monthNames.indexOf(a) - monthNames.indexOf(b);
  });
  
  return orderedMonths.map(month => ({
    month,
    income: parseFloat(result[month].income.toFixed(2)),
    expenses: parseFloat(result[month].expenses.toFixed(2)),
    balance: parseFloat(result[month].balance.toFixed(2))
  }));
}

/**
 * Calculate simple interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as a decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time in years
 * @returns {number} Interest amount
 */
export function calculateSimpleInterest(principal, rate, time) {
  return principal * rate * time;
}

/**
 * Calculate compound interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as a decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time in years
 * @param {number} n - Compound frequency per year (default: 1)
 * @returns {number} Final amount after compound interest
 */
export function calculateCompoundInterest(principal, rate, time, n = 1) {
  return principal * Math.pow(1 + rate / n, n * time);
}

/**
 * Calculate the future value of a payment stream
 * @param {number} pmt - Payment amount per period
 * @param {number} rate - Interest rate per period
 * @param {number} periods - Number of periods
 * @returns {number} Future value
 */
export function calculateFutureValue(pmt, rate, periods) {
  return pmt * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/**
 * Calculate loan payment
 * @param {number} principal - Loan principal
 * @param {number} annualRate - Annual interest rate (as a decimal)
 * @param {number} years - Loan term in years
 * @returns {number} Monthly payment
 */
export function calculateLoanPayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
}

/**
 * Group transactions by category
 * @param {Array} transactions - Array of transaction objects with category properties
 * @returns {Object} Transactions grouped by category with totals
 */
export function groupTransactionsByCategory(transactions) {
  const categories = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
    
    if (!categories[category]) {
      categories[category] = {
        total: 0,
        count: 0,
        transactions: []
      };
    }
    
    categories[category].total += amount;
    categories[category].count += 1;
    categories[category].transactions.push(transaction);
  });
  
  // Format totals
  Object.keys(categories).forEach(category => {
    categories[category].total = categories[category].total.toFixed(2);
  });
  
  return categories;
}

/**
 * Calculate cashflow projection
 * @param {Array} transactions - Historical transactions
 * @param {number} months - Number of months to project
 * @returns {Array} Monthly projection data
 */
export function calculateCashflowProjection(transactions, months = 3) {
  // This is a simplified version that assumes future months will match the average of past months
  const monthlyIncomes = [];
  const monthlyExpenses = [];
  
  // Group by month and calculate averages
  const transactionsByMonth = {};
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!transactionsByMonth[monthKey]) {
      transactionsByMonth[monthKey] = { income: 0, expenses: 0 };
    }
    
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
      
    if (transaction.type === 'income') {
      transactionsByMonth[monthKey].income += amount;
    } else if (transaction.type === 'expense') {
      transactionsByMonth[monthKey].expenses += amount;
    }
  });
  
  // Calculate averages
  Object.values(transactionsByMonth).forEach(month => {
    monthlyIncomes.push(month.income);
    monthlyExpenses.push(month.expenses);
  });
  
  const averageIncome = monthlyIncomes.reduce((sum, val) => sum + val, 0) / monthlyIncomes.length || 0;
  const averageExpense = monthlyExpenses.reduce((sum, val) => sum + val, 0) / monthlyExpenses.length || 0;
  
  // Project future months
  const now = new Date();
  const projection = [];
  
  for (let i = 1; i <= months; i++) {
    const projectedDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthKey = `${projectedDate.getFullYear()}-${String(projectedDate.getMonth() + 1).padStart(2, '0')}`;
    
    projection.push({
      month: monthKey,
      income: averageIncome.toFixed(2),
      expenses: averageExpense.toFixed(2),
      balance: (averageIncome - averageExpense).toFixed(2)
    });
  }
  
  return projection;
}