import prisma from '../../../lib/prisma';

export async function DELETE(req) {
  try {
    const data = await req.json();

    //assign the json data to these values
    const { userId, id } = data;

    //check if they exist, if not return error
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing transaction id' }), { status: 400 });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    // Check database connection before proceeding
    try {
      // Simple MongoDB connection check using a lightweight query
      await prisma.$runCommandRaw({ ping: 1 });
      console.log("MongoDB connection verified successfully before deleting transaction");
    } catch (dbCheckError) {
      console.error('MongoDB connection check failed in deletetransaction:', dbCheckError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error', 
        details: 'Unable to connect to the database. Please try again later.',
        message: dbCheckError.message
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find the transaction to ensure it belongs to the user with timeout handling
    const transaction = await Promise.race([
      prisma.transaction.findUnique({
        where: { id },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 15000)
      )
    ]);

    if (!transaction || transaction.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Transaction not found or user not authorized' }), { status: 404 });
    }

    // Delete the transaction with timeout handling
    await Promise.race([
      prisma.transaction.delete({
        where: { id },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout')), 15000)
      )
    ]);

    return new Response(JSON.stringify({ message: 'Transaction deleted successfully' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    
    // Enhanced error handling
    if (error.message === 'Database query timeout' || error.message === 'Database operation timeout') {
      return new Response(JSON.stringify({ 
        error: 'Database timeout', 
        message: 'The database is taking too long to respond. Please try again later.'
      }), { status: 504 });
    }
    
    // Handle MongoDB-specific error codes
    if (error.code) {
      if (error.code === 'P2010' || error.code === 'P1001' || error.code === 'P1002') {
        return new Response(JSON.stringify({ 
          error: 'Database connection error', 
          message: 'Unable to connect to the database. Please check your network connection and try again.',
          details: error.message
        }), { status: 503 });
      }
      if (error.code === 'P2025') {
        return new Response(JSON.stringify({ 
          error: 'Transaction not found',
          message: 'The transaction you are trying to delete could not be found.'
        }), { status: 404 });
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to delete transaction',
      message: error.message || 'Unknown error occurred'
    }), { status: 500 });
  }
}
