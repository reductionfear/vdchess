import { parseFen, makeFen } from 'chessops/fen';
import { Chess } from 'chessops/chess';
import { parseSan, makeSan } from 'chessops/san';
import { parseSquare, makeSquare } from 'chessops/util';

/**
 * Parse a FEN string and return a Chess position
 */
export function parseFenString(fen: string) {
  try {
    const setup = parseFen(fen);
    if (setup.isOk) {
      return Chess.fromSetup(setup.value);
    }
    return { isErr: true, error: setup.error };
  } catch (error) {
    return { isErr: true, error };
  }
}

/**
 * Generate FEN string from a Chess position
 */
export function generateFen(chess: Chess): string {
  return makeFen(chess.toSetup());
}

/**
 * Parse a square name (e.g., "e4") to square index (0-63)
 */
export function parseSquareName(squareName: string): number | undefined {
  return parseSquare(squareName);
}

/**
 * Convert square index (0-63) to square name (e.g., "e4")
 */
export function squareToName(square: number): string {
  return makeSquare(square);
}

/**
 * Get piece at a specific square
 */
export function getPieceAt(chess: Chess, squareName: string) {
  const square = parseSquare(squareName);
  if (square === undefined) return null;
  
  const piece = chess.board.get(square);
  return piece || null;
}

/**
 * Parse FEN into a board representation (0-63 indexing)
 */
export function fenToBoard(fen: string): Record<number, { type: string; color: string }> {
  const result = parseFenString(fen);
  if ('isErr' in result) {
    return {};
  }
  
  const pieces: Record<number, { type: string; color: string }> = {};
  for (let sq = 0; sq < 64; sq++) {
    const piece = result.board.get(sq);
    if (piece) {
      pieces[sq] = {
        type: piece.role,
        color: piece.color,
      };
    }
  }
  
  return pieces;
}

/**
 * Standard starting position FEN
 */
export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Empty board FEN
 */
export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';
