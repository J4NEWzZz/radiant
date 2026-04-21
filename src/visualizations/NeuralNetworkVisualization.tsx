import { useEffect, useState } from 'react';

interface Props {
  step: number;
}

const LAYERS = [
  [100, 60, 100, 140, 100, 180],   // input: 3 nodes (x, [y1,y2,y3])
  [200, 50, 200, 100, 200, 150, 200, 180], // hidden1: 4 nodes
  [280, 70, 280, 130, 280, 170],   // hidden2: 3 nodes
  [360, 100],                       // output: 1 node
];

// Parse layer into [{x,y}]
function parseLayer(coords: number[]) {
  const nodes = [];
  for (let i = 0; i < coords.length; i += 2) {
    nodes.push({ x: coords[i], y: coords[i + 1] });
  }
  return nodes;
}

const layers = LAYERS.map(parseLayer);

// Active node colors by step
function nodeColor(layerIdx: number, step: number) {
  if (step === 0) return layerIdx === 0 ? '#6D5BFF' : '#1C2540';
  if (step === 1) return layerIdx <= 2 ? (layerIdx === 2 ? '#00E5A0' : '#6D5BFF') : '#1C2540';
  return layerIdx <= 3 ? '#00E5A0' : '#1C2540';
}

function nodeStroke(layerIdx: number, step: number) {
  if (step === 0) return layerIdx === 0 ? '#9B80FF' : '#252E4A';
  if (step === 1) return layerIdx <= 2 ? '#9B80FF' : '#252E4A';
  return '#00E5A0';
}

function connectionOpacity(fromLayer: number, step: number) {
  if (step === 0) return fromLayer === 0 ? 0.5 : 0.08;
  if (step === 1) return fromLayer <= 1 ? 0.5 : 0.08;
  return 0.5;
}

function connectionColor(fromLayer: number, step: number) {
  if (step >= 2) return '#00E5A0';
  if (step === 1 && fromLayer <= 1) return '#6D5BFF';
  if (step === 0 && fromLayer === 0) return '#6D5BFF';
  return '#1C2540';
}

export function NeuralNetworkVisualization({ step }: Props) {
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { setAnimKey(k => k + 1); }, [step]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <svg key={animKey} viewBox="0 0 440 220" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow-nn">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {layers.slice(0, -1).map((fromNodes, li) =>
          fromNodes.map((from, fi) =>
            layers[li + 1].map((to, ti) => (
              <line
                key={`${li}-${fi}-${ti}`}
                x1={from.x + 12} y1={from.y}
                x2={to.x - 12} y2={to.y}
                stroke={connectionColor(li, step)}
                strokeWidth="1"
                opacity={connectionOpacity(li, step)}
                style={{ transition: 'all 0.6s ease' }}
              />
            ))
          )
        )}

        {/* Nodes */}
        {layers.map((nodes, li) =>
          nodes.map((node, ni) => (
            <g key={`n-${li}-${ni}`}>
              <circle
                cx={node.x} cy={node.y} r="12"
                fill={nodeColor(li, step)}
                stroke={nodeStroke(li, step)}
                strokeWidth="1.5"
                filter={nodeColor(li, step) !== '#1C2540' ? 'url(#glow-nn)' : undefined}
                style={{ transition: 'all 0.5s ease' }}
              />
              {/* Pulse ring for active nodes */}
              {((step === 0 && li === 0) || (step === 1 && li <= 2) || step === 2) && (
                <circle
                  cx={node.x} cy={node.y} r="12"
                  fill="none"
                  stroke={step >= 2 ? '#00E5A0' : '#6D5BFF'}
                  strokeWidth="1"
                  opacity="0"
                >
                  <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" begin={`${ni * 0.15}s`} />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" begin={`${ni * 0.15}s`} />
                </circle>
              )}
            </g>
          ))
        )}

        {/* Layer labels */}
        {[
          { x: 100, label: 'INPUT' },
          { x: 200, label: 'HIDDEN 1' },
          { x: 280, label: 'HIDDEN 2' },
          { x: 360, label: 'OUTPUT' },
        ].map(({ x, label }) => (
          <text key={label} x={x} y={208} textAnchor="middle"
            fill="#3D4A6B" fontSize="9" fontFamily="DM Mono">{label}</text>
        ))}

        {/* Data values for input layer in step 0 */}
        {step === 0 && layers[0].map((node, ni) => (
          <text key={ni} x={node.x} y={node.y + 1} textAnchor="middle"
            fill="white" fontSize="8" fontFamily="DM Mono" dominantBaseline="middle">
            {['0.8', '0.2', '0.5'][ni]}
          </text>
        ))}

        {/* Output value in step 2 */}
        {step >= 2 && (
          <text x={360} y={101} textAnchor="middle"
            fill="white" fontSize="8" fontFamily="DM Mono" dominantBaseline="middle">
            🐱
          </text>
        )}

        {/* Status */}
        <text x={220} y={220} textAnchor="middle" fill="#3D4A6B" fontSize="9" fontFamily="DM Mono">
          {step === 0 ? 'Input data enters the network' : step === 1 ? 'Hidden layers transform the data' : 'Output: prediction complete'}
        </text>
      </svg>
    </div>
  );
}
