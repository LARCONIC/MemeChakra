import OpenAI from "openai";
import { AiMemeResponse } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mockResponses: AiMemeResponse[] = [
  {
    text: "When mom says we have food at home",
    topText: "We have food at home",
    bottomText: "The food at home:"
  },
  {
    text: "When the code works but you don't know why",
    topText: "Code working",
    bottomText: "Me: No idea why"
  }
];

export async function generateMemeText(prompt: string): Promise<AiMemeResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return getMockMemeText();
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative meme text generator. Generate funny and witty text for memes.",
        },
        {
          role: "user",
          content: `Generate a funny meme text for the following prompt: ${prompt}. Return a JSON object with 'text', 'topText', and 'bottomText' properties.`,
        },
      ],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);
    return {
      text: result.text || `${result.topText} ${result.bottomText}`,
      topText: result.topText,
      bottomText: result.bottomText
    };
  } catch (error) {
    console.error("Error generating meme text:", error);
    return getMockMemeText();
  }
}

function getMockMemeText(): AiMemeResponse {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
}
