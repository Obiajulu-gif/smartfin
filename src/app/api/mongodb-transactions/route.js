import { ObjectId } from 'mongodb';
import { connectToDatabase, getCollection } from '../../../lib/mongodb';
import { prisma } from '../../../lib/prisma';

// GET - Fetch transactions using direct MongoDB connection
export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    try {
      // Get the transactions collection
      const transactionsCollection = await getCollection('Transaction');
      
      // Check connection with a simple ping
      await connectToDatabase();
      
      // Query MongoDB directly
      const transactions = await transactionsCollection
        .find({ userId })
        .sort({ date: -1 })
        .toArray();

      return new Response(JSON.stringify(transactions), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch transactions',
        message: error.message || 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in transaction API:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Add a transaction using direct MongoDB connection
export async function POST(req) {
  try {
    // Get the data from the frontend
    const data = await req.json();
    
    // Assign the json data to these values
    const { userId, amount, category, description, date } = data;
    
    // Validation
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }
    if (!amount) {
      return new Response(JSON.stringify({ error: 'Amount is required' }), { status: 400 });
    }
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category is required' }), { status: 400 });
    }
    if (!description) {
      return new Response(JSON.stringify({ error: 'Description is required' }), { status: 400 });
    }
    if (!date) {
      return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });
    }

    // Parse amount to ensure it's a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return new Response(JSON.stringify({ error: 'Amount must be a valid number' }), { status: 400 });
    }

    // Safely parse the date
    let transactionDate;
    try {
      transactionDate = new Date(date);
      if (isNaN(transactionDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), { status: 400 });
    }

    // Get the transactions collection
    const transactionsCollection = await getCollection('Transaction');
    
    // Create a new transaction document
    const transaction = {
      userId,
      amount: parsedAmount,
      category,
      description,
      date: transactionDate,
      createdAt: new Date()
    };
    
    // Insert the document
    const result = await transactionsCollection.insertOne(transaction);
    
    // Return the new transaction with its generated ID
    return new Response(JSON.stringify({
      ...transaction,
      _id: result.insertedId
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to add transaction',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete a transaction using direct MongoDB connection
export async function DELETE(req) {
  try {
    const data = await req.json();
    const { userId, id } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing transaction id' }), { status: 400 });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Get the transactions collection
    const transactionsCollection = await getCollection('Transaction');
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the transaction first to verify ownership
    const transaction = await transactionsCollection.findOne({ 
      _id: objectId 
    });

    if (!transaction) {
      return new Response(JSON.stringify({ error: 'Transaction not found' }), { status: 404 });
    }
    
    if (transaction.userId !== userId) {
      return new Response(JSON.stringify({ error: 'User not authorized to delete this transaction' }), { status: 403 });
    }

    // Delete the transaction
    await transactionsCollection.deleteOne({ _id: objectId });

    return new Response(JSON.stringify({ 
      message: 'Transaction deleted successfully' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete transaction',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}