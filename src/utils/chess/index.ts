/**
 * Main entry point for chess utilities
 * Consolidates all chess-related functionality using chessops library
 */

// Re-export board editor utilities
export {
  createEmptyBoard,
  fenToBoard,
  boardToFen,
  getStartingPositionFen,
  generateRandomPosition,
  calculateAccuracy,
  getPieceDifferences,
  validatePosition,
} from './boardEditor';

// Re-export board state management
export {
  createBoardState,
  makeMove,
  goToMove,
  nextMove,
  previousMove,
  firstMove,
  lastMove,
  hasNextMove,
  hasPreviousMove,
  getLegalMoves,
  isInCheck,
  isCheckmate,
  isStalemate,
  exportToPgn,
} from './boardState';

export type { BoardStateManager, MoveHistoryEntry } from './boardState';

// Re-export FEN parser utilities
export {
  parseFenString,
  generateFen,
  parseSquareName,
  squareToName,
  getPieceAt,
  fenToBoard as fenToBoardMap,
  STARTING_FEN,
  EMPTY_FEN,
} from './fenParser';
