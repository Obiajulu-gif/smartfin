// Express server with MongoDB connection for SmartFin
import express from "express";
import cors from "cors";
import { connectToDatabase, closeMongoDBConnection } from "./lib/mongodb.js";
import { ObjectId } from "mongodb";

// Create Express application
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection service
class MongoDBService {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      console.log("Connecting to MongoDB Atlas...");
      const connection = await connectToDatabase();
      this.client = connection.client;
      this.db = connection.db;
      console.log("Successfully connected to MongoDB Atlas");
      return connection;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async disconnect() {
    await closeMongoDBConnection();
    console.log("Disconnected from MongoDB Atlas");
  }

  getCollection(collectionName) {
    return this.db.collection(collectionName);
  }
}

// Create MongoDB Service instance
const mongoDBService = new MongoDBService();

// Basic route for testing
app.get("/", (req, res) => {
  res.send("SmartFin API is running");
});

// Transactions API routes
app.get("/api/transactions", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const transactionsCollection = mongoDBService.getCollection("Transaction");
    const transactions = await transactionsCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ 
      error: "Failed to fetch transactions",
      message: error.message
    });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { userId, amount, category, description, date } = req.body;
    
    if (!userId || !amount || !category || !description || !date) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["userId", "amount", "category", "description", "date"]
      });
    }
    
    const transactionsCollection = mongoDBService.getCollection("Transaction");
    
    const transaction = {
      userId,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date)
    };
    
    const result = await transactionsCollection.insertOne(transaction);
    
    res.status(201).json({
      message: "Transaction added successfully",
      id: result.insertedId,
      transaction
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ 
      error: "Failed to add transaction",
      message: error.message
    });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const transactionsCollection = mongoDBService.getCollection("Transaction");
    
    // Find the transaction first to verify ownership
    const transaction = await transactionsCollection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    if (transaction.userId !== userId) {
      return res.status(403).json({ error: "User not authorized to delete this transaction" });
    }
    
    await transactionsCollection.deleteOne({ _id: new ObjectId(id) });
    
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ 
      error: "Failed to delete transaction",
      message: error.message
    });
  }
});

// Start the Express server and connect to MongoDB
app.listen(port, async () => {
  console.log(`SmartFin API server started at http://localhost:${port}`);
  
  try {
    // Initiate MongoDB connection when the server starts
    await mongoDBService.connect();
    
    // Set up graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully");
      await mongoDBService.disconnect();
      process.exit(0);
    });
    
    process.on("SIGINT", async () => {
      console.log("SIGINT received. Shutting down gracefully");
      await mongoDBService.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server with MongoDB connection:", error);
  }
});

export default app;