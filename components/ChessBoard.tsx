import React from 'react';
import { BoardState, Square, Piece, PieceColor, PieceType } from '../types';
import { PIECE_IMAGES, THEME } from '../constants';

interface ChessBoardProps {
  board: BoardState;
  interactive?: boolean;
  onSquareClick?: (square: Square) => void;
  selectedSquare?: Square | null;
  showLabels?: boolean;
  highlightErrors?: { square: string }[]; // List of square names (e.g. "a1") that are wrong
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board, 
  interactive = false, 
  onSquareClick, 
  selectedSquare,
  showLabels = true,
  highlightErrors = []
}) => {
  
  const isSquareSelected = (sq: Square) => {
    return selectedSquare && selectedSquare.x === sq.x && selectedSquare.y === sq.y;
  };

  const isSquareError = (sq: Square) => {
    return highlightErrors.some(e => e.square === sq.name);
  };

  return (
    <div className="select-none">
      <div className="grid grid-cols-8 w-full aspect-square border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((square, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const bgColor = isDark ? THEME.boardBlack : THEME.boardWhite;
              
              let overlayClass = "";
              if (isSquareSelected(square)) {
                overlayClass = "ring-inset ring-4 ring-yellow-400";
              } else if (isSquareError(square)) {
                overlayClass = "ring-inset ring-4 ring-red-500";
              }

              return (
                <div
                  key={square.name}
                  onClick={() => interactive && onSquareClick && onSquareClick(square)}
                  className={`
                    relative ${bgColor} flex items-center justify-center
                    ${interactive ? 'cursor-pointer hover:opacity-90' : ''}
                    ${overlayClass}
                  `}
                >
                  {/* Labels */}
                  {showLabels && colIndex === 0 && (
                    <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isDark ? 'text-[#ebecd0]' : 'text-[#779556]'}`}>
                      {square.name[1]} 
                    </span>
                  )}
                  {showLabels && rowIndex === 7 && (
                    <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isDark ? 'text-[#ebecd0]' : 'text-[#779556]'}`}>
                      {square.name[0]}
                    </span>
                  )}

                  {/* Piece */}
                  {square.piece && (
                    <img 
                      src={PIECE_IMAGES[`${square.piece.color}${square.piece.type}`]} 
                      alt={`${square.piece.color} ${square.piece.type}`}
                      className="w-4/5 h-4/5 object-contain drop-shadow-md"
                    />
                  )}
                  
                  {/* Hint/Guide for empty interactive squares if needed */}
                  {/* {interactive && !square.piece && isSquareSelected(square) && (
                      <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50" />
                  )} */}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;