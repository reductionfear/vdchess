import React, { useState } from 'react';
import EnhancedChessBoard from './EnhancedChessBoard';
import PiecePalette from './PiecePalette';
import { BoardState, Piece, Square } from '../types';

interface RecreatePositionEditorProps {
  board: BoardState;
  onBoardChange: (board: BoardState) => void;
}

const RecreatePositionEditor: React.FC<RecreatePositionEditorProps> = ({
  board,
  onBoardChange
}) => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [moveSource, setMoveSource] = useState<Square | null>(null);

  const handlePaletteDrop = (piece: Piece, targetSquare: Square) => {
    const newBoard = [...board.map(row => [...row.map(sq => ({...sq}))])];
    const r = 7 - targetSquare.y;
    const c = targetSquare.x;
    newBoard[r][c].piece = { ...piece, id: `${piece.id}-${targetSquare.name}-${Date.now()}` };
    onBoardChange(newBoard);
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
      onBoardChange(newBoard);
    }
    setMoveSource(null);
  };

  const handleSquareClick = (square: Square) => {
    const newBoard = [...board.map(row => [...row.map(sq => ({...sq}))])];
    const r = 7 - square.y;
    const c = square.x;
    const targetSquare = newBoard[r][c];

    // 1. PLACEMENT MODE (Palette piece selected)
    if (selectedPiece) {
      targetSquare.piece = { ...selectedPiece, id: `${selectedPiece.id}-${Date.now()}` };
      onBoardChange(newBoard);
      setMoveSource(null);
      setSelectedPiece(null); // Deselect after placing
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
          newBoard[sourceR][sourceC].piece = null;
          targetSquare.piece = pieceToMove;
          onBoardChange(newBoard);
        }
        setMoveSource(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <EnhancedChessBoard 
        board={board} 
        interactive={true} 
        onSquareClick={handleSquareClick}
        onPieceMove={handlePieceMove}
        onPaletteDrop={handlePaletteDrop}
        selectedSquare={moveSource}
      />
      <PiecePalette 
        selectedPiece={selectedPiece}
        onPieceSelect={setSelectedPiece}
        onMoveSourceClear={() => setMoveSource(null)}
      />
    </div>
  );
};

export default RecreatePositionEditor;
