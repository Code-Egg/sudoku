import { CellData, GameConfig } from '../types';

// Helper to check if a value is valid in a specific position
const isValid = (
  board: (number | null)[][],
  row: number,
  col: number,
  num: number,
  config: GameConfig
): boolean => {
  const { size, boxWidth, boxHeight } = config;

  // Check Row
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num && x !== col) return false;
  }

  // Check Col
  for (let y = 0; y < size; y++) {
    if (board[y][col] === num && y !== row) return false;
  }

  // Check Box
  // For 3x3 with boxHeight 1, boxWidth 3, it effectively checks the row again if we aren't careful. 
  // Standard Sudoku box check:
  const startRow = Math.floor(row / boxHeight) * boxHeight;
  const startCol = Math.floor(col / boxWidth) * boxWidth;

  for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
      if (board[startRow + i][startCol + j] === num) {
        // Don't check self
        if ((startRow + i) !== row || (startCol + j) !== col) {
           return false;
        }
      }
    }
  }

  return true;
};

// Solve the board using backtracking
const solve = (board: (number | null)[][], config: GameConfig): boolean => {
  const { size } = config;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) {
        // Try numbers 1 to size
        const nums = Array.from({ length: size }, (_, i) => i + 1);
        // Shuffle for randomness
        nums.sort(() => Math.random() - 0.5);

        for (const num of nums) {
          if (isValid(board, row, col, num, config)) {
            board[row][col] = num;
            if (solve(board, config)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generateSudoku = (config: GameConfig): CellData[] => {
  const { size, emptyCells } = config;

  // 1. Initialize empty board
  const board: (number | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );

  // 2. Fill diagonal boxes first (they are independent) to speed up solving
  // Only applies if box logic holds standard separation. 
  // For 3x3 (1x3 blocks?), it's just rows. We can just run solve().
  // For larger grids, filling diagonals helps randomness.
  if (size >= 6) {
      const boxCount = size / config.boxWidth; // This logic varies, let's keep it simple and just solve.
      // Actually, for 9x9, filling (0,0), (3,3), (6,6) blocks independently is valid.
      // For 6x6 (2x3), blocks are (0,0), (0,3), (2,0)... blocks are not strictly diagonal in the same simple square way.
      // Let's just trust the solver is fast enough for <9x9 and adequate for 9x9.
  }

  // 3. Solve to get a full valid board
  solve(board, config);

  // 4. Remove elements to create puzzle
  let attempts = emptyCells;
  while (attempts > 0) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (board[r][c] !== null) {
      board[r][c] = null;
      attempts--;
      // Ideally we check if unique solution exists here, but for a simple app, skipping uniqueness check is acceptable for responsiveness.
    }
  }

  // 5. Convert to CellData flat array or structured
  const cells: CellData[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = board[r][c];
      cells.push({
        row: r,
        col: c,
        value: val,
        isFixed: val !== null,
        isError: false,
        notes: [],
      });
    }
  }

  return cells;
};

export const checkBoard = (cells: CellData[], config: GameConfig): boolean => {
  // Reconstruct 2D board
  const board: (number | null)[][] = Array.from({ length: config.size }, () =>
    Array(config.size).fill(null)
  );
  
  let isFull = true;

  cells.forEach(c => {
    board[c.row][c.col] = c.value;
    if (c.value === null) isFull = false;
  });

  if (!isFull) return false;

  // Check validity
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      const val = board[r][c];
      if (val === null) return false;
      // Temporarily clear cell to check if valid placement
      board[r][c] = null;
      const valid = isValid(board, r, c, val, config);
      board[r][c] = val;
      if (!valid) return false;
    }
  }

  return true;
};

export const getCellIndex = (row: number, col: number, size: number) => row * size + col;
