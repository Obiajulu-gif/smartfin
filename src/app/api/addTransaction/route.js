import prisma from '../../../lib/prisma';
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin SDK to verify idToken

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, category, description, date } = req.body;
    const idToken = req.headers.authorization?.split('Bearer ')[1]; // Get idToken from Authorization header

    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      // Verify the token using Firebase Admin SDK
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userId = decodedToken.uid; // This is the user ID

      // Now create the transaction
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          amount: parseFloat(amount),
          category,
          description,
          date: new Date(date),
        },
      });

      res.status(200).json(transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Failed to add transaction' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
