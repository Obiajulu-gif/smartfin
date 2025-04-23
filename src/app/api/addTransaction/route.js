import prisma from '../../../lib/prisma';

export async function POST(req) {
  try {
    // Get the data from the frontend
    const data = await req.json();
    
    // Assign the json data to these values
    const { userId, amount, category, description, date } = data;
    
    // Enhanced validation with more detailed error messages
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

    // Check database connection before proceeding
    try {
      // Simple MongoDB connection check using a lightweight query
      await prisma.$runCommandRaw({ ping: 1 });
      console.log("MongoDB connection verified successfully before adding transaction");
    } catch (dbCheckError) {
      console.error('MongoDB connection check failed in addTransaction:', dbCheckError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error', 
        details: 'Unable to connect to the database. Please try again later.',
        message: dbCheckError.message
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add timeout handling for the database operation
    const transaction = await Promise.race([
      prisma.transaction.create({
        data: {
          userId,
          amount: parsedAmount,
          category,
          description,
          date: transactionDate,
        },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout')), 15000)
      )
    ]);

    return new Response(JSON.stringify(transaction), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Transaction error details:', error);
    
    // More detailed error handling
    if (error.message === 'Database operation timeout') {
      return new Response(JSON.stringify({ 
        error: 'Database timeout', 
        message: 'The database is taking too long to respond. Please try again later.'
      }), { status: 504 });
    }
    
    if (error.code) {
      // Handle specific Prisma error codes
      if (error.code === 'P2002') {
        return new Response(JSON.stringify({ error: 'A transaction with these details already exists' }), { status: 400 });
      }
      if (error.code === 'P2003') {
        return new Response(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
      }
      if (error.code === 'P2010' || error.code === 'P1001' || error.code === 'P1002') {
        // Database connection issues
        return new Response(JSON.stringify({ 
          error: 'Database connection error', 
          message: 'Unable to connect to the database. Please check your network connection and try again.',
          details: error.message
        }), { status: 503 });
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to add transaction', 
      message: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
