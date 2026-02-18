import React from 'react';

interface ScoreboardProps {
  scores: {
    xWins: number;
    oWins: number;
    draws: number;
  };
  onResetScores: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ scores, onResetScores }) => {
  const totalGames = scores.xWins + scores.oWins + scores.draws;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Scoreboard</h3>
        <button
          onClick={onResetScores}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          aria-label="Reset all scores"
        >
          Reset
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 p-3 rounded">
          <div className="text-2xl font-bold text-blue-800">{scores.xWins}</div>
          <div className="text-sm text-blue-600">X Wins</div>
          {totalGames > 0 && (
            <div className="text-xs text-blue-500">
              {Math.round((scores.xWins / totalGames) * 100)}%
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-2xl font-bold text-gray-800">{scores.draws}</div>
          <div className="text-sm text-gray-600">Draws</div>
          {totalGames > 0 && (
            <div className="text-xs text-gray-500">
              {Math.round((scores.draws / totalGames) * 100)}%
            </div>
          )}
        </div>
        
        <div className="bg-red-100 p-3 rounded">
          <div className="text-2xl font-bold text-red-800">{scores.oWins}</div>
          <div className="text-sm text-red-600">O Wins</div>
          {totalGames > 0 && (
            <div className="text-xs text-red-500">
              {Math.round((scores.oWins / totalGames) * 100)}%
            </div>
          )}
        </div>
      </div>
      
      {totalGames > 0 && (
        <div className="mt-3 text-center text-sm text-gray-600">
          Total games: {totalGames}
        </div>
      )}
    </div>
  );
};
