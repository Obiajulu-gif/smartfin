import prisma from '../../../lib/prisma';
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin SDK to verify idToken

export async function POST(req) {
  try {
    //get the data from the frontend
    const data = await req.json();
    //assign the json data to these values
    const { userId, amount, category, description, date } = data;
    //check if they exist, if not return error
    if (!userId || !amount || !category || !description || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    //store it in the database
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
