# Tic-Tac-Toe AI

A fully functional, interactive Tic-Tac-Toe game with an AI opponent using the Minimax algorithm with alpha-beta pruning. Built with React, TypeScript, and modern web technologies.

## 🎯 Features

- **Perfect AI Opponent**: Uses Minimax algorithm with alpha-beta pruning for optimal play
- **Multiple Difficulty Levels**: Easy (random), Medium (mixed), Perfect (optimal)
- **Game Modes**: Human vs AI, Human vs Human, AI vs AI
- **Accessibility**: Full keyboard navigation, ARIA labels, screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Performance Optimized**: Fast AI decisions with move ordering and memoization
- **Learning Extension**: Optional self-play training and statistics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tic-tac-toe-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 How to Play

1. **Choose Game Mode**:
   - **Human vs AI**: Play against the computer
   - **Human vs Human**: Two players on the same device
   - **AI vs AI**: Watch two AI players compete

2. **Select Difficulty** (Human vs AI mode):
   - **Easy**: AI makes random moves
   - **Medium**: AI mixes optimal and random moves
   - **Perfect**: AI plays optimally (never loses)

3. **Make Your Move**:
   - Click on any empty square
   - Use keyboard navigation (Tab to move, Enter to select)
   - X always goes first

4. **Game Controls**:
   - **New Game**: Start a fresh game
   - **Undo**: Take back your last move
   - **Reset Scores**: Clear the scoreboard

## 🧠 AI Algorithm Details

### Minimax Algorithm

The AI uses the Minimax algorithm with several optimizations:

#### Core Algorithm
```typescript
function minimax(state, depth, isMaximizing, alpha, beta) {
  if (terminal(state)) return evaluateTerminal(state);
  
  if (isMaximizing) {
    let best = -Infinity;
    for (move in orderedMoves(state)) {
      applyMove(move);
      val = minimax(newState, depth+1, false, alpha, beta);
      undoMove(move);
      best = max(best, val);
      alpha = max(alpha, best);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return best;
  }
  // Similar for minimizing player
}
```

#### Optimizations

1. **Alpha-Beta Pruning**: Reduces search space by eliminating branches that won't affect the final decision
2. **Move Ordering**: Prioritizes center, then corners, then edges for better pruning
3. **Transposition Table**: Caches previously computed positions
4. **Iterative Deepening**: Can be extended for larger boards

#### Performance Metrics

- **Nodes Expanded**: Typically 50-200 for a 3x3 board
- **Decision Time**: < 10ms for optimal moves
- **Memory Usage**: Minimal with efficient memoization

## 🏗️ Architecture

### Project Structure

```
src/
├── engine/           # Pure game logic (framework-agnostic)
│   ├── gameEngine.ts     # Game rules and state management
│   ├── minimax.ts        # AI algorithm implementation
│   ├── aiInterfaces.ts   # AI interface definitions
│   ├── selfPlayTrainer.ts # Optional learning components
│   └── types.ts          # Type definitions
├── components/       # React UI components
│   ├── Board.tsx         # Game board component
│   ├── Square.tsx        # Individual square component
│   ├── Controls.tsx      # Game controls
│   └── Scoreboard.tsx    # Score tracking
├── hooks/            # Custom React hooks
│   └── useGame.ts       # Game state management
└── App.tsx           # Main application component
```

### Key Design Principles

1. **Separation of Concerns**: Game logic is completely separate from UI
2. **Testability**: Pure functions with comprehensive test coverage
3. **Extensibility**: Easy to add new AI agents or game variants
4. **Performance**: Optimized for speed and memory efficiency

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: Game engine, AI algorithm, utility functions
- **Integration Tests**: Component interactions, game flow
- **Performance Tests**: AI decision speed, memory usage
- **Accessibility Tests**: Keyboard navigation, screen reader support

### Test Scenarios

- ✅ AI never loses in perfect mode
- ✅ All win conditions detected correctly
- ✅ Draw detection works properly
- ✅ Undo/redo functionality
- ✅ Invalid move prevention
- ✅ Accessibility compliance

## 🎨 Customization

### Adding New AI Agents

1. Implement the `AIAgent` interface:
```typescript
class MyAI implements AIAgent {
  getMove(board: Board, player: Player, difficulty?: Difficulty): AIMove {
    // Your AI logic here
  }
}
```

2. Register in the game hook:
```typescript
const ai = new MyAI();
```

### Styling

The app uses Tailwind CSS for styling. Key classes:
- `grid-cols-3`: 3x3 board layout
- `hover:bg-gray-100`: Square hover effects
- `bg-yellow-200`: Winning line highlighting
- `transition-all`: Smooth animations

## 📊 Learning Extension

### Self-Play Training

The optional learning system includes:

1. **Game Logging**: Records all moves and outcomes
2. **Statistical Analysis**: Win rates, move patterns
3. **Heuristic Tuning**: Adjusts move ordering based on results

### Usage

```typescript
import { SelfPlayTrainer } from './engine/selfPlayTrainer';

const trainer = new SelfPlayTrainer();
const results = await trainer.train(1000);
console.log(`AI won ${results.aiWins} out of ${results.gamesPlayed} games`);
```

## 🚀 Deployment

### Build Process

```bash
npm run build
```

### Deployment Options

1. **Static Hosting**: Upload `dist` folder to any static host
2. **Docker**: Use the included Dockerfile for containerized deployment
3. **CDN**: Serve from a CDN for global distribution

### Environment Variables

- `VITE_API_URL`: Backend API URL (if using multiplayer features)
- `VITE_ANALYTICS_ID`: Analytics tracking ID

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Maintain 90%+ test coverage
- Use conventional commit messages
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Minimax algorithm implementation based on classic game theory
- React Testing Library for comprehensive testing utilities
- Tailwind CSS for rapid UI development
- Vite for fast development and building

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy Gaming! 🎮**
