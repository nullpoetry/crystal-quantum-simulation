import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI (using a local MongoDB instance by default)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'quantum_crystal_sim';

// Create a MongoDB client with specified options
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection
let db: any = null;

export async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Get a reference to the database
    db = client.db(DB_NAME);
    
    // Ping to confirm successful connection
    await db.command({ ping: 1 });
    
    console.log('Connected successfully to MongoDB database');
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

export function getCollection(collectionName: string) {
  return getDb().collection(collectionName);
}

export async function closeConnection() {
  await client.close();
  console.log('MongoDB connection closed');
}