/**
 * Field to Family - Google Sheet backend (free).
 * Paste this whole file into Extensions > Apps Script, run setupSheets() once,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Products tab : you edit prices / availability here, the website updates by itself.
 * Orders tab   : every order is added here automatically.
 */

var PRODUCT_HEADERS = ["ID", "Active", "Available", "Category", "Name", "Telugu", "Hindi", "Price", "Unit", "Image URL"];
var ORDER_HEADERS = ["Time", "Order ID", "Name", "Phone", "Address", "Area", "Map link", "Slot", "Payment", "Items", "Total (Rs)", "Notes", "Status"];
var MIN_ORDER = 150, FREE_ABOVE = 500, DELIVERY_FEE = 30;

var SEED = /*SEED*/[];

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var p = ss.getSheetByName("Products") || ss.insertSheet("Products");
  if (p.getLastRow() < 2) {
    p.clear();
    p.appendRow(PRODUCT_HEADERS);
    var rows = SEED.map(function (s) { return [s.id, true, true, s.category, s.name, s.te, s.hi, s.price, s.unit, ""]; });
    p.getRange(2, 1, rows.length, PRODUCT_HEADERS.length).setValues(rows);
    p.getRange(2, 2, rows.length, 2).insertCheckboxes();
    p.setFrozenRows(1);
    p.getRange(1, 1, 1, PRODUCT_HEADERS.length).setFontWeight("bold").setBackground("#e9f0dd");
    p.autoResizeColumns(1, PRODUCT_HEADERS.length);
  }
  var o = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
  if (o.getLastRow() < 1) {
    o.appendRow(ORDER_HEADERS);
    o.setFrozenRows(1);
    o.getRange(1, 1, 1, ORDER_HEADERS.length).setFontWeight("bold").setBackground("#fbe9c8");
  }
  var def = ss.getSheetByName("Sheet1");
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
}

function truthy(v) { return v === true || String(v).toLowerCase() === "true" || String(v).toLowerCase() === "yes"; }

function readProducts_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  if (!sh || sh.getLastRow() < 2) return [];
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, PRODUCT_HEADERS.length).getValues();
  var out = [];
  v.forEach(function (r) {
    if (!r[0] || !truthy(r[1])) return;            // Active = false hides the item
    var price = Number(r[7]);
    if (!(price > 0)) return;
    out.push({
      id: String(r[0]).trim(), available: truthy(r[2]), category: String(r[3] || "Other"),
      name: String(r[4]), te: String(r[5] || ""), hi: String(r[6] || ""),
      price: price, unit: String(r[8] || "kg"), image: String(r[9] || "")
    });
  });
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ products: readProducts_() });
}

function clean_(s, n) {
  s = String(s == null ? "" : s).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
  if (/^[=+\-@]/.test(s)) s = "'" + s;             // stop spreadsheet formula injection
  return s;
}

function stepFor_(unit) { return String(unit).toLowerCase() === "kg" ? 0.5 : 1; }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (d.website) return json_({ ok: true });      // honeypot: bots fill this
    var phone = String(d.phone || "").replace(/\D/g, "").slice(-10);
    if (!d.orderId || !/^[6-9]\d{9}$/.test(phone) || !d.items || !d.items.length || d.items.length > 60)
      return json_({ ok: false, error: "bad order" });

    var byId = {};
    readProducts_().forEach(function (p) { byId[p.id] = p; });
    var lines = [], sub = 0;
    d.items.forEach(function (it) {
      var p = byId[String(it.id)];
      var q = Number(it.qty);
      if (!p || !p.available || !(q > 0) || q > 99) return;
      var st = stepFor_(p.unit);
      q = Math.round(q / st) * st;
      var lt = Math.round(p.price * q * 100) / 100;
      sub += lt;
      lines.push(p.name + " " + q + " " + p.unit + " = Rs " + lt);
    });
    if (!lines.length) return json_({ ok: false, error: "no valid items" });
    var total = sub + (sub >= FREE_ABOVE ? 0 : DELIVERY_FEE);

    lock.waitLock(20000);
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    if (!sh) { setupSheets(); sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders"); }
    var oid = clean_(d.orderId, 30);
    var last = sh.getLastRow();
    if (last > 1) {
      var ids = sh.getRange(Math.max(2, last - 200), 2, Math.min(last - 1, 201), 1).getValues();
      for (var i = 0; i < ids.length; i++) if (ids[i][0] === oid) return json_({ ok: true, dup: true });
    }
    sh.appendRow([
      new Date(), oid, clean_(d.name, 80), "'" + phone, clean_(d.address, 250), clean_(d.area, 60),
      clean_(d.mapLink, 200), clean_(d.slot, 40), clean_(d.payment, 40),
      lines.join("\n"), total + (sub < MIN_ORDER ? "  (below minimum)" : ""),
      clean_(d.notes, 300), "New"
    ]);
    return json_({ ok: true, total: total });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
