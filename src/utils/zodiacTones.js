// LocalStorage helpers for selected zodiac
export const getSelectedZodiac = () => {
  const stored = localStorage.getItem("selectedZodiac");
  return stored || null;
};

export const setSelectedZodiac = (sign) => {
  if (!sign) {
    localStorage.removeItem("selectedZodiac");
  } else {
    localStorage.setItem("selectedZodiac", sign);
  }
};
export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", key: "aries" },
  { name: "Taurus", symbol: "♉", key: "taurus" },
  { name: "Gemini", symbol: "♊", key: "gemini" },
  { name: "Cancer", symbol: "♋", key: "cancer" },
  { name: "Leo", symbol: "♌", key: "leo" },
  { name: "Virgo", symbol: "♍", key: "virgo" },

  // PLANET_FLAVORS: ultra-short, caption-ready overlays for each zodiac sign.
  // See docs/ASTRONOPE_CONTENT_RULES.md for full copy guidelines.
  { name: "Capricorn", symbol: "♑", key: "capricorn" },
  { name: "Aquarius", symbol: "♒", key: "aquarius" },
  { name: "Pisces", symbol: "♓", key: "pisces" },
];

// Maps zodiac signs to the tones used in excuseService
// These are used when generating zodiac-specific excuses
export const SIGN_TONES = {
  aries: ["dry", "playful"],
  taurus: ["dry", "casual"],
  gemini: ["playful", "casual"],
  cancer: ["casual", "playful"],
  leo: ["playful", "dry"],
  virgo: ["dry", "casual"],
  libra: ["playful", "casual"],
  scorpio: ["dry", "playful"],
  sagittarius: ["playful", "dry"],
  capricorn: ["dry", "casual"],
  aquarius: ["playful", "dry"],
  pisces: ["playful", "casual"],
};

export function pickFlavorEnding(sign) {
  const list = SIGN_FLAVOR_ENDINGS[sign];
  if (!list || list.length === 0) return null;
  const today = new Date().toLocaleDateString("en-CA");
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % list.length;
  return list[idx];
}

// Ruling planet mapping (canonical, simplified for flavor only)
export const SIGN_RULERS = {
  aries: "mars",
  taurus: "venus",
  gemini: "mercury",
  cancer: "moon",
  leo: "sun",
  virgo: "mercury",
  libra: "venus",
  scorpio: "mars", // flavor: intensity (we route via mars)
  sagittarius: "jupiter",
  capricorn: "saturn",
  aquarius: "uranus", // could be saturn; we choose rebel vibe
  pisces: "neptune", // could be jupiter; we choose fog vibe
};

// Planet-based flavor phrases that replace the final sentence (no sign names)
// AstroNope Zodiac Flavor System
// Purpose: ultra-short, caption-ready personality overlays
// Rule: one sharp sentence, no explanations

export const PLANET_FLAVORS = {
  mars: ["Hard no.", "Impulse spent.", "Too fast, still no."],

  venus: ["Not worth moving.", "Comfort locked.", "Staying put."],

  mercury: ["Changed my mind.", "Ask again later.", "Mixed signals."],

  moon: [
    "Emotionally unavailable.",
    "Protecting my peace.",
    "Too sensitive for this.",
  ],

  sun: ["Spotlight unavailable.", "Main character offline.", "Ego on break."],

  jupiter: ["Gone somewhere else.", "Too free for this.", "Maybe never."],

  saturn: ["Not productive.", "Doesn’t scale.", "Declined professionally."],

  uranus: ["Doesn’t align.", "Concept rejected.", "Too conventional."],

  neptune: ["Not feeling it.", "Energy says no.", "Drifted away."],
};

export const PUNCHLINES = [
  "No reason given.",
  "End of discussion.",
  "Message not delivered.",
  "Case closed.",
  "No further questions.",
  "That’s final.",
];

function deterministicIndexByDate(len) {
  const today = new Date().toLocaleDateString("en-CA");
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % len;
}

// Generic universe flavor (no specific system)
export const UNIVERSE_FLAVORS = [
  "The universe has spoken.",
  "Cosmic scheduling conflict.",
  "Universe said not today.",
  "Stars declined the request.",
  "Space chose silence today.",
];

// Numerology flavor: rare, short, and sign-free
export const NUMEROLOGY_FLAVORS = [
  "777 went elsewhere.",
  "The numbers didn’t align.",
  "11 took the day off.",
  "3 declined politely.",
  "7 chose silence today.",
];

function dateHash() {
  const today = new Date().toLocaleDateString("en-CA");
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) >>> 0;
}

function pickWeightedCategory() {
  // Percent mix: 50% planet (astrology default), 25% universe, 15% moon, 10% numerology
  const h = dateHash() % 100;
  if (h < 50) return "planet";
  if (h < 75) return "universe";
  if (h < 90) return "moon";
  return "number";
}

function pickPlanetForToday() {
  const keys = Object.keys(PLANET_FLAVORS);
  return keys[deterministicIndexByDate(keys.length)];
}

// Split the excuse into core and flavor parts for separate visual display
// ZODIAC RULE: Flavor ONLY shows when a zodiac sign is selected
export function splitExcuseWithFlavor(baseExcuse, sign) {
  if (!baseExcuse) return { core: baseExcuse, flavor: null };

  // NO ZODIAC = NO FLAVOR (core message only)
  if (!sign) {
    return { core: baseExcuse, flavor: null };
  }

  // WITH ZODIAC = ADD PLANET-BASED FLAVOR
  const flavorText = getPlanetFlavorForSign(sign);

  if (!flavorText) {
    return { core: baseExcuse, flavor: null };
  }

  // Split: extract last sentence from core and replace with flavor
  const lastDot = baseExcuse.lastIndexOf(".");
  if (lastDot === -1) {
    // No sentence delimiter: return whole as core, flavor as addon
    return { core: baseExcuse.trim(), flavor: flavorText };
  }
  // Find the start of the last sentence by locating the previous period
  const prevDot = baseExcuse.lastIndexOf(".", lastDot - 1);
  const core = baseExcuse.slice(0, prevDot + 1).trim();
  return { core, flavor: flavorText };
}

// Helper: Get planet-based flavor for a sign (used by FlavorEngine)
export function getPlanetFlavorForSign(sign) {
  const planet = SIGN_RULERS[sign];
  const list = PLANET_FLAVORS[planet];

  if (!planet || !list || list.length === 0) {
    return null;
  }

  return list[deterministicIndexByDate(list.length)];
}

// Backward compatible: returns combined text
export function flavorExcuse(baseExcuse, sign) {
  const { core, flavor } = splitExcuseWithFlavor(baseExcuse, sign);
  if (!flavor) return core;
  return `${core} ${flavor}`;
}
