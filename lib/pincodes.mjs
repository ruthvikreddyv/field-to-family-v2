// Hyderabad / Secunderabad pincodes and the localities they mostly cover (approximate - one pincode
// can cover several localities). Works offline, costs nothing. Anything in the 500001-500100 range
// is accepted as Hyderabad even if it is not listed here. Add more lines any time.

export const PINCODES = [
  ["500001", ["Abids", "Nampally", "Koti"]],
  ["500002", ["Charminar", "Moghalpura"]],
  ["500003", ["Secunderabad", "Paradise"]],
  ["500004", ["Khairatabad", "Masab Tank"]],
  ["500007", ["Osmania University", "Habsiguda"]],
  ["500008", ["Tolichowki", "Shaikpet"]],
  ["500010", ["Alwal"]],
  ["500014", ["Kompally"]],
  ["500016", ["Begumpet", "Ameerpet"]],
  ["500017", ["Tarnaka"]],
  ["500018", ["Erragadda", "Borabanda", "Moosapet", "Sanath Nagar"]],
  ["500028", ["Mehdipatnam"]],
  ["500029", ["Himayatnagar", "Narayanguda"]],
  ["500030", ["Rajendra Nagar"]],
  ["500032", ["Gachibowli", "Nanakramguda", "Financial District"]],
  ["500033", ["Jubilee Hills"]],
  ["500034", ["Banjara Hills"]],
  ["500035", ["Kothapet"]],
  ["500036", ["Malakpet"]],
  ["500038", ["Ameerpet", "SR Nagar"]],
  ["500039", ["Uppal"]],
  ["500045", ["Yousufguda", "Krishna Nagar"]],
  ["500047", ["Malkajgiri"]],
  ["500048", ["Attapur"]],
  ["500049", ["Miyapur", "Hafeezpet"]],
  ["500050", ["Chandanagar", "Madinaguda"]],
  ["500055", ["Jeedimetla"]],
  ["500059", ["Santosh Nagar"]],
  ["500060", ["Dilsukhnagar"]],
  ["500062", ["ECIL", "Kapra"]],
  ["500068", ["Nagole"]],
  ["500070", ["Champapet", "Saidabad"]],
  ["500072", ["Kukatpally"]],
  ["500074", ["LB Nagar"]],
  ["500075", ["Narsingi", "Kokapet"]],
  ["500081", ["Madhapur", "Hitech City"]],
  ["500082", ["Somajiguda", "Panjagutta"]],
  ["500084", ["Kondapur"]],
  ["500085", ["KPHB", "Nizampet"]],
  ["500089", ["Manikonda", "Puppalguda"]],
  ["500090", ["Bachupally"]],
  ["500094", ["Sainikpuri"]],
  ["500096", ["Film Nagar", "Jubilee Hills"]],
];

const FLAT = PINCODES.flatMap(([pin, locs]) => locs.map((loc) => ({ pin, loc })));

export function cleanPin(v) {
  return String(v || "").replace(/\D/g, "").slice(0, 6);
}

// Suggestions while typing: by pincode digits ("5000", "50008") or by locality name ("madh", "kuk").
export function suggest(query, limit = 6) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  if (/^\d+$/.test(q)) return FLAT.filter((x) => x.pin.startsWith(q)).slice(0, limit);
  return FLAT.filter((x) => x.loc.toLowerCase().includes(q))
    .sort((a, b) => a.loc.toLowerCase().indexOf(q) - b.loc.toLowerCase().indexOf(q))
    .slice(0, limit);
}

// Is this a pincode we deliver to?  -> { ok, city, localities, message }
export function lookupPin(pin) {
  const p = cleanPin(pin);
  if (p.length < 6) return { ok: false, partial: true, message: "Enter your 6-digit pincode." };
  const hit = PINCODES.find(([x]) => x === p);
  if (hit) return { ok: true, city: "Hyderabad", state: "Telangana", localities: hit[1] };
  const n = Number(p);
  if (n >= 500001 && n <= 500100) return { ok: true, city: "Hyderabad", state: "Telangana", localities: [] };
  return { ok: false, message: "Sorry, we deliver only in Hyderabad right now (pincodes 500001 to 500100)." };
}
