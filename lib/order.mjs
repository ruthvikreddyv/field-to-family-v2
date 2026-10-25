// Pure order logic (no React, no browser APIs) so it can be tested alone.
import { lookupPin } from "./pincodes.mjs";

export function priceBreakdown(subtotal, config) {
  const delivery =
    subtotal === 0 || subtotal >= config.freeDeliveryAbove ? 0 : config.deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
}

// kg items can be ordered in half-kilos; everything else in whole units.
export function stepFor(unit) {
  return String(unit).toLowerCase() === "kg" ? 0.5 : 1;
}

export function fmtQty(q) {
  return Number.isInteger(q) ? String(q) : q.toFixed(1);
}

export function cartLines(cart, products) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = [];
  for (const [id, qty] of Object.entries(cart || {})) {
    const p = byId.get(id);
    const step = p ? stepFor(p.unit) : 1;
    const q = Math.round(Number(qty) / step) * step;
    if (!p || !p.available || !(q > 0) || q > 99) continue;
    lines.push({
      id, name: p.name, hi: p.hi, te: p.te, unit: p.unit, price: p.price, qty: q,
      lineTotal: Math.round(p.price * q * 100) / 100,
    });
  }
  return lines;
}

export function makeOrderId(now = new Date(), rand = Math.random) {
  const p = (n) => String(n).padStart(2, "0");
  const stamp = String(now.getFullYear()).slice(2) + p(now.getMonth() + 1) + p(now.getDate());
  return "F2F-" + stamp + "-" + Math.floor(1000 + rand() * 9000);
}

export function normalisePhone(input) {
  return String(input || "").replace(/\D/g, "").slice(-10);
}

export function isValidMobile(input) {
  return /^[6-9]\d{9}$/.test(normalisePhone(input));
}

export function buildMessage({ orderId, lines, totals, customer }) {
  const items = lines
    .map((l, i) => `${i + 1}. ${l.name} (${l.te} / ${l.hi}) - ${fmtQty(l.qty)} ${l.unit} x Rs ${l.price} = Rs ${l.lineTotal}`)
    .join("\n");
  const parts = [
    `*Field to Family order ${orderId}*`,
    "",
    items,
    "",
    `Subtotal: Rs ${totals.subtotal}`,
    `Delivery: ${totals.delivery === 0 ? "Free" : "Rs " + totals.delivery}`,
    `*Total: Rs ${totals.total}*`,
    "",
    `Name: ${customer.name}`,
    `Phone: ${normalisePhone(customer.phone)}`,
    `Address: ${customer.address}, ${customer.area}, Hyderabad - ${customer.pincode}`,
  ];
  if (customer.landmark) parts.push(`Landmark: ${customer.landmark}`);
  if (customer.mapLink) parts.push(`Location: ${customer.mapLink}`);
  parts.push(`Delivery slot: ${customer.slot}`, `Payment: ${customer.payment}`);
  if (customer.notes) parts.push(`Notes: ${customer.notes}`);
  return parts.join("\n");
}

export function whatsappLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function validateCheckout({ lines, totals, customer }, config) {
  if (!lines.length) return "Your basket is empty.";
  if (totals.subtotal < config.minOrder)
    return `Minimum order is Rs ${config.minOrder}. Add Rs ${config.minOrder - totals.subtotal} more.`;
  if (!customer.name.trim()) return "Please enter your name.";
  if (!isValidMobile(customer.phone)) return "Please enter a valid 10-digit mobile number.";
  if (!customer.address.trim()) return "Please enter your flat / house number and street.";
  const pin = lookupPin(customer.pincode);
  if (!pin.ok) return pin.message;
  if (!String(customer.area || "").trim()) return "Please enter your area / locality.";
  return "";
}
