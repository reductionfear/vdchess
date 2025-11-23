import React from 'react';
import { Settings, Eye, Sun, Palette, ZoomIn } from 'lucide-react';

interface BoardSettingsProps {
  opacity: number;
  brightness: number;
  hue: number;
  zoom: number;
  theme: 'light' | 'dark' | 'transparent';
  showCoordinates: boolean;
  onOpacityChange: (value: number) => void;
  onBrightnessChange: (value: number) => void;
  onHueChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onThemeChange: (theme: 'light' | 'dark' | 'transparent') => void;
  onToggleCoordinates: () => void;
  className?: string;
}

const BoardSettings: React.FC<BoardSettingsProps> = ({
  opacity,
  brightness,
  hue,
  zoom,
  theme,
  showCoordinates,
  onOpacityChange,
  onBrightnessChange,
  onHueChange,
  onZoomChange,
  onThemeChange,
  onToggleCoordinates,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-700 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-slate-300" />
          <span className="font-semibold text-slate-200">Board Settings</span>
        </div>
        <span className="text-slate-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Settings Panel */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-700">
          {/* Opacity Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-slate-400" />
                <label className="text-sm text-slate-300">Opacity</label>
              </div>
              <span className="text-sm text-slate-400">{opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Brightness Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-slate-400" />
                <label className="text-sm text-slate-300">Brightness</label>
              </div>
              <span className="text-sm text-slate-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => onBrightnessChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Hue Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-slate-400" />
                <label className="text-sm text-slate-300">Hue</label>
              </div>
              <span className="text-sm text-slate-400">{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => onHueChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn size={16} className="text-slate-400" />
                <label className="text-sm text-slate-300">Zoom</label>
              </div>
              <span className="text-sm text-slate-400">{zoom}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  theme === 'light'
                    ? 'bg-amber-500 text-slate-900 font-semibold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-amber-500 text-slate-900 font-semibold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => onThemeChange('transparent')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  theme === 'transparent'
                    ? 'bg-amber-500 text-slate-900 font-semibold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Show Coordinates</span>
              <input
                type="checkbox"
                checked={showCoordinates}
                onChange={onToggleCoordinates}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-2 focus:ring-amber-500"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSettings;
