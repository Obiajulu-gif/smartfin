// Direct MongoDB connection utility
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority',
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export const getMongoClient = async () => {
  return await clientPromise;
};

// Helper function to connect to database
export async function connectToDatabase() {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || 'smartfin');
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Unable to connect to database');
  }
}

// Helper function to get a collection with proper error handling
export async function getCollection(collectionName) {
  try {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Failed to get collection ${collectionName}:`, error);
    throw new Error(`Unable to access collection: ${collectionName}`);
  }
}

// Helper function to close database connection
export async function closeDatabaseConnection() {
  try {
    if (client) {
      await client.close();
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw new Error('Failed to close database connection');
  }
}