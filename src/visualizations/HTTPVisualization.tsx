import { useEffect, useState } from 'react';

interface Props {
  step: number;
}

export function HTTPVisualization({ step }: Props) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey(k => k + 1);
  }, [step]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <svg
        key={animKey}
        viewBox="0 0 400 200"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-http">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow-req" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6D5BFF" />
          </marker>
          <marker id="arrow-resp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#00E5A0" />
          </marker>
          <linearGradient id="req-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6D5BFF" />
            <stop offset="100%" stopColor="#9B80FF" />
          </linearGradient>
          <linearGradient id="resp-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00E5A0" />
            <stop offset="100%" stopColor="#00C280" />
          </linearGradient>
        </defs>

        {/* Client box */}
        <rect x="10" y="60" width="90" height="80" rx="10" fill="#101526" stroke="#1C2540" strokeWidth="1.5" />
        <text x="55" y="96" textAnchor="middle" fill="#8892B0" fontSize="11" fontFamily="DM Mono">CLIENT</text>
        <text x="55" y="113" textAnchor="middle" fill="#ECF0FF" fontSize="18">💻</text>

        {/* Server box */}
        <rect x="300" y="60" width="90" height="80" rx="10" fill="#101526" stroke="#1C2540" strokeWidth="1.5" />
        <text x="345" y="96" textAnchor="middle" fill="#8892B0" fontSize="11" fontFamily="DM Mono">SERVER</text>
        <text x="345" y="113" textAnchor="middle" fill="#ECF0FF" fontSize="18">🖥️</text>

        {/* Step 0: idle dashed line */}
        {step === 0 && (
          <line
            x1="100" y1="100" x2="300" y2="100"
            stroke="#1C2540" strokeWidth="1.5" strokeDasharray="6 4"
          />
        )}

        {/* Step 1: Request arrow → */}
        {step >= 1 && (
          <g>
            <line
              x1="100" y1="84" x2="292" y2="84"
              stroke="url(#req-grad)" strokeWidth="2"
              markerEnd="url(#arrow-req)"
              strokeDasharray="200"
              strokeDashoffset="0"
              style={{ animation: step === 1 ? 'draw-line 0.6s ease-out both' : 'none' }}
            />
            {/* Request label */}
            <rect x="145" y="58" width="110" height="20" rx="4" fill="#0C1020" stroke="#1C2540" strokeWidth="1" />
            <text x="200" y="72" textAnchor="middle" fill="#6D5BFF" fontSize="10" fontFamily="DM Mono"
              style={{ animation: step === 1 ? 'fade-in 0.4s 0.4s ease both' : 'none', opacity: step === 1 ? 0 : 1 }}>
              GET /api/data HTTP/1.1
            </text>
          </g>
        )}

        {/* Step 2: server processing */}
        {step >= 2 && (
          <g>
            <circle cx="345" cy="100" r="24" fill="none" stroke="#FFB800" strokeWidth="1.5" strokeDasharray="4 3">
              <animateTransform attributeName="transform" type="rotate" values="0 345 100;360 345 100" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="345" y="105" textAnchor="middle" fill="#FFB800" fontSize="10" fontFamily="DM Mono">⚙️</text>
          </g>
        )}

        {/* Step 3: Response ← */}
        {step >= 3 && (
          <g>
            <line
              x1="300" y1="116" x2="108" y2="116"
              stroke="url(#resp-grad)" strokeWidth="2"
              markerEnd="url(#arrow-resp)"
              strokeDasharray="200"
              strokeDashoffset="0"
              style={{ animation: step === 3 ? 'draw-line 0.6s ease-out both' : 'none' }}
            />
            <rect x="145" y="122" width="110" height="20" rx="4" fill="#0C1020" stroke="#1C2540" strokeWidth="1" />
            <text x="200" y="136" textAnchor="middle" fill="#00E5A0" fontSize="10" fontFamily="DM Mono"
              style={{ animation: step === 3 ? 'fade-in 0.4s 0.4s ease both' : 'none', opacity: step === 3 ? 0 : 1 }}>
              200 OK — application/json
            </text>
          </g>
        )}

        {/* Status indicator */}
        <text x="200" y="185" textAnchor="middle" fill="#3D4A6B" fontSize="10" fontFamily="DM Mono">
          {step === 0 ? 'Waiting for request...' : step === 1 ? 'Request sent' : step === 2 ? 'Server processing...' : 'Response received ✓'}
        </text>
      </svg>
    </div>
  );
}
