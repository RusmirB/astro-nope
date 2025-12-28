export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", key: "aries" },
  { name: "Taurus", symbol: "♉", key: "taurus" },
  { name: "Gemini", symbol: "♊", key: "gemini" },
  { name: "Cancer", symbol: "♋", key: "cancer" },
  { name: "Leo", symbol: "♌", key: "leo" },
  { name: "Virgo", symbol: "♍", key: "virgo" },
  { name: "Libra", symbol: "♎", key: "libra" },
  { name: "Scorpio", symbol: "♏", key: "scorpio" },
  { name: "Sagittarius", symbol: "♐", key: "sagittarius" },
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

export const SIGN_MODIFIERS = {
  aries: {
    emoji: "🔥",
  },
  taurus: {
    emoji: "🐂",
  },
  gemini: {
    emoji: "👯",
  },
  cancer: {
    emoji: "🦀",
  },
  leo: {
    emoji: "👑",
  },
  virgo: {
    emoji: "📋",
  },
  libra: {
    emoji: "⚖️",
  },
  scorpio: {
    emoji: "🦂",
  },
  sagittarius: {
    emoji: "🏹",
  },
  capricorn: {
    emoji: "🐐",
  },
  aquarius: {
    emoji: "⚡",
  },
  pisces: {
    emoji: "🌊",
  },
};

export const getSelectedZodiac = () => {
  const stored = localStorage.getItem("selectedZodiac");
  return stored || null;
};

export const setSelectedZodiac = (sign) => {
  if (sign === null) {
    localStorage.removeItem("selectedZodiac");
  } else {
    localStorage.setItem("selectedZodiac", sign);
  }
};

// Flavor-only endings appended to the daily core excuse
export const SIGN_FLAVOR_ENDINGS = {
  aries: [
    "Mars says relax. Try again tomorrow.",
    "Direct energy fizzled. Reboot tomorrow.",
  ],
  taurus: [
    "Comfort takes priority. Reschedule with the universe.",
    "The ground says sit. Tomorrow is better.",
  ],
  gemini: [
    "Two minds disagree. Let the cosmos decide tomorrow.",
    "Too many signals. We'll align later.",
  ],
  cancer: [
    "Moon needs a soft pause. Check back tomorrow.",
    "Feelings first. The stars can wait.",
  ],
  leo: [
    "Spotlight dimmed for today. Return with flair tomorrow.",
    "Royal rest day. Audience tomorrow.",
  ],
  virgo: [
    "Details are misaligned. Reschedule with the cosmos.",
    "System needs tidying. Tomorrow is optimal.",
  ],
  libra: [
    "Balance is off. We'll restore harmony tomorrow.",
    "Scales say later. Rebalance tomorrow.",
  ],
  scorpio: [
    "Some things are better left unsaid.",
    "Depth requires silence today. Return tomorrow.",
  ],
  sagittarius: [
    "Aim postponed. Adventure resumes tomorrow.",
    "Arrow on pause. Try again tomorrow.",
  ],
  capricorn: [
    "Climb resumes tomorrow. Strategy over speed.",
    "Timelines slip today. Discipline returns tomorrow.",
  ],
  aquarius: [
    "Signals jammed. Refresh the circuit tomorrow.",
    "Unusual weather in the cloud. Sync tomorrow.",
  ],
  pisces: [
    "Dream tide is out. Swim back tomorrow.",
    "Drift today. Current returns tomorrow.",
  ],
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
export const PLANET_FLAVORS = {
  mars: [
    "Action denied.",
    "Energy misplaced.",
    "Impulse rerouted.",
    "Bold move rejected.",
    "Heat off.",
  ],
  venus: [
    "Harmony refused.",
    "Comfort won.",
    "Grace over grind.",
    "Sweetness withheld.",
  ],
  mercury: [
    "Signals crossed.",
    "Message lost.",
    "Outbox jammed.",
    "Noise won.",
  ],
  moon: ["Tides disagreed.", "Quiet tides.", "Lunar shrug.", "Moon said no."],
  sun: [
    "Spotlight off.",
    "Ego reset.",
    "Center stepped back.",
    "Brightness declined.",
  ],
  jupiter: [
    "Expansion canceled.",
    "Scope shrank.",
    "Big plan vetoed.",
    "Luck abstained.",
  ],
  saturn: [
    "Rules enforced.",
    "Boundary held.",
    "Process said no.",
    "Clock disagreed.",
  ],
  uranus: [
    "Systems rebelled.",
    "Circuit flipped.",
    "Chaos picked this slot.",
    "Unexpected no.",
  ],
  neptune: [
    "Reality blurred.",
    "Edges dissolved.",
    "Signals misted.",
    "Dream logic won.",
  ],
};

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
