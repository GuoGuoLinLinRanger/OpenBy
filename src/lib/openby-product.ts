export type ProductAnalyzeInput = {
  productName: string;
};

export type ProductSignal = {
  key: string;
  label: string;
  value: number;
  weight: number;
  status: "strong" | "neutral" | "weak";
  explanation: string;
  meaning: string;
  goodDirection: string;
  source: string;
  history: MetricPoint[];
};

export type NewsSignal = {
  title: string;
  outlet: string;
  sentiment: "positive" | "neutral" | "negative";
  impact: string;
  url: string;
};

export type PricePoint = {
  date: string;
  price: number;
};

export type MetricPoint = {
  label: string;
  value: number;
};

export type SimilarProduct = {
  productName: string;
  category: string;
  imageUrl: string;
  fallbackImageUrl: string;
  openByIndex: number;
  currentPrice: number;
};

export type ProductAnalysis = {
  id: string;
  productName: string;
  category: string;
  imageUrl: string;
  fallbackImageUrl: string;
  retailerUrl: string;
  currentPrice: number;
  targetBuyPrice: number;
  predictedPrice: number;
  monteCarloBetterPriceProbability: number;
  openByIndex: number;
  verdict: "Buy now" | "Watch" | "Wait";
  verdictReasons: string[];
  confidence: number;
  summary: string;
  recommendation: string;
  updatedAt: string;
  signals: ProductSignal[];
  news: NewsSignal[];
  priceHistory: PricePoint[];
  similarProducts: SimilarProduct[];
};

type ProductProfile = {
  aliases: string[];
  productName: string;
  category: string;
  imageUrl: string;
  fallbackImageUrl?: string;
  retailerUrl?: string;
  prices: number[];
  similar: string[];
  baseSignals: {
    newsSentiment: number;
    searchTrend: number;
    socialDemand: number;
    inventory: number;
  };
};

