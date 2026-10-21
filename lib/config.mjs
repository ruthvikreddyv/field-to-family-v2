// ============================================================
// THE ONLY FILE YOU EVER NEED TO EDIT IN CODE.
// (Prices and availability are edited in the Google Sheet, not here.)
// ============================================================

export const CONFIG = {
  businessName: "Field to Family",
  city: "Hyderabad",

  // Orders open WhatsApp chat with this number. Country code + number,
  // no "+", no spaces.
  whatsappNumber: "919014346193",

  // Paste the Web App URL from Google Apps Script here (see SETUP.md,
  // Step 3). Leave it as "" and the site still works - orders just go to
  // WhatsApp and nothing is logged in the Sheet, and the built-in
  // vegetable list is used.
  sheetUrl: "https://script.google.com/macros/s/AKfycbxYLv3zOGR0SKlQKgG_hwFbJQ6MsefRMNIHpjajSrlM0Z-rBKt8friFYSS9Ssaim4Y/exec",

  deliveryAreas: [
    "Hitech City", "Gachibowli", "Madhapur", "Kondapur", "Jubilee Hills",
    "Banjara Hills", "Kukatpally", "Miyapur", "Ameerpet", "Secunderabad",
    "LB Nagar", "Kompally", "Other (Hyderabad)",
  ],
  deliverySlots: ["6:00 – 9:00 AM", "5:00 – 8:00 PM"],
  paymentOptions: ["Cash on delivery", "UPI on delivery"],

  minOrder: 150,
  freeDeliveryAbove: 500,
  deliveryFee: 30,
};
