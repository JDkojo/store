import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  className = '',
  label,
}) => {
  // Generate deterministic QR-like matrix pattern based on input string
  const gridSize = 21; // standard Version 1 QR matrix size
  const matrix: boolean[][] = React.useMemo(() => {
    // Generate pseudorandom seeded pattern from value string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    // Standard Finder patterns (Top-Left, Top-Right, Bottom-Left)
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    drawFinder(0, 0); // Top-left
    drawFinder(gridSize - 7, 0); // Top-right
    drawFinder(0, gridSize - 7); // Bottom-left

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Fill data areas
    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder areas
        const isFinderTL = r < 8 && c < 8;
        const isFinderTR = r < 8 && c >= gridSize - 8;
        const isFinderBL = r >= gridSize - 8 && c < 8;
        const isTiming = (r === 6 && c >= 8 && c < gridSize - 8) || (c === 6 && r >= 8 && r < gridSize - 8);

        if (!isFinderTL && !isFinderTR && !isFinderBL && !isTiming) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          // Mix with coordinate and value character
          const charCode = value.charCodeAt((r * gridSize + c) % value.length) || 42;
          grid[r][c] = (seed + charCode + r * 7 + c * 13) % 3 !== 0;
        }
      }
    }

    return grid;
  }, [value]);

  const cell = size / gridSize;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="p-3 bg-white rounded-2xl shadow-sm border-2 border-slate-900 inline-block"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="w-full h-full"
        >
          {matrix.map((row, r) =>
            row.map((active, c) =>
              active ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cell}
                  y={r * cell}
                  width={cell + 0.15}
                  height={cell + 0.15}
                  fill="#0f172a"
                />
              ) : null
            )
          )}
        </svg>
      </div>
      {label && (
        <span className="mt-2 text-xs font-mono font-bold tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {label}
        </span>
      )}
    </div>
  );
};
