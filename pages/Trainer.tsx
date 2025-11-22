import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, RefreshCw, Eye, CheckCircle, XCircle, HelpCircle, Play } from 'lucide-react';
import Layout from '../components/Layout';
import ChessBoard from '../components/ChessBoard';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { AppState, BoardState, Difficulty, GameSettings, Piece, PieceColor, PieceType, Square } from '../types';
import { createEmptyBoard, generateRandomPosition, calculateAccuracy, getPieceDifferences, fenToBoard } from '../utils/chessLogic';
import { PIECE_IMAGES, THEME } from '../constants';

const Trainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Game State
  const [gameState, setGameState] = useState<AppState>(AppState.MEMORIZE);
  const [settings, setSettings] = useState<GameSettings>(location.state?.settings || { mode: 'CLASSIC', difficulty: 'EASY', memorizeTime: 10 });
  
  // Board Data
  const [originalBoard, setOriginalBoard] = useState<BoardState>(createEmptyBoard());
  const [userBoard, setUserBoard] = useState<BoardState>(createEmptyBoard());
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(settings.memorizeTime);
  
  // Reconstruction UI
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [moveSource, setMoveSource] = useState<Square | null>(null);
  
  // Results
  const [accuracy, setAccuracy] = useState(0);
  const [detailedErrors, setDetailedErrors] = useState<any[]>([]);
  const [showDetailedErrors, setShowDetailedErrors] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    startNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewSession = () => {
    let newBoard;
    if (settings.fen) {
        newBoard = fenToBoard(settings.fen);
    } else {
        newBoard = generateRandomPosition(settings.difficulty);
    }
    setOriginalBoard(newBoard);
    setUserBoard(createEmptyBoard());
    setGameState(AppState.MEMORIZE);
    setTimeLeft(settings.memorizeTime);
    setShowDetailedErrors(false);
    setSelectedPiece(null);
    setMoveSource(null);
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (gameState === AppState.MEMORIZE && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === AppState.MEMORIZE && timeLeft === 0) {
      setGameState(AppState.RECONSTRUCT);
      setTimeLeft(60); // Give 60s to reconstruct or make it unlimited/count up
    }
    
    // Optional: Timer for reconstruction phase
    if (gameState === AppState.RECONSTRUCT && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState]);

  // --- Interaction Handlers ---
  
  const handlePieceMove = (from: Square, to: Square) => {
    if (gameState !== AppState.RECONSTRUCT) return;

    // Clone the board
    const newBoard = [...userBoard.map(row => [...row.map(sq => ({...sq}))])];
    const fromR = 7 - from.y;
    const fromC = from.x;
    const toR = 7 - to.y;
    const toC = to.x;

    const pieceToMove = newBoard[fromR][fromC].piece;
    
    if (pieceToMove) {
      // Move piece
      newBoard[fromR][fromC].piece = null;
      newBoard[toR][toC].piece = pieceToMove;
      setUserBoard(newBoard);
    }
    setMoveSource(null);
  };

  const handleSquareClick = (square: Square) => {
    if (gameState !== AppState.RECONSTRUCT) return;

    // Clone the board
    const newBoard = [...userBoard.map(row => [...row.map(sq => ({...sq}))])];
    const r = 7 - square.y;
    const c = square.x;
    const targetSquare = newBoard[r][c];

    // 1. PLACEMENT MODE (Palette piece selected)
    if (selectedPiece) {
      // Place piece
      targetSquare.piece = { ...selectedPiece, id: `${selectedPiece.id}-${Date.now()}` };
      setUserBoard(newBoard);
      setMoveSource(null); // Cancel any move
      return;
    }

    // 2. MOVE MODE (No palette piece selected)
    if (!moveSource) {
        // Selecting source
        if (targetSquare.piece) {
            setMoveSource(square);
        }
    } else {
        // Selecting destination
        if (moveSource.x === square.x && moveSource.y === square.y) {
            // Clicked same square -> Deselect
            setMoveSource(null);
        } else {
            // Moving to a new square
            const sourceR = 7 - moveSource.y;
            const sourceC = moveSource.x;
            
            const pieceToMove = newBoard[sourceR][sourceC].piece;
            
            if (pieceToMove) {
                // Move piece
                newBoard[sourceR][sourceC].piece = null;
                targetSquare.piece = pieceToMove;
                setUserBoard(newBoard);
            }
            setMoveSource(null);
        }
    }
  };

  const handleSubmit = () => {
    const acc = calculateAccuracy(originalBoard, userBoard);
    const errs = getPieceDifferences(originalBoard, userBoard);
    setAccuracy(acc);
    setDetailedErrors(errs);
    setGameState(AppState.RESULT);
  };

  // --- Sub Components ---

  const PiecePalette = () => {
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

    return (
      <div className="grid grid-cols-6 gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
        {pieces.map(p => (
          <button
            key={p.id}
            onClick={() => {
                setSelectedPiece(p);
                setMoveSource(null);
            }}
            className={`
              p-2 rounded-md transition-all flex justify-center items-center aspect-square
              text-4xl font-bold select-none
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
        <button 
            onClick={() => {
                setSelectedPiece(null);
                setMoveSource(null);
            }}
            className={`
              col-span-6 mt-2 p-2 rounded border border-slate-600 text-xs text-center
              transition-all duration-200
              ${selectedPiece === null 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500 font-semibold' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }
            `}
        >
            {selectedPiece === null ? '✓ Drag/Move Mode Active' : 'Switch to Drag/Move Mode'}
        </button>
      </div>
    );
  };

  // --- Render ---

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header / Back Button */}
        <div className="mb-8 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </button>
            <div className="flex items-center space-x-4">
                 <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
                    {settings.fen ? 'CUSTOM' : settings.difficulty} MODE
                 </span>
                 {gameState !== AppState.RESULT && (
                     <div className="flex items-center text-amber-400 font-mono font-bold text-xl bg-slate-800 px-4 py-2 rounded-lg border border-slate-700/50 shadow-inner">
                        <Timer className="mr-2 h-5 w-5" />
                        {timeLeft < 10 ? `0:0${timeLeft}` : timeLeft < 60 ? `0:${timeLeft}` : `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`}
                     </div>
                 )}
            </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left: The Board */}
            <div className="lg:col-span-2 flex justify-center">
                <div className="w-full max-w-xl">
                    {gameState === AppState.MEMORIZE && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                    <Eye className="text-amber-400"/> Memorize This Position
                                </h2>
                                <p className="text-slate-400">Study the board carefully!</p>
                            </div>
                            <EnhancedChessBoard board={originalBoard} />
                            <button 
                                onClick={() => setGameState(AppState.RECONSTRUCT)}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
                            >
                                I'm Ready!
                            </button>
                        </div>
                    )}

                    {gameState === AppState.RECONSTRUCT && (
                         <div className="space-y-4">
                             <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                    <RefreshCw className="text-amber-400"/> Recreate Position
                                </h2>
                                <p className="text-slate-400">Select a piece to place, or click board to move</p>
                            </div>
                            <EnhancedChessBoard 
                                board={userBoard} 
                                interactive={true} 
                                onSquareClick={handleSquareClick}
                                onPieceMove={handlePieceMove}
                                selectedSquare={moveSource}
                            />
                            <PiecePalette />
                            <button 
                                onClick={handleSubmit}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
                            >
                                Submit Answer
                            </button>
                        </div>
                    )}

                    {gameState === AppState.RESULT && (
                         <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-center text-slate-400 mb-2 text-sm">Original</p>
                                    <EnhancedChessBoard board={originalBoard} showLabels={false} />
                                </div>
                                <div>
                                    <p className="text-center text-slate-400 mb-2 text-sm">Your Answer</p>
                                    <EnhancedChessBoard 
                                        board={userBoard} 
                                        showLabels={false} 
                                        highlightErrors={showDetailedErrors ? detailedErrors : []}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Sidebar / Stats */}
            <div className="lg:col-span-1 space-y-6">
                
                {gameState === AppState.RESULT ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-fade-in">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Session Result</h3>
                        
                        <div className={`text-6xl font-black text-center mb-2 ${accuracy === 100 ? 'text-emerald-400' : accuracy > 70 ? 'text-amber-400' : 'text-red-400'}`}>
                            {accuracy}%
                        </div>
                        <p className="text-center text-slate-400 mb-8">Accuracy</p>

                        <div className="space-y-3">
                            <button 
                                onClick={() => setShowDetailedErrors(!showDetailedErrors)}
                                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {showDetailedErrors ? <Eye size={18} /> : <HelpCircle size={18} />}
                                {showDetailedErrors ? 'Hide Details' : 'Show Detailed Errors'}
                            </button>
                            <button 
                                onClick={startNewSession}
                                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> {settings.fen ? 'Retry' : 'Next Position'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">Instructions</h3>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white mt-0.5 shrink-0">1</span>
                                <span>Memorize the position of all pieces on the board.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white mt-0.5 shrink-0">2</span>
                                <span>Click a piece from the palette to place it on the board.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white mt-0.5 shrink-0">3</span>
                                <span><strong>Drag pieces</strong> on the board to move them, or click to select and click destination.</span>
                            </li>
                        </ul>
                        
                        {gameState === AppState.MEMORIZE && (
                            <button 
                                onClick={() => setTimeLeft(prev => prev + 10)}
                                className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-sm transition-colors"
                            >
                                + 10 Seconds
                            </button>
                        )}
                    </div>
                )}
            </div>

        </div>
      </div>
    </Layout>
  );
};

export default Trainer;