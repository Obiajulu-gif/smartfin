import prisma from '../../../lib/prisma';
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin SDK to verify idToken

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, amount, category, description, date } = req.body;

    if (!userId || !amount || !category || !description || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create a new transaction in the database using Prisma
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(date),
        },
      });

      // Return the newly created transaction
      res.status(200).json(transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Failed to add transaction' });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}