import { GeneratedReward } from '../types';

// Replace this URL with your own base URL.
// Ensure images are named 1.jpg, 2.jpg, etc.
// For this demo, using PokeAPI official artwork which fits the theme perfectly.
const REWARD_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// The number of images available (e.g., 151 for Gen 1 Pokemon)
const MAX_IMAGE_ID = 151;

export const generateReward = async (): Promise<GeneratedReward> => {
  // Simulate a short network delay for better UX (feeling of "unlocking")
  await new Promise(resolve => setTimeout(resolve, 600));

  const randomId = Math.floor(Math.random() * MAX_IMAGE_ID) + 1;
  
  // Construct the URL. Note: PokeAPI uses .png, change to .jpg if your server uses jpg.
  const imageUrl = `${REWARD_IMAGE_BASE_URL}/${randomId}.png`;

  return {
    imageUrl,
    description: `You discovered Pokémon #${randomId}!`
  };
};