import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from './db';
import { templates, categories } from './schema';
import { generateMemeText } from './openai';
import { eq } from 'drizzle-orm';

export const handler: Handler = async (
  event: HandlerEvent, 
  context: HandlerContext
) => {
  try {
    const path = event.path.replace(/^\/api\//, '');
    const categorySlug = event.queryStringParameters?.category;

    switch (path) {
      case 'generate-text': {
        if (!event.body) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No request body provided' })
          };
        }

        const data = JSON.parse(event.body);
        const response = await generateMemeText(data.prompt);
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        };
      }

      case 'templates': {
        const query = db.select().from(templates);
        
        if (categorySlug && categorySlug !== 'all') {
          const [category] = await db.select()
            .from(categories)
            .where(eq(categories.slug, categorySlug));

          if (category) {
            const templatesWithCategory = await db.select()
              .from(templates)
              .where(eq(templates.category, category.slug));
            
            return {
              statusCode: 200,
              body: JSON.stringify(templatesWithCategory)
            };
          }
        }

        const allTemplates = await query;
        return {
          statusCode: 200,
          body: JSON.stringify(allTemplates)
        };
      }

      case 'categories': {
        const allCategories = await db.select().from(categories);
        return {
          statusCode: 200,
          body: JSON.stringify(allCategories)
        };
      }

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};