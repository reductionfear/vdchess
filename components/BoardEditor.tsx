import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2, Play, Copy, CheckCircle, FlipVertical } from 'lucide-react';
import EnhancedChessBoard from './EnhancedChessBoard';
import { BoardState, Piece, PieceColor, PieceType, Square } from '../types';
import { createEmptyBoard, fenToBoard, boardToFen, getStartingPositionFen } from '../utils/chessLogic';

interface BoardEditorProps {
  onStartTraining?: (fen: string) => void;
}

const BoardEditor: React.FC<BoardEditorProps> = ({ onStartTraining }) => {
  const navigate = useNavigate();
  
  // Board state
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [moveSource, setMoveSource] = useState<Square | null>(null);
  const [flipped, setFlipped] = useState(false);
  
  // FEN components
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [castlingRights, setCastlingRights] = useState({
    K: true,  // White kingside
    Q: true,  // White queenside
    k: true,  // Black kingside
    q: true   // Black queenside
  });
  const [enPassantSquare, setEnPassantSquare] = useState<string>('-');
  const [fenInput, setFenInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Generate FEN whenever board or settings change
  useEffect(() => {
    const castlingString = [
      castlingRights.K ? 'K' : '',
      castlingRights.Q ? 'Q' : '',
      castlingRights.k ? 'k' : '',
      castlingRights.q ? 'q' : ''
    ].join('') || '-';
    
    const fen = boardToFen(board, turn, castlingString, enPassantSquare, 0, 1);
    setFenInput(fen);
  }, [board, turn, castlingRights, enPassantSquare]);
  
  // Handlers
  const handlePaletteDrop = (piece: Piece, targetSquare: Square) => {
    const newBoard = [...board.map(row => [...row.map(sq => ({...sq}))])];
    const r = 7 - targetSquare.y;
    const c = targetSquare.x;
    newBoard[r][c].piece = { ...piece, id: `${piece.id}-${targetSquare.name}-${Date.now()}` };
    setBoard(newBoard);
  };
  
  const handlePieceMove = (from: Square, to: Square) => {
    const newBoard = [...board.map(row => [...row.map(sq => ({...sq}))])];
    const fromR = 7 - from.y;
    const fromC = from.x;
    const toR = 7 - to.y;
    const toC = to.x;

    const pieceToMove = newBoard[fromR][fromC].piece;
    
    if (pieceToMove) {
      newBoard[fromR][fromC].piece = null;
      newBoard[toR][toC].piece = pieceToMove;
      setBoard(newBoard);
    }
    setMoveSource(null);
  };

  const handleSquareClick = (square: Square) => {
    const newBoard = [...board.map(row => [...row.map(sq => ({...sq}))])];
    const r = 7 - square.y;
    const c = square.x;
    const targetSquare = newBoard[r][c];

    // Placement mode
    if (selectedPiece) {
      targetSquare.piece = { ...selectedPiece, id: `${selectedPiece.id}-${Date.now()}` };
      setBoard(newBoard);
      setMoveSource(null);
      return;
    }

    // Move mode
    if (!moveSource) {
      if (targetSquare.piece) {
        setMoveSource(square);
      }
    } else {
      if (moveSource.x === square.x && moveSource.y === square.y) {
        setMoveSource(null);
      } else {
        const sourceR = 7 - moveSource.y;
        const sourceC = moveSource.x;
        const pieceToMove = newBoard[sourceR][sourceC].piece;
        
        if (pieceToMove) {
          newBoard[sourceR][sourceC].piece = null;
          targetSquare.piece = pieceToMove;
          setBoard(newBoard);
        }
        setMoveSource(null);
      }
    }
  };
  
  const handleClearBoard = () => {
    setBoard(createEmptyBoard());
    setSelectedPiece(null);
    setMoveSource(null);
  };
  
  const handleStartingPosition = () => {
    const fen = getStartingPositionFen();
    setBoard(fenToBoard(fen));
    setTurn('w');
    setCastlingRights({ K: true, Q: true, k: true, q: true });
    setEnPassantSquare('-');
    setSelectedPiece(null);
    setMoveSource(null);
  };
  
  const handleLoadFen = () => {
    try {
      const newBoard = fenToBoard(fenInput);
      setBoard(newBoard);
      
      // Parse other FEN components
      const parts = fenInput.split(' ');
      if (parts[1]) setTurn(parts[1] as 'w' | 'b');
      if (parts[2]) {
        const castling = parts[2];
        setCastlingRights({
          K: castling.includes('K'),
          Q: castling.includes('Q'),
          k: castling.includes('k'),
          q: castling.includes('q')
        });
      }
      if (parts[3]) setEnPassantSquare(parts[3]);
    } catch (error) {
      alert('Invalid FEN string. Please check the format.');
    }
  };
  
  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(fenInput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy FEN:', err);
    }
  };
  
  const handleStartTraining = () => {
    if (onStartTraining) {
      onStartTraining(fenInput);
    } else {
      navigate('/trainer', {
        state: {
          settings: {
            mode: 'CLASSIC',
            difficulty: 'CUSTOM',
            memorizeTime: 30,
            fen: fenInput
          }
        }
      });
    }
  };
  
  const toggleCastling = (key: keyof typeof castlingRights) => {
    setCastlingRights(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Piece palette component
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
      <div className="grid grid-cols-6 gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700">
        {pieces.map(p => (
          <button
            key={p.id}
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData('palette-piece', JSON.stringify(p));
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => {
              setSelectedPiece(p);
              setMoveSource(null);
            }}
            className={`
              p-2 rounded-md transition-all flex justify-center items-center aspect-square
              text-4xl font-bold select-none cursor-grab active:cursor-grabbing
              ${selectedPiece?.type === p.type && selectedPiece?.color === p.color 
                ? 'bg-amber-400/20 ring-2 ring-amber-400' 
                : 'hover:bg-slate-700 hover:scale-105'
              }
              ${p.color === PieceColor.WHITE ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-gray-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]'}
            `}
          >
            {getPieceUnicode(p)}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </button>
        <h1 className="text-2xl font-bold text-white">Board Editor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Board */}
        <div className="lg:col-span-2 space-y-4">
          <EnhancedChessBoard 
            board={board}
            interactive={true}
            onSquareClick={handleSquareClick}
            onPieceMove={handlePieceMove}
            onPaletteDrop={handlePaletteDrop}
            selectedSquare={moveSource}
          />
          
          <PiecePalette />
          
          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={handleStartingPosition}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              Start Position
            </button>
            <button
              onClick={handleClearBoard}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Clear Board
            </button>
            <button
              onClick={() => setFlipped(!flipped)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <FlipVertical size={18} />
              Flip Board
            </button>
            <button
              onClick={() => {
                setSelectedPiece(null);
                setMoveSource(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                selectedPiece === null 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500' 
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              Move Mode
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          {/* Turn */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Side to Move</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTurn('w')}
                className={`py-2 px-4 rounded-md font-medium transition-colors ${
                  turn === 'w' 
                    ? 'bg-white text-slate-900' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                White
              </button>
              <button
                onClick={() => setTurn('b')}
                className={`py-2 px-4 rounded-md font-medium transition-colors ${
                  turn === 'b' 
                    ? 'bg-slate-900 text-white border border-slate-600' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Black
              </button>
            </div>
          </div>

          {/* Castling Rights */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Castling Rights</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-2">White</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCastling('K')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold transition-colors ${
                      castlingRights.K 
                        ? 'bg-white text-slate-900' 
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    K
                  </button>
                  <button
                    onClick={() => toggleCastling('Q')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold transition-colors ${
                      castlingRights.Q 
                        ? 'bg-white text-slate-900' 
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    Q
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Black</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCastling('k')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold transition-colors ${
                      castlingRights.k 
                        ? 'bg-slate-900 text-white border border-slate-600' 
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    k
                  </button>
                  <button
                    onClick={() => toggleCastling('q')}
                    className={`flex-1 py-2 px-3 rounded-md font-bold transition-colors ${
                      castlingRights.q 
                        ? 'bg-slate-900 text-white border border-slate-600' 
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    q
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* En Passant */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">En Passant Square</h3>
            <input
              type="text"
              value={enPassantSquare}
              onChange={(e) => setEnPassantSquare(e.target.value || '-')}
              placeholder="-"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <p className="text-xs text-slate-500 mt-2">e.g., "e3" or "-" for none</p>
          </div>

          {/* FEN */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">FEN String</h3>
            <textarea
              value={fenInput}
              onChange={(e) => setFenInput(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white text-xs font-mono resize-none focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleLoadFen}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Load FEN
              </button>
              <button
                onClick={handleCopyFen}
                className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
              >
                {copySuccess ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Start Training */}
          <button
            onClick={handleStartTraining}
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Start Training with This Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEditor;
