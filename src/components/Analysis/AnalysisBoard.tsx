import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Chess } from 'chessops/chess';
import { makeFen } from 'chessops/fen';
import { useChessboard } from '../../hooks/useChessboard';
import { useAnalysis } from '../../hooks/useAnalysis';
import BoardControls from '../Board/BoardControls';
import BoardSettings from '../Board/BoardSettings';
import MoveList from './MoveList';
import Evaluation from './Evaluation';

interface AnalysisBoardProps {
  initialFen?: string;
  onFenChange?: (fen: string) => void;
  showControls?: boolean;
  showSettings?: boolean;
  showMoveList?: boolean;
  showEvaluation?: boolean;
  className?: string;
}

const AnalysisBoard: React.FC<AnalysisBoardProps> = ({
  initialFen,
  onFenChange,
  showControls = true,
  showSettings = true,
  showMoveList = true,
  showEvaluation = true,
  className = '',
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // Chess state management
  const {
    state,
    moveHistory,
    currentMoveIndex,
    makeMove,
    goToMove,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    hasNext,
    hasPrevious,
    getCurrentFen,
    getPgn,
    resetBoard,
  } = useChessboard({ initialFen });

  // Analysis settings
  const {
    settings,
    updateBoardOpacity,
    updateBoardBrightness,
    updateBoardHue,
    updateZoomLevel,
    toggleCoordinates,
    getBoardStyle,
    evaluation,
    isAnalyzing,
  } = useAnalysis();

  // Notify parent of FEN changes
  useEffect(() => {
    if (onFenChange) {
      onFenChange(getCurrentFen());
    }
  }, [currentMoveIndex, onFenChange, getCurrentFen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          previousMove();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextMove();
          break;
        case 'ArrowUp':
          e.preventDefault();
          firstMove();
          break;
        case 'ArrowDown':
          e.preventDefault();
          lastMove();
          break;
        case 'Home':
          e.preventDefault();
          firstMove();
          break;
        case 'End':
          e.preventDefault();
          lastMove();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextMove, previousMove, firstMove, lastMove]);

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the wheel event is on the board or its children
      if (
        boardRef.current &&
        (boardRef.current.contains(target) ||
          target.classList.contains('chess-square') ||
          target.classList.contains('chess-piece') ||
          target.tagName.toLowerCase() === 'cg-board')
      ) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
          // Scroll up = previous move
          previousMove();
        } else if (e.deltaY > 0) {
          // Scroll down = next move
          nextMove();
        }
      }
    };

    const boardElement = boardRef.current;
    if (boardElement) {
      boardElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => boardElement.removeEventListener('wheel', handleWheel);
    }
  }, [nextMove, previousMove]);

  // Handle board flip
  const handleFlip = useCallback(() => {
    setFlipped(prev => !prev);
  }, []);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      const fen = getCurrentFen();
      await navigator.clipboard.writeText(fen);
      // Could show a toast notification here
      console.log('FEN copied to clipboard:', fen);
    } catch (error) {
      console.error('Failed to copy FEN:', error);
    }
  }, [getCurrentFen]);

  // Handle download PGN
  const handleDownload = useCallback(() => {
    const pgn = getPgn({
      Event: 'Analysis',
      Site: 'VDChess',
      Date: new Date().toISOString().split('T')[0],
    });

    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${Date.now()}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getPgn]);

  // Render a simple board representation (placeholder)
  // In a real implementation, you would integrate with a chess board library like chessground
  const renderBoard = () => {
    const pieces = state.position.board;
    const squares = [];

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const square = flipped ? (7 - rank) * 8 + (7 - file) : rank * 8 + file;
        const piece = pieces.get(square);
        const isLight = (rank + file) % 2 === 0;

        squares.push(
          <div
            key={square}
            className={`
              chess-square aspect-square flex items-center justify-center text-4xl
              ${isLight ? 'bg-[#ebecd0]' : 'bg-[#779556]'}
            `}
            data-square={square}
          >
            {piece && (
              <span className="chess-piece select-none">
                {getPieceSymbol(piece.role, piece.color)}
              </span>
            )}
          </div>
        );
      }
    }

    return squares;
  };

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

  const boardStyle = getBoardStyle();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Board Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Board */}
          <div 
            ref={boardRef}
            className="relative mx-auto max-w-2xl"
            style={boardStyle}
          >
            <div className="grid grid-cols-8 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl bg-slate-800">
              {renderBoard()}
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <BoardControls
              onFirst={firstMove}
              onPrevious={previousMove}
              onNext={nextMove}
              onLast={lastMove}
              onFlip={handleFlip}
              onCopy={handleCopy}
              onDownload={handleDownload}
              hasPrevious={hasPrevious()}
              hasNext={hasNext()}
            />
          )}

          {/* Settings */}
          {showSettings && (
            <BoardSettings
              opacity={settings.boardOpacity}
              brightness={settings.boardBrightness}
              hue={settings.boardHue}
              zoom={settings.zoomLevel}
              theme={settings.theme}
              showCoordinates={settings.showCoordinates}
              onOpacityChange={updateBoardOpacity}
              onBrightnessChange={updateBoardBrightness}
              onHueChange={updateBoardHue}
              onZoomChange={updateZoomLevel}
              onThemeChange={(theme) => {/* Handle theme change */}}
              onToggleCoordinates={toggleCoordinates}
            />
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Evaluation */}
          {showEvaluation && (
            <Evaluation
              score={evaluation?.score}
              mate={evaluation?.mate}
              depth={evaluation?.depth}
              bestMove={evaluation?.bestMove}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Move List */}
          {showMoveList && (
            <MoveList
              moves={moveHistory}
              currentMoveIndex={currentMoveIndex}
              onMoveClick={goToMove}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisBoard;