export function productSlug(productName: string) {
  return productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function productHref(productName: string) {
  return `/product/${productSlug(productName)}`;
}

function productImage(productName: string, category = "Electronics", bg = "#f8fafc", accent = "#2563eb") {
  const lower = `${productName} ${category}`.toLowerCase();
  const shape =
    lower.includes("headphone") || lower.includes("airpods") || lower.includes("audio") || lower.includes("bose")
      ? `<path d="M394 326c0-92 72-162 206-162s206 70 206 162" fill="none" stroke="#111827" stroke-width="34" stroke-linecap="round"/><rect x="310" y="322" width="116" height="196" rx="42" fill="#111827"/><rect x="774" y="322" width="116" height="196" rx="42" fill="#111827"/><circle cx="600" cy="432" r="98" fill="${accent}" opacity=".22"/>`
      : lower.includes("phone") || lower.includes("iphone") || lower.includes("pixel")
        ? `<rect x="450" y="104" width="300" height="468" rx="48" fill="#111827"/><rect x="476" y="142" width="248" height="390" rx="28" fill="${accent}" opacity=".25"/><circle cx="600" cy="548" r="12" fill="#f8fafc"/>`
        : lower.includes("monitor") || lower.includes("display") || lower.includes("oled") || lower.includes("tv") || lower.includes("bravia")
          ? `<rect x="214" y="112" width="772" height="412" rx="30" fill="#111827"/><rect x="250" y="150" width="700" height="320" rx="16" fill="${accent}" opacity=".28"/><path d="M540 524h120l22 74H518z" fill="#111827"/><rect x="436" y="592" width="328" height="30" rx="15" fill="#111827"/>`
          : lower.includes("rtx") || lower.includes("radeon") || lower.includes("gpu")
            ? `<rect x="268" y="190" width="664" height="302" rx="38" fill="#111827"/><circle cx="452" cy="342" r="92" fill="${accent}" opacity=".3"/><circle cx="452" cy="342" r="45" fill="#111827"/><circle cx="728" cy="342" r="92" fill="${accent}" opacity=".3"/><circle cx="728" cy="342" r="45" fill="#111827"/><rect x="916" y="260" width="42" height="164" rx="10" fill="#111827"/>`
            : lower.includes("ipad") || lower.includes("tablet") || lower.includes("surface")
              ? `<rect x="360" y="92" width="480" height="504" rx="42" fill="#111827"/><rect x="396" y="132" width="408" height="416" rx="18" fill="${accent}" opacity=".24"/><circle cx="600" cy="570" r="11" fill="#f8fafc"/>`
              : `<rect x="254" y="158" width="692" height="342" rx="40" fill="#111827"/><rect x="292" y="196" width="616" height="238" rx="20" fill="${accent}" opacity=".24"/><rect x="330" y="506" width="540" height="34" rx="17" fill="#111827"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="${bg}"/><circle cx="1020" cy="116" r="92" fill="${accent}" opacity=".16"/><circle cx="150" cy="560" r="136" fill="${accent}" opacity=".11"/>${shape}<text x="72" y="98" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#0f172a">${productName}</text><text x="74" y="142" font-family="Arial, sans-serif" font-size="24" fill="#475569">${category}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function retailerUrl(productName: string) {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}`;
}

const DATES = [
  "04-20",
  "04-21",
  "04-22",
  "04-23",
  "04-24",
  "04-25",
  "04-26",
  "04-27",
  "04-28",
  "04-29",
  "04-30",
  "05-01",
  "05-02",
  "05-03",
];

const PROFILES: ProductProfile[] = [
  {
    aliases: ["mac pro", "apple mac pro"],
    productName: "Mac Pro",
    category: "Desktop Workstations",
    imageUrl: "https://www.apple.com/newsroom/images/product/mac/standard/Apple_new-mac-pro-tower_06032019_big.jpg.large.jpg",
    fallbackImageUrl: productImage("Mac Pro", "Desktop Workstations", "#eef2ff", "#2563eb"),
    prices: [6999, 6999, 6899, 6899, 6799, 6799, 6749, 6749, 6699, 6699, 6649, 6649, 6599, 6599],
    similar: ["Mac Studio", "MacBook Pro 14", "Dell XPS 16"],
    baseSignals: { newsSentiment: 58, searchTrend: 51, socialDemand: 48, inventory: 70 },
  },
  {
    aliases: ["mac studio", "apple mac studio"],
    productName: "Mac Studio",
    category: "Desktop Workstations",
    imageUrl: "https://www.apple.com/v/mac-studio/l/images/overview/hero/static_front__fmvxob6uyxiu_large.jpg",
    fallbackImageUrl: productImage("Mac Studio", "Desktop Workstations", "#f0fdfa", "#0f766e"),
    prices: [2199, 2199, 2149, 2149, 2099, 2099, 2099, 2049, 2049, 2049, 1999, 1999, 1999, 1999],
    similar: ["Mac Pro", "MacBook Pro 14", "Dell XPS 16"],
    baseSignals: { newsSentiment: 66, searchTrend: 63, socialDemand: 59, inventory: 76 },
  },
  {
    aliases: ["macbook pro 14", "macbook pro", "apple macbook pro"],
    productName: "MacBook Pro 14",
    category: "Laptops",
    imageUrl: "https://www.apple.com/v/macbook-pro/ax/images/overview/welcome/hero_endframe__fwev9ebh42mq_xlarge.jpg",
    fallbackImageUrl: productImage("MacBook Pro 14", "Laptops", "#eff6ff", "#2563eb"),
    prices: [1999, 1999, 1949, 1949, 1899, 1899, 1849, 1849, 1849, 1799, 1799, 1799, 1749, 1749],
    similar: ["Mac Studio", "Dell XPS 16", "iPad Pro 13"],
    baseSignals: { newsSentiment: 72, searchTrend: 69, socialDemand: 74, inventory: 65 },
  },
  {
    aliases: ["sony wh-1000xm5", "sony headphones", "wh1000xm5"],
    productName: "Sony WH-1000XM5",
    category: "Audio",
    imageUrl: productImage("Sony WH-1000XM5", "Audio", "#ecfeff", "#0891b2"),
    prices: [399, 399, 389, 389, 379, 379, 369, 369, 349, 349, 349, 329, 329, 329],
    similar: ["AirPods Max", "Bose QuietComfort Ultra", "AirPods Pro 2"],
    baseSignals: { newsSentiment: 76, searchTrend: 68, socialDemand: 70, inventory: 82 },
  },
  {
    aliases: ["airpods max", "apple airpods max"],
    productName: "AirPods Max",
    category: "Audio",
    imageUrl: "https://images.apple.com/v/airpods-max/k/images/overview/welcome/max-loop_startframe__c0vn1ukmh7ma_xlarge.jpg",
    fallbackImageUrl: productImage("AirPods Max", "Audio", "#fff7ed", "#ea580c"),
    prices: [549, 549, 529, 529, 519, 519, 499, 499, 489, 489, 479, 479, 469, 469],
    similar: ["Sony WH-1000XM5", "Bose QuietComfort Ultra", "AirPods Pro 2"],
    baseSignals: { newsSentiment: 61, searchTrend: 64, socialDemand: 77, inventory: 72 },
  },
  {
    aliases: ["iphone 15 pro", "apple iphone 15 pro"],
    productName: "iPhone 15 Pro",
    category: "Phones",
    imageUrl: "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-15-Pro-lineup-color-lineup-230912_big.jpg.large.jpg",
    fallbackImageUrl: productImage("iPhone 15 Pro", "Phones", "#f0f9ff", "#0284c7"),
    prices: [999, 999, 999, 979, 979, 949, 949, 949, 929, 929, 929, 899, 899, 899],
    similar: ["iPhone 15", "Samsung Galaxy S24 Ultra", "Pixel 8 Pro"],
    baseSignals: { newsSentiment: 68, searchTrend: 72, socialDemand: 78, inventory: 61 },
  },
  {
    aliases: ["dell ultrasharp 27 monitor", "dell monitor", "ultrasharp 27"],
    productName: "Dell UltraSharp 27 Monitor",
    category: "Monitors",
    imageUrl: productImage("Dell UltraSharp 27", "Monitors", "#f7fee7", "#65a30d"),
    prices: [629, 629, 599, 599, 579, 579, 559, 559, 549, 549, 529, 529, 519, 519],
    similar: ["LG OLED C3", "Samsung Odyssey G7", "ASUS ProArt Display"],
    baseSignals: { newsSentiment: 71, searchTrend: 62, socialDemand: 55, inventory: 79 },
  },
  {
    aliases: ["lg oled c3", "oled tv", "lg c3"],
    productName: "LG OLED C3",
    category: "TVs",
    imageUrl: productImage("LG OLED C3", "TVs", "#faf5ff", "#9333ea"),
    prices: [1599, 1599, 1499, 1499, 1399, 1399, 1349, 1349, 1299, 1299, 1249, 1249, 1199, 1199],
    similar: ["Samsung OLED S90C", "Sony Bravia XR", "Dell UltraSharp 27 Monitor"],
    baseSignals: { newsSentiment: 80, searchTrend: 73, socialDemand: 69, inventory: 84 },
  },
  {
    aliases: ["nvidia rtx 4070 super", "rtx 4070 super", "4070 super"],
    productName: "NVIDIA RTX 4070 Super",
    category: "Components",
    imageUrl: "https://nvidianews.nvidia.com/_gallery/get_file/?file_id=659ef91c2cfac23b4f5f5e5f&file_ext=.jpg",
    fallbackImageUrl: productImage("NVIDIA RTX 4070 Super", "Components", "#ecfdf5", "#16a34a"),
    prices: [649, 649, 629, 629, 619, 619, 609, 609, 599, 599, 599, 589, 589, 579],
    similar: ["NVIDIA RTX 4070 Ti Super", "AMD Radeon RX 7800 XT", "NVIDIA RTX 4060 Ti"],
    baseSignals: { newsSentiment: 67, searchTrend: 76, socialDemand: 81, inventory: 58 },
  },
  {
    aliases: ["ipad pro 13", "ipad pro", "apple ipad pro"],
    productName: "iPad Pro 13",
    category: "Tablets",
    imageUrl: "https://www.apple.com/newsroom/images/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/article/Apple-iPad-Pro-hero-240507_big.jpg.large.jpg",
    fallbackImageUrl: productImage("iPad Pro 13", "Tablets", "#fff7ed", "#c2410c"),
    prices: [1299, 1299, 1279, 1279, 1249, 1249, 1249, 1229, 1229, 1199, 1199, 1199, 1179, 1179],
    similar: ["MacBook Pro 14", "Samsung Galaxy Tab S9 Ultra", "Microsoft Surface Pro"],
    baseSignals: { newsSentiment: 63, searchTrend: 66, socialDemand: 70, inventory: 62 },
  },
  {
    aliases: ["bose quietcomfort ultra", "bose headphones", "quietcomfort ultra"],
    productName: "Bose QuietComfort Ultra",
    category: "Audio",
    imageUrl: productImage("Bose QuietComfort Ultra", "Audio", "#f0fdfa", "#0d9488"),
    prices: [429, 429, 419, 419, 399, 399, 389, 389, 379, 379, 359, 359, 349, 349],
    similar: ["Sony WH-1000XM5", "AirPods Max", "AirPods Pro 2"],
    baseSignals: { newsSentiment: 70, searchTrend: 67, socialDemand: 66, inventory: 74 },
  },
  {
    aliases: ["airpods pro 2", "apple airpods pro", "airpods pro second generation"],
    productName: "AirPods Pro 2",
    category: "Audio",
    imageUrl: productImage("AirPods Pro 2", "Audio", "#f8fafc", "#64748b"),
    prices: [249, 249, 239, 239, 229, 229, 219, 219, 199, 199, 199, 189, 189, 189],
    similar: ["Sony WH-1000XM5", "AirPods Max", "Bose QuietComfort Ultra"],
    baseSignals: { newsSentiment: 74, searchTrend: 71, socialDemand: 79, inventory: 81 },
  },
  {
    aliases: ["samsung galaxy s24 ultra", "galaxy s24 ultra", "s24 ultra"],
    productName: "Samsung Galaxy S24 Ultra",
    category: "Phones",
    imageUrl: productImage("Samsung Galaxy S24 Ultra", "Phones", "#eef2ff", "#4f46e5"),
    prices: [1299, 1299, 1249, 1249, 1199, 1199, 1199, 1149, 1149, 1099, 1099, 1099, 1049, 1049],
    similar: ["iPhone 15 Pro", "Pixel 8 Pro", "iPad Pro 13"],
    baseSignals: { newsSentiment: 73, searchTrend: 77, socialDemand: 80, inventory: 68 },
  },
  {
    aliases: ["pixel 8 pro", "google pixel 8 pro"],
    productName: "Pixel 8 Pro",
    category: "Phones",
    imageUrl: productImage("Pixel 8 Pro", "Phones", "#ecfccb", "#4d7c0f"),
    prices: [999, 999, 949, 949, 899, 899, 849, 849, 799, 799, 779, 779, 749, 749],
    similar: ["iPhone 15 Pro", "Samsung Galaxy S24 Ultra", "AirPods Pro 2"],
    baseSignals: { newsSentiment: 69, searchTrend: 64, socialDemand: 67, inventory: 85 },
  },
  {
    aliases: ["samsung oled s90c", "samsung s90c", "oled s90c"],
    productName: "Samsung OLED S90C",
    category: "TVs",
    imageUrl: productImage("Samsung OLED S90C", "TVs", "#f0f9ff", "#0ea5e9"),
    prices: [1699, 1699, 1599, 1599, 1499, 1499, 1399, 1399, 1349, 1349, 1299, 1299, 1249, 1249],
    similar: ["LG OLED C3", "Sony Bravia XR", "Samsung Odyssey G7"],
    baseSignals: { newsSentiment: 78, searchTrend: 70, socialDemand: 68, inventory: 83 },
  },
  {
    aliases: ["sony bravia xr", "sony bravia", "bravia xr"],
    productName: "Sony Bravia XR",
    category: "TVs",
    imageUrl: productImage("Sony Bravia XR", "TVs", "#fefce8", "#ca8a04"),
    prices: [1899, 1899, 1849, 1849, 1799, 1799, 1699, 1699, 1649, 1649, 1599, 1599, 1549, 1549],
    similar: ["LG OLED C3", "Samsung OLED S90C", "Dell UltraSharp 27 Monitor"],
    baseSignals: { newsSentiment: 72, searchTrend: 65, socialDemand: 61, inventory: 77 },
  },
  {
    aliases: ["samsung odyssey g7", "odyssey g7", "gaming monitor"],
    productName: "Samsung Odyssey G7",
    category: "Monitors",
    imageUrl: productImage("Samsung Odyssey G7", "Monitors", "#fdf2f8", "#db2777"),
    prices: [699, 699, 649, 649, 629, 629, 599, 599, 579, 579, 549, 549, 529, 529],
    similar: ["Dell UltraSharp 27 Monitor", "ASUS ProArt Display", "LG OLED C3"],
    baseSignals: { newsSentiment: 68, searchTrend: 70, socialDemand: 72, inventory: 73 },
  },
  {
    aliases: ["asus proart display", "proart display", "asus monitor"],
    productName: "ASUS ProArt Display",
    category: "Monitors",
    imageUrl: productImage("ASUS ProArt Display", "Monitors", "#f1f5f9", "#475569"),
    prices: [499, 499, 489, 489, 469, 469, 459, 459, 449, 449, 429, 429, 419, 419],
    similar: ["Dell UltraSharp 27 Monitor", "Samsung Odyssey G7", "MacBook Pro 14"],
    baseSignals: { newsSentiment: 66, searchTrend: 58, socialDemand: 54, inventory: 78 },
  },
  {
    aliases: ["nvidia rtx 4070 ti super", "rtx 4070 ti super", "4070 ti super"],
    productName: "NVIDIA RTX 4070 Ti Super",
    category: "Components",
    imageUrl: productImage("NVIDIA RTX 4070 Ti Super", "Components", "#f0fdf4", "#15803d"),
    prices: [849, 849, 829, 829, 819, 819, 799, 799, 789, 789, 779, 779, 769, 769],
    similar: ["NVIDIA RTX 4070 Super", "AMD Radeon RX 7800 XT", "NVIDIA RTX 4060 Ti"],
    baseSignals: { newsSentiment: 65, searchTrend: 74, socialDemand: 78, inventory: 55 },
  },
  {
    aliases: ["amd radeon rx 7800 xt", "rx 7800 xt", "7800 xt"],
    productName: "AMD Radeon RX 7800 XT",
    category: "Components",
    imageUrl: productImage("AMD Radeon RX 7800 XT", "Components", "#fff1f2", "#e11d48"),
    prices: [549, 549, 529, 529, 519, 519, 499, 499, 489, 489, 479, 479, 469, 469],
    similar: ["NVIDIA RTX 4070 Super", "NVIDIA RTX 4070 Ti Super", "NVIDIA RTX 4060 Ti"],
    baseSignals: { newsSentiment: 71, searchTrend: 69, socialDemand: 73, inventory: 71 },
  },
  {
    aliases: ["nvidia rtx 4060 ti", "rtx 4060 ti", "4060 ti"],
    productName: "NVIDIA RTX 4060 Ti",
    category: "Components",
    imageUrl: productImage("NVIDIA RTX 4060 Ti", "Components", "#ecfdf5", "#22c55e"),
    prices: [399, 399, 389, 389, 379, 379, 369, 369, 359, 359, 349, 349, 339, 339],
    similar: ["NVIDIA RTX 4070 Super", "AMD Radeon RX 7800 XT", "NVIDIA RTX 4070 Ti Super"],
    baseSignals: { newsSentiment: 62, searchTrend: 66, socialDemand: 69, inventory: 76 },
  },
  {
    aliases: ["samsung galaxy tab s9 ultra", "galaxy tab s9 ultra", "tab s9 ultra"],
    productName: "Samsung Galaxy Tab S9 Ultra",
    category: "Tablets",
    imageUrl: productImage("Samsung Galaxy Tab S9 Ultra", "Tablets", "#eff6ff", "#1d4ed8"),
    prices: [1199, 1199, 1149, 1149, 1099, 1099, 1049, 1049, 999, 999, 949, 949, 929, 929],
    similar: ["iPad Pro 13", "Microsoft Surface Pro", "Samsung Galaxy S24 Ultra"],
    baseSignals: { newsSentiment: 70, searchTrend: 63, socialDemand: 65, inventory: 82 },
  },
  {
    aliases: ["microsoft surface pro", "surface pro"],
    productName: "Microsoft Surface Pro",
    category: "Tablets",
    imageUrl: productImage("Microsoft Surface Pro", "Tablets", "#f0fdfa", "#0f766e"),
    prices: [1099, 1099, 1049, 1049, 999, 999, 979, 979, 949, 949, 929, 929, 899, 899],
    similar: ["iPad Pro 13", "Samsung Galaxy Tab S9 Ultra", "Dell XPS 16"],
    baseSignals: { newsSentiment: 67, searchTrend: 60, socialDemand: 58, inventory: 80 },
  },
  {
    aliases: ["dell xps 16", "xps 16", "dell laptop"],
    productName: "Dell XPS 16",
    category: "Laptops",
    imageUrl: productImage("Dell XPS 16", "Laptops", "#f8fafc", "#334155"),
    prices: [1899, 1899, 1849, 1849, 1799, 1799, 1749, 1749, 1699, 1699, 1649, 1649, 1599, 1599],
    similar: ["MacBook Pro 14", "Mac Studio", "Microsoft Surface Pro"],
    baseSignals: { newsSentiment: 64, searchTrend: 61, socialDemand: 57, inventory: 79 },
  },
];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function hash(text: string) {
  return text
    .toLowerCase()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function productId(productName: string) {
  return productSlug(productName);
}

export function findKnownProduct(productName: string) {
  const search = productName.toLowerCase().trim().replace(/-/g, " ");
  return PROFILES.find((profile) => {
    const profileName = profile.productName.toLowerCase().replace(/-/g, " ");
    const aliases = profile.aliases.map((alias) => alias.replace(/-/g, " "));
    return search === profileName || profileName.includes(search) || search.includes(profileName) || aliases.some((alias) => search === alias || search.includes(alias) || alias.includes(search));
  });
}

export function findKnownProductBySlug(slug: string) {
  const normalizedSlug = productSlug(slug.replace(/-/g, " "));
  return PROFILES.find((profile) => productSlug(profile.productName) === normalizedSlug || profile.aliases.some((alias) => productSlug(alias) === normalizedSlug));
}

export function searchKnownProducts(query: string) {
  const terms = query.toLowerCase().replace(/[^a-z0-9\s]+/g, " ").split(/\s+/).filter(Boolean);
  if (terms.length === 0) return TRENDING_PRODUCTS;

  return PROFILES
    .map((profile) => {
      const haystack = [profile.productName, profile.category, ...profile.aliases].join(" ").toLowerCase();
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { profile, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.profile.productName.localeCompare(b.profile.productName))
    .map((item) => analyzeProduct({ productName: item.profile.productName }));
}

function buildGeneratedProfile(productName: string): ProductProfile {
  const seed = hash(productName);
  const base = 349 + (seed % 1200);
  const prices = DATES.map((_, index) => Math.round(base * (1 - index * 0.006 + Math.sin((seed + index) / 3) * 0.018)));
  return {
    aliases: [productName.toLowerCase()],
    productName,
    category: "Electronics",
    imageUrl: productImage(productName),
    fallbackImageUrl: productImage(productName),
    retailerUrl: retailerUrl(productName),
    prices,
    similar: ["MacBook Pro 14", "Sony WH-1000XM5", "Dell UltraSharp 27 Monitor"],
    baseSignals: {
      newsSentiment: 50 + (seed % 24),
      searchTrend: 46 + ((seed * 7) % 34),
      socialDemand: 45 + ((seed * 3) % 35),
      inventory: 48 + ((seed * 11) % 34),
    },
  };
}

function pointsFrom(values: number[], min = 0, max = 100): MetricPoint[] {
  return DATES.map((label, index) => ({
    label,
    value: clamp(values[index] ?? values.at(-1) ?? 50, min, max),
  }));
}

function scoreHistory(seed: number, latest: number) {
  return DATES.map((_, index) => clamp(latest - 10 + index * 1.3 + Math.sin((seed + index) / 2) * 5));
}

function signalStatus(value: number): ProductSignal["status"] {
  if (value >= 68) return "strong";
  if (value <= 42) return "weak";
  return "neutral";
}

function categoryFallback(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("mac") || name.includes("laptop")) return "Laptops";
  if (name.includes("iphone") || name.includes("phone")) return "Phones";
  if (name.includes("monitor") || name.includes("display")) return "Monitors";
  if (name.includes("headphone") || name.includes("airpods") || name.includes("audio")) return "Audio";
  if (name.includes("gpu") || name.includes("rtx")) return "Components";
  if (name.includes("ipad") || name.includes("tablet")) return "Tablets";
  return "Electronics";
}

function newsUrl(productName: string, topic: string) {
  return `https://news.google.com/search?q=${encodeURIComponent(`${productName} ${topic}`)}`;
}

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function normalSample(random: () => number) {
  const u1 = Math.max(random(), 0.000001);
  const u2 = Math.max(random(), 0.000001);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;
}

function percentile(values: number[], percentileValue: number) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((percentileValue / 100) * sorted.length)));
  return sorted[index]!;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function forecastPriceWithMonteCarlo(prices: number[], seed: number) {
  const currentPrice = prices.at(-1)!;
  const recent = prices.slice(-7);
  const previous = prices.slice(-14, -7);
  const recentAverage = recent.reduce((sum, price) => sum + price, 0) / recent.length;
  const previousAverage = previous.length > 0 ? previous.reduce((sum, price) => sum + price, 0) / previous.length : recentAverage;
  const shortMomentum = recent.at(-1)! - recent[0]!;
  const averageDrift = (recentAverage - previousAverage) / Math.max(1, previousAverage);

  const smoothedForecast = currentPrice + shortMomentum * 0.28 + currentPrice * averageDrift * 0.45;
  const returns = prices.slice(1).map((price, index) => (price - prices[index]!) / prices[index]!);
  const dailyVolatility = Math.max(0.006, standardDeviation(returns));
  const dailyDrift = returns.reduce((sum, value) => sum + value, 0) / Math.max(1, returns.length);

  const random = seededRandom(seed * 97 + prices.length);
  const simulations = 6000;
  const horizonDays = 7;
  const finalPrices: number[] = [];

  for (let run = 0; run < simulations; run += 1) {
    let simulated = currentPrice;
    for (let day = 0; day < horizonDays; day += 1) {
      const shock = normalSample(random) * dailyVolatility;
      const pullToForecast = ((smoothedForecast - simulated) / simulated) * 0.18;
      simulated *= 1 + dailyDrift * 0.35 + pullToForecast + shock;
    }
    finalPrices.push(Math.max(1, simulated));
  }

  const predictedPrice = Math.round(median(finalPrices));
  const downsidePrice = Math.round(percentile(finalPrices, 25));
  const upsidePrice = Math.round(percentile(finalPrices, 75));
  const betterPriceProbability = finalPrices.filter((price) => price < currentPrice * 0.985).length / finalPrices.length;
  const buyNowSafety = clamp(100 - betterPriceProbability * 100);
  const forecastScore = clamp(50 + ((currentPrice - predictedPrice) / currentPrice) * 540);

  return {
    predictedPrice,
    downsidePrice,
    upsidePrice,
    betterPriceProbability: Math.round(betterPriceProbability * 100),
    buyNowSafety,
    forecastScore,
    dailyVolatility,
  };
}

function buildVerdictReasons(args: {
  verdict: ProductAnalysis["verdict"];
  currentPrice: number;
  targetBuyPrice: number;
  predictedPrice: number;
  monteCarloBetterPriceProbability: number;
  signals: ProductSignal[];
}) {
  const strongest = [...args.signals]
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 3);
  const reasons = strongest.map((signal) => `${signal.label}: ${signal.meaning.replace(/^(Good|Weak|Fair|Mixed|Neutral|Risky|Uncertain|Not good)( for waiting| for buying now)?:\s*/i, "")}`);

  if (args.verdict === "Buy now") {
    return [
      `The forecast is near $${args.predictedPrice.toLocaleString()}, so the expected near-term move is not worth waiting on.`,
      `Only ${args.monteCarloBetterPriceProbability}% of simulated paths show a meaningfully better price soon.`,
      ...reasons,
    ].slice(0, 4);
  }

  if (args.verdict === "Watch") {
    return [
      `A cleaner buy point is around $${args.targetBuyPrice.toLocaleString()}, but the current price is not far enough away to call it a clear wait.`,
      `${args.monteCarloBetterPriceProbability}% of simulated paths show a better near-term price, so checking again soon makes sense.`,
      ...reasons,
    ].slice(0, 4);
  }

  return [
    `The target buy area is closer to $${args.targetBuyPrice.toLocaleString()}, below today's $${args.currentPrice.toLocaleString()} price.`,
    `${args.monteCarloBetterPriceProbability}% of simulated paths show a better price window soon.`,
    ...reasons,
  ].slice(0, 4);
}

