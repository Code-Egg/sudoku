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

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className={`
              aspect-square flex items-center justify-center
              text-xl sm:text-2xl font-bold rounded-xl shadow-sm
              transition-all duration-100 active:scale-95
              ${disabled 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-100 hover:border-indigo-200'
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
            aspect-square flex items-center justify-center
            rounded-xl shadow-sm transition-all duration-100 active:scale-95
            ${disabled
              ? 'bg-slate-100 text-slate-300'
              : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border-2 border-rose-100'
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
