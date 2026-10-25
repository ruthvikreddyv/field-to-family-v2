// Original illustrated scenes (free, no photos needed). Real photos replace them automatically
// when you add files to public/gallery (see README).

function Plants({ x0, y, count, gap, size, c1, c2 }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + i * gap;
        return (
          <g key={i} className="sway" style={{ animationDelay: `${(i % 5) * 0.35}s`, transformOrigin: `${x}px ${y}px` }}>
            <path d={`M${x} ${y} C${x - size} ${y - size} ${x - size * 0.6} ${y - size * 1.5} ${x} ${y - size * 0.9}Z`} fill={c1} />
            <path d={`M${x} ${y} C${x + size} ${y - size} ${x + size * 0.6} ${y - size * 1.5} ${x} ${y - size * 0.9}Z`} fill={c2} />
          </g>
        );
      })}
    </g>
  );
}

export function Sun({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 2.2} fill="#f6c25a" opacity=".16" />
      <circle cx={cx} cy={cy} r={r * 1.5} fill="#f6c25a" opacity=".26" />
      <circle cx={cx} cy={cy} r={r} fill="#f3a93a" />
    </g>
  );
}

export function FieldScene() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Green vegetable fields at sunrise" className="scene">
      <rect width="320" height="240" fill="#fbe3b8" />
      <rect width="320" height="110" fill="#fdeccb" />
      <Sun cx="236" cy="70" r="22" />
      <path d="M0 120 C60 90 120 110 180 96 C240 84 290 100 320 94 V240 H0Z" fill="#8fb36a" />
      <path d="M0 140 C80 118 160 138 240 122 C280 116 300 120 320 118 V240 H0Z" fill="#6c9a4f" />
      <g stroke="#4f7d3a" strokeWidth="2" opacity=".5">
        <path d="M0 170 H320" /><path d="M0 195 H320" /><path d="M0 222 H320" />
      </g>
      <Plants x0={14} y={168} count={14} gap={22} size={9} c1="#3f7a34" c2="#58944a" />
      <Plants x0={6} y={194} count={12} gap={27} size={12} c1="#386f2f" c2="#4f8a43" />
      <Plants x0={20} y={224} count={9} gap={36} size={16} c1="#2f6a2a" c2="#478540" />
    </svg>
  );
}

export function StoreScene() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A fresh vegetable stall" className="scene">
      <rect width="320" height="240" fill="#f3e6cd" />
      <rect y="170" width="320" height="70" fill="#d9c49a" />
      <rect x="40" y="40" width="240" height="14" fill="#e2901f" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${40 + i * 30} 54 h30 v22 a15 15 0 0 1 -30 0Z`} fill={i % 2 ? "#fff6e0" : "#2f4a34"} />
      ))}
      <rect x="46" y="76" width="6" height="110" fill="#7a5a34" /><rect x="268" y="76" width="6" height="110" fill="#7a5a34" />
      <rect x="40" y="150" width="240" height="46" rx="4" fill="#9a6e3c" />
      <path d="M40 150 h240 v8 h-240Z" fill="#b4834a" />
      <g>
        <ellipse cx="80" cy="146" rx="26" ry="12" fill="#e0382b" /><circle cx="68" cy="140" r="9" fill="#e84b3c" /><circle cx="88" cy="138" r="9" fill="#d12f22" /><circle cx="78" cy="132" r="9" fill="#e84b3c" />
        <ellipse cx="146" cy="146" rx="26" ry="12" fill="#f08a24" /><path d="M130 144 l8 -22 l6 22Z M146 144 l8 -26 l6 26Z M160 144 l8 -20 l5 20Z" fill="#f4a03c" />
        <ellipse cx="214" cy="146" rx="26" ry="12" fill="#4f9a3e" /><circle cx="202" cy="138" r="10" fill="#6aae50" /><circle cx="222" cy="136" r="11" fill="#5ea046" />
        <ellipse cx="262" cy="146" rx="18" ry="10" fill="#5b2a86" /><ellipse cx="256" cy="136" rx="7" ry="11" fill="#6d3a9a" /><ellipse cx="270" cy="138" rx="7" ry="10" fill="#5b2a86" />
      </g>
      <rect x="120" y="86" width="80" height="26" rx="4" fill="#fffdf8" stroke="#e7d7b3" />
      <text x="160" y="104" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2f4a34" fontFamily="Georgia,serif">Fresh Veggies</text>
    </svg>
  );
}

export function DeliveryScene() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Delivery scooter carrying vegetables" className="scene">
      <rect width="320" height="240" fill="#e9f0dd" />
      <Sun cx="70" cy="60" r="18" />
      <path d="M0 150 C80 120 160 140 240 124 C280 118 300 122 320 120 V240 H0Z" fill="#b9d19a" />
      <rect y="186" width="320" height="54" fill="#c9bfa6" />
      <path d="M0 212 H320" stroke="#fffdf8" strokeWidth="3" strokeDasharray="22 16" />
      <g className="roll">
        <circle cx="100" cy="190" r="22" fill="#2b2013" /><circle cx="100" cy="190" r="10" fill="#d9d2c0" />
        <circle cx="228" cy="190" r="22" fill="#2b2013" /><circle cx="228" cy="190" r="10" fill="#d9d2c0" />
        <path d="M100 190 L128 150 H196 L228 190" fill="none" stroke="#2f4a34" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M196 150 L204 120 H222" fill="none" stroke="#2f4a34" strokeWidth="7" strokeLinecap="round" />
        <rect x="110" y="106" width="80" height="48" rx="6" fill="#e2901f" />
        <rect x="116" y="112" width="68" height="36" rx="4" fill="#f3b04c" />
        <circle cx="132" cy="108" r="11" fill="#e0382b" /><circle cx="152" cy="104" r="12" fill="#5ea046" /><circle cx="172" cy="108" r="10" fill="#f08a24" />
        <path d="M148 90 l4 -10 l4 10Z" fill="#4d8a3a" />
      </g>
    </svg>
  );
}

export function HeroScene() {
  return (
    <svg viewBox="0 0 760 150" preserveAspectRatio="xMidYMax slice" className="hero-scene" aria-hidden="true">
      <path d="M0 70 C120 30 240 80 380 56 C520 32 640 70 760 44 V150 H0Z" fill="#3f6a47" />
      <path d="M0 96 C140 64 280 108 420 86 C560 66 680 96 760 80 V150 H0Z" fill="#5a8a55" />
      <path d="M0 124 C160 100 320 132 480 114 C600 102 700 118 760 110 V150 H0Z" fill="#fbf3e6" />
      <g stroke="#3b6a3f" strokeWidth="1.5" opacity=".35">
        <path d="M0 108 C160 84 320 116 480 98 C600 86 700 102 760 94" fill="none" />
      </g>
      <Plants x0={20} y={118} count={30} gap={26} size={7} c1="#4f7f45" c2="#6c9a58" />
    </svg>
  );
}
