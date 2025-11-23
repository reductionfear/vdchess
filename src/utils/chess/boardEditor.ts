import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseSquare, makeSquare } from 'chessops/util';
import { BoardState, Piece, PieceColor, PieceType, Square } from '@/types';
import { FILES, RANKS } from '@/constants';

// Counter for generating unique piece IDs
let pieceIdCounter = 0;

/**
 * Create an empty board state in the legacy format
 */
export function createEmptyBoard(): BoardState {
  const board: BoardState = [];
  for (let y = 7; y >= 0; y--) {
    const row: Square[] = [];
    for (let x = 0; x < 8; x++) {
      row.push({
        x,
        y,
        name: `${FILES[x]}${RANKS[y]}`,
        piece: null,
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Convert FEN to legacy board format
 */
export function fenToBoard(fen: string): BoardState {
  const board = createEmptyBoard();
  
  try {
    const setup = parseFen(fen);
    if (setup.isErr) {
      console.error('Invalid FEN:', setup.error);
      return board;
    }
    
    const chess = Chess.fromSetup(setup.value);
    if (chess.isErr) {
      console.error('Cannot create position from FEN');
      return board;
    }
    
    // Populate board from chessops position
    for (let sq = 0; sq < 64; sq++) {
      const piece = chess.value.board.get(sq);
      if (piece) {
        const file = sq % 8; // 0-7
        const rank = Math.floor(sq / 8); // 0-7
        const row = 7 - rank; // board[0] is rank 8
        const col = file;
        
        board[row][col].piece = {
          type: piece.role as PieceType,
          color: piece.color as PieceColor,
          id: `${piece.color}-${piece.role}-${sq}-${++pieceIdCounter}`
        };
      }
    }
  } catch (error) {
    console.error('Error parsing FEN:', error);
  }
  
  return board;
}

/**
 * Convert legacy board format to FEN
 */
export function boardToFen(
  board: BoardState, 
  turn: 'w' | 'b' = 'w',
  castling: string = 'KQkq',
  enPassant: string = '-',
  halfmoves: number = 0,
  fullmoves: number = 1
): string {
  let fen = '';
  
  // Build position part (rows from rank 8 to rank 1)
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      
      if (piece) {
        // Add any accumulated empty squares
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        
        // Add piece character
        const pieceChar = piece.type;
        fen += piece.color === PieceColor.WHITE ? pieceChar.toUpperCase() : pieceChar;
      } else {
        emptyCount++;
      }
    }
    
    // Add final empty count if any
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    
    // Add rank separator (except after last rank)
    if (row < 7) {
      fen += '/';
    }
  }
  
  // Add other FEN components
  return `${fen} ${turn} ${castling} ${enPassant} ${halfmoves} ${fullmoves}`;
}

/**
 * Get standard starting position FEN
 */
export function getStartingPositionFen(): string {
  return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
}

/**
 * Generate a random chess position for training
 */
export function generateRandomPosition(difficulty: string): BoardState {
  const board = createEmptyBoard();
  const usedSquares = new Set<string>();
  
  const getRandomSquare = () => {
    let x, y, name;
    do {
      x = Math.floor(Math.random() * 8);
      y = Math.floor(Math.random() * 8);
      name = `${x},${y}`;
    } while (usedSquares.has(name));
    usedSquares.add(name);
    return { x, y };
  };

  // Place Kings first
  const wKingPos = getRandomSquare();
  board[7 - wKingPos.y][wKingPos.x].piece = {
    type: PieceType.KING,
    color: PieceColor.WHITE,
    id: 'wk',
  };

  let bKingPos;
  let validBKing = false;
  while (!validBKing) {
    bKingPos = getRandomSquare();
    const dx = Math.abs(bKingPos.x - wKingPos.x);
    const dy = Math.abs(bKingPos.y - wKingPos.y);
    if (dx > 1 || dy > 1) {
      validBKing = true;
    } else {
      usedSquares.delete(`${bKingPos.x},${bKingPos.y}`);
    }
  }
  
  board[7 - bKingPos!.y][bKingPos!.x].piece = {
    type: PieceType.KING,
    color: PieceColor.BLACK,
    id: 'bk',
  };

  // Determine number of additional pieces based on difficulty
  let minPieces = 2;
  let maxPieces = 4;
  
  if (difficulty === 'MEDIUM') {
    minPieces = 5;
    maxPieces = 8;
  } else if (difficulty === 'HARD') {
    minPieces = 9;
    maxPieces = 14;
  }

  const numPieces = Math.floor(Math.random() * (maxPieces - minPieces + 1)) + minPieces;

  // Place random pieces
  const pieceTypes = [PieceType.PAWN, PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN];
  
  for (let i = 0; i < numPieces; i++) {
    const { x, y } = getRandomSquare();
    const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    const color = Math.random() > 0.5 ? PieceColor.WHITE : PieceColor.BLACK;
    
    // No pawns on back ranks
    if (type === PieceType.PAWN && (y === 0 || y === 7)) {
      i--;
      usedSquares.delete(`${x},${y}`);
      continue;
    }

    board[7 - y][x].piece = {
      type,
      color,
      id: `p-${++pieceIdCounter}`,
    };
  }

  return board;
}

/**
 * Calculate accuracy between two board states
 */
export function calculateAccuracy(original: BoardState, reconstructed: BoardState): number {
  let totalSquares = 64;
  let correctSquares = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p1 = original[r][c].piece;
      const p2 = reconstructed[r][c].piece;

      if (!p1 && !p2) {
        correctSquares++;
      } else if (p1 && p2 && p1.type === p2.type && p1.color === p2.color) {
        correctSquares++;
      }
    }
  }
  return Math.round((correctSquares / totalSquares) * 100);
}

/**
 * Get detailed differences between two board states
 */
export function getPieceDifferences(original: BoardState, reconstructed: BoardState) {
  const errors: { square: string, expected: Piece | null, actual: Piece | null }[] = [];
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p1 = original[r][c].piece;
      const p2 = reconstructed[r][c].piece;
      const same = (!p1 && !p2) || (p1 && p2 && p1.type === p2.type && p1.color === p2.color);
      
      if (!same) {
        errors.push({
          square: original[r][c].name,
          expected: p1,
          actual: p2
        });
      }
    }
  }
  return errors;
}

/**
 * Validate a board position using chessops
 */
export function validatePosition(board: BoardState): { valid: boolean; error?: string } {
  try {
    const fen = boardToFen(board);
    const setup = parseFen(fen);
    
    if (setup.isErr) {
      return { valid: false, error: setup.error.message };
    }
    
    const chess = Chess.fromSetup(setup.value);
    if (chess.isErr) {
      return { valid: false, error: chess.error.message };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: String(error) };
  }
}
