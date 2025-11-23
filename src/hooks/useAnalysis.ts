import { useState, useCallback } from 'react';

export interface AnalysisSettings {
  boardOpacity: number;
  boardBrightness: number;
  boardHue: number;
  zoomLevel: number;
  theme: 'light' | 'dark' | 'transparent';
  showCoordinates: boolean;
  highlightLastMove: boolean;
  showLegalMoves: boolean;
  autoQueen: boolean;
}

export interface EvaluationData {
  score?: number;
  mate?: number;
  depth: number;
  bestMove?: string;
}

const DEFAULT_SETTINGS: AnalysisSettings = {
  boardOpacity: 100,
  boardBrightness: 100,
  boardHue: 0,
  zoomLevel: 100,
  theme: 'light',
  showCoordinates: true,
  highlightLastMove: true,
  showLegalMoves: false,
  autoQueen: true,
};

export function useAnalysis() {
  const [settings, setSettings] = useState<AnalysisSettings>(DEFAULT_SETTINGS);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [arrows, setArrows] = useState<Array<{ from: string; to: string; color: string }>>([]);
  const [circles, setCircles] = useState<Array<{ square: string; color: string }>>([]);

  const updateSettings = useCallback((partial: Partial<AnalysisSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const updateBoardOpacity = useCallback((opacity: number) => {
    setSettings(prev => ({ ...prev, boardOpacity: Math.max(0, Math.min(100, opacity)) }));
  }, []);

  const updateBoardBrightness = useCallback((brightness: number) => {
    setSettings(prev => ({ ...prev, boardBrightness: Math.max(0, Math.min(100, brightness)) }));
  }, []);

  const updateBoardHue = useCallback((hue: number) => {
    setSettings(prev => ({ ...prev, boardHue: Math.max(0, Math.min(360, hue)) }));
  }, []);

  const updateZoomLevel = useCallback((zoom: number) => {
    setSettings(prev => ({ ...prev, zoomLevel: Math.max(50, Math.min(150, zoom)) }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'transparent' : 'light',
    }));
  }, []);

  const toggleCoordinates = useCallback(() => {
    setSettings(prev => ({ ...prev, showCoordinates: !prev.showCoordinates }));
  }, []);

  const toggleLastMoveHighlight = useCallback(() => {
    setSettings(prev => ({ ...prev, highlightLastMove: !prev.highlightLastMove }));
  }, []);

  const toggleLegalMoves = useCallback(() => {
    setSettings(prev => ({ ...prev, showLegalMoves: !prev.showLegalMoves }));
  }, []);

  const addArrow = useCallback((from: string, to: string, color: string = 'green') => {
    setArrows(prev => {
      // Remove existing arrow with same from/to
      const filtered = prev.filter(a => !(a.from === from && a.to === to));
      return [...filtered, { from, to, color }];
    });
  }, []);

  const removeArrow = useCallback((from: string, to: string) => {
    setArrows(prev => prev.filter(a => !(a.from === from && a.to === to)));
  }, []);

  const clearArrows = useCallback(() => {
    setArrows([]);
  }, []);

  const addCircle = useCallback((square: string, color: string = 'yellow') => {
    setCircles(prev => {
      // Remove existing circle on same square
      const filtered = prev.filter(c => c.square !== square);
      return [...filtered, { square, color }];
    });
  }, []);

  const removeCircle = useCallback((square: string) => {
    setCircles(prev => prev.filter(c => c.square !== square));
  }, []);

  const clearCircles = useCallback(() => {
    setCircles([]);
  }, []);

  const clearShapes = useCallback(() => {
    setArrows([]);
    setCircles([]);
  }, []);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    // Placeholder for engine integration
  }, []);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getBoardStyle = useCallback(() => {
    const { boardOpacity, boardBrightness, boardHue, zoomLevel } = settings;
    
    return {
      opacity: boardOpacity / 100,
      filter: `brightness(${boardBrightness}%) hue-rotate(${boardHue}deg)`,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'center center',
    };
  }, [settings]);

  return {
    settings,
    evaluation,
    isAnalyzing,
    selectedSquare,
    arrows,
    circles,
    updateSettings,
    updateBoardOpacity,
    updateBoardBrightness,
    updateBoardHue,
    updateZoomLevel,
    toggleTheme,
    toggleCoordinates,
    toggleLastMoveHighlight,
    toggleLegalMoves,
    addArrow,
    removeArrow,
    clearArrows,
    addCircle,
    removeCircle,
    clearCircles,
    clearShapes,
    setSelectedSquare,
    startAnalysis,
    stopAnalysis,
    setEvaluation,
    getBoardStyle,
    resetSettings,
  };
}
