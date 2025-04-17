import express from "express";
import { setupRoutes } from "./routes";
import { setupVite } from "./vite";

export async function createServer() {
  const app = express();
  
  app.use(express.json());
  
  if (process.env.NODE_ENV === 'development') {
    await setupVite(app);
  }
  
  const server = await setupRoutes(app);
  
  return server;
}
