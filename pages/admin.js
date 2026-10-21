import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "../lib/config.mjs";

const PW_KEY = "f2f_admin_pw";
const UNITS = ["kg", "bunch", "piece", "dozen", "packet"];

async function api(body) {
  if (!CONFIG.sheetUrl) return { ok: false, error: "sheetUrl is empty in lib/config.mjs" };
  try {
    const r = await fetch(CONFIG.sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    return await r.json();
  } catch (e) {
    return { ok: false, error: "Could not reach the Sheet. Check your internet and that the web app is deployed with access 'Anyone'." };
  }
}

function slug(name) {
  const base = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
  return base + "-" + Math.floor(100 + Math.random() * 900);
}

function when(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("orders");
  const [rows, setRows] = useState([]);          // editable products
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState(["New", "Confirmed", "Out for delivery", "Delivered", "Cancelled"]);
  const [filter, setFilter] = useState("Open");
  const [q, setQ] = useState("");
  const [pq, setPq] = useState("");
  const [draft, setDraft] = useState({ name: "", te: "", hi: "", category: "", price: "", unit: "kg" });
  const pwRef = useRef("");

  const apply = useCallback((res) => {
    setRows((res.products || []).map((p) => ({ ...p, dirty: false })));
    setOrders(res.orders || []);
    if (res.statuses) setStatuses(res.statuses);
  }, []);

  const call = useCallback(async (body, okText) => {
    setBusy(true); setErr(""); setMsg("");
    const res = await api({ ...body, pw: pwRef.current });
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Something went wrong"); return res; }
    apply(res);
    if (okText) setMsg(okText);
    return res;
  }, [apply]);

  async function login(e, saved) {
    if (e) e.preventDefault();
    pwRef.current = saved || pw;
    const res = await call({ action: "list" });
    if (res.ok) {
      setAuthed(true);
      try { sessionStorage.setItem(PW_KEY, pwRef.current); } catch (x) { /* ignore */ }
    } else {
      try { sessionStorage.removeItem(PW_KEY); } catch (x) { /* ignore */ }
    }
  }

  useEffect(() => {
    try { const s = sessionStorage.getItem(PW_KEY); if (s) { setPw(s); login(null, s); } } catch (x) { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh orders every minute while there is nothing unsaved
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => {
      if (document.hidden || rows.some((r) => r.dirty)) return;
      api({ action: "list", pw: pwRef.current }).then((res) => { if (res.ok) apply(res); });
    }, 60000);
    return () => clearInterval(t);
  }, [authed, rows, apply]);

  function logout() {
    try { sessionStorage.removeItem(PW_KEY); } catch (x) { /* ignore */ }
    pwRef.current = ""; setPw(""); setAuthed(false); setRows([]); setOrders([]);
  }

  /* ---- orders ---- */
  const counts = useMemo(() => {
    const c = { Open: 0 };
    orders.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; if (o.status !== "Delivered" && o.status !== "Cancelled") c.Open++; });
    return c;
  }, [orders]);

  const shownOrders = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter === "Open" && (o.status === "Delivered" || o.status === "Cancelled")) return false;
      if (filter !== "Open" && filter !== "All" && o.status !== filter) return false;
      return !s || (o.name + o.phone + o.orderId + o.area).toLowerCase().includes(s);
    });
  }, [orders, filter, q]);

  function setStatus(o, status) {
    setOrders((list) => list.map((x) => (x.orderId === o.orderId ? { ...x, status } : x)));
    call({ action: "setStatus", orderId: o.orderId, status }, "Order " + o.orderId + " marked " + status);
  }

  /* ---- products ---- */
  const dirtyCount = rows.filter((r) => r.dirty).length;
  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))], [rows]);

  function edit(id, patch) {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, ...patch, dirty: true } : r)));
  }
  function saveAll() {
    const changed = rows.filter((r) => r.dirty).map(({ dirty, ...p }) => p);
    if (!changed.length) return;
    call({ action: "saveProducts", products: changed }, changed.length + " item(s) saved. The website updates within a minute.");
  }
  function remove(r) {
    if (!window.confirm("Delete " + r.name + " permanently? (To just hide it, untick Show instead.)")) return;
    call({ action: "deleteProduct", id: r.id }, r.name + " deleted");
  }
  function addNew(e) {
    e.preventDefault();
    const price = Number(draft.price);
    if (!draft.name.trim() || !(price > 0)) { setErr("Enter a name and a price greater than 0."); return; }
    const item = {
      id: slug(draft.name), show: true, name: draft.name.trim(), te: draft.te.trim(), hi: draft.hi.trim(),
      category: draft.category.trim() || "Other", price, unit: draft.unit, image: "",
    };
    call({ action: "saveProducts", products: [item] }, draft.name.trim() + " added");
    setDraft({ name: "", te: "", hi: "", category: draft.category, price: "", unit: draft.unit });
  }
  function hideAllToggle(show) {
    if (!window.confirm(show ? "Show ALL vegetables on the website?" : "Hide ALL vegetables? (Useful at the end of the day. Show them again tomorrow.)")) return;
    setRows((list) => list.map((r) => (r.show === show ? r : { ...r, show, dirty: true })));
  }

  const shownRows = useMemo(() => {
    const s = pq.trim().toLowerCase();
    return rows.filter((r) => !s || (r.name + r.te + r.hi + r.category).toLowerCase().includes(s));
  }, [rows, pq]);
  const grouped = useMemo(() => {
    const m = new Map();
    shownRows.forEach((r) => { if (!m.has(r.category)) m.set(r.category, []); m.get(r.category).push(r); });
    return [...m.entries()];
  }, [shownRows]);

  if (!authed) {
    return (
      <>
        <Head><title>Admin - Field to Family</title><meta name="robots" content="noindex,nofollow" /></Head>
        <main className="ad-login">
          <form onSubmit={login} className="ad-card">
            <h1>Field to Family admin</h1>
            <p>Enter the admin password you set in Code.gs.</p>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoFocus autoComplete="current-password" />
            {err && <div className="err">{err}</div>}
            <button className="primary" disabled={busy || !pw}>{busy ? "Checking..." : "Open admin"}</button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin - Field to Family</title><meta name="robots" content="noindex,nofollow" /></Head>
      <header className="top">
        <div className="top-in">
          <div className="brand">Admin</div>
          <div className="ad-nav">
            <button className={"cat" + (tab === "orders" ? " on" : "")} onClick={() => setTab("orders")}>
              Orders{counts.Open ? " (" + counts.Open + ")" : ""}
            </button>
            <button className={"cat" + (tab === "products" ? " on" : "")} onClick={() => setTab("products")}>Vegetables & prices</button>
            <button className="cat" onClick={() => call({ action: "list" }, "Refreshed")}>Refresh</button>
            <button className="cat" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="ad-main">
        {err && <div className="err">{err}</div>}
        {msg && <div className="ad-ok">{msg}</div>}

        {tab === "orders" && (
          <section>
            <div className="ad-bar">
              {["Open", "All", ...statuses].map((s) => (
                <button key={s} className={"cat" + (filter === s ? " on" : "")} onClick={() => setFilter(s)}>
                  {s}{counts[s] ? " " + counts[s] : ""}
                </button>
              ))}
            </div>
            <input className="search" placeholder="Search name, phone, order ID, area" value={q} onChange={(e) => setQ(e.target.value)} />
            {!shownOrders.length && <p className="empty">{busy ? "Loading..." : "No orders here."}</p>}
            {shownOrders.map((o) => (
              <article className="ad-order" key={o.orderId}>
                <div className="ad-oh">
                  <div>
                    <b>{o.name}</b> <span className="native">{o.orderId} - {when(o.time)}</span>
                  </div>
                  <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} disabled={busy}>
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <pre className="ad-items">{o.items}</pre>
                <div className="ad-meta">
                  <div><b>Total Rs {o.total}</b> - {o.payment} - {o.slot}</div>
                  <div>{o.address}, {o.area}</div>
                  {o.notes && <div>Notes: {o.notes}</div>}
                </div>
                <div className="ad-links">
                  <a href={"tel:+91" + o.phone}>Call {o.phone}</a>
                  <a href={"https://wa.me/91" + o.phone} target="_blank" rel="noopener noreferrer">WhatsApp customer</a>
                  {o.mapLink && <a href={o.mapLink} target="_blank" rel="noopener noreferrer">Map</a>}
                </div>
              </article>
            ))}
          </section>
        )}

        {tab === "products" && (
          <section>
            <form className="ad-card ad-add" onSubmit={addNew}>
              <h2>Add a vegetable</h2>
              <div className="ad-grid">
                <input placeholder="Name (English)*" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                <input placeholder="Telugu" value={draft.te} onChange={(e) => setDraft({ ...draft, te: e.target.value })} />
                <input placeholder="Hindi" value={draft.hi} onChange={(e) => setDraft({ ...draft, hi: e.target.value })} />
                <input list="cats" placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
                <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
                <input type="number" inputMode="decimal" min="1" placeholder="Price Rs*" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
                <select value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <button className="primary" disabled={busy}>Add to website</button>
            </form>

            <div className="ad-bar">
              <input className="search" placeholder="Search vegetables" value={pq} onChange={(e) => setPq(e.target.value)} />
              <button className="cat" onClick={() => hideAllToggle(false)}>Hide all</button>
              <button className="cat" onClick={() => hideAllToggle(true)}>Show all</button>
            </div>

            {grouped.map(([cat, list]) => (
              <div key={cat}>
                <h3 className="ad-cat">{cat}</h3>
                {list.map((r) => (
                  <div className={"ad-prow" + (r.show ? "" : " off") + (r.dirty ? " dirty" : "")} key={r.id}>
                    <label className="ad-show">
                      <input type="checkbox" checked={r.show} onChange={(e) => edit(r.id, { show: e.target.checked })} />
                      <span>Show</span>
                    </label>
                    <div className="ad-name">
                      <b>{r.name}</b>
                      <span className="native">{r.te} {r.hi && "/ " + r.hi}</span>
                    </div>
                    <div className="ad-price">
                      <span>Rs</span>
                      <input type="number" inputMode="decimal" min="1" value={r.price} onChange={(e) => edit(r.id, { price: e.target.value })} />
                      <select value={r.unit} onChange={(e) => edit(r.id, { unit: e.target.value })}>
                        {[...new Set([...UNITS, r.unit])].map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <button className="link" onClick={() => remove(r)} aria-label={"Delete " + r.name}>Delete</button>
                  </div>
                ))}
              </div>
            ))}
            {!rows.length && <p className="empty">{busy ? "Loading..." : "No vegetables yet."}</p>}

            <div className="ad-save">
              <button className="primary" onClick={saveAll} disabled={busy || !dirtyCount}>
                {dirtyCount ? "Save " + dirtyCount + " change" + (dirtyCount > 1 ? "s" : "") : "No changes to save"}
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