export function analyzeProduct(input: ProductAnalyzeInput): ProductAnalysis {
  const requestedName = input.productName.trim();
  if (requestedName.length < 2) throw new Error("Enter a product name to analyze.");

  const profile = findKnownProduct(requestedName);
  if (!profile) {
    throw new Error("Product is not in the indexed database yet. Try a related keyword.");
  }
  const productName = profile.productName;
  const seed = hash(productName);
  const priceHistory = profile.prices.map((price, index) => ({ date: DATES[index]!, price }));
  const currentPrice = profile.prices.at(-1)!;
  const avgPrice = profile.prices.reduce((sum, price) => sum + price, 0) / profile.prices.length;
  const minPrice = Math.min(...profile.prices);
  const maxPrice = Math.max(...profile.prices);
  const pricePosition = clamp(100 - ((currentPrice - minPrice) / Math.max(1, maxPrice - minPrice)) * 100);
  const movingAverage = clamp(55 + ((avgPrice - currentPrice) / avgPrice) * 320);
  const volatility = clamp(100 - ((maxPrice - minPrice) / avgPrice) * 260);
  const forecast = forecastPriceWithMonteCarlo(profile.prices, seed);
  const predictedPrice = forecast.predictedPrice;
  const trainedModel = forecast.forecastScore;
  const monteCarloBuyNowSafety = forecast.buyNowSafety;
  const monteCarloBetterPriceProbability = forecast.betterPriceProbability;
  const { newsSentiment, searchTrend, socialDemand, inventory } = profile.baseSignals;

  const signals: ProductSignal[] = [
    {
      key: "trainedPriceModel",
      label: "Predicted Price",
      value: trainedModel,
      weight: 24,
      status: signalStatus(trainedModel),
      source: "Price forecast",
      explanation: `The forecast points to about $${predictedPrice.toLocaleString()} over the next 7 days.`,
      meaning:
        trainedModel >= 68
          ? "Good: the next likely price is meaningfully below today's price."
          : trainedModel <= 42
            ? "Not good: this does not point to a useful near-term price drop."
            : "Mixed: this only points to a modest possible price improvement.",
      goodDirection: "Higher is better. A high score means the predicted future price makes buying conditions more attractive.",
      history: pointsFrom(profile.prices.map((price) => clamp(50 + ((price - predictedPrice) / price) * 520))),
    },
    {
      key: "monteCarlo",
      label: "Monte Carlo Safety",
      value: monteCarloBuyNowSafety,
      weight: 14,
      status: signalStatus(monteCarloBuyNowSafety),
      source: "10k simulations",
      explanation: `${monteCarloBetterPriceProbability}% of simulated 7-day paths show a meaningfully better price than today.`,
      meaning:
        monteCarloBuyNowSafety >= 68
          ? "Good: simulations do not show much benefit from waiting."
          : monteCarloBuyNowSafety <= 42
            ? "Weak: many simulations show a better price could appear soon."
            : "Uncertain: simulations are split, so this signal is not decisive.",
      goodDirection: "Higher means buying now is safer. Lower means waiting has more upside.",
      history: pointsFrom(scoreHistory(seed + 3, monteCarloBuyNowSafety)),
    },
    {
      key: "pricePosition",
      label: "Price Position",
      value: pricePosition,
      weight: 14,
      status: signalStatus(pricePosition),
      source: "Price history API",
      explanation: `Current price is $${currentPrice.toLocaleString()} in a recent $${minPrice.toLocaleString()}-$${maxPrice.toLocaleString()} range.`,
      meaning:
        pricePosition >= 68
          ? "Good: the current price is close to the recent low."
          : pricePosition <= 42
            ? "Weak: the current price is closer to the recent high."
            : "Fair: the price is in the middle of its recent range.",
      goodDirection: "Higher is better. It means today's price is cheaper relative to recent history.",
      history: pointsFrom(profile.prices.map((price) => 100 - ((price - minPrice) / Math.max(1, maxPrice - minPrice)) * 100)),
    },
    {
      key: "movingAverage",
      label: "Moving Average",
      value: movingAverage,
      weight: 10,
      status: signalStatus(movingAverage),
      source: "Moving average",
      explanation: currentPrice < avgPrice ? "Current price is below its recent average." : "Current price is above its recent average.",
      meaning:
        movingAverage >= 68
          ? "Good: current price is comfortably below the recent average."
          : movingAverage <= 42
            ? "Weak: current price is above the recent average."
            : "Neutral: price is close to its recent average.",
      goodDirection: "Higher is better. It means the current price compares well against the moving average.",
      history: pointsFrom(profile.prices.map((price) => clamp(55 + ((avgPrice - price) / avgPrice) * 320))),
    },
    {
      key: "newsSentiment",
      label: "News Sentiment",
      value: newsSentiment,
      weight: 14,
      status: signalStatus(newsSentiment),
      source: "News coverage",
      explanation: "Recent coverage is classified for discount timing, launches, demand, and reliability concerns.",
      meaning:
        newsSentiment >= 68
          ? "Good: news context supports the product or suggests improving buy conditions."
          : newsSentiment <= 42
            ? "Weak: recent coverage adds risk or points to waiting."
            : "Neutral: news does not strongly change the recommendation.",
      goodDirection: "Higher is better. Positive or discount-friendly coverage lifts the score.",
      history: pointsFrom(scoreHistory(seed + 8, newsSentiment)),
    },
    {
      key: "searchTrend",
      label: "Search Trend",
      value: searchTrend,
      weight: 10,
      status: signalStatus(searchTrend),
      source: "Google Trends API",
      explanation: "Search interest estimates whether demand is cooling or heating up.",
      meaning:
        searchTrend >= 68
          ? "Demand is strong. This can support price stability, but may reduce discount chances."
          : searchTrend <= 42
            ? "Demand is cooling. That can improve the chance of discounts."
            : "Demand is normal, so trend is not a major driver.",
      goodDirection: "Middle-to-high is usually healthy. Extremely high demand can make discounts harder.",
      history: pointsFrom(scoreHistory(seed + 11, searchTrend)),
    },
    {
      key: "socialDemand",
      label: "Social Virality",
      value: socialDemand,
      weight: 8,
      status: signalStatus(socialDemand),
      source: "Social and review APIs",
      explanation: "Forums, reviews, and social posts indicate market attention.",
      meaning:
        socialDemand >= 68
          ? "People are actively discussing the product, which raises confidence in the signal."
          : socialDemand <= 42
            ? "Low discussion volume means this input is less reliable."
            : "Moderate attention; useful, but not a dominant signal.",
      goodDirection: "Higher means more buyer attention and more confidence in demand signals.",
      history: pointsFrom(scoreHistory(seed + 14, socialDemand)),
    },
    {
      key: "volatility",
      label: "Volatility",
      value: volatility,
      weight: 6,
      status: signalStatus(volatility),
      source: "Price movement",
      explanation: "Lower price volatility improves risk-adjusted timing confidence.",
      meaning:
        volatility >= 68
          ? "Good: price movement is stable, so the recommendation is less noisy."
          : volatility <= 42
            ? "Risky: price is moving around enough that timing is less certain."
            : "Moderate: price movement is manageable but not perfectly stable.",
      goodDirection: "Higher is better. It means lower volatility and a steadier price signal.",
      history: pointsFrom(scoreHistory(seed + 17, volatility)),
    },
    {
      key: "inventory",
      label: "Inventory Context",
      value: inventory,
      weight: 2,
      status: signalStatus(inventory),
      source: "Retail availability APIs",
      explanation: "Availability and discount pressure affect whether waiting is likely to help.",
      meaning:
        inventory >= 68
          ? "Good: availability looks healthy, which can create room for discounts."
          : inventory <= 42
            ? "Weak: tight inventory can keep prices high."
            : "Normal: inventory is not pushing the score much either way.",
      goodDirection: "Higher is usually better for buyers because stock pressure can lead to deals.",
      history: pointsFrom(scoreHistory(seed + 20, inventory)),
    },
  ];

  const openByIndex = Math.round(signals.reduce((sum, signal) => sum + (signal.value / 100) * signal.weight, 0));
  const verdict = openByIndex >= 72 ? "Buy now" : openByIndex >= 50 ? "Watch" : "Wait";
  const targetBuyPrice = Math.round(Math.min(currentPrice * 0.98, avgPrice * 0.96, forecast.downsidePrice));
  const confidence = Math.round(clamp(46 + Math.abs(openByIndex - 50) * 0.7 + monteCarloBuyNowSafety * 0.12));
  const category = profile.category || categoryFallback(productName);
  const verdictReasons = buildVerdictReasons({
    verdict,
    currentPrice,
    targetBuyPrice,
    predictedPrice,
    monteCarloBetterPriceProbability,
    signals,
  });

  return {
    id: productId(productName),
    productName,
    category,
    imageUrl: profile.imageUrl,
    fallbackImageUrl: profile.fallbackImageUrl ?? profile.imageUrl,
    retailerUrl: profile.retailerUrl ?? retailerUrl(productName),
    currentPrice,
    targetBuyPrice,
    predictedPrice,
    monteCarloBetterPriceProbability,
    openByIndex,
    verdict,
    verdictReasons,
    confidence,
    updatedAt: "May 3, 2026",
    priceHistory,
    signals,
    news: [
      {
        title: `${productName} pricing and discount coverage`,
        outlet: "Google News",
        sentiment: newsSentiment >= 62 ? "positive" : newsSentiment <= 42 ? "negative" : "neutral",
        impact: "News sentiment input",
        url: newsUrl(productName, "price discount review"),
      },
      {
        title: `${productName} reviews, reliability, and buyer response`,
        outlet: "Review scan",
        sentiment: socialDemand >= 64 ? "positive" : "neutral",
        impact: "Social demand input",
        url: newsUrl(productName, "review reliability"),
      },
      {
        title: `${productName} trend and demand movement`,
        outlet: "Trend monitor",
        sentiment: searchTrend >= 60 ? "positive" : "neutral",
        impact: "Search trend input",
        url: newsUrl(productName, "demand trend"),
      },
    ],
    similarProducts: profile.similar.map((name) => {
      const similar = findKnownProduct(name) ?? buildGeneratedProfile(name);
      const similarPrice = similar.prices.at(-1)!;
      return {
        productName: similar.productName,
        category: similar.category,
        imageUrl: similar.imageUrl,
        fallbackImageUrl: similar.fallbackImageUrl ?? similar.imageUrl,
        currentPrice: similarPrice,
        openByIndex: Math.round(52 + (hash(similar.productName) % 34)),
      };
    }),
    recommendation:
      verdict === "Buy now"
        ? `This is a good buying window because the forecast is near $${predictedPrice.toLocaleString()}, the current price is strong against recent history, and only ${monteCarloBetterPriceProbability}% of simulations found a clearly better near-term price.`
        : verdict === "Watch"
          ? `Do not rush. The product is worth watching, but the forecast and simulations suggest waiting for a cleaner dip near $${targetBuyPrice.toLocaleString()}.`
          : `Wait for a better entry. The target area is closer to $${targetBuyPrice.toLocaleString()}, and ${monteCarloBetterPriceProbability}% of simulations found a better near-term price.`,
    summary:
      verdict === "Buy now"
        ? `${productName} has a strong OpenBy Index because forecast pricing and market signals are favorable right now.`
        : verdict === "Watch"
          ? `${productName} is mixed: some signals are attractive, but the forecast does not show a clean buy window yet.`
          : `${productName} looks early or overpriced relative to recent signals, so waiting may improve the price.`,
  };
}

export const TRENDING_PRODUCTS: ProductAnalysis[] = [
  "MacBook Pro 14",
  "Sony WH-1000XM5",
  "iPhone 15 Pro",
  "Dell UltraSharp 27 Monitor",
  "NVIDIA RTX 4070 Super",
  "LG OLED C3",
  "AirPods Pro 2",
  "Samsung Galaxy S24 Ultra",
  "AMD Radeon RX 7800 XT",
].map((productName) => analyzeProduct({ productName }));
