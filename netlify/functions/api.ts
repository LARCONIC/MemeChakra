import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../../src/lib/db';
import { templates, categories } from '../../src/lib/schema';
import { eq } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const path = event.path.replace(/^\/api\//, '');
    const categorySlug = event.queryStringParameters?.category;

    switch (path) {
      case 'generate-text': {
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No request body provided' })
          };
        }

        if (!process.env.GEMINI_API_KEY) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'AI features are not configured' })
          };
        }

        const { prompt } = JSON.parse(event.body);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const promptText = `Create a funny meme in Hinglish (mix of Hindi and English) with two parts: top text and bottom text.
        The meme should be relatable to Indian audience.
        Context: ${prompt}
        Format your response as a JSON with this exact structure: {"topText": "your top text", "bottomText": "your bottom text"}
        Make it funny and culturally relevant.`;

        const result = await model.generateContent(promptText);
        const response = result.response;
        const text = response.text();
        
        try {
          const memeText = JSON.parse(text);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(memeText)
          };
        } catch {
          const lines = text.split("\n").filter(line => line.trim());
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              topText: lines[0] || "",
              bottomText: lines[1] || ""
            })
          };
        }
      }

      case 'templates': {
        const templatesList = await db.query.templates.findMany();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(templatesList)
        };
      }

      case 'categories': {
        const categoriesList = await db.query.categories.findMany();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(categoriesList)
        };
      }

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};