import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { PromotionRole } from 'chessops/types';
import { 
  BoardStateManager, 
  createBoardState, 
  makeMove as makeMoveUtil,
  goToMove,
  nextMove as nextMoveUtil,
  previousMove as previousMoveUtil,
  firstMove as firstMoveUtil,
  lastMove as lastMoveUtil,
  hasNextMove as hasNextMoveUtil,
  hasPreviousMove as hasPreviousMoveUtil,
  getLegalMoves as getLegalMovesUtil,
  isInCheck,
  isCheckmate,
  isStalemate,
  exportToPgn,
} from '../utils/chess/boardState';

export interface UseChessboardOptions {
  initialFen?: string;
  onChange?: (state: BoardStateManager) => void;
}

export function useChessboard(options: UseChessboardOptions = {}) {
  const { initialFen, onChange } = options;
  const [state, setState] = useState<BoardStateManager>(() => 
    createBoardState(initialFen)
  );
  const prevInitialFenRef = useRef<string | undefined>(initialFen);

  // Reset board when initialFen changes externally
  useEffect(() => {
    if (initialFen && initialFen !== prevInitialFenRef.current) {
      prevInitialFenRef.current = initialFen;
      setState(createBoardState(initialFen));
    }
  }, [initialFen]);

  // Notify on changes
  useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [state, onChange]);

  const makeMove = useCallback((from: string, to: string, promotion?: PromotionRole) => {
    const newState = makeMoveUtil(state, from, to, promotion);
    if (newState) {
      setState(newState);
      return true;
    }
    return false;
  }, [state]);

  const goToMoveIndex = useCallback((index: number) => {
    setState(goToMove(state, index));
  }, [state]);

  const nextMove = useCallback(() => {
    setState(nextMoveUtil(state));
  }, [state]);

  const previousMove = useCallback(() => {
    setState(previousMoveUtil(state));
  }, [state]);

  const firstMove = useCallback(() => {
    setState(firstMoveUtil(state));
  }, [state]);

  const lastMove = useCallback(() => {
    setState(lastMoveUtil(state));
  }, [state]);

  const hasNext = useCallback(() => {
    return hasNextMoveUtil(state);
  }, [state]);

  const hasPrevious = useCallback(() => {
    return hasPreviousMoveUtil(state);
  }, [state]);

  const getLegalMoves = useCallback((from: string) => {
    return getLegalMovesUtil(state, from);
  }, [state]);

  const getCurrentFen = useCallback(() => {
    return makeFen(state.position.toSetup());
  }, [state]);

  const getPgn = useCallback((metadata?: Record<string, string>) => {
    return exportToPgn(state, metadata);
  }, [state]);

  const resetBoard = useCallback((fen?: string) => {
    setState(createBoardState(fen));
  }, []);

  const getGameStatus = useCallback(() => {
    if (isCheckmate(state)) return 'checkmate';
    if (isStalemate(state)) return 'stalemate';
    if (isInCheck(state)) return 'check';
    return 'active';
  }, [state]);

  return {
    state,
    position: state.position,
    moveHistory: state.moveHistory,
    currentMoveIndex: state.currentMoveIndex,
    makeMove,
    goToMove: goToMoveIndex,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    hasNext,
    hasPrevious,
    getLegalMoves,
    getCurrentFen,
    getPgn,
    resetBoard,
    getGameStatus,
  };
}
