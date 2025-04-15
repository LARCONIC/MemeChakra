import { Handler } from '@netlify/functions';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../../shared/schema';
import { OpenAI } from 'openai';

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate meme text using OpenAI API
 * @param prompt User's meme idea prompt
 * @returns Object with topText and bottomText
 */
async function generateMemeText(prompt: string) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a humorous meme creator specializing in Indian cultural context and Desi memes. 
          Generate concise and funny meme text in Hinglish (Hindi written in Roman script) for a meme template based on the user's prompt.
          Responses should be in JSON format with 'topText' and 'bottomText' fields, both in Hinglish. 
          Keep each text short (maximum 10 words) and punchy to fit on a meme.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating meme text:', error);
    return { topText: "मीम जेनरेशन एरर", bottomText: "कृपया दुबारा कोशिश करें" };
  }
}

export const handler: Handler = async (event, context) => {
  // Set headers for CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Extract the endpoint path from the function URL
  const path = event.path.replace('/.netlify/functions/api/', '');
  
  try {
    // Route handling based on path and HTTP method
    
    // GET templates
    if (path === 'templates' && event.httpMethod === 'GET') {
      const templates = await db.query.templates.findMany();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(templates)
      };
    }

    // GET templates by category
    if (path.startsWith('templates/category/') && event.httpMethod === 'GET') {
      const categorySlug = path.split('/').pop();
      
      if (categorySlug === 'all') {
        const templates = await db.query.templates.findMany();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(templates)
        };
      } else {
        const category = await db.query.categories.findFirst({
          where: (categories, { eq }) => eq(categories.slug, categorySlug || '')
        });
        
        if (!category) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Category not found' })
          };
        }
        
        const templates = await db.query.templates.findMany({
          where: (templates, { eq }) => eq(templates.categoryId, category.id)
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(templates)
        };
      }
    }

    // GET categories
    if (path === 'categories' && event.httpMethod === 'GET') {
      const categories = await db.query.categories.findMany();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categories)
      };
    }

    // POST AI meme generation
    if (path === 'ai/generate-meme' && event.httpMethod === 'POST') {
      const requestBody = JSON.parse(event.body || '{}');
      const { prompt } = requestBody;
      
      if (!prompt) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Prompt is required' })
        };
      }
      
      const memeText = await generateMemeText(prompt);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(memeText)
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: String(error) })
    };
  }
};