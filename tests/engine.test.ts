import { GameEngine } from '../src/engine/gameEngine';
import { Player } from '../src/engine/types';

describe('GameEngine', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = new GameEngine();
  });

  describe('Initialization', () => {
    test('should initialize with empty board', () => {
      const board = game.getBoard();
      expect(board.squares).toEqual(Array(9).fill(null));
    });

    test('should start with X player', () => {
      expect(game.getCurrentPlayer()).toBe('X');
    });

    test('should start in playing state', () => {
      expect(game.getGameState()).toBe('playing');
    });

    test('should have empty move history', () => {
      expect(game.getMoveHistory()).toEqual([]);
    });
  });

  describe('Move Application', () => {
    test('should apply valid move', () => {
      const result = game.applyMove(0);
      expect(result).toBe(true);
      expect(game.getBoard().squares[0]).toBe('X');
      expect(game.getCurrentPlayer()).toBe('O');
    });

    test('should reject invalid move on occupied square', () => {
      game.applyMove(0);
      const result = game.applyMove(0);
      expect(result).toBe(false);
    });

    test('should reject invalid move on out of bounds', () => {
      const result = game.applyMove(9);
      expect(result).toBe(false);
    });

    test('should track move history', () => {
      game.applyMove(0);
      game.applyMove(1);
      const history = game.getMoveHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual({ index: 0, player: 'X' });
      expect(history[1]).toEqual({ index: 1, player: 'O' });
    });
  });

  describe('Win Detection', () => {
    test('should detect horizontal win', () => {
      // X | X | X
      // O | O | _
      // _ | _ | _
      game.applyMove(0); // X
      game.applyMove(3); // O
      game.applyMove(1); // X
      game.applyMove(4); // O
      game.applyMove(2); // X wins

      const result = game.isTerminal();
      expect(result.winner).toBe('X');
      expect(result.draw).toBe(false);
      expect(result.winningLine).toEqual([0, 1, 2]);
      expect(game.getGameState()).toBe('won');
    });

    test('should detect vertical win', () => {
      // X | O | _
      // X | O | _
      // X | _ | _
      game.applyMove(0); // X
      game.applyMove(1); // O
      game.applyMove(3); // X
      game.applyMove(4); // O
      game.applyMove(6); // X wins

      const result = game.isTerminal();
      expect(result.winner).toBe('X');
      expect(result.winningLine).toEqual([0, 3, 6]);
    });

    test('should detect diagonal win', () => {
      // X | O | _
      // O | X | _
      // _ | _ | X
      game.applyMove(0); // X
      game.applyMove(1); // O
      game.applyMove(4); // X
      game.applyMove(3); // O
      game.applyMove(8); // X wins

      const result = game.isTerminal();
      expect(result.winner).toBe('X');
      expect(result.winningLine).toEqual([0, 4, 8]);
    });

    test('should detect draw', () => {
      // X | O | X
      // X | O | O
      // O | X | X
      game.applyMove(0); // X
      game.applyMove(1); // O
      game.applyMove(2); // X
      game.applyMove(4); // O
      game.applyMove(3); // X
      game.applyMove(5); // O
      game.applyMove(7); // X
      game.applyMove(6); // O
      game.applyMove(8); // X

      const result = game.isTerminal();
      expect(result.winner).toBe(null);
      expect(result.draw).toBe(true);
      expect(game.getGameState()).toBe('draw');
    });
  });

  describe('Undo Functionality', () => {
    test('should undo last move', () => {
      game.applyMove(0);
      game.applyMove(1);
      
      const result = game.undoMove();
      expect(result).toBe(true);
      expect(game.getBoard().squares[1]).toBe(null);
      expect(game.getCurrentPlayer()).toBe('O');
      expect(game.getGameState()).toBe('playing');
    });

    test('should not undo when no moves', () => {
      const result = game.undoMove();
      expect(result).toBe(false);
    });

    test('should restore game state after undo', () => {
      game.applyMove(0);
      game.applyMove(1);
      game.applyMove(2);
      
      game.undoMove();
      expect(game.getBoard().squares[2]).toBe(null);
      expect(game.getCurrentPlayer()).toBe('X');
    });
  });

  describe('Reset Functionality', () => {
    test('should reset game to initial state', () => {
      game.applyMove(0);
      game.applyMove(1);
      game.applyMove(2);
      
      game.reset();
      
      expect(game.getBoard().squares).toEqual(Array(9).fill(null));
      expect(game.getCurrentPlayer()).toBe('X');
      expect(game.getGameState()).toBe('playing');
      expect(game.getMoveHistory()).toEqual([]);
    });
  });

  describe('Available Moves', () => {
    test('should return all empty squares initially', () => {
      const moves = game.getAvailableMoves();
      expect(moves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test('should return only empty squares after moves', () => {
      game.applyMove(0);
      game.applyMove(1);
      const moves = game.getAvailableMoves();
      expect(moves).toEqual([2, 3, 4, 5, 6, 7, 8]);
    });

    test('should return empty array when game is over', () => {
      // Force a win
      game.applyMove(0);
      game.applyMove(3);
      game.applyMove(1);
      game.applyMove(4);
      game.applyMove(2);
      
      const moves = game.getAvailableMoves();
      expect(moves).toEqual([]);
    });
  });

  describe('State Cloning', () => {
    test('should clone board state', () => {
      game.applyMove(0);
      game.applyMove(1);
      
      const cloned = game.cloneState();
      expect(cloned.squares).toEqual(game.getBoard().squares);
      expect(cloned).not.toBe(game.getBoard());
    });

    test('should generate unique board key', () => {
      game.applyMove(0);
      game.applyMove(1);
      
      const key = game.toKey();
      expect(key).toBe('XO_______');
    });
  });
});
