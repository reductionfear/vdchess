import React, { useState } from 'react';
import { BoardState, Square, Piece } from '../types';
import { THEME } from '../constants';

interface EnhancedChessBoardProps {
  board: BoardState;
  interactive?: boolean;
  onSquareClick?: (square: Square) => void;
  onPieceMove?: (from: Square, to: Square) => void;
  onPaletteDrop?: (piece: Piece, square: Square) => void;
  selectedSquare?: Square | null;
  showLabels?: boolean;
  highlightErrors?: { square: string }[];
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({
  board,
  interactive = false,
  onSquareClick,
  onPieceMove,
  onPaletteDrop,
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
          ${isWhite 
            ? 'text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]' 
            : 'text-gray-900 drop-shadow-[0_2px_5px_rgba(255,255,255,0.4)]'
          }
          transition-all duration-200 ease-out
          ${interactive && !draggedPiece ? 'hover:scale-110 hover:drop-shadow-[0_4px_8px_rgba(59,130,246,0.5)] cursor-grab active:cursor-grabbing active:scale-105' : ''}
        `}
        style={{ 
          fontFamily: 'Arial Unicode MS, Lucida Grande, DejaVu Sans, sans-serif',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          textShadow: isWhite 
            ? '0 0 2px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8)' 
            : '0 0 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.4)'
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
    
    // Safely remove drag image after it's been used
    setTimeout(() => {
      try {
        if (dragImage && dragImage.parentNode) {
          document.body.removeChild(dragImage);
        }
      } catch (error) {
        // Element already removed, ignore
      }
    }, 0);
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
    
    // Check if this is a palette piece
    const palettePieceData = e.dataTransfer.getData('palette-piece');
    if (palettePieceData && onPaletteDrop) {
      try {
        const piece = JSON.parse(palettePieceData) as Piece;
        onPaletteDrop(piece, targetSquare);
        setDragOverSquare(null);
        return;
      } catch (error) {
        console.error('Failed to parse palette piece data:', palettePieceData, error);
      }
    }
    
    // Handle board piece drag
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
    <div className="select-none w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-8 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '1' }}>
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
                  onDragOver={(e) => handleDragOver(e, square)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, square)}
                  className={`
                    relative ${bgColor} flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    ${interactive ? 'cursor-pointer' : ''}
                    ${ringClass}
                    ${overlayClass}
                    chess-square
                  `}
                  style={{
                    aspectRatio: '1',
                    opacity: isDragging ? 0.3 : 1,
                    transform: isDragging ? 'scale(0.95)' : 'scale(1)',
                  }}
                >
                  {/* Labels */}
                  {showLabels && colIndex === 0 && (
                    <span className={`
                      absolute top-0.5 left-1 text-[10px] font-bold 
                      ${isDark ? 'text-[#ebecd0]' : 'text-[#779556]'}
                      opacity-80
                    `}>
                      {square.name[1]}
                    </span>
                  )}
                  {showLabels && rowIndex === 7 && (
                    <span className={`
                      absolute bottom-0.5 right-1 text-[10px] font-bold 
                      ${isDark ? 'text-[#ebecd0]' : 'text-[#779556]'}
                      opacity-80
                    `}>
                      {square.name[0]}
                    </span>
                  )}

                  {/* Piece */}
                  {square.piece && (
                    <div 
                      draggable={interactive}
                      onDragStart={(e) => handleDragStart(e, square)}
                      onDragEnd={handleDragEnd}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {getPieceSVG(square.piece)}
                    </div>
                  )}
                  
                  {/* Move hint for selected piece */}
                  {interactive && !square.piece && isSquareSelected(square) && (
                    <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50 animate-pulse" />
                  )}
                  
                  {/* Drag target indicator */}
                  {interactive && isDragOver(square) && !square.piece && (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 bg-blue-400 bg-opacity-20 animate-pulse" />
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
