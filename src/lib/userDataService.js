import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Fetches all relevant user data from MongoDB for a given user ID
 * This includes profile, transactions, expenses summary, contacts, and products/services
 */
export async function getUserFullContext(userId) {
  try {
    // Convert the userId to MongoDB ObjectId if it's a string
    const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    // 1) Basic profile
    const usersCollection = await getCollection('users');
    const profile = await usersCollection.findOne({ _id });
    
    // 2) Transactions
    const transactionsCollection = await getCollection('transactions');
    const transactions = await transactionsCollection
      .find({ user_id: _id })
      .toArray();
    
    // 3) Expenses summary
    const expensesCollection = await getCollection('expenses_summary');
    const expenses_summary = await expensesCollection.findOne({ user_id: _id });
    
    // 4) Contacts
    const contactsCollection = await getCollection('contacts');
    const contacts = await contactsCollection
      .find({ user_id: _id })
      .toArray();
    
    // 5) Products & services
    const productsCollection = await getCollection('products_services');
    const products_services = await productsCollection
      .find({ user_id: _id })
      .toArray();
    
    return { 
      profile, 
      transactions, 
      expenses_summary, 
      contacts, 
      products_services 
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    throw new Error('Failed to fetch user data from MongoDB');
  }
} 