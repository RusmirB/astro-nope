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
