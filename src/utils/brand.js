// Brand caption suggestions — Phase-1 safe
// Subtle, optional, shown only after Copy/Share

export const BRAND_CAPTIONS = [
  "I AstroNoped today.",
  "Just AstroNope’d my meeting.",
  "The universe AstroNoped me.",
  "Got AstroNoped by the stars.",
  "AstroNope happened.",
  "AstroNope took over.",
  "Consider it AstroNoped.",
];

function getDeviceSeed() {
  try {
    // Reuse existing device seed if present, else create brand-specific
    const existing = localStorage.getItem("astronope_device_seed");
    if (existing) return existing;
    let seed = localStorage.getItem("astronope_brand_seed");
    if (!seed) {
      seed = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("astronope_brand_seed", seed);
    }
    return seed;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

// Optional vibe-aware suggestion for on-brand pairing
// `indexHint` lets us rotate by session share/copy count for extra variety.
export function getSuggestedBrandCaption(vibe, indexHint = 0) {
  const vibeMap = {
    dry_sarcastic: [
      "AstroNope happened.",
      "The universe AstroNoped me.",
      "I AstroNoped today.",
      "Consider it AstroNoped.",
    ],
    chaos_energy: [
      "Got AstroNoped by the stars.",
      "I AstroNoped today.",
      "The universe AstroNoped me.",
      "AstroNope took over.",
    ],
    corporate_avoidance: [
      "Just AstroNope’d my meeting.",
      "I AstroNoped today.",
      "AstroNope happened.",
      "Consider it AstroNoped.",
    ],
    peaceful_nope: [
      "I AstroNoped today.",
      "The universe AstroNoped me.",
      "AstroNope happened.",
      "Consider it AstroNoped.",
    ],
    existential_shrug: [
      "The universe AstroNoped me.",
      "AstroNope happened.",
      "I AstroNoped today.",
      "AstroNope took over.",
    ],
  };

  const seed = getDeviceSeed();
  const day = getDayKey();
  const dailyIdx = hash(`${seed}-${day}`);

  if (vibe && vibeMap[vibe]) {
    const options = vibeMap[vibe];
    const idx = (dailyIdx + indexHint) % options.length;
    return options[idx];
  }

  const idx = (dailyIdx + indexHint) % BRAND_CAPTIONS.length;
  return BRAND_CAPTIONS[idx];
}

// Session share/copy counter helpers (for rotation)
const SHARE_COUNT_KEY = "astronope_session_share_count";
export function getSessionShareCount() {
  try {
    const raw = sessionStorage.getItem(SHARE_COUNT_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}
export function incrementSessionShareCount() {
  try {
    const n = getSessionShareCount() + 1;
    sessionStorage.setItem(SHARE_COUNT_KEY, String(n));
    return n;
  } catch {
    return 0;
  }
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getDayKey() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Date().toLocaleDateString("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
}

// (removed old duplicate getSuggestedBrandCaption)

const SESSION_KEY = "astronope_brand_caption_shown";

export function hasBrandCaptionShown() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBrandCaptionShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {}
}
