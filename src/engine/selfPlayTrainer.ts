import { GameEngine } from './gameEngine';
import { MinimaxAI } from './minimax';
import { Player, GameResult } from './types';

export interface TrainingResult {
  gamesPlayed: number;
  aiWins: number;
  humanWins: number;
  draws: number;
  averageNodesExpanded: number;
  averageDecisionTime: number;
}

export class SelfPlayTrainer {
  private ai: MinimaxAI;
  private gameLogs: Array<{
    gameId: string;
    moves: Array<{ board: string; move: number; player: Player; score: number }>;
    result: GameResult;
    nodesExpanded: number;
    decisionTime: number;
  }>;

  constructor() {
    this.ai = new MinimaxAI();
    this.gameLogs = [];
  }

  async train(numGames: number = 100): Promise<TrainingResult> {
    const results: TrainingResult = {
      gamesPlayed: 0,
      aiWins: 0,
      humanWins: 0,
      draws: 0,
      averageNodesExpanded: 0,
      averageDecisionTime: 0
    };

    let totalNodesExpanded = 0;
    let totalDecisionTime = 0;

    for (let i = 0; i < numGames; i++) {
      const gameResult = await this.playGame(i);
      
      results.gamesPlayed++;
      if (gameResult.result.winner === 'X') {
        results.aiWins++;
      } else if (gameResult.result.winner === 'O') {
        results.humanWins++;
      } else {
        results.draws++;
      }

      totalNodesExpanded += gameResult.nodesExpanded;
      totalDecisionTime += gameResult.decisionTime;
    }

    results.averageNodesExpanded = totalNodesExpanded / numGames;
    results.averageDecisionTime = totalDecisionTime / numGames;

    return results;
  }

  private async playGame(gameId: number): Promise<{
    result: GameResult;
    nodesExpanded: number;
    decisionTime: number;
  }> {
    const game = new GameEngine();
    const gameLog = {
      gameId: `game_${gameId}`,
      moves: [] as Array<{ board: string; move: number; player: Player; score: number }>,
      result: { winner: null as Player, draw: false },
      nodesExpanded: 0,
      decisionTime: 0
    };

    let totalNodesExpanded = 0;
    let totalDecisionTime = 0;

    while (game.getGameState() === 'playing') {
      const currentPlayer = game.getCurrentPlayer();
      const board = game.getBoard();
      
      if (currentPlayer === 'X') {
        // AI move
        const startTime = performance.now();
        const aiMove = this.ai.getMove(board, 'X');
        const endTime = performance.now();
        
        const decisionTime = endTime - startTime;
        totalDecisionTime += decisionTime;
        totalNodesExpanded += aiMove.nodesExpanded;
        
        game.applyMove(aiMove.index);
        
        gameLog.moves.push({
          board: game.toKey(),
          move: aiMove.index,
          player: 'X',
          score: aiMove.score
        });
      } else {
        // Random move for opponent
        const availableMoves = game.getAvailableMoves();
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        game.applyMove(randomMove);
        
        gameLog.moves.push({
          board: game.toKey(),
          move: randomMove,
          player: 'O',
          score: 0
        });
      }
    }

    const result = game.isTerminal();
    gameLog.result = result;
    gameLog.nodesExpanded = totalNodesExpanded;
    gameLog.decisionTime = totalDecisionTime;

    this.gameLogs.push(gameLog);

    return {
      result,
      nodesExpanded: totalNodesExpanded,
      decisionTime: totalDecisionTime
    };
  }

  getGameLogs(): typeof this.gameLogs {
    return [...this.gameLogs];
  }

  exportLogs(): string {
    return JSON.stringify(this.gameLogs, null, 2);
  }

  importLogs(logsJson: string): void {
    this.gameLogs = JSON.parse(logsJson);
  }
}
