/* ============ ELORA — product catalog ============ */
// EDIT: prices/names here — all placeholders

const PRODUCTS = [
  {
    id: "classic",
    name: "The Classic Kit",
    price: 299,
    mrp: 399,
    img: "assets/hero.png",
    badge: "Bestseller",
    tagline: "The original emergency pouch — 8 essentials in one chic zip pouch.",
    contents: [
      "Sanitary pads ×2",
      "Panty liners ×2",
      "Pocket tissues",
      "Wet wipes ×4",
      "Hair ties ×2",
      "Safety pins ×2",
      "Band-aids ×3"
    ]
  },
  {
    id: "lavender",
    name: "Lavender Dream Kit",
    price: 349,
    mrp: 449,
    img: "assets/pouch-lavender.png",
    badge: "New",
    tagline: "Same 8 essentials in a dreamy lavender pouch.",
    contents: [
      "Sanitary pads ×2",
      "Panty liners ×2",
      "Pocket tissues",
      "Wet wipes ×4",
      "Hair ties ×2",
      "Safety pins ×2",
      "Band-aids ×3"
    ]
  },
  {
    id: "travel",
    name: "Travel Ready Kit",
    price: 499,
    mrp: 649,
    img: "assets/pouch-sage.png",
    badge: null,
    tagline: "Double the essentials in a roomy sage pouch — for trips and long days.",
    contents: [
      "Sanitary pads ×4",
      "Panty liners ×4",
      "Pocket tissues ×2",
      "Wet wipes ×8",
      "Hair ties ×3",
      "Safety pins ×3",
      "Band-aids ×5"
    ]
  },
  {
    id: "refill",
    name: "Refill Pack",
    price: 149,
    mrp: 199,
    img: "assets/flatlay.png",
    badge: "Value",
    tagline: "Restock your pouch — all consumables, no new pouch.",
    contents: [
      "Sanitary pads ×2",
      "Panty liners ×2",
      "Pocket tissues",
      "Wet wipes ×4",
      "Hair ties ×2",
      "Safety pins ×2",
      "Band-aids ×3"
    ]
  }
];

function getProduct(id) {
  if (typeof PRODUCTS === "undefined") return null;
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return null;
}

function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
