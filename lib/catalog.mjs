// Built-in vegetable list. Used (a) while the live list loads and (b) if
// the Google Sheet isn't connected / is unreachable. Once the Sheet is
// connected, the Sheet is the source of truth and this is just a fallback.
// Fields: id, category, name, hi (Hindi), te (Telugu), price (Rs), unit.

export const FALLBACK_PRODUCTS = [
  // Leafy greens
  { id: "spinach", category: "Leafy greens", name: "Spinach", hi: "पालक", te: "పాలకూర", price: 30, unit: "bunch" },
  { id: "fenugreek", category: "Leafy greens", name: "Fenugreek leaves", hi: "मेथी", te: "మెంతికూర", price: 25, unit: "bunch" },
  { id: "amaranth", category: "Leafy greens", name: "Amaranth greens", hi: "चौलाई", te: "తోటకూర", price: 25, unit: "bunch" },
  { id: "coriander", category: "Leafy greens", name: "Coriander", hi: "धनिया", te: "కొత్తిమీర", price: 15, unit: "bunch" },
  { id: "mint", category: "Leafy greens", name: "Mint", hi: "पुदीना", te: "పుదీనా", price: 15, unit: "bunch" },
  { id: "mustard", category: "Leafy greens", name: "Mustard greens", hi: "सरसों", te: "ఆవిసె కూర", price: 30, unit: "bunch" },
  // Roots & tubers
  { id: "potato", category: "Roots & tubers", name: "Potato", hi: "आलू", te: "బంగాళాదుంప", price: 35, unit: "kg" },
  { id: "onion", category: "Roots & tubers", name: "Onion", hi: "प्याज़", te: "ఉల్లిపాయ", price: 40, unit: "kg" },
  { id: "carrot", category: "Roots & tubers", name: "Carrot", hi: "गाजर", te: "క్యారెట్", price: 45, unit: "kg" },
  { id: "beetroot", category: "Roots & tubers", name: "Beetroot", hi: "चुकंदर", te: "బీట్‌రూట్", price: 40, unit: "kg" },
  { id: "radish", category: "Roots & tubers", name: "Radish", hi: "मूली", te: "ముల్లంగి", price: 30, unit: "kg" },
  { id: "sweetpotato", category: "Roots & tubers", name: "Sweet potato", hi: "शकरकंद", te: "చిలగడదుంప", price: 50, unit: "kg" },
  { id: "ginger", category: "Roots & tubers", name: "Ginger", hi: "अदरक", te: "అల్లం", price: 90, unit: "250g" },
  { id: "garlic", category: "Roots & tubers", name: "Garlic", hi: "लहसुन", te: "వెల్లుల్లి", price: 140, unit: "250g" },
  // Gourds & squashes
  { id: "bottlegourd", category: "Gourds & squashes", name: "Bottle gourd", hi: "लौकी", te: "సొరకాయ", price: 35, unit: "piece" },
  { id: "ridgegourd", category: "Gourds & squashes", name: "Ridge gourd", hi: "तोरई", te: "బీరకాయ", price: 40, unit: "kg" },
  { id: "bittergourd", category: "Gourds & squashes", name: "Bitter gourd", hi: "करेला", te: "కాకరకాయ", price: 45, unit: "kg" },
  { id: "pumpkin", category: "Gourds & squashes", name: "Pumpkin", hi: "कद्दू", te: "గుమ్మడికాయ", price: 35, unit: "kg" },
  { id: "cucumber", category: "Gourds & squashes", name: "Cucumber", hi: "खीरा", te: "దోసకాయ", price: 30, unit: "kg" },
  { id: "snakegourd", category: "Gourds & squashes", name: "Snake gourd", hi: "चिचिंडा", te: "పొట్లకాయ", price: 40, unit: "kg" },
  // Everyday vegetables
  { id: "tomato", category: "Everyday vegetables", name: "Tomato", hi: "टमाटर", te: "టమాటా", price: 40, unit: "kg" },
  { id: "brinjal", category: "Everyday vegetables", name: "Brinjal", hi: "बैंगन", te: "వంకాయ", price: 35, unit: "kg" },
  { id: "cauliflower", category: "Everyday vegetables", name: "Cauliflower", hi: "फूल गोभी", te: "కాలీఫ్లవర్", price: 40, unit: "piece" },
  { id: "cabbage", category: "Everyday vegetables", name: "Cabbage", hi: "पत्ता गोभी", te: "క్యాబేజీ", price: 30, unit: "piece" },
  { id: "beans", category: "Everyday vegetables", name: "Green beans", hi: "फंसी", te: "చిక్కుడుకాయ", price: 50, unit: "kg" },
  { id: "capsicum", category: "Everyday vegetables", name: "Capsicum", hi: "शिमला मिर्च", te: "క్యాప్సికం", price: 60, unit: "kg" },
  { id: "peas", category: "Everyday vegetables", name: "Green peas", hi: "मटर", te: "బటానీ", price: 70, unit: "kg" },
  { id: "okra", category: "Everyday vegetables", name: "Okra", hi: "भिंडी", te: "బెండకాయ", price: 45, unit: "kg" },
  { id: "chilli", category: "Everyday vegetables", name: "Green chilli", hi: "हरी मिर्च", te: "పచ్చిమిర్చి", price: 40, unit: "250g" },
  { id: "drumstick", category: "Everyday vegetables", name: "Drumstick", hi: "सहजन", te: "మునగకాయ", price: 50, unit: "bunch" },
].map((p) => ({ ...p, available: true, image: "" }));
