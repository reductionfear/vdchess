import React from 'react';
import { 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight,
  FlipVertical,
  Download,
  Copy
} from 'lucide-react';

interface BoardControlsProps {
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  onFlip?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
}

const BoardControls: React.FC<BoardControlsProps> = ({
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onFlip,
  onDownload,
  onCopy,
  hasPrevious,
  hasNext,
  className = '',
}) => {
  const buttonBaseClass = "p-2 rounded-lg transition-all duration-200 hover:bg-slate-700";
  const disabledClass = "opacity-40 cursor-not-allowed hover:bg-transparent";
  const enabledClass = "hover:bg-slate-600 active:bg-slate-500";

  return (
    <div className={`flex items-center justify-center gap-2 bg-slate-800 p-3 rounded-lg border border-slate-700 ${className}`}>
      {/* Move Navigation */}
      <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
        <button
          onClick={onFirst}
          disabled={!hasPrevious}
          className={`${buttonBaseClass} ${hasPrevious ? enabledClass : disabledClass}`}
          title="First move (Home)"
          aria-label="First move"
        >
          <ChevronsLeft size={20} className="text-slate-200" />
        </button>
        
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`${buttonBaseClass} ${hasPrevious ? enabledClass : disabledClass}`}
          title="Previous move (←)"
          aria-label="Previous move"
        >
          <ChevronLeft size={20} className="text-slate-200" />
        </button>
        
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`${buttonBaseClass} ${hasNext ? enabledClass : disabledClass}`}
          title="Next move (→)"
          aria-label="Next move"
        >
          <ChevronRight size={20} className="text-slate-200" />
        </button>
        
        <button
          onClick={onLast}
          disabled={!hasNext}
          className={`${buttonBaseClass} ${hasNext ? enabledClass : disabledClass}`}
          title="Last move (End)"
          aria-label="Last move"
        >
          <ChevronsRight size={20} className="text-slate-200" />
        </button>
      </div>

      {/* Additional Actions */}
      <div className="flex items-center gap-1">
        {onFlip && (
          <button
            onClick={onFlip}
            className={`${buttonBaseClass} ${enabledClass}`}
            title="Flip board"
            aria-label="Flip board"
          >
            <FlipVertical size={20} className="text-slate-200" />
          </button>
        )}
        
        {onCopy && (
          <button
            onClick={onCopy}
            className={`${buttonBaseClass} ${enabledClass}`}
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            <Copy size={20} className="text-slate-200" />
          </button>
        )}
        
        {onDownload && (
          <button
            onClick={onDownload}
            className={`${buttonBaseClass} ${enabledClass}`}
            title="Download PGN"
            aria-label="Download PGN"
          >
            <Download size={20} className="text-slate-200" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardControls;
