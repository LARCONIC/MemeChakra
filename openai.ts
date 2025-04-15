import OpenAI from "openai";
import { AiMemeResponse } from "@shared/schema";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "mock_key_for_development" });

/**
 * Generates meme text based on a prompt
 * @param prompt The user's meme idea prompt
 * @returns Object with topText and bottomText
 */
export async function generateMemeText(prompt: string): Promise<AiMemeResponse> {
  try {
    // If no API key is available, return mock data for development
    if (!process.env.OPENAI_API_KEY) {
      return getMockMemeText(prompt);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI specialized in creating funny desi memes. Generate a meme with a top text and bottom text based on the user's prompt. " +
            "The text should be short, punchy, and funny. Use Indian pop culture references and humor when appropriate. " +
            "The meme should be culturally relevant to Indian audiences. Respond in JSON format with 'topText' and 'bottomText' keys."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      topText: result.topText,
      bottomText: result.bottomText
    };
  } catch (error) {
    console.error("Error generating meme text with OpenAI:", error);
    
    // Fallback to mock data if API call fails
    return getMockMemeText(prompt);
  }
}

/**
 * Provides mock meme text responses for development or when API is unavailable
 */
function getMockMemeText(prompt: string): AiMemeResponse {
  const mockResponses = [
    { topText: "When your mom asks", bottomText: "if you've studied for exams" },
    { topText: "Nobody:", bottomText: "Indian parents when you get 99%" },
    { topText: "Me explaining to my boss", bottomText: "why I need a day off" },
    { topText: "My face when", bottomText: "the waiter brings the wrong order" },
    { topText: "Indian engineers", bottomText: "fixing things with jugaad" },
    { topText: "When your friend says", bottomText: "they'll be there in 5 minutes" },
    { topText: "That moment when", bottomText: "you find money in old jeans" },
    { topText: "Relatives at wedding:", bottomText: "Beta, when are you getting married?" }
  ];
  
  // Choose a random response
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
}
