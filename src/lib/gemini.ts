import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiMemeResponse } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const mockResponses: AiMemeResponse[] = [
  {
    text: "Jab mummy kehti hai ghar pe khana hai",
    topText: "Ghar pe khana hai",
    bottomText: "Ghar ka khana:"
  },
  {
    text: "Jab code chal jata hai par pata nahi kaise",
    topText: "Code working",
    bottomText: "Main: Kaise ho gaya?"
  }
];

export async function generateMemeText(prompt: string): Promise<AiMemeResponse> {
  if (!process.env.GEMINI_API_KEY) {
    return getMockMemeText();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt_text = `Create a funny meme in Hinglish (mix of Hindi and English) with two parts: top text and bottom text.
    The meme should be relatable to Indian audience.
    Context: ${prompt}
    Format your response as a JSON with this exact structure: {"topText": "your top text", "bottomText": "your bottom text"}
    Make it funny and culturally relevant.`;

    const result = await model.generateContent(prompt_text);
    const response = result.response;
    const text = response.text();
    
    try {
      const memeText = JSON.parse(text);
      return {
        text: `${memeText.topText} ${memeText.bottomText}`,
        topText: memeText.topText,
        bottomText: memeText.bottomText
      };
    } catch {
      // If JSON parsing fails, use line breaks to split text
      const lines = text.split("\n").filter(line => line.trim());
      return {
        text: lines.join(" "),
        topText: lines[0] || "",
        bottomText: lines[1] || ""
      };
    }
  } catch (error) {
    console.error("Error generating meme text:", error);
    return getMockMemeText();
  }
}

function getMockMemeText(): AiMemeResponse {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
}