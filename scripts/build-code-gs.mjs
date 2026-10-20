import { readFileSync, writeFileSync } from "node:fs";
import { FALLBACK_PRODUCTS } from "../lib/catalog.mjs";
const seed = FALLBACK_PRODUCTS.map(({ id, category, name, hi, te, price, unit }) => ({ id, category, name, hi, te, price, unit }));
const t = readFileSync(new URL("./Code.template.gs", import.meta.url), "utf8");
writeFileSync(new URL("../google-apps-script/Code.gs", import.meta.url), t.replace("/*SEED*/[]", JSON.stringify(seed, null, 1)));
console.log("seed items:", seed.length);
