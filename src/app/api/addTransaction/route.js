import prisma from '../../../lib/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Data received in backend:", data); // Log data here

    const { userId, amount, category, description, date } = data;

    if (!userId || !amount || !category || !description || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date),
      },
    });

    return new Response(JSON.stringify(transaction), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add transaction' }), { status: 500 });
  }
}
