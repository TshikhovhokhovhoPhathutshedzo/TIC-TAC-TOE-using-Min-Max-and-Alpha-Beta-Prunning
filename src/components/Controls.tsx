import React from 'react';
import { Difficulty, GameMode, Player } from '../engine/types';
import { CustomDropdown } from './CustomDropdown';

interface ControlsProps {
  currentPlayer: Player;
  gameState: 'playing' | 'won' | 'draw';
  difficulty: Difficulty;
  mode: GameMode;
  onNewGame: () => void;
  onStartSimulation: () => void;
  onUndo: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: GameMode) => void;
  onStartingPlayerChange: (player: Player) => void;
  canUndo: boolean;
  isThinking: boolean;
  isSimulationRunning: boolean;
  hasGameStarted: boolean;
  isGameInProgress: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  currentPlayer,
  gameState,
  difficulty,
  mode,
  onNewGame,
  onStartSimulation,
  onUndo,
  onDifficultyChange,
  onModeChange,
  onStartingPlayerChange,
  canUndo,
  isThinking,
  isSimulationRunning,
  hasGameStarted,
  isGameInProgress
}) => {
  const getGameStatusText = () => {
    if (isThinking) return 'AI is thinking...';
    if (gameState === 'won') return `Player ${currentPlayer === 'X' ? 'O' : 'X'} wins!`;
    if (gameState === 'draw') return "It's a draw!";
    return `Current player: ${currentPlayer}`;
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy - Random moves' },
    { value: 'medium', label: 'Medium - Mixed strategy' },
    { value: 'perfect', label: 'Perfect - Optimal play' }
  ];

  const modeOptions = [
    { value: 'human-vs-ai', label: 'Human vs AI' },
    { value: 'human-vs-human', label: 'Human vs Human' },
    { value: 'ai-vs-ai', label: 'AI vs AI' }
  ];

  const startingPlayerOptions = [
    { value: 'X', label: 'X (First)' },
    { value: 'O', label: 'O (Second)' }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      {/* Game Status */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151' }}>
          {getGameStatusText()}
        </h2>
      </div>

      {/* Game Controls */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {mode === 'ai-vs-ai' ? (
          <button
            onClick={onStartSimulation}
            disabled={isSimulationRunning}
            style={{
              padding: '12px 24px',
              backgroundColor: isSimulationRunning ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isSimulationRunning ? 'default' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSimulationRunning) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSimulationRunning) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isSimulationRunning ? 'Simulation Running...' : 'Start Simulation'}
          </button>
        ) : (
          <button
            onClick={onNewGame}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            New Game
          </button>
        )}
        
        <button
          onClick={onUndo}
          disabled={!canUndo || isSimulationRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: canUndo && !isSimulationRunning ? '#6b7280' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: canUndo && !isSimulationRunning ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (canUndo && !isSimulationRunning) {
              e.currentTarget.style.backgroundColor = '#4b5563';
            }
          }}
          onMouseLeave={(e) => {
            if (canUndo && !isSimulationRunning) {
              e.currentTarget.style.backgroundColor = '#6b7280';
            }
          }}
        >
          Undo
        </button>
      </div>

      {/* Settings */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: '20px' }}>
          Game Settings
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Difficulty */}
          <CustomDropdown
            label="AI Difficulty"
            value={difficulty}
            options={difficultyOptions}
            onChange={(value) => onDifficultyChange(value as Difficulty)}
            disabled={isGameInProgress}
          />

          {/* Game Mode */}
          <CustomDropdown
            label="Game Mode"
            value={mode}
            options={modeOptions}
            onChange={(value) => onModeChange(value as GameMode)}
            disabled={isGameInProgress}
          />

          {/* Starting Player */}
          <CustomDropdown
            label="Starting Player"
            value={currentPlayer || 'X'}
            options={startingPlayerOptions}
            onChange={(value) => onStartingPlayerChange(value as Player)}
            disabled={isGameInProgress}
          />
        </div>

        {/* Settings Info */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#6b7280', 
          backgroundColor: '#f9fafb', 
          padding: '12px', 
          borderRadius: '6px',
          marginTop: '20px'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Easy:</strong> AI makes random moves • 
            <strong> Medium:</strong> AI mixes optimal and random moves • 
            <strong> Perfect:</strong> AI never loses
          </p>
          <p style={{ margin: '0' }}>
            {mode === 'ai-vs-ai' 
              ? (isSimulationRunning 
                  ? 'AI vs AI simulation is running. Settings are locked during simulation.'
                  : 'Select AI vs AI mode and click "Start Simulation" to watch AI play against itself.'
                )
              : (isGameInProgress 
                  ? 'Settings are locked during gameplay. Start a new game to change settings.'
                  : hasGameStarted 
                    ? 'Game has ended. You can change settings for the next game.'
                    : 'Configure your game settings before starting to play.'
                )
            }
          </p>
        </div>
      </div>
    </div>
  );
};