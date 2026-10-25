// Hand-drawn vegetable illustrations (original SVG, free, no downloads, no licences).
// Each one is drawn in a 64x64 box. If a Sheet row has an Image URL, a real photo is shown instead.

const SH = "rgba(43,32,19,.14)"; // soft ground shadow

function Ground() { return <ellipse cx="32" cy="58" rx="19" ry="3" fill={SH} />; }

function Bunch({ leaf, dark, vein, n = 5, rx = 8, ry = 18, spread = 34, accent, ruffle }) {
  const angles = Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * ((2 * spread) / (n - 1)));
  return (
    <g>
      <Ground />
      {angles.map((a, i) => (
        <g key={i} transform={`rotate(${a} 32 54)`}>
          <ellipse cx="32" cy={54 - ry} rx={rx} ry={ry} fill={i % 2 ? leaf : dark} />
          {accent && <ellipse cx="32" cy={54 - ry * 0.9} rx={rx * 0.4} ry={ry * 0.55} fill={accent} opacity=".85" />}
          {!ruffle && <path d={`M32 ${54} L32 ${54 - ry * 1.8}`} stroke={vein} strokeWidth="1" opacity=".6" />}
          {ruffle && <circle cx="32" cy={54 - ry * 1.6} r={rx * 0.7} fill={leaf} />}
        </g>
      ))}
      <rect x="27" y="49" width="10" height="5" rx="2" fill="#e2901f" />
      <path d="M29 54 L28 60 M35 54 L36 60" stroke="#8aa56b" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Leaves({ c = "#4d7a3a", c2 = "#6c8f58", y = 14 }) {
  return (
    <g>
      <path d={`M32 ${y + 6} C22 ${y - 6} 14 ${y + 2} 20 ${y + 10} C25 ${y + 12} 30 ${y + 10} 32 ${y + 6}Z`} fill={c} />
      <path d={`M32 ${y + 6} C42 ${y - 8} 52 ${y} 44 ${y + 10} C39 ${y + 12} 34 ${y + 10} 32 ${y + 6}Z`} fill={c2} />
      <path d={`M32 ${y + 8} C31 ${y - 4} 34 ${y - 6} 33 ${y - 8} C38 ${y - 2} 36 ${y + 4} 32 ${y + 8}Z`} fill={c} />
    </g>
  );
}

const ART = {
  spinach: () => <Bunch leaf="#3f8a3f" dark="#2d6a30" vein="#c8e6b0" n={5} rx={8} ry={16} />,
  fenugreek: () => <Bunch leaf="#78b04a" dark="#5c9638" vein="#d8efb8" n={6} rx={5} ry={14} ruffle />,
  amaranth: () => <Bunch leaf="#4f9a43" dark="#3b7e35" vein="#d8efb8" n={5} rx={7} ry={16} accent="#c2355a" />,
  coriander: () => <Bunch leaf="#8cc152" dark="#6fa83d" vein="#e3f3c6" n={7} rx={4.5} ry={14} ruffle />,
  mint: () => <Bunch leaf="#58b06b" dark="#3f9456" vein="#d4f0d8" n={5} rx={6} ry={13} />,
  mustard: () => <Bunch leaf="#5f9f3a" dark="#46832c" vein="#dcefbf" n={4} rx={9} ry={17} />,

  potato: () => (
    <g><Ground />
      <path d="M12 36 C10 24 24 16 38 18 C52 20 56 32 50 42 C44 54 22 54 14 46 C12 44 12 40 12 36Z" fill="#c99a5b" />
      <path d="M16 44 C22 52 42 52 48 42 C52 36 52 30 50 28 C50 40 38 50 16 44Z" fill="#b5834a" opacity=".6" />
      <g fill="#8a5d2b"><circle cx="24" cy="30" r="1.6" /><circle cx="36" cy="26" r="1.4" /><circle cx="42" cy="38" r="1.7" /><circle cx="28" cy="42" r="1.4" /></g>
      <ellipse cx="26" cy="24" rx="7" ry="3" fill="#fff" opacity=".22" />
    </g>),
  onion: () => (
    <g><Ground />
      <path d="M32 6 C33 12 36 14 36 18 C48 22 54 34 48 44 C42 54 22 54 16 44 C10 34 16 22 28 18 C28 14 31 12 32 6Z" fill="#b4476b" />
      <path d="M32 18 C24 26 22 40 28 52 M32 18 C40 26 42 40 36 52" stroke="#d98aa5" strokeWidth="1.4" fill="none" />
      <ellipse cx="26" cy="28" rx="4" ry="8" fill="#fff" opacity=".22" transform="rotate(14 26 28)" />
      <path d="M26 54 L24 58 M30 54 L30 58 M36 54 L38 58" stroke="#e7d7b3" strokeWidth="1.4" />
    </g>),
  carrot: () => (
    <g><Ground /><g transform="rotate(-18 32 32)">
      <path d="M26 18 C26 14 38 14 38 18 L34 56 C33 59 31 59 30 56Z" fill="#f08a24" />
      <path d="M28 26 H36 M29 34 H35 M30 42 H34" stroke="#c96a10" strokeWidth="1.4" />
      <path d="M32 16 C26 8 24 4 22 2 M32 16 C32 8 32 4 32 0 M32 16 C38 8 40 4 42 2" stroke="#4d8a3a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
    </g></g>),
  beetroot: () => (
    <g><Ground />
      <path d="M32 22 C46 20 54 30 50 42 C46 52 36 54 32 56 C28 54 18 52 14 42 C10 30 18 20 32 22Z" fill="#8e1f4d" />
      <ellipse cx="25" cy="32" rx="5" ry="7" fill="#fff" opacity=".18" />
      <path d="M32 56 L32 61" stroke="#8e1f4d" strokeWidth="1.6" />
      <path d="M28 22 C22 14 20 8 18 4 M32 22 C32 14 34 8 36 3 M36 22 C42 14 46 10 48 7" stroke="#4d8a3a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M28 22 C22 14 20 8 18 4" stroke="#b83a66" strokeWidth="1.2" fill="none" />
    </g>),
  radish: () => (
    <g><Ground />
      <path d="M32 22 C44 22 50 32 44 44 C40 52 34 56 32 60 C30 56 24 52 20 44 C14 32 20 22 32 22Z" fill="#f4f0f2" />
      <path d="M32 22 C44 22 50 32 44 44 C42 48 40 50 38 52 C46 42 46 28 32 26Z" fill="#d7487a" opacity=".55" />
      <path d="M32 22 C28 14 22 8 18 6 M32 22 C32 12 34 8 36 4 M32 22 C38 14 44 10 48 8" stroke="#4d8a3a" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </g>),
  sweetpotato: () => (
    <g><Ground /><g transform="rotate(-24 32 34)">
      <path d="M8 34 C10 24 30 20 44 24 C54 27 58 31 58 34 C58 39 52 44 42 45 C26 47 10 46 8 34Z" fill="#b8553b" />
      <path d="M14 40 C26 46 44 46 54 38 C50 46 34 49 18 46Z" fill="#8f3b27" opacity=".5" />
      <ellipse cx="28" cy="28" rx="9" ry="2.6" fill="#fff" opacity=".22" />
      <path d="M22 32 H26 M38 36 H42" stroke="#8f3b27" strokeWidth="1.2" />
    </g></g>),
  ginger: () => (
    <g><Ground />
      <path d="M10 38 C8 30 14 26 20 28 C20 20 28 16 32 22 C34 14 44 14 44 24 C52 22 56 30 52 36 C58 38 56 48 48 48 C40 54 24 54 16 48 C10 48 8 42 10 38Z" fill="#d6b27a" />
      <path d="M16 44 C28 50 42 50 50 44 M24 34 C28 32 32 32 36 34 M30 24 C32 26 34 26 36 24" stroke="#a98450" strokeWidth="1.4" fill="none" />
      <ellipse cx="26" cy="30" rx="5" ry="2.4" fill="#fff" opacity=".28" />
    </g>),
  garlic: () => (
    <g><Ground />
      <path d="M32 6 C33 12 34 14 36 18 C48 22 54 34 48 44 C42 54 22 54 16 44 C10 34 16 22 28 18 C30 14 31 12 32 6Z" fill="#f1e6cf" stroke="#cdbd98" strokeWidth="1.2" />
      <path d="M32 18 C24 26 22 40 28 53 M32 18 C40 26 42 40 36 53 M32 18 L32 54" stroke="#d9cdb4" strokeWidth="1.4" fill="none" />
      <path d="M26 54 L24 58 M32 54 L32 58 M38 54 L40 58" stroke="#c9b78f" strokeWidth="1.4" />
    </g>),

  bottlegourd: () => (
    <g><Ground /><g transform="rotate(-22 32 32)">
      <path d="M28 6 C28 4 36 4 36 6 L36 18 C50 24 50 52 32 54 C14 52 14 24 28 18Z" fill="#a9d27a" />
      <path d="M22 34 C22 44 26 50 32 51" stroke="#8cb860" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="38" rx="3" ry="8" fill="#fff" opacity=".3" />
      <rect x="29" y="2" width="6" height="5" rx="2" fill="#7a9a4e" />
    </g></g>),
  ridgegourd: () => (
    <g><Ground /><g transform="rotate(-30 32 32)">
      <path d="M26 6 L38 6 L36 56 C35 60 29 60 28 56Z" fill="#4f8f3a" />
      <path d="M29 8 L30 56 M32 8 V58 M35 8 L34 56" stroke="#2f6a26" strokeWidth="1.5" />
      <path d="M24 4 C24 2 40 2 40 4 L38 8 H26Z" fill="#6a8a3c" />
    </g></g>),
  bittergourd: () => (
    <g><Ground /><g transform="rotate(-28 32 32)">
      <path d="M32 4 C44 6 48 24 46 38 C44 52 38 58 32 60 C26 58 20 52 18 38 C16 24 20 6 32 4Z" fill="#4c8a3c" />
      <g fill="#2f6a26"><ellipse cx="26" cy="18" rx="2.4" ry="4" /><ellipse cx="34" cy="14" rx="2.4" ry="4" /><ellipse cx="38" cy="26" rx="2.4" ry="4" /><ellipse cx="24" cy="32" rx="2.4" ry="4" /><ellipse cx="33" cy="38" rx="2.4" ry="4" /><ellipse cx="26" cy="46" rx="2.4" ry="4" /><ellipse cx="38" cy="48" rx="2.2" ry="3.4" /></g>
      <path d="M32 4 V60" stroke="#7fb862" strokeWidth="1.2" opacity=".6" />
    </g></g>),
  pumpkin: () => (
    <g><Ground />
      <ellipse cx="32" cy="38" rx="22" ry="17" fill="#e8851f" />
      <path d="M32 21 C22 26 20 50 32 55 C44 50 42 26 32 21Z" fill="#f09a35" />
      <path d="M32 21 C26 28 25 46 32 55 M32 21 C38 28 39 46 32 55 M20 25 C14 34 16 46 24 52 M44 25 C50 34 48 46 40 52" stroke="#c46c10" strokeWidth="1.3" fill="none" />
      <path d="M30 22 C30 16 34 14 36 12 C37 15 35 20 34 22Z" fill="#6a8a3c" />
      <ellipse cx="22" cy="32" rx="4" ry="6" fill="#fff" opacity=".2" />
    </g>),
  cucumber: () => (
    <g><Ground /><g transform="rotate(-32 32 32)">
      <path d="M24 8 C24 4 40 4 40 8 L40 52 C40 60 24 60 24 52Z" fill="#3d8a40" />
      <path d="M28 10 V54" stroke="#74b872" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <g fill="#bfe3a8"><circle cx="30" cy="18" r="1" /><circle cx="35" cy="26" r="1" /><circle cx="29" cy="34" r="1" /><circle cx="35" cy="42" r="1" /><circle cx="30" cy="50" r="1" /></g>
    </g></g>),
  snakegourd: () => (
    <g><Ground />
      <path d="M46 8 C52 20 36 30 34 40 C32 48 40 54 38 60" stroke="#cde7b4" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M46 8 C52 20 36 30 34 40 C32 48 40 54 38 60" stroke="#9cc472" strokeWidth="9" strokeLinecap="round" strokeDasharray="2 5" fill="none" opacity=".55" />
    </g>),

  tomato: () => (
    <g><Ground />
      <path d="M32 14 C48 12 58 24 54 38 C50 52 38 56 32 56 C26 56 14 52 10 38 C6 24 16 12 32 14Z" fill="#e0382b" />
      <path d="M12 40 C16 52 28 56 32 56 C40 56 50 52 54 40 C48 50 36 52 12 40Z" fill="#b82618" opacity=".45" />
      <ellipse cx="22" cy="26" rx="6" ry="4" fill="#fff" opacity=".3" transform="rotate(-24 22 26)" />
      <path d="M32 16 L24 12 L28 18 L20 20 L28 22 L26 28 L32 24 L38 28 L36 22 L44 20 L36 18 L40 12Z" fill="#4d8a3a" />
    </g>),
  brinjal: () => (
    <g><Ground /><g transform="rotate(-24 32 32)">
      <path d="M24 12 C16 20 10 40 22 54 C30 62 46 56 46 42 C46 32 38 24 36 12Z" fill="#5b2a86" />
      <ellipse cx="25" cy="38" rx="3.4" ry="10" fill="#fff" opacity=".22" />
      <path d="M22 14 C22 8 38 8 38 14 L42 20 L36 18 L32 24 L28 18 L22 20Z" fill="#4d8a3a" />
      <path d="M30 10 C30 4 32 2 34 2" stroke="#4d8a3a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
    </g></g>),
  cauliflower: () => (
    <g><Ground />
      <path d="M8 36 C10 52 24 56 32 56 C40 56 54 52 56 36 C48 44 16 44 8 36Z" fill="#6aa04a" />
      <path d="M10 36 C6 26 14 16 22 18 C24 10 38 10 42 18 C52 16 58 28 54 36 C46 42 18 42 10 36Z" fill="#f4efe0" />
      <g fill="#fffaf0"><circle cx="20" cy="28" r="5" /><circle cx="30" cy="22" r="6" /><circle cx="42" cy="26" r="5.5" /><circle cx="34" cy="33" r="5" /><circle cx="24" cy="36" r="4" /></g>
      <g fill="none" stroke="#d6cdb0" strokeWidth="1"><circle cx="30" cy="22" r="6" /><circle cx="42" cy="26" r="5.5" /><circle cx="20" cy="28" r="5" /></g>
    </g>),
  cabbage: () => (
    <g><Ground />
      <circle cx="32" cy="34" r="22" fill="#6faa4a" />
      <path d="M32 12 C22 24 22 44 32 56 M32 12 C42 24 42 44 32 56" stroke="#4d8a3a" strokeWidth="1.6" fill="none" />
      <path d="M14 26 C22 28 26 34 28 44 M50 26 C42 28 38 34 36 44 M16 42 C22 38 28 38 32 40 M48 42 C42 38 36 38 32 40" stroke="#a8d487" strokeWidth="1.4" fill="none" />
      <ellipse cx="22" cy="24" rx="5" ry="3" fill="#fff" opacity=".25" transform="rotate(-30 22 24)" />
    </g>),
  beans: () => (
    <g><Ground />
      <g stroke="#4d9a3e" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M14 10 C20 24 12 40 22 56" /><path d="M30 6 C36 22 28 38 38 58" stroke="#5db04c" /><path d="M46 10 C52 26 44 42 52 54" />
      </g>
      <g stroke="#9bd78a" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".7">
        <path d="M13 12 C19 24 11 40 21 54" /><path d="M29 8 C35 22 27 38 37 56" /><path d="M45 12 C51 26 43 42 51 52" />
      </g>
    </g>),
  capsicum: () => (
    <g><Ground />
      <path d="M32 16 C46 12 54 22 52 36 C50 50 44 56 38 56 C35 56 34 53 32 53 C30 53 29 56 26 56 C20 56 14 50 12 36 C10 22 18 12 32 16Z" fill="#3a9a3f" />
      <path d="M24 20 C20 30 22 46 26 54 M40 20 C44 30 42 46 38 54" stroke="#2a7a30" strokeWidth="1.4" fill="none" />
      <ellipse cx="20" cy="28" rx="3.6" ry="8" fill="#fff" opacity=".24" />
      <path d="M32 16 C32 10 34 8 38 7" stroke="#2f6a26" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>),
  peas: () => (
    <g><Ground />
      <path d="M6 30 C10 14 52 14 58 28 C52 46 14 48 6 30Z" fill="#5fa84a" />
      <path d="M8 31 C20 40 46 40 56 29" stroke="#3f8a35" strokeWidth="1.6" fill="none" />
      <g fill="#a7de6b" stroke="#78b84a" strokeWidth="1"><circle cx="17" cy="29" r="5.4" /><circle cx="27" cy="29" r="5.8" /><circle cx="37" cy="28.5" r="5.8" /><circle cx="47" cy="27.5" r="5.2" /></g>
      <g fill="#fff" opacity=".35"><circle cx="15" cy="27" r="1.4" /><circle cx="25" cy="27" r="1.5" /><circle cx="35" cy="26.5" r="1.5" /><circle cx="45" cy="25.5" r="1.3" /></g>
      <path d="M54 20 C60 18 62 14 62 10" stroke="#4d8a3a" strokeWidth="2" fill="none" />
    </g>),
  okra: () => (
    <g><Ground />
      <g fill="#5fa04a">
        <path d="M14 14 C16 10 22 10 24 14 L26 52 C26 60 20 62 18 56Z" transform="rotate(-8 20 36)" />
        <path d="M28 8 C30 4 36 4 38 8 L40 52 C40 60 34 62 32 56Z" fill="#6cb056" />
        <path d="M44 14 C46 10 52 10 54 14 L52 52 C50 60 44 62 44 54Z" transform="rotate(10 48 36)" />
      </g>
      <g stroke="#3d8035" strokeWidth="1.2"><path d="M32 12 L34 54" /><path d="M20 16 L22 52" transform="rotate(-8 20 36)" /><path d="M48 16 L47 52" transform="rotate(10 48 36)" /></g>
      <g fill="#3d8035"><rect x="29" y="4" width="8" height="5" rx="2" /><rect x="15" y="10" width="8" height="5" rx="2" transform="rotate(-8 20 36)" /><rect x="44" y="10" width="8" height="5" rx="2" transform="rotate(10 48 36)" /></g>
    </g>),
  chilli: () => (
    <g><Ground />
      <path d="M12 22 C14 18 18 18 22 20 C34 26 48 36 56 56 C46 52 28 46 16 34 C10 30 10 26 12 22Z" fill="#3fa23a" />
      <path d="M12 38 C14 34 18 34 22 36 C30 40 40 46 46 60 C38 56 24 52 16 48 C10 44 10 42 12 38Z" fill="#59b84a" transform="translate(4 -6)" />
      <path d="M12 22 C8 18 8 12 12 8" stroke="#2f7a2a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M16 24 C28 30 40 38 48 50" stroke="#fff" strokeWidth="1.6" opacity=".3" fill="none" />
    </g>),
  drumstick: () => (
    <g><Ground />
      <path d="M8 56 L56 8" stroke="#8a9a4a" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 58 L58 20" stroke="#738a3a" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M8 40 L40 8" stroke="#9aaa58" strokeWidth="3.6" strokeLinecap="round" />
      <g fill="#6b7a34"><circle cx="22" cy="42" r="1.6" /><circle cx="34" cy="30" r="1.6" /><circle cx="46" cy="18" r="1.6" /><circle cx="30" cy="48" r="1.5" /><circle cx="46" cy="38" r="1.5" /></g>
    </g>),
};

// fallback: a leaf badge when we have no drawing for a new vegetable you add later
function Generic({ name }) {
  return (
    <g><Ground />
      <circle cx="32" cy="34" r="20" fill="#e9f0dd" />
      <Leaves y={22} />
      <text x="32" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2f4a34" fontFamily="Georgia,serif">
        {String(name || "?").charAt(0).toUpperCase()}
      </text>
    </g>
  );
}

// keyword fallback so rows you add in the Sheet still get a sensible picture
const GUESS = [
  ["gourd", "bottlegourd"], ["tomato", "tomato"], ["potato", "potato"], ["onion", "onion"], ["carrot", "carrot"],
  ["chilli", "chilli"], ["chili", "chilli"], ["bean", "beans"], ["pea", "peas"], ["cabbage", "cabbage"], ["cauli", "cauliflower"],
  ["brinjal", "brinjal"], ["eggplant", "brinjal"], ["pepper", "capsicum"], ["capsicum", "capsicum"], ["cucumber", "cucumber"],
  ["pumpkin", "pumpkin"], ["garlic", "garlic"], ["ginger", "ginger"], ["radish", "radish"], ["beet", "beetroot"],
  ["leaf", "spinach"], ["leaves", "spinach"], ["greens", "spinach"], ["palak", "spinach"], ["okra", "okra"], ["lady", "okra"],
];

export function artFor(id, name) {
  if (ART[id]) return ART[id];
  const n = String(name || id || "").toLowerCase();
  const hit = GUESS.find(([k]) => n.includes(k));
  return hit ? ART[hit[1]] : null;
}

export default function VegArt({ id, name, size = 52 }) {
  const Draw = artFor(id, name);
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={name || id} className="vegart">
      {Draw ? <Draw /> : <Generic name={name} />}
    </svg>
  );
}

export const ART_IDS = Object.keys(ART);
