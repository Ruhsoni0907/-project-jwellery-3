// ===== Product Data =====
const PRODUCTS = [
  // RINGS
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    category: "rings",
    price: 1299.99,
    originalPrice: 1599.99,
    metal: "gold",
    gemstone: "diamond",
    description: "A stunning 1 carat diamond set in 18k gold. This timeless piece features a brilliant cut diamond that captures light beautifully, making it perfect for engagements or special occasions.",
    images: ["https://picsum.photos/seed/ring1/600/600", "https://picsum.photos/seed/ring1b/600/600"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 15,
    featured: true,
    rating: 4.8,
    reviews: 124,
    createdAt: "2026-01-15"
  },
  {
    id: 2,
    name: "Rose Gold Infinity Band",
    category: "rings",
    price: 449.99,
    originalPrice: null,
    metal: "rosegold",
    gemstone: "none",
    description: "An elegant infinity symbol band crafted in rose gold. The intertwined design symbolizes eternal love, making it a meaningful gift for anniversaries or weddings.",
    images: ["https://picsum.photos/seed/ring2/600/600", "https://picsum.photos/seed/ring2b/600/600"],
    sizes: ["5", "6", "7", "8"],
    stock: 28,
    featured: true,
    rating: 4.6,
    reviews: 89,
    createdAt: "2026-01-20"
  },
  {
    id: 3,
    name: "Silver Sapphire Halo Ring",
    category: "rings",
    price: 699.99,
    originalPrice: 849.99,
    metal: "silver",
    gemstone: "sapphire",
    description: "A mesmerizing blue sapphire surrounded by a halo of diamonds, set in sterling silver. The deep blue color creates a stunning contrast against the silver setting.",
    images: ["https://picsum.photos/seed/ring3/600/600", "https://picsum.photos/seed/ring3b/600/600"],
    sizes: ["6", "7", "8", "9"],
    stock: 12,
    featured: false,
    rating: 4.7,
    reviews: 67,
    createdAt: "2026-02-01"
  },
  {
    id: 4,
    name: "Gold Emerald Cocktail Ring",
    category: "rings",
    price: 899.99,
    originalPrice: null,
    metal: "gold",
    gemstone: "emerald",
    description: "A bold emerald cocktail ring set in 14k gold. The vibrant green emerald is perfect for making a statement at any special event.",
    images: ["https://picsum.photos/seed/ring4/600/600", "https://picsum.photos/seed/ring4b/600/600"],
    sizes: ["5", "6", "7", "8"],
    stock: 8,
    featured: false,
    rating: 4.5,
    reviews: 42,
    createdAt: "2026-02-10"
  },
  {
    id: 5,
    name: "Diamond Eternity Band",
    category: "rings",
    price: 1899.99,
    originalPrice: 2199.99,
    metal: "gold",
    gemstone: "diamond",
    description: "A continuous circle of brilliant diamonds set in 18k gold. This eternity band symbolizes never-ending love and commitment.",
    images: ["https://picsum.photos/seed/ring5/600/600", "https://picsum.photos/seed/ring5b/600/600"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 10,
    featured: true,
    rating: 4.9,
    reviews: 156,
    createdAt: "2026-01-25"
  },

  // NECKLACES
  {
    id: 6,
    name: "Pearl Strand Necklace",
    category: "necklaces",
    price: 599.99,
    originalPrice: null,
    metal: "gold",
    gemstone: "pearl",
    description: "A classic strand of freshwater pearls with a gold clasp. This timeless necklace adds elegance to any outfit, from casual to formal.",
    images: ["https://picsum.photos/seed/neck1/600/600", "https://picsum.photos/seed/neck1b/600/600"],
    sizes: ["16 inch", "18 inch", "20 inch"],
    stock: 20,
    featured: true,
    rating: 4.7,
    reviews: 98,
    createdAt: "2026-01-18"
  },
  {
    id: 7,
    name: "Diamond Pendant Necklace",
    category: "necklaces",
    price: 1199.99,
    originalPrice: 1499.99,
    metal: "gold",
    gemstone: "diamond",
    description: "A delicate diamond pendant hanging from a fine gold chain. The 0.75 carat diamond catches the light beautifully with every movement.",
    images: ["https://picsum.photos/seed/neck2/600/600", "https://picsum.photos/seed/neck2b/600/600"],
    sizes: ["16 inch", "18 inch"],
    stock: 18,
    featured: true,
    rating: 4.8,
    reviews: 134,
    createdAt: "2026-01-22"
  },
  {
    id: 8,
    name: "Silver Chain Choker",
    category: "necklaces",
    price: 179.99,
    originalPrice: null,
    metal: "silver",
    gemstone: "none",
    description: "A sleek sterling silver chain choker with a modern design. Perfect for layering or wearing solo for a minimalist look.",
    images: ["https://picsum.photos/seed/neck3/600/600", "https://picsum.photos/seed/neck3b/600/600"],
    sizes: ["14 inch", "16 inch"],
    stock: 35,
    featured: false,
    rating: 4.4,
    reviews: 76,
    createdAt: "2026-02-05"
  },
  {
    id: 9,
    name: "Rose Gold Locket",
    category: "necklaces",
    price: 349.99,
    originalPrice: null,
    metal: "rosegold",
    gemstone: "none",
    description: "A beautiful rose gold locket that opens to hold two photos. The exterior features delicate engraving for a vintage feel.",
    images: ["https://picsum.photos/seed/neck4/600/600", "https://picsum.photos/seed/neck4b/600/600"],
    sizes: ["18 inch", "20 inch"],
    stock: 22,
    featured: false,
    rating: 4.6,
    reviews: 58,
    createdAt: "2026-02-12"
  },
  {
    id: 10,
    name: "Sapphire Tennis Necklace",
    category: "necklaces",
    price: 2499.99,
    originalPrice: 2999.99,
    metal: "gold",
    gemstone: "sapphire",
    description: "A luxurious tennis necklace featuring alternating sapphires and diamonds set in 18k gold. A true statement piece for special occasions.",
    images: ["https://picsum.photos/seed/neck5/600/600", "https://picsum.photos/seed/neck5b/600/600"],
    sizes: ["16 inch", "18 inch"],
    stock: 5,
    featured: true,
    rating: 4.9,
    reviews: 45,
    createdAt: "2026-01-30"
  },

  // EARRINGS
  {
    id: 11,
    name: "Diamond Stud Earrings",
    category: "earrings",
    price: 799.99,
    originalPrice: null,
    metal: "gold",
    gemstone: "diamond",
    description: "Classic diamond stud earrings featuring 0.5 carat diamonds each, set in 18k gold. A timeless addition to any jewelry collection.",
    images: ["https://picsum.photos/seed/ear1/600/600", "https://picsum.photos/seed/ear1b/600/600"],
    sizes: ["One Size"],
    stock: 25,
    featured: true,
    rating: 4.8,
    reviews: 167,
    createdAt: "2026-01-16"
  },
  {
    id: 12,
    name: "Pearl Drop Earrings",
    category: "earrings",
    price: 299.99,
    originalPrice: 399.99,
    metal: "gold",
    gemstone: "pearl",
    description: "Elegant pearl drop earrings with a gold setting. The lustrous pearls add a touch of sophistication to any ensemble.",
    images: ["https://picsum.photos/seed/ear2/600/600", "https://picsum.photos/seed/ear2b/600/600"],
    sizes: ["One Size"],
    stock: 30,
    featured: false,
    rating: 4.5,
    reviews: 82,
    createdAt: "2026-02-03"
  },
  {
    id: 13,
    name: "Silver Hoop Earrings",
    category: "earrings",
    price: 149.99,
    originalPrice: null,
    metal: "silver",
    gemstone: "none",
    description: "Sterling silver hoop earrings with a polished finish. These versatile hoops are perfect for everyday wear.",
    images: ["https://picsum.photos/seed/ear3/600/600", "https://picsum.photos/seed/ear3b/600/600"],
    sizes: ["Small", "Medium", "Large"],
    stock: 45,
    featured: false,
    rating: 4.3,
    reviews: 112,
    createdAt: "2026-02-08"
  },
  {
    id: 14,
    name: "Rose Gold Chandelier Earrings",
    category: "earrings",
    price: 459.99,
    originalPrice: null,
    metal: "rosegold",
    gemstone: "amethyst",
    description: "Stunning chandelier earrings in rose gold with dangling amethyst stones. Perfect for formal events and evening wear.",
    images: ["https://picsum.photos/seed/ear4/600/600", "https://picsum.photos/seed/ear4b/600/600"],
    sizes: ["One Size"],
    stock: 15,
    featured: true,
    rating: 4.7,
    reviews: 64,
    createdAt: "2026-01-28"
  },
  {
    id: 15,
    name: "Diamond Halo Earrings",
    category: "earrings",
    price: 1399.99,
    originalPrice: 1699.99,
    metal: "gold",
    gemstone: "diamond",
    description: "Exquisite halo earrings featuring a central diamond surrounded by a circle of smaller diamonds, set in 18k gold.",
    images: ["https://picsum.photos/seed/ear5/600/600", "https://picsum.photos/seed/ear5b/600/600"],
    sizes: ["One Size"],
    stock: 10,
    featured: true,
    rating: 4.9,
    reviews: 89,
    createdAt: "2026-01-20"
  },

  // BRACELETS
  {
    id: 16,
    name: "Gold Chain Bracelet",
    category: "bracelets",
    price: 399.99,
    originalPrice: null,
    metal: "gold",
    gemstone: "none",
    description: "A classic gold chain bracelet with a lobster clasp. This versatile piece can be worn alone or stacked with other bracelets.",
    images: ["https://picsum.photos/seed/brace1/600/600", "https://picsum.photos/seed/brace1b/600/600"],
    sizes: ["7 inch", "8 inch"],
    stock: 32,
    featured: false,
    rating: 4.5,
    reviews: 73,
    createdAt: "2026-02-02"
  },
  {
    id: 17,
    name: "Tennis Bracelet",
    category: "bracelets",
    price: 1599.99,
    originalPrice: 1899.99,
    metal: "gold",
    gemstone: "diamond",
    description: "A stunning tennis bracelet featuring a continuous line of brilliant diamonds set in 18k gold. A timeless piece for any occasion.",
    images: ["https://picsum.photos/seed/brace2/600/600", "https://picsum.photos/seed/brace2b/600/600"],
    sizes: ["7 inch", "7.5 inch", "8 inch"],
    stock: 12,
    featured: true,
    rating: 4.9,
    reviews: 108,
    createdAt: "2026-01-19"
  },
  {
    id: 18,
    name: "Silver Charm Bracelet",
    category: "bracelets",
    price: 229.99,
    originalPrice: null,
    metal: "silver",
    gemstone: "none",
    description: "A sterling silver charm bracelet with three initial charms. Add more charms to personalize your bracelet over time.",
    images: ["https://picsum.photos/seed/brace3/600/600", "https://picsum.photos/seed/brace3b/600/600"],
    sizes: ["7 inch", "8 inch"],
    stock: 28,
    featured: false,
    rating: 4.4,
    reviews: 91,
    createdAt: "2026-02-07"
  },
  {
    id: 19,
    name: "Rose Gold Bangle Set",
    category: "bracelets",
    price: 349.99,
    originalPrice: 449.99,
    metal: "rosegold",
    gemstone: "none",
    description: "A set of three rose gold bangles with different textures - smooth, hammered, and twisted. Wear together or separately.",
    images: ["https://picsum.photos/seed/brace4/600/600", "https://picsum.photos/seed/brace4b/600/600"],
    sizes: ["Small", "Medium", "Large"],
    stock: 20,
    featured: false,
    rating: 4.6,
    reviews: 67,
    createdAt: "2026-02-14"
  },
  {
    id: 20,
    name: "Diamond Cuff Bracelet",
    category: "bracelets",
    price: 2199.99,
    originalPrice: 2599.99,
    metal: "gold",
    gemstone: "diamond",
    description: "A bold diamond cuff bracelet featuring pave-set diamonds across the entire surface, crafted in 18k gold. A true statement piece.",
    images: ["https://picsum.photos/seed/brace5/600/600", "https://picsum.photos/seed/brace5b/600/600"],
    sizes: ["One Size"],
    stock: 7,
    featured: true,
    rating: 4.8,
    reviews: 52,
    createdAt: "2026-01-27"
  }
];

// ===== Helper Functions =====
function getProducts() {
  const stored = localStorage.getItem('products');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('products', JSON.stringify(PRODUCTS));
  return PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(category) {
  const products = getProducts();
  return products.filter(p => p.category === category);
}

function getFeaturedProducts() {
  const products = getProducts();
  return products.filter(p => p.featured);
}

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function getDiscountPercent(original, current) {
  if (!original) return 0;
  return Math.round(((original - current) / original) * 100);
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star filled">&#9733;</span>';
  }
  if (hasHalf) {
    stars += '<span class="star filled">&#9733;</span>';
  }
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star">&#9733;</span>';
  }
  return stars;
}

function getProductImage(product) {
  return product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://picsum.photos/seed/placeholder/600/600';
}
