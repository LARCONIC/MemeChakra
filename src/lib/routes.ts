import express from "express";
import { createServer, type Server } from "http";
import { aiMemePromptSchema } from "@/shared/schema";
import { generateMemeText } from "@lib/openai";

export async function setupRoutes(app: express.Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
