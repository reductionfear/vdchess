import React from 'react';

interface Arrow {
  from: string;
  to: string;
  color: string;
}

interface Circle {
  square: string;
  color: string;
}

interface SVGOverlayProps {
  arrows: Arrow[];
  circles: Circle[];
  flipped?: boolean;
  squareSize: number;
  className?: string;
}

const SVGOverlay: React.FC<SVGOverlayProps> = ({
  arrows,
  circles,
  flipped = false,
  squareSize,
  className = '',
}) => {
  // Convert square name (e.g., "e4") to coordinates
  const squareToCoords = (square: string): { x: number; y: number } => {
    const file = square.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
    const rank = parseInt(square[1]) - 1;   // 1=0, 2=1, ..., 8=7
    
    let x = file;
    let y = 7 - rank;
    
    if (flipped) {
      x = 7 - x;
      y = 7 - y;
    }
    
    return {
      x: x * squareSize + squareSize / 2,
      y: y * squareSize + squareSize / 2,
    };
  };

  const colorMap: Record<string, string> = {
    green: '#15803d',
    red: '#dc2626',
    blue: '#2563eb',
    yellow: '#eab308',
  };

  const getColor = (color: string) => colorMap[color] || color;

  return (
    <svg
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Render circles */}
      {circles.map((circle, index) => {
        const coords = squareToCoords(circle.square);
        return (
          <circle
            key={`circle-${index}`}
            cx={coords.x}
            cy={coords.y}
            r={squareSize * 0.4}
            fill="none"
            stroke={getColor(circle.color)}
            strokeWidth={squareSize * 0.08}
            opacity={0.8}
          />
        );
      })}

      {/* Render arrows */}
      {arrows.map((arrow, index) => {
        const from = squareToCoords(arrow.from);
        const to = squareToCoords(arrow.to);
        
        // Calculate arrow direction
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);
        
        // Shorten arrow to not overlap pieces
        const margin = squareSize * 0.15;
        const length = Math.sqrt(dx * dx + dy * dy);
        const startX = from.x + Math.cos(angle) * margin;
        const startY = from.y + Math.sin(angle) * margin;
        const endX = to.x - Math.cos(angle) * margin;
        const endY = to.y - Math.sin(angle) * margin;
        
        // Arrow head size
        const headLength = squareSize * 0.3;
        const headWidth = squareSize * 0.2;
        
        // Calculate arrow head points
        const headAngle1 = angle + Math.PI - Math.PI / 6;
        const headAngle2 = angle - Math.PI + Math.PI / 6;
        
        const head1X = endX + Math.cos(headAngle1) * headLength;
        const head1Y = endY + Math.sin(headAngle1) * headLength;
        const head2X = endX + Math.cos(headAngle2) * headLength;
        const head2Y = endY + Math.sin(headAngle2) * headLength;

        return (
          <g key={`arrow-${index}`} opacity={0.8}>
            {/* Arrow line */}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={getColor(arrow.color)}
              strokeWidth={squareSize * 0.12}
              strokeLinecap="round"
            />
            
            {/* Arrow head */}
            <polygon
              points={`${endX},${endY} ${head1X},${head1Y} ${head2X},${head2Y}`}
              fill={getColor(arrow.color)}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default SVGOverlay;
