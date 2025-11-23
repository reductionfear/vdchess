import { Chess } from 'chessops/chess';
import { makeSan, parseSan } from 'chessops/san';
import { parseSquare, makeSquare } from 'chessops/util';

/**
 * Generate SAN (Standard Algebraic Notation) for a move
 */
export function generateSan(chess: Chess, from: string, to: string, promotion?: string): string | null {
  const fromSquare = parseSquare(from);
  const toSquare = parseSquare(to);
  
  if (fromSquare === undefined || toSquare === undefined) {
    return null;
  }
  
  const move = {
    from: fromSquare,
    to: toSquare,
    promotion: promotion as any,
  };
  
  try {
    return makeSan(chess, move);
  } catch (error) {
    return null;
  }
}

/**
 * Parse SAN notation and return the move
 */
export function parseSanMove(chess: Chess, san: string) {
  try {
    return parseSan(chess, san);
  } catch (error) {
    return null;
  }
}

/**
 * Convert a move to UCI notation (e.g., "e2e4")
 */
export function moveToUci(from: number, to: number, promotion?: string): string {
  let uci = makeSquare(from) + makeSquare(to);
  if (promotion) {
    uci += promotion;
  }
  return uci;
}

/**
 * Format move number for display
 */
export function formatMoveNumber(ply: number): string {
  const moveNum = Math.floor(ply / 2) + 1;
  const isWhite = ply % 2 === 0;
  return isWhite ? `${moveNum}.` : `${moveNum}...`;
}

/**
 * Parse PGN move list
 */
export function parsePgnMoves(pgn: string): string[] {
  // Simple PGN parser - extracts moves
  const movePattern = /\d+\.+\s*([^\s]+)(?:\s+([^\s]+))?/g;
  const moves: string[] = [];
  let match;
  
  while ((match = movePattern.exec(pgn)) !== null) {
    if (match[1]) moves.push(match[1]);
    if (match[2]) moves.push(match[2]);
  }
  
  return moves;
}
