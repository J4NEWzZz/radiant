import { useEffect, useState } from 'react';

interface Props {
  step: number;
}

// A sorted array for binary search visualization
const ARR = [2, 7, 13, 21, 34, 45, 67];
const TARGET = 34;
const TARGET_IDX = 4;

// Binary search steps:
// Step 0: Show array, highlight nothing
// Step 1: Check middle (idx 3 = 21), target > 21, eliminate left half
// Step 2: Check middle of right half (idx 5 = 45), target < 45, eliminate right of idx5
// Step 3: Found at idx 4 = 34

function getStepState(step: number) {
  if (step === 0) {
    return { checkIdx: -1, eliminated: [] as number[], found: -1 };
  } else if (step === 1) {
    return { checkIdx: 3, eliminated: [] as number[], found: -1 };
  } else if (step === 2) {
    return { checkIdx: 5, eliminated: [0, 1, 2, 3] as number[], found: -1 };
  } else {
    return { checkIdx: TARGET_IDX, eliminated: [0, 1, 2, 3, 5, 6] as number[], found: TARGET_IDX };
  }
}

export function BinarySearchVisualization({ step }: Props) {
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey(k => k + 1); }, [step]);

  const { checkIdx, eliminated, found } = getStepState(step);

  const cellW = 44;
  const cellH = 40;
  const startX = 16;
  const startY = 60;
  const gap = 6;

  return (
    <div style={{ width: '100%', height: '200px' }}>
      <svg key={animKey} viewBox="0 0 420 200" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow-bs">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Target indicator */}
        <text x="210" y="24" textAnchor="middle" fill="#8892B0" fontSize="11" fontFamily="DM Mono">
          Searching for:
        </text>
        <rect x="160" y="30" width="100" height="24" rx="6" fill="#1C2540" stroke="#252E4A" strokeWidth="1" />
        <text x="210" y="47" textAnchor="middle" fill="#FFB800" fontSize="14" fontFamily="DM Mono" fontWeight="500">
          {TARGET}
        </text>

        {/* Array cells */}
        {ARR.map((val, i) => {
          const x = startX + i * (cellW + gap);
          const isEliminated = eliminated.includes(i);
          const isChecking = checkIdx === i;
          const isFound = found === i;

          let fill = '#101526';
          let stroke = '#1C2540';
          let textColor = '#8892B0';

          if (isFound) { fill = '#00E5A0'; stroke = '#00E5A0'; textColor = '#060914'; }
          else if (isChecking) { fill = '#1A1640'; stroke = '#6D5BFF'; textColor = '#ECF0FF'; }
          else if (isEliminated) { fill = '#0A0E1A'; stroke = '#10152A'; textColor = '#2A3550'; }

          return (
            <g key={i} style={{ transition: 'all 0.4s ease', animationDelay: `${i * 0.05}s` }}>
              <rect
                x={x} y={startY}
                width={cellW} height={cellH}
                rx="8"
                fill={fill}
                stroke={stroke}
                strokeWidth={isChecking || isFound ? 2 : 1}
                filter={isFound || isChecking ? 'url(#glow-bs)' : undefined}
                style={{ transition: 'all 0.5s ease' }}
              />
              <text
                x={x + cellW / 2} y={startY + cellH / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fill={textColor}
                fontSize="15"
                fontFamily="DM Mono"
                fontWeight={isFound || isChecking ? '500' : '400'}
                style={{ transition: 'all 0.5s ease' }}
              >
                {isEliminated ? '—' : val}
              </text>
              {/* Index labels */}
              <text
                x={x + cellW / 2} y={startY + cellH + 14}
                textAnchor="middle" fill="#3D4A6B" fontSize="9" fontFamily="DM Mono"
              >
                [{i}]
              </text>

              {/* Checking arrow */}
              {isChecking && !isFound && (
                <g style={{ animation: 'slide-up 0.3s ease both' }}>
                  <polygon
                    points={`${x + cellW/2 - 6},${startY - 14} ${x + cellW/2 + 6},${startY - 14} ${x + cellW/2},${startY - 4}`}
                    fill="#6D5BFF"
                    filter="url(#glow-bs)"
                  />
                  <text x={x + cellW/2} y={startY - 22} textAnchor="middle" fill="#6D5BFF" fontSize="9" fontFamily="DM Mono">
                    check
                  </text>
                </g>
              )}

              {/* Found check */}
              {isFound && (
                <g>
                  <polygon
                    points={`${x + cellW/2 - 6},${startY - 14} ${x + cellW/2 + 6},${startY - 14} ${x + cellW/2},${startY - 4}`}
                    fill="#00E5A0"
                    filter="url(#glow-bs)"
                  />
                  <text x={x + cellW/2} y={startY - 22} textAnchor="middle" fill="#00E5A0" fontSize="9" fontFamily="DM Mono">
                    found!
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Range brackets */}
        {step === 1 && (
          <g>
            <line x1={startX + 4 * (cellW + gap)} y1={startY + cellH + 24} x2={startX + 7 * (cellW + gap) - gap} y2={startY + cellH + 24}
              stroke="#6D5BFF" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x={startX + 5.5 * (cellW + gap)} y={startY + cellH + 36}
              textAnchor="middle" fill="#6D5BFF" fontSize="8" fontFamily="DM Mono">search right half</text>
          </g>
        )}

        {/* Status text */}
        <text x="210" y="190" textAnchor="middle" fill="#3D4A6B" fontSize="10" fontFamily="DM Mono">
          {step === 0
            ? '7 elements — where is 34?'
            : step === 1
            ? 'Mid = 21, target > 21 → search right'
            : step === 2
            ? 'Mid = 45, target < 45 → search left'
            : '✓ Found 34 in 3 comparisons (log₂7 ≈ 3)'}
        </text>
      </svg>
    </div>
  );
}
