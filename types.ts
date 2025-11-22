export enum PieceType {
  PAWN = 'p',
  ROOK = 'r',
  KNIGHT = 'n',
  BISHOP = 'b',
  QUEEN = 'q',
  KING = 'k',
}

export enum PieceColor {
  WHITE = 'w',
  BLACK = 'b',
}

export interface Piece {
  type: PieceType;
  color: PieceColor;
  id: string; // Unique ID for React keys
}

export interface Square {
  x: number; // 0-7 (a-h)
  y: number; // 0-7 (1-8)
  piece: Piece | null;
  name: string; // e.g., "a1", "h8"
}

export type BoardState = Square[][];

export enum GameMode {
  CLASSIC = 'CLASSIC',
  PROGRESSIVE = 'PROGRESSIVE',
}

export enum Difficulty {
  EASY = 'EASY',     // 4-6 pieces
  MEDIUM = 'MEDIUM', // 7-10 pieces
  HARD = 'HARD',     // 11+ pieces
}

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  memorizeTime: number; // in seconds
  fen?: string; // Optional custom FEN string
}

export enum AppState {
  IDLE = 'IDLE',
  MEMORIZE = 'MEMORIZE',
  RECONSTRUCT = 'RECONSTRUCT',
  RESULT = 'RESULT',
}