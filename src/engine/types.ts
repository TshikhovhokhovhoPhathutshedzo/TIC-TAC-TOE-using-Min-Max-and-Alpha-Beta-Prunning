export type Player = 'X' | 'O' | null;
export type GameState = 'playing' | 'won' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'perfect';
export type GameMode = 'human-vs-ai' | 'human-vs-human' | 'ai-vs-ai';

export interface Board {
  squares: Player[];
}

export interface GameResult {
  winner: Player;
  draw: boolean;
  winningLine?: number[];
}

export interface Move {
  index: number;
  player: Player;
}

export interface GameConfig {
  startingPlayer: Player;
  difficulty: Difficulty;
  mode: GameMode;
  showThinking: boolean;
}

export interface AIMove {
  index: number;
  score: number;
  nodesExpanded: number;
}

export interface GameHistory {
  moves: Move[];
  results: GameResult[];
}
