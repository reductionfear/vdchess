import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import Layout from '../components/Layout';
import AnalysisBoard from '../src/components/Analysis/AnalysisBoard';

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [currentFen, setCurrentFen] = useState<string>('');
  const [fenInput, setFenInput] = useState<string>('');

  const handleLoadFen = () => {
    if (fenInput.trim()) {
      setCurrentFen(fenInput.trim());
    }
  };

  const handleReset = () => {
    setCurrentFen('');
    setFenInput('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">
                  Chess Analysis Board
                </h1>
                <p className="text-slate-400">
                  Analyze positions with full navigation and customization features
                </p>
              </div>
            </div>
          </div>

          {/* FEN Input */}
          <div className="mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Load Position from FEN
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Enter FEN notation (e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1)"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleLoadFen}
                className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                Load
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">Controls & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
              <div>• <kbd className="px-2 py-1 bg-slate-900 rounded">←</kbd> Previous move</div>
              <div>• <kbd className="px-2 py-1 bg-slate-900 rounded">→</kbd> Next move</div>
              <div>• <kbd className="px-2 py-1 bg-slate-900 rounded">Home</kbd> First move</div>
              <div>• <kbd className="px-2 py-1 bg-slate-900 rounded">End</kbd> Last move</div>
              <div>• Mouse wheel on board to navigate moves</div>
              <div>• Click moves in the list to jump to that position</div>
              <div>• Adjust board appearance in settings panel</div>
              <div>• Use tabs below move list for more features</div>
            </div>
          </div>

          {/* Analysis Board */}
          <AnalysisBoard
            initialFen={currentFen || undefined}
            showControls={true}
            showSettings={true}
            showMoveList={true}
            showEvaluation={true}
          />

          {/* Feature Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-slate-200 mb-2">Board Interaction</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✓ Mouse wheel scroll navigation</li>
                <li>✓ Keyboard arrow key navigation</li>
                <li>✓ Move list click navigation</li>
                <li>✓ SVG arrows and circles overlay</li>
                <li>✓ Last move highlighting</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-slate-200 mb-2">Board Customization</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✓ Opacity control (0-100%)</li>
                <li>✓ Brightness control (0-100%)</li>
                <li>✓ Hue adjustment (0-360°)</li>
                <li>✓ Zoom level (50-150%)</li>
                <li>✓ Theme support (light/dark/clear)</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-slate-200 mb-2">Analysis Features</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✓ Move history with SAN notation</li>
                <li>✓ FEN display and loading</li>
                <li>✓ PGN export and copy</li>
                <li>✓ Position evaluation display</li>
                <li>✓ Tabbed underboard menu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
