import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { CONFIG } from "../lib/config.mjs";
import { FALLBACK_PRODUCTS } from "../lib/catalog.mjs";
import * as O from "../lib/order.mjs";

const products = FALLBACK_PRODUCTS.map((p) => ({ ...p, available: true, image: "" }));
const veg = (id) => products.find((p) => p.id === id);

// totals
assert.deepEqual(O.priceBreakdown(0, CONFIG), { subtotal: 0, delivery: 0, total: 0 });
assert.equal(O.priceBreakdown(200, CONFIG).total, 230);
assert.equal(O.priceBreakdown(500, CONFIG).delivery, 0);
// steps
assert.equal(O.stepFor("kg"), 0.5); assert.equal(O.stepFor("bunch"), 1);
assert.equal(O.fmtQty(1.5), "1.5"); assert.equal(O.fmtQty(2), "2");
// lines
const lines = O.cartLines({ potato: 1.5, spinach: 2, ghost: 3, onion: -1, mint: 500 }, products);
assert.equal(lines.length, 2);
assert.equal(lines.find((l) => l.id === "potato").lineTotal, veg("potato").price * 1.5);
products.find((p) => p.id === "mint").available = false;
assert.equal(O.cartLines({ mint: 1 }, products).length, 0);
// phone / id
assert.equal(O.normalisePhone("+91 90143 46193"), "9014346193");
assert.ok(O.isValidMobile("9014346193")); assert.ok(!O.isValidMobile("1234567890")); assert.ok(!O.isValidMobile("90143"));
assert.match(O.makeOrderId(new Date(2026, 9, 20), () => 0.5), /^F2F-261020-\d{4}$/);
// message + link
lines.find((l) => l.id === "potato").qty = 5; lines.find((l) => l.id === "potato").lineTotal = veg("potato").price * 5;
const totals = O.priceBreakdown(lines.reduce((s, l) => s + l.lineTotal, 0), CONFIG);
const customer = { name: "Ravi", phone: "9014346193", address: "Flat 4B, Rose Apts, Road 3", area: CONFIG.deliveryAreas[0], slot: CONFIG.deliverySlots[0], payment: CONFIG.paymentOptions[0], notes: "", mapLink: "" };
const msg = O.buildMessage({ orderId: "F2F-261020-1234", lines, totals, customer });
assert.ok(msg.includes("1. ") && msg.includes("Total: Rs") && msg.includes("Ravi") && msg.includes("Hyderabad"));
const link = O.whatsappLink(CONFIG.whatsappNumber, msg);
assert.ok(link.startsWith("https://wa.me/919014346193?text="));
assert.equal(decodeURIComponent(link.split("text=")[1]), msg);
// validation
const base = { lines, totals, customer };
assert.equal(O.validateCheckout(base, CONFIG), "");
assert.match(O.validateCheckout({ ...base, customer: { ...customer, phone: "123" } }, CONFIG), /mobile/);
assert.match(O.validateCheckout({ ...base, customer: { ...customer, area: "" } }, CONFIG), /area/);
assert.match(O.validateCheckout({ lines: [], totals, customer }, CONFIG), /empty/);
assert.match(O.validateCheckout({ lines, totals: { ...totals, subtotal: 10 }, customer }, CONFIG), /Minimum/);

// Apps Script mock
const rows = [];
const prodRows = FALLBACK_PRODUCTS.map((s) => [s.id, true, true, s.category, s.name, s.te, s.hi, s.price, s.unit, ""]);
prodRows[0][2] = false; // first item sold out
const sheet = (name) => name === "Products"
  ? { getLastRow: () => prodRows.length + 1, getRange: () => ({ getValues: () => prodRows }) }
  : { getLastRow: () => rows.length + 1, getRange: () => ({ getValues: () => rows.map((r) => [r[1]]) }), appendRow: (r) => rows.push(r) };
const ctx = {
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: sheet }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ t, setMimeType() { return this; } }) },
  JSON, String, Number, Math, Date,
};
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8"), ctx);
const post = (o) => JSON.parse(vm.runInContext("doPost", ctx)({ postData: { contents: JSON.stringify(o) } }).t);
const get = JSON.parse(vm.runInContext("doGet", ctx)().t);
assert.equal(get.products.length, 30); assert.equal(get.products[0].available, false);
const ok = { orderId: "F2F-1", name: "=HYPERLINK(1)", phone: "9014346193", address: "x", area: "y", items: [{ id: "potato", qty: 1.5 }, { id: "fake", qty: 1 }, { id: FALLBACK_PRODUCTS[0].id, qty: 1 }] };
assert.equal(post(ok).ok, true); assert.equal(rows.length, 1);
assert.equal(rows[0][2][0], "'"); // formula neutralised
assert.equal(rows[0][9].split("\n").length, 1); // only valid potato line
assert.equal(post(ok).dup, true); assert.equal(rows.length, 1);
assert.equal(post({ ...ok, orderId: "F2", phone: "123" }).ok, false);
assert.equal(post({ ...ok, orderId: "F3", website: "spam" }).ok, true); assert.equal(rows.length, 1);
assert.equal(post({ ...ok, orderId: "F4", items: [{ id: "fake", qty: 1 }] }).ok, false);
console.log("all logic tests passed");
