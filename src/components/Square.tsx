import React from 'react';
import { Player } from '../engine/types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  'aria-label'?: string;
}

export const Square: React.FC<SquareProps> = ({ 
  value, 
  onClick, 
  isHighlighted = false, 
  isDisabled = false,
  'aria-label': ariaLabel 
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`
        w-20 h-20 border-2 border-gray-300 flex items-center justify-center text-3xl font-bold 
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${!isDisabled 
          ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 active:scale-95' 
          : 'cursor-not-allowed opacity-50'
        }
        ${isHighlighted 
          ? 'bg-yellow-200 border-yellow-400 shadow-lg' 
          : 'bg-white hover:shadow-md'
        }
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={ariaLabel || `Square ${value || 'empty'}`}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      type="button"
    >
      <span className="select-none">
        {value}
      </span>
    </button>
  );
};