import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { Scoreboard } from './components/Scoreboard';
import { useGame } from './hooks/useGame';

function App() {
  const {
    game,
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
    canUndo,
    hasGameStarted,
    isGameInProgress
  } = useGame();

  const gameResult = game.isTerminal();
  const winningLine = gameResult.winningLine || [];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', 
      padding: '32px 0' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px' 
      }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '8px' 
          }}>
            Tic-Tac-Toe AI
          </h1>
          <p style={{ color: '#6b7280' }}>
            Play against an AI opponent using the Minimax algorithm
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Game Board */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <Board
                board={game.getBoard()}
                onSquareClick={handleSquareClick}
                winningLine={winningLine}
                isDisabled={isThinking}
              />
            </div>
            
            <Controls
              currentPlayer={game.getCurrentPlayer()}
              gameState={game.getGameState()}
              difficulty={config.difficulty}
              mode={config.mode}
              onNewGame={handleNewGame}
              onStartSimulation={handleStartSimulation}
              onUndo={handleUndo}
              onDifficultyChange={handleDifficultyChange}
              onModeChange={handleModeChange}
              onStartingPlayerChange={handleStartingPlayerChange}
              canUndo={canUndo}
              isThinking={isThinking}
              isSimulationRunning={isSimulationRunning}
              hasGameStarted={hasGameStarted}
              isGameInProgress={isGameInProgress}
            />
          </div>

          {/* Scoreboard */}
          <div>
            <Scoreboard
              scores={scores}
              onResetScores={handleResetScores}
            />
          </div>
        </div>

        {/* Game Result Modal */}
        {(gameResult.winner || gameResult.draw) && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                {gameResult.draw ? "It's a Draw!" : `Player ${gameResult.winner} Wins!`}
              </h2>
              <button
                onClick={handleNewGame}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;