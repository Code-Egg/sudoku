import { GoogleGenAI } from "@google/genai";
import { GeneratedReward } from '../types';

const POKEMON_TYPES = [
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Ghost', 'Fairy', 'Steel'
];

export const generateReward = async (): Promise<GeneratedReward> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Pick a random type for variety
    const randomType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
    const prompt = `A cute, high-quality, 3D render style image of a newly discovered ${randomType}-type Pokémon. Vibrant colors, plain background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Fast image generation
      contents: {
        parts: [{ text: prompt }]
      },
      // No schema or mime type for image model usually needed for basic gen unless strict
    });

    let imageUrl = '';
    
    // Extract image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
        throw new Error("No image generated");
    }

    return {
      imageUrl,
      description: `A rare ${randomType}-type Pokémon appeared!`
    };

  } catch (error) {
    console.error("Reward generation failed:", error);
    // Fallback if API fails
    return {
      imageUrl: 'https://picsum.photos/400/400?blur=2',
      description: 'A mysterious shadow...'
    };
  }
};
