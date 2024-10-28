import prisma from '../../../lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    // Fetch all transactions for the authenticated user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch transactions' }), { status: 500 });
  }
}
