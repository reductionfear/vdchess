import React, { useState } from 'react';
import { Cpu, Clock, FileText, Share2 } from 'lucide-react';

interface UnderboardMenuProps {
  currentFen: string;
  pgn: string;
  onCopyFen?: () => void;
  onCopyPgn?: () => void;
  onDownloadPgn?: () => void;
  className?: string;
}

type TabType = 'analysis' | 'times' | 'fen-pgn' | 'share';

const UnderboardMenu: React.FC<UnderboardMenuProps> = ({
  currentFen,
  pgn,
  onCopyFen,
  onCopyPgn,
  onDownloadPgn,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('fen-pgn');

  const tabs = [
    { id: 'analysis' as TabType, label: 'Computer Analysis', icon: Cpu },
    { id: 'times' as TabType, label: 'Move Times', icon: Clock },
    { id: 'fen-pgn' as TabType, label: 'FEN & PGN', icon: FileText },
    { id: 'share' as TabType, label: 'Share & Export', icon: Share2 },
  ];

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 overflow-hidden ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3
                transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                }
              `}
            >
              <Icon size={16} />
              <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'analysis' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Computer Analysis</h3>
            <p className="text-sm text-slate-400">
              Engine analysis integration placeholder.
            </p>
            <div className="bg-slate-900 rounded p-3 text-sm text-slate-500">
              <p>• Stockfish integration can be added here</p>
              <p>• Show engine lines and evaluations</p>
              <p>• Display principal variations</p>
            </div>
          </div>
        )}

        {activeTab === 'times' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Move Times</h3>
            <p className="text-sm text-slate-400">
              Track time spent on each move.
            </p>
            <div className="bg-slate-900 rounded p-3 text-sm text-slate-500">
              <p>• Time per move visualization</p>
              <p>• Time pressure indicators</p>
              <p>• Average thinking time</p>
            </div>
          </div>
        )}

        {activeTab === 'fen-pgn' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-200">FEN</h3>
                {onCopyFen && (
                  <button
                    onClick={onCopyFen}
                    className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="bg-slate-900 rounded p-3 max-h-24 overflow-y-auto">
                <code className="text-xs text-slate-300 font-mono break-all">
                  {currentFen || 'No position loaded'}
                </code>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-200">PGN</h3>
                {onCopyPgn && (
                  <button
                    onClick={onCopyPgn}
                    className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="bg-slate-900 rounded p-3 max-h-48 overflow-y-auto">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                  {pgn || 'No moves yet'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Share & Export</h3>
            
            <div className="space-y-2">
              <button
                onClick={onCopyFen}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors text-sm text-left"
              >
                📋 Copy FEN to Clipboard
              </button>
              
              <button
                onClick={onCopyPgn}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors text-sm text-left"
              >
                📋 Copy PGN to Clipboard
              </button>
              
              <button
                onClick={onDownloadPgn}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors text-sm text-left"
              >
                💾 Download PGN File
              </button>
            </div>

            <div className="pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                Share this position with others or export for analysis in other chess software.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnderboardMenu;
