import { GeneratedReward } from '../types';

// Using PokeAPI official artwork
const REWARD_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Gen 1 Pokemon
const MAX_IMAGE_ID = 1024;

export const generateReward = async (): Promise<GeneratedReward> => {
  const randomId = Math.floor(Math.random() * MAX_IMAGE_ID) + 1;
  const imageUrl = `${REWARD_IMAGE_BASE_URL}/${randomId}.png`;
  
  let name = `Pokémon #${randomId}`;

  try {
    // Fetch Pokemon species data to get localized names
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
    if (response.ok) {
      const data = await response.json();
      
      // Try to find Traditional Chinese (zh-Hant) or Simplified Chinese (zh-Hans)
      const chineseNameEntry = data.names.find(
        (n: any) => n.language.name === 'zh-Hant' || n.language.name === 'zh-Hans'
      );

      if (chineseNameEntry) {
        name = chineseNameEntry.name;
      } else {
        // Fallback to English name if Chinese not found
        const enNameEntry = data.names.find((n: any) => n.language.name === 'en');
        if (enNameEntry) {
          name = enNameEntry.name;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch Pokémon name:", error);
    // Fallback is already set to "Pokémon #ID"
  }

  return {
    imageUrl,
    description: `你發現了 ${name}!`
  };
};