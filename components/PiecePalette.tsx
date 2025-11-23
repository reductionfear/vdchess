import React from 'react';
import { Piece, PieceColor, PieceType } from '../types';

interface PiecePaletteProps {
  selectedPiece: Piece | null;
  onPieceSelect: (piece: Piece | null) => void;
  onMoveSourceClear?: () => void;
}

const PiecePalette: React.FC<PiecePaletteProps> = ({ 
  selectedPiece, 
  onPieceSelect,
  onMoveSourceClear 
}) => {
  const pieces: Piece[] = [
    { type: PieceType.KING, color: PieceColor.WHITE, id: 'wk' },
    { type: PieceType.QUEEN, color: PieceColor.WHITE, id: 'wq' },
    { type: PieceType.ROOK, color: PieceColor.WHITE, id: 'wr' },
    { type: PieceType.BISHOP, color: PieceColor.WHITE, id: 'wb' },
    { type: PieceType.KNIGHT, color: PieceColor.WHITE, id: 'wn' },
    { type: PieceType.PAWN, color: PieceColor.WHITE, id: 'wp' },
    { type: PieceType.KING, color: PieceColor.BLACK, id: 'bk' },
    { type: PieceType.QUEEN, color: PieceColor.BLACK, id: 'bq' },
    { type: PieceType.ROOK, color: PieceColor.BLACK, id: 'br' },
    { type: PieceType.BISHOP, color: PieceColor.BLACK, id: 'bb' },
    { type: PieceType.KNIGHT, color: PieceColor.BLACK, id: 'bn' },
    { type: PieceType.PAWN, color: PieceColor.BLACK, id: 'bp' },
  ];

  const getPieceUnicode = (piece: Piece) => {
    const isWhite = piece.color === PieceColor.WHITE;
    return {
      [PieceType.KING]: isWhite ? '♔' : '♚',
      [PieceType.QUEEN]: isWhite ? '♕' : '♛',
      [PieceType.ROOK]: isWhite ? '♖' : '♜',
      [PieceType.BISHOP]: isWhite ? '♗' : '♝',
      [PieceType.KNIGHT]: isWhite ? '♘' : '♞',
      [PieceType.PAWN]: isWhite ? '♙' : '♟',
    }[piece.type];
  };

  const handlePieceClick = (piece: Piece) => {
    // Toggle selection: if same piece is clicked, deselect it
    if (selectedPiece?.type === piece.type && selectedPiece?.color === piece.color) {
      onPieceSelect(null);
    } else {
      onPieceSelect(piece);
    }
    // Clear any move source when selecting from palette
    if (onMoveSourceClear) {
      onMoveSourceClear();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
      {pieces.map(p => (
        <button
          key={p.id}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('palette-piece', JSON.stringify(p));
            e.dataTransfer.effectAllowed = 'copy';
          }}
          onClick={() => handlePieceClick(p)}
          className={`
            p-2 rounded-md transition-all flex justify-center items-center aspect-square
            text-4xl font-bold select-none cursor-grab active:cursor-grabbing
            ${selectedPiece?.type === p.type && selectedPiece?.color === p.color 
              ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-110' 
              : 'hover:bg-slate-700 hover:scale-105 active:scale-95'
            }
            ${p.color === PieceColor.WHITE ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-gray-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]'}
          `}
          title={`${p.color === PieceColor.WHITE ? 'White' : 'Black'} ${p.type.toUpperCase()}`}
        >
          {getPieceUnicode(p)}
        </button>
      ))}
    </div>
  );
};

export default PiecePalette;
