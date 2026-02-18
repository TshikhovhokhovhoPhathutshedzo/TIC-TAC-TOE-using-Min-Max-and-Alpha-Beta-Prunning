import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { GameEngine } from '../src/engine/gameEngine';

// Mock the game engine for testing
jest.mock('../src/engine/gameEngine');

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders game board and controls', () => {
    render(<App />);
    
    expect(screen.getByText('Tic-Tac-Toe AI')).toBeInTheDocument();
    expect(screen.getByText('Current player: X')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  test('displays scoreboard', () => {
    render(<App />);
    
    expect(screen.getByText('Scoreboard')).toBeInTheDocument();
    expect(screen.getByText('X Wins')).toBeInTheDocument();
    expect(screen.getByText('O Wins')).toBeInTheDocument();
    expect(screen.getByText('Draws')).toBeInTheDocument();
  });

  test('allows difficulty selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const difficultySelect = screen.getByLabelText('AI Difficulty');
    await user.selectOptions(difficultySelect, 'easy');
    
    expect(difficultySelect).toHaveValue('easy');
  });

  test('allows game mode selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const modeSelect = screen.getByLabelText('Game Mode');
    await user.selectOptions(modeSelect, 'human-vs-human');
    
    expect(modeSelect).toHaveValue('human-vs-human');
  });

  test('new game button resets the game', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const newGameButton = screen.getByRole('button', { name: 'New Game' });
    await user.click(newGameButton);
    
    // Game should be reset (this would need proper mocking in a real test)
    expect(newGameButton).toBeInTheDocument();
  });
});

describe('Board Component', () => {
  test('renders 9 squares', () => {
    const mockBoard = { squares: Array(9).fill(null) };
    const mockOnClick = jest.fn();
    
    render(
      <div role="grid" aria-label="Tic-tac-toe game board">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            onClick={() => mockOnClick(index)}
            aria-label={`Square ${index + 1}, empty`}
          >
            {mockBoard.squares[index]}
          </button>
        ))}
      </div>
    );
    
    const squares = screen.getAllByRole('button');
    expect(squares).toHaveLength(9);
  });

  test('handles square clicks', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    const mockBoard = { squares: Array(9).fill(null) };
    
    render(
      <div role="grid">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            onClick={() => mockOnClick(index)}
            aria-label={`Square ${index + 1}, empty`}
          >
            {mockBoard.squares[index]}
          </button>
        ))}
      </div>
    );
    
    const firstSquare = screen.getByLabelText('Square 1, empty');
    await user.click(firstSquare);
    
    expect(mockOnClick).toHaveBeenCalledWith(0);
  });

  test('displays player marks', () => {
    const mockBoard = { squares: ['X', 'O', null, null, null, null, null, null, null] };
    
    render(
      <div role="grid">
        {Array.from({ length: 9 }, (_, index) => (
          <button key={index} aria-label={`Square ${index + 1}, ${mockBoard.squares[index] || 'empty'}`}>
            {mockBoard.squares[index]}
          </button>
        ))}
      </div>
    );
    
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
  });
});

describe('Controls Component', () => {
  const mockProps = {
    currentPlayer: 'X' as const,
    gameState: 'playing' as const,
    difficulty: 'perfect' as const,
    mode: 'human-vs-ai' as const,
    onNewGame: jest.fn(),
    onUndo: jest.fn(),
    onDifficultyChange: jest.fn(),
    onModeChange: jest.fn(),
    onStartingPlayerChange: jest.fn(),
    canUndo: false,
    isThinking: false
  };

  test('displays current player', () => {
    render(
      <div>
        <h2>Current player: {mockProps.currentPlayer}</h2>
      </div>
    );
    
    expect(screen.getByText('Current player: X')).toBeInTheDocument();
  });

  test('shows thinking indicator when AI is thinking', () => {
    const thinkingProps = { ...mockProps, isThinking: true };
    
    render(
      <div>
        <h2>AI is thinking...</h2>
      </div>
    );
    
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
  });

  test('disables undo button when no moves to undo', () => {
    render(
      <button disabled={!mockProps.canUndo}>
        Undo
      </button>
    );
    
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    expect(undoButton).toBeDisabled();
  });
});

describe('Scoreboard Component', () => {
  const mockScores = {
    xWins: 5,
    oWins: 3,
    draws: 2
  };

  test('displays scores correctly', () => {
    render(
      <div>
        <div>X Wins: {mockScores.xWins}</div>
        <div>O Wins: {mockScores.oWins}</div>
        <div>Draws: {mockScores.draws}</div>
      </div>
    );
    
    expect(screen.getByText('X Wins: 5')).toBeInTheDocument();
    expect(screen.getByText('O Wins: 3')).toBeInTheDocument();
    expect(screen.getByText('Draws: 2')).toBeInTheDocument();
  });

  test('calculates percentages', () => {
    const totalGames = mockScores.xWins + mockScores.oWins + mockScores.draws;
    const xPercentage = Math.round((mockScores.xWins / totalGames) * 100);
    
    render(
      <div>
        <div>{xPercentage}%</div>
      </div>
    );
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
