import { PieceColor, PieceType } from './types';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const PIECE_IMAGES: Record<string, string> = {
  [`${PieceColor.WHITE}${PieceType.PAWN}`]: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Chess_plt45.svg',
  [`${PieceColor.WHITE}${PieceType.ROOK}`]: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  [`${PieceColor.WHITE}${PieceType.KNIGHT}`]: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  [`${PieceColor.WHITE}${PieceType.BISHOP}`]: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  [`${PieceColor.WHITE}${PieceType.QUEEN}`]: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  [`${PieceColor.WHITE}${PieceType.KING}`]: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  [`${PieceColor.BLACK}${PieceType.PAWN}`]: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  [`${PieceColor.BLACK}${PieceType.ROOK}`]: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  [`${PieceColor.BLACK}${PieceType.KNIGHT}`]: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  [`${PieceColor.BLACK}${PieceType.BISHOP}`]: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  [`${PieceColor.BLACK}${PieceType.QUEEN}`]: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  [`${PieceColor.BLACK}${PieceType.KING}`]: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

export const THEME = {
  bg: 'bg-slate-900',
  bgCard: 'bg-slate-800',
  accent: 'text-amber-400',
  accentBg: 'bg-amber-400',
  accentHover: 'hover:bg-amber-500',
  buttonPrimary: 'bg-amber-400 text-slate-900 font-bold hover:bg-amber-500',
  buttonSecondary: 'bg-slate-700 text-white hover:bg-slate-600',
  boardWhite: 'bg-[#ebecd0]',
  boardBlack: 'bg-[#779556]',
};