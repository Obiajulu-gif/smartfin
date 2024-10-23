"use client";
import React, { useState } from "react";
import { auth } from "../../../lib/firebaseAuth"; // Adjust the import path as needed

// React functional component
const AddTransactionForm = () => {
  // State variables to manage form inputs
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // State to store all transactions
  const [transactions, setTransactions] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Transaction data to be added
    const newTransaction = {
      amount: parseFloat(amount), // Convert amount to number
      category,
      description,
      date,
    };

    // Call the addTransaction function
    const result = await addTransaction(newTransaction);

    if (result) {
      alert("Transaction added successfully!");
      // Add the new transaction to the transactions array
      setTransactions([...transactions, newTransaction]);
      // Reset form fields after successful submission
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
    }
  };

  // Function to add a new transaction and include the idToken
  const addTransaction = async (transactionData) => {
    try {

      // Retrieve the idToken from Firebase authentication
      const user = auth.currentUser;
      if (!user) {
        alert("User is not authenticated. Please log in to continue.");
        return;
      }
      const idToken = await user.getIdToken();

      // Retrieve the idToken from localStorage
      //const idToken = localStorage.getItem("idToken");

      //if (!idToken) {
        //alert("User is not authenticated. Please log in to continue.");
        //return;
     // }

      // Send the POST request to the backend API with idToken in the Authorization header
      const response = await fetch('/api/addtransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`, // Attach idToken in the Authorization header
        },
        body: JSON.stringify(transactionData), // Send transaction data as JSON
      });

      // Check if the response is ok (status 200)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the JSON response
      const result = await response.json();
      console.log('Transaction added successfully:', result);

      return result; // Return the result for further handling if needed
    } catch (error) {
      console.error("Error adding transaction:", error.message);
      alert(`Failed to add transaction: ${error.message}`);
    }
  };

  // Function to calculate total income and expenses
  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    // Loop through each transaction and categorize as income or expense
    transactions.forEach((transaction) => {
      if (transaction.category.toLowerCase() === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.category.toLowerCase() === "expenses") {
        totalExpenses += transaction.amount;
      }
    });

    // Calculate savings as income - expenses
    const savings = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, savings };
  };

  // Render the form and the transaction summary
  const { totalIncome, totalExpenses, savings } = calculateSummary();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category (income/expenses):</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Transaction</button>
      </form>

      {/* Display Transaction Summary */}
      <div>
        <h2>Transaction Summary</h2>
        <p>Total Income: ${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p>Savings: ${savings.toFixed(2)}</p>
      </div>

      {/* Optionally, list all transactions */}
      <div>
        <h3>All Transactions</h3>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.description} - {transaction.category} - $
              {transaction.amount} on {transaction.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddTransactionForm;
