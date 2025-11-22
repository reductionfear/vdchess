import React, { useState, useRef, useEffect } from 'react';
import { BoardState, Square, Piece } from '../types';
import { THEME } from '../constants';

interface EnhancedChessBoardProps {
  board: BoardState;
  interactive?: boolean;
  onSquareClick?: (square: Square) => void;
  onPieceMove?: (from: Square, to: Square) => void;
  selectedSquare?: Square | null;
  showLabels?: boolean;
  highlightErrors?: { square: string }[];
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({
  board,
  interactive = false,
  onSquareClick,
  onPieceMove,
  selectedSquare,
  showLabels = true,
  highlightErrors = []
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ square: Square; piece: Piece } | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);

  const isSquareSelected = (sq: Square) => {
    return selectedSquare && selectedSquare.x === sq.x && selectedSquare.y === sq.y;
  };

  const isSquareError = (sq: Square) => {
    return highlightErrors.some(e => e.square === sq.name);
  };

  const isDragOver = (sq: Square) => {
    return dragOverSquare && dragOverSquare.x === sq.x && dragOverSquare.y === sq.y;
  };

  const isHovered = (sq: Square) => {
    return hoveredSquare && hoveredSquare.x === sq.x && hoveredSquare.y === sq.y;
  };

  // Piece SVG components using Unicode chess symbols as fallback
  const getPieceSVG = (piece: Piece) => {
    const { color, type } = piece;
    const isWhite = color === 'w';
    const pieceChar = {
      'p': isWhite ? '♙' : '♟',
      'r': isWhite ? '♖' : '♜',
      'n': isWhite ? '♘' : '♞',
      'b': isWhite ? '♗' : '♝',
      'q': isWhite ? '♕' : '♛',
      'k': isWhite ? '♔' : '♚',
    }[type];

    return (
      <div 
        className={`
          text-6xl select-none leading-none
          ${isWhite ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]'}
          transition-transform duration-200
          ${interactive && !draggedPiece ? 'hover:scale-110 cursor-grab active:cursor-grabbing' : ''}
        `}
        style={{ 
          fontFamily: 'Arial Unicode MS, Lucida Grande, sans-serif',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {pieceChar}
      </div>
    );
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (!interactive || !square.piece) return;
    
    setDraggedPiece({ square, piece: square.piece });
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.7';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 50);
    
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent, square: Square) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSquare(square);
  };

  const handleDragLeave = () => {
    setDragOverSquare(null);
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    
    if (!draggedPiece) return;
    
    // Call the move callback if provided
    if (onPieceMove && draggedPiece.square.name !== targetSquare.name) {
      onPieceMove(draggedPiece.square, targetSquare);
    }
    
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
    setDragOverSquare(null);
  };

  const handleClick = (square: Square) => {
    if (interactive && onSquareClick) {
      onSquareClick(square);
    }
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
              let ringClass = "";
              
              if (isSquareSelected(square)) {
                ringClass = "ring-inset ring-4 ring-yellow-400 ring-opacity-70";
              } else if (isSquareError(square)) {
                ringClass = "ring-inset ring-4 ring-red-500 ring-opacity-70";
              } else if (isDragOver(square)) {
                ringClass = "ring-inset ring-4 ring-blue-400 ring-opacity-50";
                overlayClass = "bg-blue-400 bg-opacity-20";
              } else if (isHovered(square) && interactive) {
                overlayClass = "bg-white bg-opacity-10";
              }

              const isDragging = draggedPiece?.square.name === square.name;

              return (
                <div
                  key={square.name}
                  onClick={() => handleClick(square)}
                  onMouseEnter={() => interactive && setHoveredSquare(square)}
                  onMouseLeave={() => setHoveredSquare(null)}
                  onDragStart={(e) => handleDragStart(e, square)}
                  onDragOver={(e) => handleDragOver(e, square)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, square)}
                  onDragEnd={handleDragEnd}
                  draggable={interactive && square.piece !== null}
                  className={`
                    relative ${bgColor} flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    ${interactive ? 'cursor-pointer' : ''}
                    ${ringClass}
                    ${overlayClass}
                    chess-square
                  `}
                  style={{
                    opacity: isDragging ? 0.3 : 1,
                  }}
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
                    <div 
                      className="w-full h-full flex items-center justify-center pointer-events-none"
                    >
                      {getPieceSVG(square.piece)}
                    </div>
                  )}
                  
                  {/* Move hint for selected piece */}
                  {interactive && !square.piece && isSquareSelected(square) && (
                    <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50 animate-pulse" />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EnhancedChessBoard;
