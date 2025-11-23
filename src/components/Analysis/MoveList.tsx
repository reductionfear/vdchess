import React, { useRef, useEffect } from 'react';
import { MoveHistoryEntry } from '../../utils/chess/boardState';

interface MoveListProps {
  moves: MoveHistoryEntry[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
  className?: string;
}

const MoveList: React.FC<MoveListProps> = ({
  moves,
  currentMoveIndex,
  onMoveClick,
  className = '',
}) => {
  const selectedMoveRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to selected move
  useEffect(() => {
    if (selectedMoveRef.current) {
      selectedMoveRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentMoveIndex]);

  // Group moves by pairs (white and black)
  const movePairs: Array<{ white?: MoveHistoryEntry; black?: MoveHistoryEntry; moveNumber: number }> = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i],
      black: moves[i + 1],
      moveNumber: Math.floor(i / 2) + 1,
    });
  }

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      <div className="p-3 border-b border-slate-700">
        <h3 className="font-semibold text-slate-200 text-sm">Move List</h3>
      </div>
      
      <div className="p-2 max-h-96 overflow-y-auto">
        {movePairs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No moves yet
          </div>
        ) : (
          <div className="space-y-1">
            {movePairs.map((pair, pairIndex) => (
              <div key={pairIndex} className="flex items-center gap-1">
                {/* Move Number */}
                <span className="text-slate-500 text-sm font-mono w-8 flex-shrink-0">
                  {pair.moveNumber}.
                </span>

                {/* White's Move */}
                {pair.white && (
                  <button
                    ref={pair.white.ply === currentMoveIndex ? selectedMoveRef : null}
                    onClick={() => onMoveClick(pair.white!.ply)}
                    className={`
                      px-2 py-1 rounded text-sm font-mono flex-1
                      transition-colors duration-150
                      ${
                        pair.white.ply === currentMoveIndex
                          ? 'bg-amber-500 text-slate-900 font-semibold'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }
                    `}
                    title={`${pair.moveNumber}. ${pair.white.san}`}
                  >
                    {pair.white.san}
                  </button>
                )}

                {/* Black's Move */}
                {pair.black && (
                  <button
                    ref={pair.black.ply === currentMoveIndex ? selectedMoveRef : null}
                    onClick={() => onMoveClick(pair.black!.ply)}
                    className={`
                      px-2 py-1 rounded text-sm font-mono flex-1
                      transition-colors duration-150
                      ${
                        pair.black.ply === currentMoveIndex
                          ? 'bg-amber-500 text-slate-900 font-semibold'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }
                    `}
                    title={`${pair.moveNumber}... ${pair.black.san}`}
                  >
                    {pair.black.san}
                  </button>
                )}

                {/* Empty placeholder if only white move exists */}
                {pair.white && !pair.black && (
                  <div className="flex-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveList;
