export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CellData {
  row: number;
  col: number;
  value: number | null;
  isFixed: boolean; // Part of the initial puzzle
  isError: boolean; // User entered an invalid number
  notes: number[]; // Pencil marks (optional future feature, but good to have in structure)
}

export interface GameConfig {
  size: number;
  boxWidth: number;
  boxHeight: number;
  emptyCells: number; // Approximation
}

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  EASY: { size: 3, boxWidth: 3, boxHeight: 1, emptyCells: 4 }, // 3x3 Latin Squareish (Blocks logic tricky here, treating as rows/cols only effectively)
  MEDIUM: { size: 6, boxWidth: 3, boxHeight: 2, emptyCells: 18 }, // 6x6, 2x3 blocks
  HARD: { size: 9, boxWidth: 3, boxHeight: 3, emptyCells: 40 }, // Standard Sudoku
};

export interface GeneratedReward {
  imageUrl: string;
  description: string;
}
