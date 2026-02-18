import { Board, Player, AIMove, Difficulty } from './types';
import { AIAgent } from './aiInterfaces';

export class MinimaxAI implements AIAgent {
  private transpositionTable: Map<string, { score: number; depth: number }>;
  private nodesExpanded: number;

  constructor() {
    this.transpositionTable = new Map();
    this.nodesExpanded = 0;
  }

  getMove(board: Board, player: Player, difficulty: Difficulty = 'perfect'): AIMove {
    this.nodesExpanded = 0;
    this.transpositionTable.clear();

    const availableMoves = this.getAvailableMoves(board);
    if (availableMoves.length === 0) {
      return { index: -1, score: 0, nodesExpanded: 0 };
    }

    switch (difficulty) {
      case 'easy':
        return this.getRandomMove(availableMoves);
      case 'medium':
        return this.getMediumMove(board, player, availableMoves);
      case 'perfect':
      default:
        const result = this.minimax(board, player, 0, true, -Infinity, Infinity);
        return {
          index: result.move,
          score: result.score,
          nodesExpanded: this.nodesExpanded
        };
    }
  }

  private getRandomMove(availableMoves: number[]): AIMove {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return {
      index: availableMoves[randomIndex],
      score: 0,
      nodesExpanded: 1
    };
  }

  private getMediumMove(board: Board, player: Player, availableMoves: number[]): AIMove {
    // 70% chance to play optimally, 30% chance to play randomly
    if (Math.random() < 0.7) {
      const result = this.minimax(board, player, 0, true, -Infinity, Infinity);
      return {
        index: result.move,
        score: result.score,
        nodesExpanded: this.nodesExpanded
      };
    } else {
      return this.getRandomMove(availableMoves);
    }
  }

  private minimax(
    board: Board, 
    player: Player, 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number, 
    beta: number
  ): { move: number; score: number } {
    this.nodesExpanded++;

    const boardKey = this.toKey(board);
    
    // Check transposition table
    if (this.transpositionTable.has(boardKey)) {
      const cached = this.transpositionTable.get(boardKey)!;
      if (cached.depth >= depth) {
        return { move: -1, score: cached.score };
      }
    }

    const gameResult = this.evaluateTerminal(board);
    if (gameResult.winner !== null || gameResult.draw) {
      const score = this.evaluateTerminalScore(gameResult, player);
      this.transpositionTable.set(boardKey, { score, depth });
      return { move: -1, score };
    }

    const availableMoves = this.getOrderedMoves(board);
    let bestMove = availableMoves[0];
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of availableMoves) {
      // Make move
      const newBoard = this.makeMove(board, move, isMaximizing ? player : this.getOpponent(player));
      
      // Recursive call
      const result = this.minimax(newBoard, player, depth + 1, !isMaximizing, alpha, beta);
      
      // Update best move and score
      if (isMaximizing) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    this.transpositionTable.set(boardKey, { score: bestScore, depth });
    return { move: bestMove, score: bestScore };
  }

  private getAvailableMoves(board: Board): number[] {
    return board.squares
      .map((square, index) => square === null ? index : -1)
      .filter(index => index !== -1);
  }

  private getOrderedMoves(board: Board): number[] {
    const availableMoves = this.getAvailableMoves(board);
    
    // Move ordering: center, corners, edges
    const center = 4;
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];
    
    const orderedMoves: number[] = [];
    
    // Add center if available
    if (availableMoves.includes(center)) {
      orderedMoves.push(center);
    }
    
    // Add corners
    for (const corner of corners) {
      if (availableMoves.includes(corner)) {
        orderedMoves.push(corner);
      }
    }
    
    // Add edges
    for (const edge of edges) {
      if (availableMoves.includes(edge)) {
        orderedMoves.push(edge);
      }
    }
    
    return orderedMoves;
  }

  private makeMove(board: Board, index: number, player: Player): Board {
    const newSquares = [...board.squares];
    newSquares[index] = player;
    return { squares: newSquares };
  }

  private getOpponent(player: Player): Player {
    return player === 'X' ? 'O' : 'X';
  }

  private evaluateTerminal(board: Board): { winner: Player; draw: boolean; winningLine?: number[] } {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board.squares[a] && 
          board.squares[a] === board.squares[b] && 
          board.squares[a] === board.squares[c]) {
        return {
          winner: board.squares[a],
          draw: false,
          winningLine: line
        };
      }
    }

    const isDraw = board.squares.every(square => square !== null);
    return {
      winner: null,
      draw: isDraw,
      winningLine: undefined
    };
  }

  private evaluateTerminalScore(result: { winner: Player; draw: boolean }, aiPlayer: Player): number {
    if (result.draw) return 0;
    if (result.winner === aiPlayer) return 1;
    return -1;
  }

  private toKey(board: Board): string {
    return board.squares.map(square => square || '_').join('');
  }
}
