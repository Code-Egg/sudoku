export type Difficulty = '4x4' | '5x5' | '6x6' | '9x9';

export interface CellData {
  row: number;
  col: number;
  value: number | null;
  isFixed: boolean; // Part of the initial puzzle
  isError: boolean; // User entered an invalid number
  notes: number[]; // Pencil marks (optional future feature)
}

export interface GameConfig {
  size: number;
  boxWidth: number;
  boxHeight: number;
  emptyCells: number; // Approximation
}

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  '4x4': { size: 4, boxWidth: 2, boxHeight: 2, emptyCells: 6 },
  '5x5': { size: 5, boxWidth: 5, boxHeight: 1, emptyCells: 10 }, // Latin Square (Rows are blocks)
  '6x6': { size: 6, boxWidth: 3, boxHeight: 2, emptyCells: 18 },
  '9x9': { size: 9, boxWidth: 3, boxHeight: 3, emptyCells: 40 },
};

export interface GeneratedReward {
  imageUrl: string;
  description: string;
}