import React, { useRef, useEffect } from 'react';
import { Chess } from 'chessops/chess';
import SVGOverlay from './SVGOverlay';

interface ChessBoardAnalysisProps {
  position: Chess;
  flipped?: boolean;
  showCoordinates?: boolean;
  highlightSquares?: string[];
  lastMove?: { from: string; to: string };
  arrows?: Array<{ from: string; to: string; color: string }>;
  circles?: Array<{ square: string; color: string }>;
  onSquareClick?: (square: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const ChessBoardAnalysis: React.FC<ChessBoardAnalysisProps> = ({
  position,
  flipped = false,
  showCoordinates = true,
  highlightSquares = [],
  lastMove,
  arrows = [],
  circles = [],
  onSquareClick,
  style,
  className = '',
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = React.useState(60);

  // Calculate square size on mount and resize
  useEffect(() => {
    const updateSquareSize = () => {
      if (boardRef.current) {
        const size = boardRef.current.offsetWidth / 8;
        setSquareSize(size);
      }
    };

    updateSquareSize();
    window.addEventListener('resize', updateSquareSize);
    return () => window.removeEventListener('resize', updateSquareSize);
  }, []);

  const getPieceSymbol = (role: string, color: string) => {
    const isWhite = color === 'white';
    const symbols: Record<string, string> = {
      pawn: isWhite ? '♙' : '♟',
      knight: isWhite ? '♘' : '♞',
      bishop: isWhite ? '♗' : '♝',
      rook: isWhite ? '♖' : '♜',
      queen: isWhite ? '♕' : '♛',
      king: isWhite ? '♔' : '♚',
    };
    return symbols[role] || '';
  };

  const getSquareName = (rank: number, file: number): string => {
    const actualFile = flipped ? 7 - file : file;
    const actualRank = flipped ? rank : 7 - rank;
    return String.fromCharCode(97 + actualFile) + (actualRank + 1);
  };

  const isHighlighted = (squareName: string) => {
    return highlightSquares.includes(squareName);
  };

  const isLastMove = (squareName: string) => {
    if (!lastMove) return false;
    return squareName === lastMove.from || squareName === lastMove.to;
  };

  const renderSquares = () => {
    const squares = [];

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const squareName = getSquareName(rank, file);
        // Chessops uses 0-63 indexing: a1=0, b1=1, ..., h1=7, a2=8, ..., h8=63
        const sqFile = squareName.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
        const sqRank = parseInt(squareName[1]) - 1; // 1=0, 2=1, ..., 8=7
        const squareIndex = sqRank * 8 + sqFile;
        const piece = position.board.get(squareIndex);
        const isLight = (rank + file) % 2 === 0;
        
        const highlighted = isHighlighted(squareName);
        const lastMoveSquare = isLastMove(squareName);

        squares.push(
          <div
            key={squareName}
            className={`
              chess-square aspect-square flex items-center justify-center relative
              transition-colors duration-200
              ${isLight ? 'bg-[#ebecd0]' : 'bg-[#779556]'}
              ${highlighted ? 'ring-4 ring-inset ring-yellow-400' : ''}
              ${lastMoveSquare ? 'bg-opacity-60' : ''}
              ${onSquareClick ? 'cursor-pointer hover:brightness-90' : ''}
            `}
            data-square={squareName}
            onClick={() => onSquareClick && onSquareClick(squareName)}
          >
            {/* Coordinate Labels */}
            {showCoordinates && file === 0 && (
              <span
                className={`
                  absolute top-1 left-1 text-[0.7em] font-bold select-none
                  ${isLight ? 'text-[#779556]' : 'text-[#ebecd0]'}
                `}
              >
                {squareName[1]}
              </span>
            )}
            {showCoordinates && rank === 7 && (
              <span
                className={`
                  absolute bottom-1 right-1 text-[0.7em] font-bold select-none
                  ${isLight ? 'text-[#779556]' : 'text-[#ebecd0]'}
                `}
              >
                {squareName[0]}
              </span>
            )}

            {/* Last Move Highlight */}
            {lastMoveSquare && (
              <div className="absolute inset-0 bg-yellow-300 opacity-30" />
            )}

            {/* Piece */}
            {piece && (
              <span
                className="chess-piece text-[3em] select-none z-10 drop-shadow-md"
                style={{
                  color: piece.color === 'white' ? '#ffffff' : '#000000',
                  textShadow:
                    piece.color === 'white'
                      ? '0 0 2px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8)'
                      : '0 0 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.4)',
                }}
              >
                {getPieceSymbol(piece.role, piece.color)}
              </span>
            )}
          </div>
        );
      }
    }

    return squares;
  };

  return (
    <div
      ref={boardRef}
      className={`relative select-none ${className}`}
      style={style}
    >
      <div className="grid grid-cols-8 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl bg-slate-800 relative">
        {renderSquares()}
        
        {/* SVG Overlay for arrows and circles */}
        <SVGOverlay
          arrows={arrows}
          circles={circles}
          flipped={flipped}
          squareSize={squareSize}
        />
      </div>
    </div>
  );
};

export default ChessBoardAnalysis;
