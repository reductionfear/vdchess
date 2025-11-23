import React, { useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseSquare, makeSquare } from 'chessops/util';
import type { Api } from '@lichess-org/chessground/api';
import type { Config } from '@lichess-org/chessground/config';
import type { Key, Color, Piece, PiecesDiff } from '@lichess-org/chessground/types';
import Chessground, { ChessgroundRef } from './Chessground';

// Import chessground CSS
import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';

interface ChessBoardInteractiveProps {
  position: Chess;
  flipped?: boolean;
  showCoordinates?: boolean;
  highlightSquares?: string[];
  lastMove?: { from: string; to: string };
  arrows?: Array<{ from: string; to: string; color: string }>;
  circles?: Array<{ square: string; color: string }>;
  onMove?: (from: string, to: string) => boolean;
  onSquareClick?: (square: string) => void;
  viewOnly?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const ChessBoardInteractive: React.FC<ChessBoardInteractiveProps> = ({
  position,
  flipped = false,
  showCoordinates = true,
  highlightSquares = [],
  lastMove,
  arrows = [],
  circles = [],
  onMove,
  onSquareClick,
  viewOnly = false,
  style,
  className = '',
}) => {
  const chessgroundRef = useRef<ChessgroundRef>(null);

  // Convert chess position to chessground pieces format
  const positionToPieces = useCallback((): Map<Key, Piece> => {
    const pieces = new Map<Key, Piece>();
    
    for (let sq = 0; sq < 64; sq++) {
      const piece = position.board.get(sq);
      if (piece) {
        const squareName = makeSquare(sq) as Key;
        pieces.set(squareName, {
          role: piece.role as any,
          color: piece.color as Color,
        });
      }
    }
    
    return pieces;
  }, [position]);

  // Get legal moves for a square
  const getDests = useCallback((): Map<Key, Key[]> => {
    const dests = new Map<Key, Key[]>();
    const allDests = position.allDests();
    
    allDests.forEach((destSquares, fromSquare) => {
      const from = makeSquare(fromSquare) as Key;
      const to = Array.from(destSquares).map(sq => makeSquare(sq) as Key);
      dests.set(from, to);
    });
    
    return dests;
  }, [position]);

  // Handle move
  const handleMove = useCallback((orig: Key, dest: Key) => {
    if (onMove) {
      const success = onMove(orig, dest);
      if (!success) {
        // Move was invalid, reset the board
        if (chessgroundRef.current?.api) {
          chessgroundRef.current.api.set({
            fen: makeFen(position.toSetup()),
            lastMove: lastMove ? [lastMove.from as Key, lastMove.to as Key] : undefined,
          });
        }
      }
    }
  }, [onMove, position, lastMove]);

  // Build chessground config
  const config: Config = {
    fen: makeFen(position.toSetup()),
    orientation: (flipped ? 'black' : 'white') as Color,
    coordinates: showCoordinates,
    viewOnly: viewOnly,
    movable: {
      free: false,
      color: (viewOnly ? undefined : position.turn) as Color | undefined,
      dests: viewOnly ? undefined : getDests(),
      events: {
        after: handleMove,
      },
    },
    draggable: {
      enabled: !viewOnly,
      showGhost: true,
    },
    selectable: {
      enabled: !viewOnly,
    },
    lastMove: lastMove ? [lastMove.from as Key, lastMove.to as Key] : undefined,
    highlight: {
      lastMove: true,
      check: true,
      custom: highlightSquares.length > 0 
        ? new Map(highlightSquares.map(sq => [sq as Key, 'highlight'] as [Key, string]))
        : undefined,
    },
    events: {
      select: onSquareClick ? (key: Key) => onSquareClick(key) : undefined,
      move: (orig: Key, dest: Key) => {
        console.log('Move:', orig, dest);
      },
    },
  };

  // Update board when position changes
  useEffect(() => {
    if (chessgroundRef.current?.api) {
      chessgroundRef.current.api.set({
        fen: makeFen(position.toSetup()),
        orientation: (flipped ? 'black' : 'white') as Color,
        movable: {
          color: (viewOnly ? undefined : position.turn) as Color | undefined,
          dests: viewOnly ? undefined : getDests(),
        },
        lastMove: lastMove ? [lastMove.from as Key, lastMove.to as Key] : undefined,
      });
    }
  }, [position, flipped, viewOnly, lastMove, getDests]);

  // Set shapes (arrows and circles)
  useEffect(() => {
    if (chessgroundRef.current?.api) {
      const shapes = [
        ...arrows.map(arrow => ({
          orig: arrow.from as Key,
          dest: arrow.to as Key,
          brush: arrow.color,
        })),
        ...circles.map(circle => ({
          orig: circle.square as Key,
          brush: circle.color,
        })),
      ];
      chessgroundRef.current.api.setAutoShapes(shapes);
    }
  }, [arrows, circles]);

  return (
    <div className={`relative ${className}`} style={style}>
      <Chessground
        ref={chessgroundRef}
        config={config}
        className="cg-wrap"
      />
    </div>
  );
};

export default ChessBoardInteractive;
