import { PrismaClient } from '@prisma/client';

// Check if we're running on the browser or server
const isBrowser = typeof window !== 'undefined';

let prisma;

// Only instantiate PrismaClient on the server side
if (!isBrowser) {
  // PrismaClient is attached to the `global` object in development to prevent
  // exhausting your database connection limit
  const globalForPrisma = global;

  // Create a Prisma Client instance with improved connection handling
  const createPrismaClient = () => {
    const client = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
      // Configure MongoDB connection handling
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    // Use process.on instead of client.$on for exit handling
    // This is the recommended approach for Prisma 5.0.0+
    process.on('beforeExit', async () => {
      console.log('Prisma Client is shutting down');
    });
    
    // Verify database connection on startup
    client.$connect()
      .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
      })
      .catch((e) => {
        console.error('Failed to connect to MongoDB Atlas:', e);
      });
    
    return client;
  };

  // Check if prisma exists in the global object, if not create it
  prisma = globalForPrisma.prisma || createPrismaClient();

  // In development, save the prisma instance to avoid multiple instances
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} else {
  // In the browser, provide a placeholder that will show helpful errors
  prisma = new Proxy({}, {
    get(target, prop) {
      // Helpful error message when trying to use Prisma in the browser
      if (prop !== '$$typeof' && prop !== 'constructor' && prop !== 'toJSON') {
        console.error('PrismaClient cannot be used in the browser. Please use API routes or server components to handle database operations.');
      }
      return undefined;
    }
  });
}

export default prisma;