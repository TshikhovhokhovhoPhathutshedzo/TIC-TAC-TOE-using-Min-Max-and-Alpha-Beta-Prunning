import { useState, useCallback, useEffect } from 'react';
import { MinimaxAI } from '../engine/minimax';
import { Player, Difficulty, GameMode } from '../engine/types';

interface GameScores {
  xWins: number;
  oWins: number;
  draws: number;
}

interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  gameState: 'playing' | 'won' | 'draw';
  moveHistory: Array<{ index: number; player: Player }>;
  winner: Player | null;
  winningLine?: number[];
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameState: 'playing',
    moveHistory: [],
    winner: null
  }));
  
  const [ai] = useState<MinimaxAI>(new MinimaxAI());
  const [scores, setScores] = useState<GameScores>({ xWins: 0, oWins: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [config, setConfig] = useState({
    startingPlayer: 'X' as Player,
    difficulty: 'perfect' as Difficulty,
    mode: 'human-vs-ai' as GameMode,
    showThinking: true
  });

  const checkWinner = useCallback((board: (Player | null)[]): { winner: Player | null; draw: boolean; winningLine?: number[] } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], draw: false, winningLine: line };
      }
    }

    const isDraw = board.every(square => square !== null);
    return { winner: null, draw: isDraw };
  }, []);

  const handleSquareClick = useCallback(async (index: number) => {
    if (gameState.gameState !== 'playing') return;
    
    const mode = config.mode;
    
    // Check if it's human's turn
    const isHumanTurn = mode === 'human-vs-human' || 
                       (mode === 'human-vs-ai' && gameState.currentPlayer === config.startingPlayer);
    
    if (!isHumanTurn) return;

    // Make the move
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;
    
    const newMoveHistory = [...gameState.moveHistory, { index, player: gameState.currentPlayer }];
    const result = checkWinner(newBoard);
    
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      gameState: result.winner || result.draw ? (result.draw ? 'draw' : 'won') : 'playing',
      moveHistory: newMoveHistory,
      winner: result.winner,
      winningLine: result.winningLine
    };
    
    setGameState(newGameState);
    
    // Update scores if game ended
    if (result.winner || result.draw) {
      setScores(prev => {
        const newScores = { ...prev };
        if (result.draw) {
          newScores.draws++;
        } else if (result.winner === 'X') {
          newScores.xWins++;
        } else if (result.winner === 'O') {
          newScores.oWins++;
        }
        return newScores;
      });
    }
    
    // AI move if needed
    if (newGameState.gameState === 'playing' && mode === 'human-vs-ai') {
      await makeAIMove(newGameState);
    }
  }, [gameState, config, checkWinner]);

  const makeAIMove = useCallback(async (currentGameState: GameState) => {
    if (currentGameState.gameState !== 'playing') return;
    
    setIsThinking(true);
    
    // Add small delay to show thinking
    if (config.showThinking) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const aiMove = ai.getMove({ squares: currentGameState.board }, currentGameState.currentPlayer, config.difficulty);
    
    // Make the AI move
    const newBoard = [...currentGameState.board];
    newBoard[aiMove.index] = currentGameState.currentPlayer;
    
    const newMoveHistory = [...currentGameState.moveHistory, { index: aiMove.index, player: currentGameState.currentPlayer }];
    const result = checkWinner(newBoard);
    
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: currentGameState.currentPlayer === 'X' ? 'O' : 'X',
      gameState: result.winner || result.draw ? (result.draw ? 'draw' : 'won') : 'playing',
      moveHistory: newMoveHistory,
      winner: result.winner,
      winningLine: result.winningLine
    };
    
    setGameState(newGameState);
    
    // Update scores if game ended
    if (result.winner || result.draw) {
      setScores(prev => {
        const newScores = { ...prev };
        if (result.draw) {
          newScores.draws++;
        } else if (result.winner === 'X') {
          newScores.xWins++;
        } else if (result.winner === 'O') {
          newScores.oWins++;
        }
        return newScores;
      });
    }
    
    setIsThinking(false);
  }, [ai, config, checkWinner]);

  const handleNewGame = useCallback(() => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: config.startingPlayer,
      gameState: 'playing',
      moveHistory: [],
      winner: null
    });
    setIsThinking(false);
    setIsSimulationRunning(false);
  }, [config.startingPlayer]);

  const handleStartSimulation = useCallback(() => {
    if (config.mode === 'ai-vs-ai') {
      setGameState({
        board: Array(9).fill(null),
        currentPlayer: config.startingPlayer,
        gameState: 'playing',
        moveHistory: [],
        winner: null
      });
      setIsThinking(false);
      setIsSimulationRunning(true);
    }
  }, [config.mode, config.startingPlayer]);

  const handleUndo = useCallback(() => {
    if (gameState.moveHistory.length === 0) return;
    
    const newMoveHistory = [...gameState.moveHistory];
    const lastMove = newMoveHistory.pop()!;
    
    const newBoard = [...gameState.board];
    newBoard[lastMove.index] = null;
    
    setGameState({
      board: newBoard,
      currentPlayer: lastMove.player,
      gameState: 'playing',
      moveHistory: newMoveHistory,
      winner: null
    });
  }, [gameState]);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setConfig(prev => ({ ...prev, difficulty }));
  }, []);

  const handleModeChange = useCallback((mode: GameMode) => {
    setConfig(prev => ({ ...prev, mode }));
    // Reset game when changing mode
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: config.startingPlayer,
      gameState: 'playing',
      moveHistory: [],
      winner: null
    });
    setIsThinking(false);
  }, [config.startingPlayer]);

  const handleStartingPlayerChange = useCallback((player: Player) => {
    setConfig(prev => ({ ...prev, startingPlayer: player }));
    // Reset game when changing starting player
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: player,
      gameState: 'playing',
      moveHistory: [],
      winner: null
    });
    setIsThinking(false);
  }, []);

  const handleResetScores = useCallback(() => {
    setScores({ xWins: 0, oWins: 0, draws: 0 });
  }, []);

  // Determine if game has started (any moves made)
  const hasGameStarted = gameState.moveHistory.length > 0;
  const isGameInProgress = gameState.gameState === 'playing' && hasGameStarted;

  // Auto-start AI vs AI games only when simulation is running
  useEffect(() => {
    if (config.mode === 'ai-vs-ai' && isSimulationRunning && gameState.gameState === 'playing' && !isThinking) {
      const timer = setTimeout(() => {
        makeAIMove(gameState);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [config.mode, isSimulationRunning, gameState, isThinking, makeAIMove]);

  return {
    game: {
      getBoard: () => ({ squares: gameState.board }),
      getCurrentPlayer: () => gameState.currentPlayer,
      getGameState: () => gameState.gameState,
      getMoveHistory: () => gameState.moveHistory,
      isTerminal: () => ({ winner: gameState.winner, draw: gameState.gameState === 'draw', winningLine: gameState.winningLine })
    },
    scores,
    isThinking,
    isSimulationRunning,
    config,
    handleSquareClick,
    handleNewGame,
    handleStartSimulation,
    handleUndo,
    handleDifficultyChange,
    handleModeChange,
    handleStartingPlayerChange,
    handleResetScores,
    canUndo: gameState.moveHistory.length > 0,
    hasGameStarted,
    isGameInProgress
  };
};