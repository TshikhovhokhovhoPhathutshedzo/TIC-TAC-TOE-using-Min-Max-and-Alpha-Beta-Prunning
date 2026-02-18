import { Board, Player, AIMove, Difficulty } from './types';

export interface AIAgent {
  getMove(board: Board, player: Player, difficulty?: Difficulty): AIMove;
  train?(options?: any): Promise<void>;
}

export interface MinimaxOptions {
  depth?: number;
  useAlphaBeta?: boolean;
  useMemoization?: boolean;
  useMoveOrdering?: boolean;
  maxDepth?: number;
}
