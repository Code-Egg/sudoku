import React from 'react';
import { Eraser } from 'lucide-react';

interface NumpadProps {
  maxNumber: number;
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  disabled: boolean;
}

export const Numpad: React.FC<NumpadProps> = ({ maxNumber, onNumberClick, onDelete, disabled }) => {
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  // Dynamic grid columns based on count
  const getGridClass = () => {
    if (maxNumber <= 4) return 'grid-cols-5'; // 4 numbers + delete (1 row)
    if (maxNumber === 5) return 'grid-cols-3'; // 2 rows (3 top, 2+del bottom)
    if (maxNumber === 6) return 'grid-cols-4'; // 2 rows (4 top, 2+del bottom - or mixed)
    return 'grid-cols-5'; // 9 numbers + delete (2 rows)
  };

  return (
    <div className="w-full max-w-md mx-auto px-1">
      <div className={`grid ${getGridClass()} gap-2 sm:gap-3`}>
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className={`
              aspect-[5/4] sm:aspect-square flex items-center justify-center
              text-xl sm:text-2xl font-bold rounded-xl shadow-sm
              transition-all duration-100 active:scale-95 touch-manipulation
              ${disabled 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-200 shadow-indigo-100'
              }
            `}
          >
            {num}
          </button>
        ))}
        <button
          onClick={onDelete}
          disabled={disabled}
          className={`
            aspect-[5/4] sm:aspect-square flex items-center justify-center
            rounded-xl shadow-sm transition-all duration-100 active:scale-95 touch-manipulation
            ${disabled
              ? 'bg-slate-100 text-slate-300'
              : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border-2 border-rose-100 shadow-rose-100'
            }
          `}
          aria-label="Clear cell"
        >
          <Eraser size={24} />
        </button>
      </div>
    </div>
  );
};