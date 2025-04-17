import { Handler } from "@netlify/functions";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Client } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as schema from "../shared/schema";

// Initialize Neon client
const sql = new Client({ connectionString: process.env.DATABASE_URL });
sql.connect();

// Initialize database
const db = drizzle(sql, { schema });

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  try {
    const path = event.path.replace("/.netlify/functions/api", "");
    const segments = path.split("/").filter(Boolean);

    if (event.httpMethod === "GET") {
      // Get all templates
      if (path === "/templates") {
        const templates = await db.query.templates.findMany();
        return { statusCode: 200, headers, body: JSON.stringify(templates) };
      }

      // Get templates by category
      if (segments[0] === "templates" && segments[1] === "category") {
        const templates = await db.query.templates.findMany({
          where: (templates, { eq }) => eq(templates.category, segments[2]),
        });
        return { statusCode: 200, headers, body: JSON.stringify(templates) };
      }

      // Get all categories
      if (path === "/categories") {
        const categories = await db.query.categories.findMany();
        return { statusCode: 200, headers, body: JSON.stringify(categories) };
      }
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      // Generate meme text with AI
      if (path === "/ai/generate-meme") {
        if (!process.env.GEMINI_API_KEY) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "AI features are not configured" }),
          };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Create a funny meme with two parts: top text and bottom text. Context: ${body.prompt}. Format: JSON with topText and bottomText fields.`;
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        try {
          const memeText = JSON.parse(text);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(memeText),
          };
        } catch {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              topText: text.split("\n")[0],
              bottomText: text.split("\n")[1] || "",
            }),
          };
        }
      }

      // Save generated meme
      if (path === "/memes") {
        const newMeme = await db.insert(schema.memes).values(body);
        return { statusCode: 201, headers, body: JSON.stringify(newMeme) };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};