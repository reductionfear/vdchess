import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Chess } from 'chessops/chess';
import { makeFen } from 'chessops/fen';
import { useChessboard } from '../../hooks/useChessboard';
import { useAnalysis } from '../../hooks/useAnalysis';
import BoardControls from '../Board/BoardControls';
import BoardSettings from '../Board/BoardSettings';
import ChessBoardAnalysis from '../Board/ChessBoardAnalysis';
import MoveList from './MoveList';
import Evaluation from './Evaluation';
import UnderboardMenu from './UnderboardMenu';

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
  const [drawingArrow, setDrawingArrow] = useState<{ from: string } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

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
    arrows,
    circles,
    addArrow,
    clearShapes,
    updateBoardOpacity,
    updateBoardBrightness,
    updateBoardHue,
    updateZoomLevel,
    toggleCoordinates,
    getBoardStyle,
    evaluation,
    isAnalyzing,
  } = useAnalysis();

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

  // Add demo arrows for testing
  const addDemoArrows = useCallback(() => {
    addArrow('e2', 'e4', 'green');
    addArrow('d7', 'd5', 'red');
  }, [addArrow]);

  // Handle square click - implement piece selection and movement
  const handleSquareClick = useCallback((square: string) => {
    // If no square is selected, select this square (if it has a piece)
    if (!selectedSquare) {
      // Check if the square has a piece of the current player
      // Chessops uses 0-63 indexing: a1=0, b1=1, ..., h1=7, a2=8, ..., h8=63
      const file = square.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
      const rank = parseInt(square[1]) - 1; // 1=0, 2=1, ..., 8=7
      const squareIndex = rank * 8 + file;
      const piece = state.position.board.get(squareIndex);
      
      if (piece && piece.color === state.position.turn) {
        setSelectedSquare(square);
      }
    } else {
      // Try to make a move from selected square to this square
      if (selectedSquare !== square) {
        const moveSuccess = makeMove(selectedSquare, square);
        if (!moveSuccess) {
          // If move failed, check if clicking another piece to select it
          const file = square.charCodeAt(0) - 97;
          const rank = parseInt(square[1]) - 1;
          const squareIndex = rank * 8 + file;
          const piece = state.position.board.get(squareIndex);
          
          if (piece && piece.color === state.position.turn) {
            setSelectedSquare(square);
          } else {
            setSelectedSquare(null);
          }
        } else {
          setSelectedSquare(null);
        }
      } else {
        // Clicked the same square, deselect
        setSelectedSquare(null);
      }
    }
  }, [selectedSquare, state.position, makeMove]);

  // Handle square right-click for arrow drawing
  const handleSquareRightClick = useCallback((square: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!drawingArrow) {
      // Start drawing arrow
      setDrawingArrow({ from: square });
    } else {
      // Complete arrow
      if (drawingArrow.from !== square) {
        addArrow(drawingArrow.from, square, 'green');
      }
      setDrawingArrow(null);
    }
  }, [drawingArrow, addArrow]);

  // Get last move for highlighting
  const getLastMove = () => {
    if (moveHistory.length === 0 || currentMoveIndex < 0) {
      return undefined;
    }
    const lastMove = moveHistory[currentMoveIndex];
    return lastMove ? { from: lastMove.from, to: lastMove.to } : undefined;
  };

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      const fen = getCurrentFen();
      await navigator.clipboard.writeText(fen);
      console.log('FEN copied to clipboard:', fen);
    } catch (error) {
      console.error('Failed to copy FEN:', error);
    }
  }, [getCurrentFen]);

  // Handle copy PGN to clipboard
  const handleCopyPgn = useCallback(async () => {
    try {
      const pgn = getPgn({
        Event: 'Analysis',
        Site: 'VDChess',
        Date: new Date().toISOString().split('T')[0],
      });
      await navigator.clipboard.writeText(pgn);
      console.log('PGN copied to clipboard');
    } catch (error) {
      console.error('Failed to copy PGN:', error);
    }
  }, [getPgn]);

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
            <ChessBoardAnalysis
              position={state.position}
              flipped={flipped}
              showCoordinates={settings.showCoordinates}
              lastMove={settings.highlightLastMove ? getLastMove() : undefined}
              arrows={arrows}
              circles={circles}
              onSquareClick={handleSquareClick}
              highlightSquares={selectedSquare ? [selectedSquare] : []}
            />
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
              onThemeChange={(theme) => {
                // Update theme in settings
                const themeMap = {
                  light: 'light' as const,
                  dark: 'dark' as const,
                  transparent: 'transparent' as const,
                };
                const newTheme = themeMap[theme] || 'light';
                // Note: Full theme implementation would require updating board styles
                console.log('Theme changed to:', newTheme);
              }}
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

          {/* Underboard Menu */}
          <UnderboardMenu
            currentFen={getCurrentFen()}
            pgn={getPgn({
              Event: 'Analysis',
              Site: 'VDChess',
              Date: new Date().toISOString().split('T')[0],
            })}
            onCopyFen={handleCopy}
            onCopyPgn={handleCopyPgn}
            onDownloadPgn={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisBoard;
