import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { makeSan } from 'chessops/san';
import { parseSquare } from 'chessops/util';
import { PromotionRole } from 'chessops/types';

export interface MoveHistoryEntry {
  san: string;
  fen: string;
  from: string;
  to: string;
  ply: number;
  timestamp?: number;
}

export interface BoardStateManager {
  position: Chess;
  moveHistory: MoveHistoryEntry[];
  currentMoveIndex: number;
}

/**
 * Create a new board state manager
 */
export function createBoardState(fen?: string): BoardStateManager {
  const startFen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const setup = parseFen(startFen);
  
  if (setup.isErr) {
    throw new Error('Invalid FEN');
  }
  
  const result = Chess.fromSetup(setup.value);
  if (result.isErr) {
    throw new Error('Cannot create position from FEN');
  }
  
  return {
    position: result.value,
    moveHistory: [],
    currentMoveIndex: -1,
  };
}

/**
 * Make a move and update state
 */
export function makeMove(
  state: BoardStateManager,
  from: string,
  to: string,
  promotion?: PromotionRole
): BoardStateManager | null {
  const fromSquare = parseSquare(from);
  const toSquare = parseSquare(to);
  
  if (fromSquare === undefined || toSquare === undefined) {
    return null;
  }
  
  const move = {
    from: fromSquare,
    to: toSquare,
    promotion,
  };
  
  // Check if move is legal
  const legalMoves = state.position.allDests();
  const destSquares = legalMoves.get(fromSquare);
  if (!destSquares || !destSquares.has(toSquare)) {
    return null;
  }
  
  // Generate SAN before making the move
  const san = makeSan(state.position, move);
  
  // Make the move
  state.position.play(move);
  
  // Get new FEN using makeFen from chessops
  const fenString = makeFen(state.position.toSetup());
  
  // Truncate history if we're not at the end
  const newHistory = state.moveHistory.slice(0, state.currentMoveIndex + 1);
  
  // Add move to history
  newHistory.push({
    san,
    fen: fenString,
    from,
    to,
    ply: newHistory.length,
    timestamp: Date.now(),
  });
  
  return {
    position: state.position,
    moveHistory: newHistory,
    currentMoveIndex: newHistory.length - 1,
  };
}

/**
 * Navigate to a specific move in history
 */
export function goToMove(state: BoardStateManager, index: number): BoardStateManager {
  if (index < -1 || index >= state.moveHistory.length) {
    return state;
  }
  
  // Get the FEN at the target index
  let targetFen;
  if (index === -1) {
    // Go to starting position
    targetFen = state.moveHistory[0]?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    // Extract the starting position by replaying from start
    const setup = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    if (setup.isOk) {
      const result = Chess.fromSetup(setup.value);
      if (result.isOk) {
        return {
          ...state,
          position: result.value,
          currentMoveIndex: -1,
        };
      }
    }
  } else {
    targetFen = state.moveHistory[index].fen;
  }
  
  const setup = parseFen(targetFen);
  if (setup.isErr) {
    return state;
  }
  
  const result = Chess.fromSetup(setup.value);
  if (result.isErr) {
    return state;
  }
  
  return {
    ...state,
    position: result.value,
    currentMoveIndex: index,
  };
}

/**
 * Go to the next move
 */
export function nextMove(state: BoardStateManager): BoardStateManager {
  return goToMove(state, state.currentMoveIndex + 1);
}

/**
 * Go to the previous move
 */
export function previousMove(state: BoardStateManager): BoardStateManager {
  return goToMove(state, state.currentMoveIndex - 1);
}

/**
 * Go to the first move
 */
export function firstMove(state: BoardStateManager): BoardStateManager {
  return goToMove(state, -1);
}

/**
 * Go to the last move
 */
export function lastMove(state: BoardStateManager): BoardStateManager {
  return goToMove(state, state.moveHistory.length - 1);
}

/**
 * Check if there's a next move
 */
export function hasNextMove(state: BoardStateManager): boolean {
  return state.currentMoveIndex < state.moveHistory.length - 1;
}

/**
 * Check if there's a previous move
 */
export function hasPreviousMove(state: BoardStateManager): boolean {
  return state.currentMoveIndex >= 0;
}

/**
 * Get legal moves for a square
 */
export function getLegalMoves(state: BoardStateManager, from: string): string[] {
  const fromSquare = parseSquare(from);
  if (fromSquare === undefined) {
    return [];
  }
  
  const dests = state.position.allDests();
  const destSquares = dests.get(fromSquare);
  
  if (!destSquares) {
    return [];
  }
  
  return Array.from(destSquares).map(sq => {
    const file = String.fromCharCode(97 + (sq % 8));
    const rank = String.fromCharCode(49 + Math.floor(sq / 8));
    return file + rank;
  });
}

/**
 * Check if the position is in check
 */
export function isInCheck(state: BoardStateManager): boolean {
  return state.position.isCheck();
}

/**
 * Check if the position is checkmate
 */
export function isCheckmate(state: BoardStateManager): boolean {
  return state.position.isCheckmate();
}

/**
 * Check if the position is stalemate
 */
export function isStalemate(state: BoardStateManager): boolean {
  return state.position.isStalemate();
}

/**
 * Export position to PGN format
 */
export function exportToPgn(state: BoardStateManager, metadata?: Record<string, string>): string {
  const lines: string[] = [];
  
  // Add metadata
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      lines.push(`[${key} "${value}"]`);
    });
    lines.push('');
  }
  
  // Add moves
  const moveLines: string[] = [];
  let currentLine = '';
  
  state.moveHistory.forEach((move, index) => {
    const moveNum = Math.floor(index / 2) + 1;
    const isWhite = index % 2 === 0;
    
    if (isWhite) {
      const moveText = `${moveNum}. ${move.san}`;
      if (currentLine.length + moveText.length > 80) {
        moveLines.push(currentLine.trim());
        currentLine = moveText + ' ';
      } else {
        currentLine += moveText + ' ';
      }
    } else {
      currentLine += move.san + ' ';
      if (currentLine.length > 80) {
        moveLines.push(currentLine.trim());
        currentLine = '';
      }
    }
  });
  
  if (currentLine.trim()) {
    moveLines.push(currentLine.trim());
  }
  
  lines.push(...moveLines);
  
  return lines.join('\n');
}
