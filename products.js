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
    tagline: "The original emergency pouch — 8 essentials in one chic blush zip pouch.",
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
    tagline: "The 8 essentials in a dreamy lavender pouch.",
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
    id: "rosegold",
    name: "Rose Gold Kit",
    price: 349,
    mrp: 449,
    img: "assets/pouch-rosegold.png",
    badge: "New",
    tagline: "The 8 essentials with a luxe rose-gold finish.",
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
    id: "mint",
    name: "Mint Travel Kit",
    price: 499,
    mrp: 649,
    img: "assets/pouch-mint.png",
    badge: null,
    tagline: "Double the essentials in a roomy mint pouch — made for trips and long days.",
    contents: [
      "Sanitary pads ×4 (double)",
      "Panty liners ×4 (double)",
      "Pocket tissues ×2",
      "Wet wipes ×8 (double)",
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
