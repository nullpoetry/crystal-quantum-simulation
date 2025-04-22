import { ObjectId } from 'mongodb';
import { getCollection } from './mongodb';
import { type User, type InsertUser, type Simulation, type InsertSimulation } from '@shared/schema';
import { IStorage } from './storage';

export class MongoStorage implements IStorage {
  private usersCollection = 'users';
  private simulationsCollection = 'simulations';

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const collection = getCollection(this.usersCollection);
    const user = await collection.findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const collection = getCollection(this.usersCollection);
    const user = await collection.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const collection = getCollection(this.usersCollection);
    
    // Find the highest existing ID to determine next ID
    const highestUser = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestUser.length > 0 ? highestUser[0].id + 1 : 1;
    
    const user: User = { ...insertUser, id: nextId };
    
    await collection.insertOne(user);
    return user;
  }

  // Simulation methods
  async saveSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const collection = getCollection(this.simulationsCollection);
    
    // Find the highest existing ID to determine next ID
    const highestSim = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const nextId = highestSim.length > 0 ? highestSim[0].id + 1 : 1;
    
    // Ensure userId is not undefined (default to null if it's not provided)
    const userId = insertSimulation.userId === undefined ? null : insertSimulation.userId;
    
    const simulation: Simulation = { 
      ...insertSimulation, 
      userId,
      id: nextId 
    };
    
    await collection.insertOne(simulation);
    return simulation;
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    const collection = getCollection(this.simulationsCollection);
    const simulation = await collection.findOne({ id });
    return simulation || undefined;
  }

  async getSimulationsByUserId(userId: number): Promise<Simulation[]> {
    const collection = getCollection(this.simulationsCollection);
    const simulations = await collection.find({ userId }).toArray();
    return simulations;
  }
}