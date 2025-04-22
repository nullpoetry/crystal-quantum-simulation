import { users, type User, type InsertUser, simulations, type Simulation, type InsertSimulation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulation(id: number): Promise<Simulation | undefined>;
  getSimulationsByUserId(userId: number): Promise<Simulation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private simulations: Map<number, Simulation>;
  private currentUserId: number;
  private currentSimulationId: number;

  constructor() {
    this.users = new Map();
    this.simulations = new Map();
    this.currentUserId = 1;
    this.currentSimulationId = 1;
    
    // Create a default user
    this.createUser({
      username: "demo",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const id = this.currentSimulationId++;
    const simulation: Simulation = { ...insertSimulation, id };
    this.simulations.set(id, simulation);
    return simulation;
  }
  
  async getSimulation(id: number): Promise<Simulation | undefined> {
    return this.simulations.get(id);
  }
  
  async getSimulationsByUserId(userId: number): Promise<Simulation[]> {
    return Array.from(this.simulations.values()).filter(
      (simulation) => simulation.userId === userId
    );
  }
}

export const storage = new MemStorage();
