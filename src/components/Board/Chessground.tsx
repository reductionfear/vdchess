import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { Chessground as ChessgroundApi } from '@lichess-org/chessground';
import type { Api } from '@lichess-org/chessground/api';
import type { Config } from '@lichess-org/chessground/config';

export interface ChessgroundProps {
  config?: Config;
  className?: string;
  width?: string | number;
  height?: string | number;
  contained?: boolean;
}

export interface ChessgroundRef {
  api: Api | null;
}

const Chessground = React.forwardRef<ChessgroundRef, ChessgroundProps>(
  ({ config, className = '', width, height, contained = false }, ref) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<Api | null>(null);

    // Initialize chessground
    useEffect(() => {
      if (!boardRef.current) return;

      // Create chessground instance
      apiRef.current = ChessgroundApi(boardRef.current, config);

      // Cleanup on unmount
      return () => {
        if (apiRef.current) {
          apiRef.current.destroy();
          apiRef.current = null;
        }
      };
    }, []); // Only initialize once

    // Update config when it changes
    useEffect(() => {
      if (apiRef.current && config) {
        apiRef.current.set(config);
      }
    }, [config]);

    // Expose API to parent via ref
    useImperativeHandle(ref, () => ({
      api: apiRef.current,
    }));

    const containerStyle: React.CSSProperties = {
      width: width || '100%',
      height: height || width || '600px',
      aspectRatio: '1/1',
      ...(contained && { maxWidth: '100%', maxHeight: '100%' }),
    };

    return (
      <div
        ref={boardRef}
        className={`cg-wrap ${className}`}
        style={containerStyle}
      />
    );
  }
);

Chessground.displayName = 'Chessground';

export default Chessground;
