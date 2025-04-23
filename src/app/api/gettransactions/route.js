import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    // Check if we can connect to the database before proceeding
    try {
      // Simple MongoDB connection check using a lightweight query
      await prisma.$runCommandRaw({ ping: 1 });
      console.log("MongoDB connection verified successfully");
    } catch (dbCheckError) {
      console.error('MongoDB connection check failed in gettransactions:', dbCheckError);
      return new Response(JSON.stringify({ 
        error: 'Database connection error', 
        details: 'Unable to connect to the database. Please try again later.',
        message: dbCheckError.message
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all transactions for the authenticated user with timeout handling
    const transactions = await Promise.race([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 15000)
      )
    ]);

    return new Response(JSON.stringify(transactions), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    // Improved error handling with more specific MongoDB error codes
    if (error.message === 'Database query timeout') {
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
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch transactions',
      message: error.message || 'Unknown database error'
    }), { status: 500 });
  }
}
