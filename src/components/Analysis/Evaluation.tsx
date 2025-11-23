import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EvaluationProps {
  score?: number;
  mate?: number;
  depth?: number;
  bestMove?: string;
  isAnalyzing?: boolean;
  className?: string;
}

const Evaluation: React.FC<EvaluationProps> = ({
  score,
  mate,
  depth = 0,
  bestMove,
  isAnalyzing = false,
  className = '',
}) => {
  const getEvaluationDisplay = () => {
    if (mate !== undefined) {
      return {
        text: `M${mate}`,
        color: mate > 0 ? 'text-green-400' : 'text-red-400',
        icon: mate > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />,
      };
    }

    if (score !== undefined) {
      const displayScore = (score / 100).toFixed(2);
      const absScore = Math.abs(score);
      
      let color = 'text-slate-400';
      let icon = <Minus size={16} />;
      
      if (absScore > 100) {
        color = score > 0 ? 'text-green-400' : 'text-red-400';
        icon = score > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
      }

      return {
        text: score > 0 ? `+${displayScore}` : displayScore,
        color,
        icon,
      };
    }

    return {
      text: '0.00',
      color: 'text-slate-400',
      icon: <Minus size={16} />,
    };
  };

  const evaluation = getEvaluationDisplay();

  // Calculate bar fill percentage (-10 to +10 range)
  const getBarFillPercentage = () => {
    if (mate !== undefined) {
      return mate > 0 ? 100 : 0;
    }
    
    if (score !== undefined) {
      // Clamp between -1000 and +1000 centipawns
      const clampedScore = Math.max(-1000, Math.min(1000, score));
      // Convert to 0-100 range
      return ((clampedScore + 1000) / 2000) * 100;
    }
    
    return 50; // Neutral
  };

  const barFill = getBarFillPercentage();

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-slate-300" />
          <span className="font-semibold text-slate-200 text-sm">Evaluation</span>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Evaluation Bar */}
      <div className="p-4 space-y-3">
        <div className="relative h-8 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
          {/* White advantage fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-700 to-green-600 transition-all duration-300"
            style={{ width: `${barFill}%` }}
          />
          
          {/* Center line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-600" />
          
          {/* Score display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`flex items-center gap-1 font-bold ${evaluation.color}`}>
              {evaluation.icon}
              <span>{evaluation.text}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            Depth: <span className="text-slate-300 font-mono">{depth}</span>
          </div>
          
          {bestMove && (
            <div>
              Best: <span className="text-slate-300 font-mono">{bestMove}</span>
            </div>
          )}
        </div>

        {/* Placeholder for engine controls */}
        {!isAnalyzing && (
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Computer analysis placeholder
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
