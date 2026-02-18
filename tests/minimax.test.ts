import { MinimaxAI } from '../src/engine/minimax';
import { Board, Player } from '../src/engine/types';

describe('MinimaxAI', () => {
  let ai: MinimaxAI;

  beforeEach(() => {
    ai = new MinimaxAI();
  });

  describe('Perfect Play', () => {
    test('should block immediate win', () => {
      // X | O | _
      // X | _ | _
      // _ | _ | _
      const board: Board = {
        squares: ['X', 'O', null, 'X', null, null, null, null, null]
      };
      
      const move = ai.getMove(board, 'O', 'perfect');
      expect(move.index).toBe(6); // Should block X from winning
    });

    test('should take immediate win', () => {
      // X | O | _
      // X | O | _
      // _ | _ | _
      const board: Board = {
        squares: ['X', 'O', null, 'X', 'O', null, null, null, null]
      };
      
      const move = ai.getMove(board, 'O', 'perfect');
      expect(move.index).toBe(6); // Should win
    });

    test('should prefer center on empty board', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.index).toBe(4); // Center is optimal first move
    });

    test('should prefer corner over edge', () => {
      // _ | _ | _
      // _ | X | _
      // _ | _ | _
      const board: Board = {
        squares: [null, null, null, null, 'X', null, null, null, null]
      };
      
      const move = ai.getMove(board, 'O', 'perfect');
      const corners = [0, 2, 6, 8];
      expect(corners).toContain(move.index);
    });
  });

  describe('Difficulty Levels', () => {
    test('easy difficulty should make random moves', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const move = ai.getMove(board, 'X', 'easy');
      expect(move.nodesExpanded).toBe(1);
      expect(move.index).toBeGreaterThanOrEqual(0);
      expect(move.index).toBeLessThan(9);
    });

    test('medium difficulty should sometimes play optimally', () => {
      // Test multiple times to ensure randomness
      let optimalMoves = 0;
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        const board: Board = {
          squares: Array(9).fill(null)
        };
        
        const move = ai.getMove(board, 'X', 'medium');
        if (move.index === 4) { // Center is optimal
          optimalMoves++;
        }
      }
      
      // Should have some optimal moves (not all random)
      expect(optimalMoves).toBeGreaterThan(0);
    });

    test('perfect difficulty should always play optimally', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.index).toBe(4); // Center is always optimal
      expect(move.score).toBe(0); // Draw is optimal result
    });
  });

  describe('Terminal Position Evaluation', () => {
    test('should evaluate win for AI player', () => {
      // X | X | X
      // O | O | _
      // _ | _ | _
      const board: Board = {
        squares: ['X', 'X', 'X', 'O', 'O', null, null, null, null]
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.score).toBe(1); // Win for X
    });

    test('should evaluate loss for AI player', () => {
      // O | O | O
      // X | X | _
      // _ | _ | _
      const board: Board = {
        squares: ['O', 'O', 'O', 'X', 'X', null, null, null, null]
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.score).toBe(-1); // Loss for X
    });

    test('should evaluate draw', () => {
      // X | O | X
      // O | O | X
      // O | X | O
      const board: Board = {
        squares: ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O']
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.score).toBe(0); // Draw
    });
  });

  describe('Move Ordering', () => {
    test('should prefer center over corners', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.index).toBe(4);
    });

    test('should prefer corners over edges', () => {
      // _ | _ | _
      // _ | X | _
      // _ | _ | _
      const board: Board = {
        squares: [null, null, null, null, 'X', null, null, null, null]
      };
      
      const move = ai.getMove(board, 'O', 'perfect');
      const corners = [0, 2, 6, 8];
      expect(corners).toContain(move.index);
    });
  });

  describe('Performance', () => {
    test('should complete move quickly', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const startTime = performance.now();
      const move = ai.getMove(board, 'X', 'perfect');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should be very fast
      expect(move.nodesExpanded).toBeGreaterThan(0);
    });

    test('should expand reasonable number of nodes', () => {
      const board: Board = {
        squares: Array(9).fill(null)
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.nodesExpanded).toBeGreaterThan(0);
      expect(move.nodesExpanded).toBeLessThan(1000); // Should be efficient
    });
  });

  describe('Edge Cases', () => {
    test('should handle full board', () => {
      const board: Board = {
        squares: ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O']
      };
      
      const move = ai.getMove(board, 'X', 'perfect');
      expect(move.index).toBe(-1); // No moves available
    });

    test('should handle single empty square', () => {
      const board: Board = {
        squares: ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', null]
      };
      
      const move = ai.getMove(board, 'O', 'perfect');
      expect(move.index).toBe(8);
    });
  });
});
