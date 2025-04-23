import { connectToDatabase, getCollection } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch expenses using direct MongoDB connection
export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    try {
      // Get the expenses collection
      const expensesCollection = await getCollection('Expense');
      
      // Check connection with a simple ping
      await connectToDatabase();
      
      // Query MongoDB directly
      const expenses = await expensesCollection
        .find({ userId })
        .sort({ date: -1 })
        .toArray();

      return new Response(JSON.stringify(expenses), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error', 
        message: dbError.message 
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch expenses',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Add an expense using direct MongoDB connection
export async function POST(req) {
  try {
    // Get the data from the frontend
    const data = await req.json();
    
    // Assign the json data to these values
    const { userId, amount, category, name, date } = data;
    
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
    if (!name) {
      return new Response(JSON.stringify({ error: 'Expense name is required' }), { status: 400 });
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
    let expenseDate;
    try {
      expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), { status: 400 });
    }

    // Get the expenses collection
    const expensesCollection = await getCollection('Expense');
    
    // Create a new expense document
    const expense = {
      userId,
      amount: parsedAmount,
      category,
      name,
      date: expenseDate,
      createdAt: new Date()
    };
    
    // Insert the document
    const result = await expensesCollection.insertOne(expense);
    
    // Return the new expense with its generated ID
    return new Response(JSON.stringify({
      ...expense,
      _id: result.insertedId
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to add expense',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update an expense using direct MongoDB connection
export async function PUT(req) {
  try {
    const data = await req.json();
    const { userId, id, name, amount, category, date } = data;
    
    if (!userId || !id) {
      return new Response(JSON.stringify({ error: 'User ID and expense ID are required' }), { status: 400 });
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (amount) updateData.amount = parseFloat(amount);
    if (category) updateData.category = category;
    if (date) {
      try {
        const expenseDate = new Date(date);
        if (!isNaN(expenseDate.getTime())) {
          updateData.date = expenseDate;
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid date format' }), { status: 400 });
      }
    }
    
    // Add update timestamp
    updateData.updatedAt = new Date();
    
    // Get the expenses collection
    const expensesCollection = await getCollection('Expense');
    
    // Update the expense
    const result = await expensesCollection.updateOne(
      { _id: objectId, userId }, 
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Expense not found or user not authorized' }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      message: 'Expense updated successfully',
      modifiedCount: result.modifiedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update expense',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete an expense using direct MongoDB connection
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing expense id' }), { status: 400 });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Get the expenses collection
    const expensesCollection = await getCollection('Expense');
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the expense first to verify ownership
    const expense = await expensesCollection.findOne({ 
      _id: objectId 
    });

    if (!expense) {
      return new Response(JSON.stringify({ error: 'Expense not found' }), { status: 404 });
    }
    
    if (expense.userId !== userId) {
      return new Response(JSON.stringify({ error: 'User not authorized to delete this expense' }), { status: 403 });
    }

    // Delete the expense
    await expensesCollection.deleteOne({ _id: objectId });

    return new Response(JSON.stringify({ 
      message: 'Expense deleted successfully' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete expense',
      message: error.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}