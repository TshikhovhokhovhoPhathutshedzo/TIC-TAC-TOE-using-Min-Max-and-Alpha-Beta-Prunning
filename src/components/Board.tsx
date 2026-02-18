import React from 'react';
import { Square } from './Square';
import { Board as BoardType } from '../engine/types';

interface BoardProps {
  board: BoardType;
  onSquareClick: (index: number) => void;
  winningLine?: number[];
  isDisabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ 
  board, 
  onSquareClick, 
  winningLine = [], 
  isDisabled = false
}) => {
  const renderSquare = (index: number) => {
    const isHighlighted = winningLine.includes(index);
    const isSquareDisabled = isDisabled || board.squares[index] !== null;
    
    return (
      <Square
        key={index}
        value={board.squares[index]}
        onClick={() => onSquareClick(index)}
        isHighlighted={isHighlighted}
        isDisabled={isSquareDisabled}
        aria-label={`Square ${index + 1}, ${board.squares[index] || 'empty'}`}
      />
    );
  };

  return (
    <div 
      className="grid grid-cols-3 gap-2 p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300"
      role="grid"
      aria-label="Tic-tac-toe game board"
    >
      {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
    </div>
  );
};