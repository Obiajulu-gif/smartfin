// MongoDB Database Initialization Script
import { connectToDatabase } from './mongodb';

// Establish MongoDB connection when the application starts
async function initDatabase() {
  try {
    console.log('Initializing MongoDB connection...');
    const { client, db } = await connectToDatabase();
    console.log('MongoDB connection initialized successfully!');
    
    // Add shutdown handler to properly close MongoDB connection
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing MongoDB connection');
      await client.close();
      process.exit(0);
    });
    
    return { client, db };
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    // Don't throw the error - we don't want to crash the application
    // Just log it and let the application continue without DB access
    return null;
  }
}

// Export the initialization function
export default initDatabase;