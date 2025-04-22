import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSimulationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const apiRouter = app.route("/api");

  // Save simulation state
  app.post("/api/simulation/save", async (req, res) => {
    try {
      const simulationData = {
        userId: 1, // Default user for now
        name: `Simulation ${new Date().toLocaleDateString()}`,
        data: req.body,
        createdAt: new Date().toISOString()
      };

      // Validate input data
      const validatedData = insertSimulationSchema.parse(simulationData);
      
      // Save the simulation
      const savedSimulation = await storage.saveSimulation(validatedData);
      
      res.status(200).json({ 
        success: true, 
        message: "Simulation saved successfully", 
        data: savedSimulation 
      });
    } catch (error) {
      console.error("Error saving simulation:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false, 
          message: validationError.message 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to save simulation" 
        });
      }
    }
  });

  // Get saved simulations
  app.get("/api/simulation/list", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      const simulations = await storage.getSimulationsByUserId(userId);
      
      res.status(200).json({
        success: true,
        data: simulations
      });
    } catch (error) {
      console.error("Error fetching simulations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch simulations"
      });
    }
  });

  // Get a specific simulation
  app.get("/api/simulation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const simulation = await storage.getSimulation(id);
      
      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: "Simulation not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: simulation
      });
    } catch (error) {
      console.error("Error fetching simulation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch simulation"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
