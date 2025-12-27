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
    "Impulse rerouted. Try again tomorrow.",
    "The universe chose action elsewhere.",
    "Energy redirected. Tomorrow will do.",
    "Low battery for bold moves.",
    "Action paused; align tomorrow.",
    "Sparks on standby; proceed later.",
  ],
  venus: [
    "Peace is being protected.",
    "Comfort takes priority today.",
    "Soft harmony over hustle.",
    "Choose ease over effort.",
    "Grace beats grind today.",
    "Gentle self-care wins.",
  ],
  mercury: [
    "Messages are not landing.",
    "Signals are misfiring today.",
    "The lines are crossed. Try tomorrow.",
    "Words are tangled; save it for tomorrow.",
    "Bandwidth is noisy; retry later.",
    "Outbox stuck; send tomorrow.",
  ],
  moon: [
    "Feelings go first today.",
    "A soft pause is in place.",
    "Quiet tides, try again tomorrow.",
    "Inner weather requests quiet.",
    "Tides rest; reattempt later.",
    "Emotions need room; postpone.",
  ],
  sun: [
    "Spotlight is off for today.",
    "Ego is on a reset.",
    "Stand down now; return with shine tomorrow.",
    "Center steps back today.",
    "Radiance recalibrates; return tomorrow.",
    "Brightness on standby; pause now.",
  ],
  jupiter: [
    "Expansion postponed. Tomorrow is wider.",
    "The horizon moved. Try again tomorrow.",
    "Big plans take a breath today.",
    "Optimism takes a nap.",
    "Scope shrinks for today.",
    "Luck is on lunch; try tomorrow.",
  ],
  saturn: [
    "Boundaries are enforced.",
    "Rules are winning today.",
    "Structure says not today.",
    "Not today, per the rules.",
    "Clock says 'no' politely.",
    "Process needs patience; wait.",
  ],
  uranus: [
    "Systems rebelled. Try tomorrow.",
    "Expect the unexpected, not the yes.",
    "Disruption in progress. Tomorrow aligns.",
    "The circuit flipped unpredictably.",
    "Chaos chose this slot.",
    "Update in progress; try later.",
  ],
  neptune: [
    "Reality is blurred.",
    "Fog day. Tomorrow clears.",
    "Dream tide says pause.",
    "Signals dissolve into mist.",
    "Dream logic dominates; hold.",
    "Edges soften; schedule later.",
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

// Replace the final sentence of the base excuse with a planet flavor phrase
export function flavorExcuse(baseExcuse, sign) {
  if (!baseExcuse || !sign) return baseExcuse;
  const planet = SIGN_RULERS[sign];
  const list = PLANET_FLAVORS[planet];
  if (!planet || !list || list.length === 0) return baseExcuse;
  const ending = list[deterministicIndexByDate(list.length)];
  // Find the last period and replace the last sentence
  const lastDot = baseExcuse.lastIndexOf(".");
  if (lastDot === -1 || lastDot === baseExcuse.length - 1) {
    // No clear sentence end, append
    return `${baseExcuse.trim()} ${ending}`;
  }
  const first = baseExcuse.slice(0, lastDot + 1).trim();
  return `${first} ${ending}`;
}
