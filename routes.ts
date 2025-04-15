import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiMemePromptSchema } from "@shared/schema";
import { generateMemeText } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Meme Text Generation API
  app.post("/api/meme/generate", async (req, res) => {
    try {
      const validation = aiMemePromptSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: validation.error.errors
        });
      }
      
      const { prompt } = validation.data;
      
      const memeText = await generateMemeText(prompt);
      
      return res.status(200).json(memeText);
    } catch (error) {
      console.error("Error generating meme text:", error);
      return res.status(500).json({ 
        message: "Failed to generate meme text",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      return res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({ 
        message: "Failed to fetch templates",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get templates by category
  app.get("/api/templates/category/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const templates = await storage.getTemplatesByCategory(slug);
      return res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching templates by category:", error);
      return res.status(500).json({ 
        message: "Failed to fetch templates by category",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ 
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
