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
