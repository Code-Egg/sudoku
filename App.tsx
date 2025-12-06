import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, GAME_CONFIGS, CellData, GeneratedReward } from './types';
import { generateSudoku, checkBoard } from './services/sudoku';
import { generateReward } from './services/geminiService';
import { playSound } from './services/audio';
import { Grid } from './components/Grid';
import { Numpad } from './components/Numpad';
import { RewardModal } from './components/RewardModal';
import { RotateCcw, Brain } from 'lucide-react';

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('4x4');
  const [cells, setCells] = useState<CellData[]>([]);
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [reward, setReward] = useState<GeneratedReward | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [isGeneratingReward, setIsGeneratingReward] = useState(false);

  // Initialize Game
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    playSound.restart();
    const config = GAME_CONFIGS[diff];
    const newCells = generateSudoku(config);
    setCells(newCells);
    setDifficulty(diff);
    setSelectedCellIndex(null);
    setIsGameComplete(false);
    setReward(null);
    setShowReward(false);
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    // Don't play sound on initial mount
    const config = GAME_CONFIGS['4x4'];
    const newCells = generateSudoku(config);
    setCells(newCells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Cell Click
  const handleCellClick = (index: number) => {
    if (!isGameComplete) {
      playSound.select();
      setSelectedCellIndex(index);
    }
  };

  // Handle Input
  const handleNumberInput = async (num: number) => {
    if (selectedCellIndex === null || isGameComplete) return;

    const newCells = [...cells];
    const cell = newCells[selectedCellIndex];

    if (cell.isFixed) return;

    // Update cell value
    cell.value = num;
    cell.isError = false; // Reset error state on new input
    setCells(newCells);
    playSound.input();

    // Check for win condition
    const config = GAME_CONFIGS[difficulty];
    const isWin = checkBoard(newCells, config);

    if (isWin) {
      playSound.win();
      setIsGameComplete(true);
      setShowReward(true);
      setIsGeneratingReward(true);
      
      // Call reward service
      const generatedReward = await generateReward();
      setReward(generatedReward);
      setIsGeneratingReward(false);
    }
  };

  const handleDelete = () => {
    if (selectedCellIndex === null || isGameComplete) return;
    const newCells = [...cells];
    const cell = newCells[selectedCellIndex];
    if (cell.isFixed) return;
    
    if (cell.value !== null) {
      playSound.delete();
      cell.value = null;
      cell.isError = false;
      setCells(newCells);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameComplete) return;
      
      const num = parseInt(e.key);
      if (!isNaN(num) && num > 0 && num <= GAME_CONFIGS[difficulty].size) {
        handleNumberInput(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      } else if (e.key === 'Escape') {
        setSelectedCellIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCellIndex, cells, difficulty, isGameComplete]);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-6 px-2 sm:px-4 font-sans">
      
      {/* Header */}
      <header className="w-full max-w-xl flex items-center justify-between mb-6 sm:mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Brain size={24} className="sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">PokéSudoku</h1>
        </div>
      </header>

      {/* Difficulty Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-1 w-full max-w-lg mx-auto overflow-x-auto">
        {(['4x4', '5x5', '6x6', '9x9'] as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => startNewGame(level)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
              ${difficulty === level 
                ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
              }
            `}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Main Game Area */}
      <main className="w-full max-w-xl flex flex-col items-center flex-1">
        
        <Grid 
          cells={cells}
          config={GAME_CONFIGS[difficulty]}
          selectedCellIndex={selectedCellIndex}
          onCellClick={handleCellClick}
        />

        <div className="mt-6 w-full flex justify-center">
          <Numpad 
            maxNumber={GAME_CONFIGS[difficulty].size} 
            onNumberClick={handleNumberInput}
            onDelete={handleDelete}
            disabled={isGameComplete}
          />
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex w-full max-w-xs sm:max-w-md gap-4">
          <button 
            onClick={() => startNewGame()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            <RotateCcw size={18} /> Restart
          </button>
        </div>

      </main>

      {/* Reward Modal */}
      <RewardModal 
        isOpen={showReward} 
        onClose={() => setShowReward(false)}
        reward={reward}
        isLoading={isGeneratingReward}
      />

      <footer className="mt-8 py-4 text-center text-slate-400 text-xs sm:text-sm">
        <p>Complete the puzzle to discover a new Pokémon!</p>
      </footer>
    </div>
  );
}