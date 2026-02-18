import { Board, Player, GameResult, Move, GameConfig } from './types';

export class GameEngine {
  private board: Board;
  private currentPlayer: Player;
  private gameState: 'playing' | 'won' | 'draw';
  private moveHistory: Move[];
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = {
      startingPlayer: 'X',
      difficulty: 'perfect',
      mode: 'human-vs-ai',
      showThinking: true,
      ...config
    };
    
    this.board = { squares: Array(9).fill(null) };
    this.currentPlayer = this.config.startingPlayer;
    this.gameState = 'playing';
    this.moveHistory = [];
  }

  getBoard(): Board {
    return { squares: [...this.board.squares] };
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getGameState(): 'playing' | 'won' | 'draw' {
    return this.gameState;
  }

  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  getAvailableMoves(): number[] {
    if (this.gameState !== 'playing') return [];
    
    return this.board.squares
      .map((square, index) => square === null ? index : -1)
      .filter(index => index !== -1);
  }

  applyMove(index: number): boolean {
    if (this.gameState !== 'playing' || this.board.squares[index] !== null) {
      return false;
    }

    const move: Move = {
      index,
      player: this.currentPlayer
    };

    this.board.squares[index] = this.currentPlayer;
    this.moveHistory.push(move);

    const result = this.checkGameResult();
    if (result.winner || result.draw) {
      this.gameState = result.draw ? 'draw' : 'won';
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  undoMove(): boolean {
    if (this.moveHistory.length === 0) return false;

    const lastMove = this.moveHistory.pop()!;
    this.board.squares[lastMove.index] = null;
    
    this.gameState = 'playing';
    this.currentPlayer = lastMove.player;

    return true;
  }

  reset(): void {
    this.board = { squares: Array(9).fill(null) };
    this.currentPlayer = this.config.startingPlayer;
    this.gameState = 'playing';
    this.moveHistory = [];
  }

  isTerminal(): GameResult {
    return this.checkGameResult();
  }

  cloneState(): Board {
    return { squares: [...this.board.squares] };
  }

  toKey(): string {
    return this.board.squares.map(square => square || '_').join('');
  }

  private checkGameResult(): GameResult {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (this.board.squares[a] && 
          this.board.squares[a] === this.board.squares[b] && 
          this.board.squares[a] === this.board.squares[c]) {
        return {
          winner: this.board.squares[a],
          draw: false,
          winningLine: line
        };
      }
    }

    const isDraw = this.board.squares.every(square => square !== null);
    return {
      winner: null,
      draw: isDraw,
      winningLine: undefined
    };
  }
}
