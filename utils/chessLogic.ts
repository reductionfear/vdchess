import { BoardState, Difficulty, Piece, PieceColor, PieceType, Square } from '../types';
import { FILES, RANKS } from '../constants';

export const createEmptyBoard = (): BoardState => {
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
};

export const fenToBoard = (fen: string): BoardState => {
  const board = createEmptyBoard();
  // FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  const parts = fen.split(' ');
  const position = parts[0];
  
  let row = 0; // board[0] is Rank 8
  let col = 0; // board[row][0] is File A

  for (let i = 0; i < position.length; i++) {
    const char = position[i];
    
    if (char === '/') {
      row++;
      col = 0;
    } else if (/\d/.test(char)) {
      col += parseInt(char, 10);
    } else {
      const isUpper = char === char.toUpperCase();
      const type = char.toLowerCase() as PieceType;
      const color = isUpper ? PieceColor.WHITE : PieceColor.BLACK;
      
      // Safety check
      if (row < 8 && col < 8) {
         board[row][col].piece = {
            type,
            color,
            id: `${char}-${row}-${col}-${Date.now()}`
         };
      }
      col++;
    }
  }
  return board;
};

// A simplified random position generator for training visual memory.
// It places Kings correctly (not touching) and scatters other pieces.
export const generateRandomPosition = (difficulty: Difficulty): BoardState => {
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
    return { x, y }; // Returns indices relative to how we access board array
  };

  // 1. Place Kings
  const wKingPos = getRandomSquare();
  // board is stored as board[row][col]. Since y goes 7->0, we need to map y to row index.
  // However, our createEmptyBoard logic pushes rows from y=7 down to y=0.
  // So board[0] is Rank 8 (y=7). board[7] is Rank 1 (y=0).
  // Row index = 7 - y.
  
  board[7 - wKingPos.y][wKingPos.x].piece = {
    type: PieceType.KING,
    color: PieceColor.WHITE,
    id: 'wk',
  };

  let bKingPos;
  let validBKing = false;
  while (!validBKing) {
    bKingPos = getRandomSquare();
    // Simple distance check (Chebyshev distance > 1)
    const dx = Math.abs(bKingPos.x - wKingPos.x);
    const dy = Math.abs(bKingPos.y - wKingPos.y);
    if (dx > 1 || dy > 1) validBKing = true;
    else usedSquares.delete(`${bKingPos.x},${bKingPos.y}`); // retry
  }
  
  board[7 - bKingPos!.y][bKingPos!.x].piece = {
    type: PieceType.KING,
    color: PieceColor.BLACK,
    id: 'bk',
  };

  // 2. Determine number of additional pieces based on difficulty
  let minPieces = 2;
  let maxPieces = 4;
  
  if (difficulty === Difficulty.MEDIUM) {
    minPieces = 5;
    maxPieces = 8;
  } else if (difficulty === Difficulty.HARD) {
    minPieces = 9;
    maxPieces = 14;
  }

  const numPieces = Math.floor(Math.random() * (maxPieces - minPieces + 1)) + minPieces;

  // 3. Place random pieces
  const pieceTypes = [PieceType.PAWN, PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN];
  
  for (let i = 0; i < numPieces; i++) {
    const { x, y } = getRandomSquare();
    const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    const color = Math.random() > 0.5 ? PieceColor.WHITE : PieceColor.BLACK;
    
    // Simple restriction: No pawns on back ranks
    if (type === PieceType.PAWN && (y === 0 || y === 7)) {
        i--;
        usedSquares.delete(`${x},${y}`);
        continue;
    }

    board[7 - y][x].piece = {
      type,
      color,
      id: `p-${i}`,
    };
  }

  return board;
};

export const calculateAccuracy = (original: BoardState, reconstructed: BoardState): number => {
  let totalSquares = 64;
  let correctSquares = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p1 = original[r][c].piece;
      const p2 = reconstructed[r][c].piece;

      // Check if both empty or both have same piece (type and color)
      if (!p1 && !p2) {
        correctSquares++;
      } else if (p1 && p2 && p1.type === p2.type && p1.color === p2.color) {
        correctSquares++;
      }
    }
  }
  return Math.round((correctSquares / totalSquares) * 100);
};

export const getPieceDifferences = (original: BoardState, reconstructed: BoardState) => {
    const errors: {square: string, expected: Piece | null, actual: Piece | null}[] = [];
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