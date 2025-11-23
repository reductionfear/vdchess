# Chess Utilities

This directory contains chess-related utilities built on top of the `chessops` library. These utilities provide a unified interface for chess operations across the application.

## Architecture

The chess functionality is organized into several modules:

### Core Modules

1. **`boardState.ts`** - Chess position and move management
   - Manages chess positions using the chessops library
   - Handles move history and navigation
   - Provides move validation and legal move generation
   - Exports game state (PGN, FEN)

2. **`fenParser.ts`** - FEN string operations
   - Parse and generate FEN strings
   - Convert between FEN and internal representations
   - Square notation utilities

3. **`boardEditor.ts`** - Board editor and trainer utilities
   - Legacy board format compatibility
   - Random position generation for training
   - Board comparison and accuracy calculation
   - Position validation

4. **`sanWriter.ts`** - Standard Algebraic Notation (SAN) utilities
   - Convert moves to/from SAN notation
   - Format move lists

5. **`index.ts`** - Main entry point
   - Re-exports all public APIs
   - Provides a single import point for consumers

## Usage Examples

### Basic Position Management

```typescript
import { createBoardState, makeMove, getCurrentFen } from '@/src/utils/chess';

// Create a new game
const state = createBoardState();

// Make a move
const newState = makeMove(state, 'e2', 'e4');

// Get current position as FEN
const fen = getCurrentFen(newState);
```

### Board Editor Operations

```typescript
import { createEmptyBoard, fenToBoard, boardToFen } from '@/src/utils/chess';

// Create an empty board
const board = createEmptyBoard();

// Load from FEN
const board = fenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

// Convert to FEN
const fen = boardToFen(board);
```

### Training Position Generation

```typescript
import { generateRandomPosition, calculateAccuracy } from '@/src/utils/chess';

// Generate a random position for training
const board = generateRandomPosition('MEDIUM'); // EASY, MEDIUM, or HARD

// Calculate accuracy between original and reconstructed positions
const accuracy = calculateAccuracy(originalBoard, userBoard);
```

### Move History and Navigation

```typescript
import { useChessboard } from '@/src/hooks/useChessboard';

function MyComponent() {
  const {
    makeMove,
    nextMove,
    previousMove,
    moveHistory,
    getLegalMoves,
  } = useChessboard();
  
  // Make moves, navigate history, etc.
}
```

## Integration with chessops

All chess logic is built on top of the [chessops](https://github.com/lichess-org/chessops) library, which provides:

- Legal move generation
- Position validation
- FEN/PGN parsing and generation
- Check/checkmate/stalemate detection
- Efficient bitboard representation

This ensures that all chess operations are:
- ✅ Standards-compliant
- ✅ Well-tested
- ✅ Performant
- ✅ Actively maintained

## Legacy Compatibility

The `boardEditor.ts` module provides compatibility with the legacy `BoardState` type used in the trainer and editor components. This allows for gradual migration while maintaining backward compatibility.

### Migration Path

Old code:
```typescript
import { createEmptyBoard } from '@/utils/chessLogic';
```

New code:
```typescript
import { createEmptyBoard } from '@/src/utils/chess';
```

The API remains the same, but now uses chessops internally for improved reliability.

## Type Definitions

The chess utilities work with two board representations:

1. **Legacy BoardState** (`types.ts`) - 2D array format used by trainer/editor
2. **chessops Position** - Internal bitboard representation

Conversion utilities are provided to seamlessly work with both formats.

## Future Enhancements

Potential improvements:
- [ ] Add move annotations (!, ?, !!, etc.)
- [ ] Support for chess variants (Chess960, etc.)
- [ ] Opening book integration
- [ ] Position evaluation hints
- [ ] Tablebase integration
