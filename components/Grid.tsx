import React from 'react';
import { CellData, GameConfig } from '../types';
import { getCellIndex } from '../services/sudoku';

interface GridProps {
  cells: CellData[];
  config: GameConfig;
  selectedCellIndex: number | null;
  onCellClick: (index: number) => void;
}

export const Grid: React.FC<GridProps> = ({ cells, config, selectedCellIndex, onCellClick }) => {
  const { size, boxWidth, boxHeight } = config;

  // Calculate borders based on box configuration
  const getBorderClasses = (row: number, col: number) => {
    let classes = 'border-slate-200 ';
    
    // Right border
    // Only apply thick border if it's a block boundary AND not the edge of the grid
    if ((col + 1) % boxWidth === 0 && col !== size - 1) {
      classes += 'border-r-2 border-r-indigo-400 ';
    } else {
      classes += 'border-r ';
    }

    // Bottom border
    if ((row + 1) % boxHeight === 0 && row !== size - 1) {
      classes += 'border-b-2 border-b-indigo-400 ';
    } else {
      classes += 'border-b ';
    }
    
    // Left border (first col)
    if (col === 0) classes += 'border-l-2 border-l-slate-800 ';
    // Top border (first row)
    if (row === 0) classes += 'border-t-2 border-t-slate-800 ';
    
    // Right outer
    if (col === size - 1) classes += 'border-r-2 border-r-slate-800 ';
    // Bottom outer
    if (row === size - 1) classes += 'border-b-2 border-b-slate-800 ';

    return classes;
  };

  const getFontSize = () => {
    if (size === 9) return 'text-lg sm:text-2xl md:text-3xl';
    if (size === 6) return 'text-2xl sm:text-3xl md:text-4xl';
    if (size === 5) return 'text-3xl sm:text-4xl';
    return 'text-3xl sm:text-4xl';
  };

  const getMaxWidth = () => {
    if (size === 9) return 'max-w-lg'; // Allow full width up to lg
    if (size === 6) return 'max-w-md';
    if (size === 5) return 'max-w-sm';
    return 'max-w-xs'; // 4x4
  };

  return (
    <div 
      className={`grid bg-slate-800 select-none shadow-xl rounded-lg overflow-hidden mx-auto w-full ${getMaxWidth()}`}
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell) => {
        const index = getCellIndex(cell.row, cell.col, size);
        const isSelected = selectedCellIndex === index;
        
        // Dynamic classes
        let bgClass = 'bg-white';
        if (cell.isFixed) bgClass = 'bg-slate-50';
        if (isSelected) bgClass = 'bg-indigo-200';
        else if (cell.value !== null && !cell.isFixed) bgClass = 'bg-indigo-50';
        
        const textClass = cell.isFixed 
          ? 'text-slate-900 font-bold' 
          : cell.isError 
            ? 'text-rose-500 font-medium' 
            : 'text-indigo-600 font-medium';

        return (
          <div
            key={`${cell.row}-${cell.col}`}
            onClick={() => onCellClick(index)}
            className={`
              relative aspect-square flex items-center justify-center
              cursor-pointer
              transition-colors duration-75
              ${getBorderClasses(cell.row, cell.col)}
              ${bgClass}
              ${textClass}
              ${getFontSize()}
            `}
          >
            {cell.value}
          </div>
        );
      })}
    </div>
  );
};