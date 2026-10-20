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

var SEED = [
 {
  "id": "spinach",
  "category": "Leafy greens",
  "name": "Spinach",
  "hi": "पालक",
  "te": "పాలకూర",
  "price": 30,
  "unit": "bunch"
 },
 {
  "id": "fenugreek",
  "category": "Leafy greens",
  "name": "Fenugreek leaves",
  "hi": "मेथी",
  "te": "మెంతికూర",
  "price": 25,
  "unit": "bunch"
 },
 {
  "id": "amaranth",
  "category": "Leafy greens",
  "name": "Amaranth greens",
  "hi": "चौलाई",
  "te": "తోటకూర",
  "price": 25,
  "unit": "bunch"
 },
 {
  "id": "coriander",
  "category": "Leafy greens",
  "name": "Coriander",
  "hi": "धनिया",
  "te": "కొత్తిమీర",
  "price": 15,
  "unit": "bunch"
 },
 {
  "id": "mint",
  "category": "Leafy greens",
  "name": "Mint",
  "hi": "पुदीना",
  "te": "పుదీనా",
  "price": 15,
  "unit": "bunch"
 },
 {
  "id": "mustard",
  "category": "Leafy greens",
  "name": "Mustard greens",
  "hi": "सरसों",
  "te": "ఆవిసె కూర",
  "price": 30,
  "unit": "bunch"
 },
 {
  "id": "potato",
  "category": "Roots & tubers",
  "name": "Potato",
  "hi": "आलू",
  "te": "బంగాళాదుంప",
  "price": 35,
  "unit": "kg"
 },
 {
  "id": "onion",
  "category": "Roots & tubers",
  "name": "Onion",
  "hi": "प्याज़",
  "te": "ఉల్లిపాయ",
  "price": 40,
  "unit": "kg"
 },
 {
  "id": "carrot",
  "category": "Roots & tubers",
  "name": "Carrot",
  "hi": "गाजर",
  "te": "క్యారెట్",
  "price": 45,
  "unit": "kg"
 },
 {
  "id": "beetroot",
  "category": "Roots & tubers",
  "name": "Beetroot",
  "hi": "चुकंदर",
  "te": "బీట్‌రూట్",
  "price": 40,
  "unit": "kg"
 },
 {
  "id": "radish",
  "category": "Roots & tubers",
  "name": "Radish",
  "hi": "मूली",
  "te": "ముల్లంగి",
  "price": 30,
  "unit": "kg"
 },
 {
  "id": "sweetpotato",
  "category": "Roots & tubers",
  "name": "Sweet potato",
  "hi": "शकरकंद",
  "te": "చిలగడదుంప",
  "price": 50,
  "unit": "kg"
 },
 {
  "id": "ginger",
  "category": "Roots & tubers",
  "name": "Ginger",
  "hi": "अदरक",
  "te": "అల్లం",
  "price": 90,
  "unit": "250g"
 },
 {
  "id": "garlic",
  "category": "Roots & tubers",
  "name": "Garlic",
  "hi": "लहसुन",
  "te": "వెల్లుల్లి",
  "price": 140,
  "unit": "250g"
 },
 {
  "id": "bottlegourd",
  "category": "Gourds & squashes",
  "name": "Bottle gourd",
  "hi": "लौकी",
  "te": "సొరకాయ",
  "price": 35,
  "unit": "piece"
 },
 {
  "id": "ridgegourd",
  "category": "Gourds & squashes",
  "name": "Ridge gourd",
  "hi": "तोरई",
  "te": "బీరకాయ",
  "price": 40,
  "unit": "kg"
 },
 {
  "id": "bittergourd",
  "category": "Gourds & squashes",
  "name": "Bitter gourd",
  "hi": "करेला",
  "te": "కాకరకాయ",
  "price": 45,
  "unit": "kg"
 },
 {
  "id": "pumpkin",
  "category": "Gourds & squashes",
  "name": "Pumpkin",
  "hi": "कद्दू",
  "te": "గుమ్మడికాయ",
  "price": 35,
  "unit": "kg"
 },
 {
  "id": "cucumber",
  "category": "Gourds & squashes",
  "name": "Cucumber",
  "hi": "खीरा",
  "te": "దోసకాయ",
  "price": 30,
  "unit": "kg"
 },
 {
  "id": "snakegourd",
  "category": "Gourds & squashes",
  "name": "Snake gourd",
  "hi": "चिचिंडा",
  "te": "పొట్లకాయ",
  "price": 40,
  "unit": "kg"
 },
 {
  "id": "tomato",
  "category": "Everyday vegetables",
  "name": "Tomato",
  "hi": "टमाटर",
  "te": "టమాటా",
  "price": 40,
  "unit": "kg"
 },
 {
  "id": "brinjal",
  "category": "Everyday vegetables",
  "name": "Brinjal",
  "hi": "बैंगन",
  "te": "వంకాయ",
  "price": 35,
  "unit": "kg"
 },
 {
  "id": "cauliflower",
  "category": "Everyday vegetables",
  "name": "Cauliflower",
  "hi": "फूल गोभी",
  "te": "కాలీఫ్లవర్",
  "price": 40,
  "unit": "piece"
 },
 {
  "id": "cabbage",
  "category": "Everyday vegetables",
  "name": "Cabbage",
  "hi": "पत्ता गोभी",
  "te": "క్యాబేజీ",
  "price": 30,
  "unit": "piece"
 },
 {
  "id": "beans",
  "category": "Everyday vegetables",
  "name": "Green beans",
  "hi": "फंसी",
  "te": "చిక్కుడుకాయ",
  "price": 50,
  "unit": "kg"
 },
 {
  "id": "capsicum",
  "category": "Everyday vegetables",
  "name": "Capsicum",
  "hi": "शिमला मिर्च",
  "te": "క్యాప్సికం",
  "price": 60,
  "unit": "kg"
 },
 {
  "id": "peas",
  "category": "Everyday vegetables",
  "name": "Green peas",
  "hi": "मटर",
  "te": "బటానీ",
  "price": 70,
  "unit": "kg"
 },
 {
  "id": "okra",
  "category": "Everyday vegetables",
  "name": "Okra",
  "hi": "भिंडी",
  "te": "బెండకాయ",
  "price": 45,
  "unit": "kg"
 },
 {
  "id": "chilli",
  "category": "Everyday vegetables",
  "name": "Green chilli",
  "hi": "हरी मिर्च",
  "te": "పచ్చిమిర్చి",
  "price": 40,
  "unit": "250g"
 },
 {
  "id": "drumstick",
  "category": "Everyday vegetables",
  "name": "Drumstick",
  "hi": "सहजन",
  "te": "మునగకాయ",
  "price": 50,
  "unit": "bunch"
 }
];

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
