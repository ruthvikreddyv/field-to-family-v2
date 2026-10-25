import { useEffect, useRef, useState } from "react";
import { cleanPin, lookupPin, suggest } from "../lib/pincodes.mjs";

// Pincode (with suggestions), auto city, area, landmark and optional map pin.
export default function LocationFields({ form, setForm }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState("");
  const boxRef = useRef(null);

  const pin = lookupPin(form.pincode);
  const [areaOpen, setAreaOpen] = useState(false);
  const [ahi, setAhi] = useState(-1);
  const areaRef = useRef(null);
  const list = open && form.pincode.length < 6 ? suggest(form.pincode, 6) : [];
  const alist = areaOpen && form.area.trim().length >= 2 && !/^\d+$/.test(form.area.trim()) ? suggest(form.area, 6) : [];
  const typedPin = form.pincode.length > 0;

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
      if (areaRef.current && !areaRef.current.contains(e.target)) setAreaOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  // when a full pincode with exactly one known locality is typed, fill the area for them
  useEffect(() => {
    if (pin.ok && pin.localities.length === 1 && !form.area.trim()) {
      setForm((f) => ({ ...f, area: pin.localities[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pincode]);

  function choose(s) {
    setForm((f) => ({ ...f, pincode: s.pin, area: s.loc }));
    setOpen(false); setHi(-1); setAreaOpen(false); setAhi(-1);
  }
  function onAreaKey(e) {
    if (!alist.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setAhi((h) => (h + 1) % alist.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAhi((h) => (h <= 0 ? alist.length - 1 : h - 1)); }
    else if (e.key === "Enter" && ahi >= 0) { e.preventDefault(); choose(alist[ahi]); }
    else if (e.key === "Escape") setAreaOpen(false);
  }
  function onKey(e) {
    if (!list.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % list.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h <= 0 ? list.length - 1 : h - 1)); }
    else if (e.key === "Enter" && hi >= 0) { e.preventDefault(); choose(list[hi]); }
    else if (e.key === "Escape") setOpen(false);
  }

  function shareLocation() {
    if (!("geolocation" in navigator)) { setNote("Your browser can't share location. Please type your address."); return; }
    setLocating(true); setNote("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, mapLink: `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}` }));
        setNote("Location pinned. Looking up your pincode...");
        try {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 6000);
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${latitude}&lon=${longitude}`, { signal: ctl.signal, headers: { "Accept-Language": "en" } });
          clearTimeout(t);
          const a = (await r.json()).address || {};
          const code = cleanPin(a.postcode);
          const found = lookupPin(code);
          if (code.length === 6 && !found.ok) { setNote("This location looks outside Hyderabad. We deliver only in Hyderabad."); setLocating(false); return; }
          const where = a.suburb || a.neighbourhood || a.city_district || a.quarter || "";
          setForm((f) => ({ ...f, pincode: code.length === 6 ? code : f.pincode, area: f.area.trim() ? f.area : where }));
          setNote("Location pinned. Please check the pincode and area below.");
        } catch (e) {
          setNote("Location pinned. Please type your pincode below.");
        }
        setLocating(false);
      },
      () => { setLocating(false); setNote("Could not get your location. Please allow location access, or just type your address."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="loc">
      <div className="loc-map">
        <div>
          <b>Pin your location on the map</b>
          <span>Helps our delivery partner find you quickly. Optional but recommended.</span>
        </div>
        {form.mapLink ? (
          <div className="loc-actions">
            <a href={form.mapLink} target="_blank" rel="noopener noreferrer">View on map</a>
            <button type="button" onClick={() => { setForm({ ...form, mapLink: "" }); setNote(""); }}>Remove</button>
          </div>
        ) : (
          <button type="button" className="ghost sm" onClick={shareLocation} disabled={locating}>{locating ? "Finding..." : "Use my location"}</button>
        )}
      </div>
      {note && <div className="hint tight">{note}</div>}

      <label>Pincode
        <div className="combo" ref={boxRef}>
          <input
            value={form.pincode} inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="e.g. 500081"
            role="combobox" aria-expanded={open && list.length > 0} aria-autocomplete="list"
            onFocus={() => setOpen(true)} onKeyDown={onKey}
            onChange={(e) => { setForm({ ...form, pincode: cleanPin(e.target.value) }); setOpen(true); setHi(-1); }}
          />
          {list.length > 0 && (
            <ul className="sugg" role="listbox">
              {list.map((s, i) => (
                <li key={s.pin + s.loc} role="option" aria-selected={i === hi} className={i === hi ? "on" : ""}
                  onPointerDown={(e) => { e.preventDefault(); choose(s); }} onMouseEnter={() => setHi(i)}>
                  <b>{s.pin}</b><span>{s.loc}, Hyderabad</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
      {typedPin && pin.ok && <div className="city-ok">City: {pin.city}, {pin.state} ✓ We deliver here</div>}
      {typedPin && !pin.ok && !pin.partial && <div className="err tight">{pin.message}</div>}

      <label>Area / locality
        <div className="combo" ref={areaRef}>
          <input value={form.area} placeholder="Start typing, e.g. Madhapur" autoComplete="off"
            role="combobox" aria-expanded={alist.length > 0} aria-autocomplete="list"
            onFocus={() => setAreaOpen(true)} onKeyDown={onAreaKey}
            onChange={(e) => { setForm({ ...form, area: e.target.value }); setAreaOpen(true); setAhi(-1); }} />
          {alist.length > 0 && (
            <ul className="sugg" role="listbox">
              {alist.map((s, i) => (
                <li key={s.pin + s.loc} role="option" aria-selected={i === ahi} className={i === ahi ? "on" : ""}
                  onPointerDown={(e) => { e.preventDefault(); choose(s); }} onMouseEnter={() => setAhi(i)}>
                  <b>{s.loc}</b><span>{s.pin}, Hyderabad</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
      <label>Landmark (optional)
        <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="e.g. Near Metro station, opposite SBI bank" />
      </label>
    </div>
  );
}
