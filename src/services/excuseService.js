// 🎲 COMPOSABLE EXCUSE ENGINE v4
// 3-layer structure: SETUP → AI-GENERATED MICRO-REASONS → PUNCHLINE
// Soft Cosmic Fingerprint for unique-feeling (but deterministic) personalization
// Phase 1 compatible, no AI calls at runtime, zero input required
// AI used as CONTENT GENERATOR only (offline pool)

import aiReasons from "../data/aiReasons.json";
import { SIGN_TONES } from "../utils/zodiacTones";

// Zodiac signs to filter out when using zodiac flavor
const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Check if a reason text contains direct zodiac sign mentions
function containsZodiacMention(text) {
  return ZODIAC_SIGNS.some((sign) => text.includes(sign));
}

// Avoid mixing multiple cosmic ideas: filter out explicit cosmic terms
const COSMIC_KEYWORDS = [
  // planets & bodies
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "sun",
  "moon",
  // generic cosmic nouns (singular/plural)
  "planet",
  "planets",
  "star",
  "stars",
  "cosmos",
  "cosmic",
  "universe",
  "outer space",
  // astro jargon to avoid educational tone
  "transit",
  "house",
  "phase",
];

function containsCosmicMention(text) {
  const lower = text.toLowerCase();
  return COSMIC_KEYWORDS.some((kw) => lower.includes(kw));
}

// Simple seeded RNG
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Context labels for different times of day (for UI display)
export const TIME_CONTEXTS = {
  MORNING: { label: "Morning Excuse", time: "5-12", emoji: "☀️" },
  AFTERNOON: { label: "Afternoon Excuse", time: "12-17", emoji: "📅" },
  EVENING: { label: "Evening Excuse", time: "17-21", emoji: "🌆" },
  NIGHT: { label: "Night Excuse", time: "21-5", emoji: "🌙" }
};

// Get current time context
export function getCurrentTimeContext() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return TIME_CONTEXTS.MORNING;
  if (hour >= 12 && hour < 17) return TIME_CONTEXTS.AFTERNOON;
  if (hour >= 17 && hour < 21) return TIME_CONTEXTS.EVENING;
  return TIME_CONTEXTS.NIGHT;
}

// Generate cosmic fingerprint (timezone + time-of-day + calendar + device seed)
export function getCosmicFingerprint() {
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Day of week (0-6)
  const dow = now.getDay();

  // Month (0-11)
  const month = now.getMonth();

  // Hour (0-23) → categorize into "time of day"
  const hour = now.getHours();
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 0; // morning
  else if (hour >= 12 && hour < 17) timeOfDay = 1; // afternoon
  else if (hour >= 17 && hour < 21) timeOfDay = 2; // evening
  else timeOfDay = 3; // night

  // Device seed (from localStorage, generated once)
  let deviceSeed = localStorage.getItem("astronope_device_seed");
  if (!deviceSeed) {
    deviceSeed = Math.random().toString(36).substring(2, 11);
    localStorage.setItem("astronope_device_seed", deviceSeed);
  }

  // Hash to create fingerprint (added hour for better entropy)
  const fingerprint = `${tz}-${dow}-${month}-${hour}-${timeOfDay}-${deviceSeed}`;
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    hash = (hash << 5) - hash + fingerprint.codePointAt(i);
    hash = Math.trunc(hash);
  }

  return Math.abs(hash);
}

// Vibe buckets (each has its own tone preferences)
const VIBE_BUCKETS = {
  DRY_SARCASTIC: "dry_sarcastic",
  CHAOS_ENERGY: "chaos_energy",
  CORPORATE_AVOIDANCE: "corporate_avoidance",
  PEACEFUL_NOPE: "peaceful_nope",
  EXISTENTIAL_SHRUG: "existential_shrug",
};

// Assign vibe based on fingerprint
function getVibeForUser(fingerprint) {
  const vibes = Object.values(VIBE_BUCKETS);
  return vibes[fingerprint % vibes.length];
}

const TONE = {
  CASUAL: "casual",
  PLAYFUL: "playful",
  DRY: "dry",
};

// Layer 1: SETUP (Short, dismissive refusals - max 3 words)
// Confident "no" without explanation
const SETUPS = [
  // TOP TIER (use often)
  { text: "Can't today.", tones: [TONE.DRY] },
  { text: "Not happening.", tones: [TONE.DRY] },
  { text: "Declined.", tones: [TONE.DRY] },
  { text: "Unavailable.", tones: [TONE.DRY] },
  { text: "Hard pass.", tones: [TONE.DRY] },
  { text: "System says no.", tones: [TONE.DRY] },
  // Contextual (use rarely)
  { text: "I would, but I won't.", tones: [TONE.DRY] },
  { text: "Out of service.", tones: [TONE.DRY] },
  { text: "Not possible.", tones: [TONE.DRY] },
  // New additions (rare)
  { text: "Nope.", tones: [TONE.DRY] },
  { text: "Can't commit.", tones: [TONE.DRY] },
  { text: "Not available.", tones: [TONE.DRY] },
  { text: "Passing.", tones: [TONE.DRY] },
  { text: "Skipped.", tones: [TONE.DRY] },
];

// Layer 2: AI-GENERATED MICRO-REASONS (from offline pool)
// Instead of hardcoded ABSURDITIES, we use AI-generated reasons
// AI wrote these once, they live in JSON, app never calls AI at runtime
const AI_REASONS = aiReasons.reasons || [];

// Build a rotation pool for each user based on their cosmic fingerprint
function getReasonPoolForFingerprint(fingerprint) {
  // Each user sees ~300 of the ~500 reasons (pseudo-random but deterministic)
  const poolSize = Math.min(300, Math.floor(AI_REASONS.length * 0.6));
  const rng = mulberry32(fingerprint * 31);

  const indices = new Set();
  while (indices.size < poolSize && indices.size < AI_REASONS.length) {
    indices.add(Math.floor(rng() * AI_REASONS.length));
  }

  return Array.from(indices).map((i) => AI_REASONS[i]);
}

// Layer 3: PUNCHLINE (2-4 words max, ends conversation)
// Confident refusal closer - no room for negotiation
const PUNCHLINES = [
  // TOP TIER (use often)
  { text: "No reason given.", tones: [TONE.DRY] },
  { text: "Emotionally.", tones: [TONE.DRY] },
  { text: "No further explanation.", tones: [TONE.DRY] },
  { text: "End of transmission.", tones: [TONE.DRY] },
  { text: "No comment.", tones: [TONE.DRY] },
  { text: "Not in this universe.", tones: [TONE.DRY] },
  // Contextual (rare)
  { text: "That’s all.", tones: [TONE.DRY] },
  { text: "Try again next century.", tones: [TONE.DRY] },
  // New additions (rare)
  { text: "By design.", tones: [TONE.DRY] },
  { text: "As intended.", tones: [TONE.DRY] },
  { text: "On purpose.", tones: [TONE.DRY] },
  { text: "For personal reasons.", tones: [TONE.DRY] },
  { text: "Per policy.", tones: [TONE.DRY] },
  { text: "Please try never.", tones: [TONE.DRY] },
];

// Helper: Find common tone between lists
function findCommonTone(setup, absurdity, punchline) {
  const setupTones = new Set(setup.tones);
  const absurdTones = new Set(absurdity.tones);
  const punchTones = new Set(punchline.tones);

  // Find a tone that all three share
  for (const tone of setupTones) {
    if (absurdTones.has(tone) && punchTones.has(tone)) {
      return tone;
    }
  }

  // If no perfect match, try any pair that matches
  if (
    setupTones.has(TONE.PLAYFUL) &&
    absurdTones.has(TONE.PLAYFUL) &&
    punchTones.has(TONE.PLAYFUL)
  ) {
    return TONE.PLAYFUL;
  }
  if (
    setupTones.has(TONE.CASUAL) &&
    absurdTones.has(TONE.CASUAL) &&
    punchTones.has(TONE.CASUAL)
  ) {
    return TONE.CASUAL;
  }
  if (
    setupTones.has(TONE.DRY) &&
    absurdTones.has(TONE.DRY) &&
    punchTones.has(TONE.DRY)
  ) {
    return TONE.DRY;
  }

  return null; // Skip if no compatible tone
}

// Helper: Pick setup with preference
function pickSetup(rng) {
  const drySetups = SETUPS.filter((s) => s.tones.includes(TONE.DRY));
  return drySetups.length
    ? drySetups[Math.floor(rng() * drySetups.length)]
    : SETUPS[Math.floor(rng() * SETUPS.length)];
}

// Helper: Pick reason with preference
function pickReason(rng, reasonsToUse) {
  const dryReasons = reasonsToUse.filter((r) => r.tones?.includes(TONE.DRY));
  return dryReasons.length
    ? dryReasons[Math.floor(rng() * dryReasons.length)]
    : reasonsToUse[Math.floor(rng() * reasonsToUse.length)];
}

// Helper: Pick punchline with preference
function pickPunchline(rng) {
  const nonCosmicPunchlines = PUNCHLINES.filter(
    (p) => !containsCosmicMention(p.text)
  );
  const punchPool =
    nonCosmicPunchlines.length > 0 ? nonCosmicPunchlines : PUNCHLINES;
  const dryPunch = punchPool.filter((p) => p.tones.includes(TONE.DRY));
  return dryPunch.length
    ? dryPunch[Math.floor(rng() * dryPunch.length)]
    : punchPool[Math.floor(rng() * punchPool.length)];
}

// Helper: Check if combination is valid
function isValidCombination(setup, setupText, punchText) {
  if (!(setupText && punchText && setupText !== punchText)) {
    return false;
  }
  if (setup.text === "Please try never.") {
    return false;
  }
  return true;
}

// Helper: Check if vibe matches preference
function vibeMatchesPreference(vibePreference, commonTone) {
  if (!vibePreference || !commonTone) return false;

  if (
    vibePreference === VIBE_BUCKETS.DRY_SARCASTIC &&
    commonTone === TONE.DRY
  ) {
    return true;
  }
  if (
    vibePreference === VIBE_BUCKETS.CHAOS_ENERGY &&
    commonTone === TONE.PLAYFUL
  ) {
    return true;
  }
  if (
    vibePreference === VIBE_BUCKETS.PEACEFUL_NOPE &&
    commonTone === TONE.CASUAL
  ) {
    return true;
  }
  return false;
}

// Compose excuse using seeded RNG (with optional vibe preference)
// Now uses AI_REASONS from pool instead of hardcoded ABSURDITIES
function composeExcuse(seed, vibePreference = null, reasonPool = null) {
  const rng = mulberry32(seed);
  const maxAttempts = 10;

  // Use provided pool or fallback to all reasons, but always filter out
  // any reasons that explicitly mention zodiac signs to keep core text clean.
  const basePool = reasonPool || AI_REASONS;
  let reasonsToUse = basePool.filter((r) => !containsZodiacMention(r.text));
  // Prefer non-cosmic reasons to keep "one idea per message" (cosmic ending only)
  const nonCosmic = reasonsToUse.filter((r) => !containsCosmicMention(r.text));
  if (nonCosmic.length > 50) {
    reasonsToUse = nonCosmic;
  }

  // Try up to maxAttempts times to find a good combination
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const setup = pickSetup(rng);
    const reason = pickReason(rng, reasonsToUse);
    const punchline = pickPunchline(rng);
    const commonTone = findCommonTone(setup, reason, punchline);

    // Validate combination
    const setupText = setup.text.replaceAll(/[^a-zA-Z]/g, "").toLowerCase();
    const punchText = punchline.text.replaceAll(/[^a-zA-Z]/g, "").toLowerCase();

    if (!isValidCombination(setup, setupText, punchText)) {
      continue;
    }

    // Check vibe match
    if (vibeMatchesPreference(vibePreference, commonTone)) {
      const reasonText =
        reason.text.charAt(0).toUpperCase() + reason.text.slice(1);
      return `${setup.text} ${reasonText}. ${punchline.text}`;
    }

    // Accept if tone matches even without perfect vibe match
    if (commonTone) {
      const reasonText =
        reason.text.charAt(0).toUpperCase() + reason.text.slice(1);
      return `${setup.text} ${reasonText}. ${punchline.text}`;
    }
  }

  // Fallback if no match found (shouldn't happen, but safety)
  const setup = SETUPS[0];
  const reason = reasonsToUse[0] || {
    text: "The universe had other plans",
    tones: [TONE.CASUAL],
  };
  const punchline = PUNCHLINES[0];
  const reasonText = reason.text.charAt(0).toUpperCase() + reason.text.slice(1);

  return `${setup.text} ${reasonText}. ${punchline.text}`;
}

// Generate 100 fallback excuses (for backwards compatibility)
export const FALLBACK_EXCUSES = Array.from({ length: 100 }, (_, i) =>
  composeExcuse(i * 6000)
);

// Track recent excuses to avoid duplicates
const recentExcuses = [];
const MAX_RECENT = 5;

// Generate personalized fingerprint-based excuse (respects user's vibe)
export function generatePersonalizedExcuse(seedOverride = null) {
  const fingerprint = getCosmicFingerprint();
  const vibe = getVibeForUser(fingerprint);

  // Get personalized reason pool for this user (REASON_ROTATION)
  const reasonPool = getReasonPoolForFingerprint(fingerprint);

  // Use provided seed or fingerprint as seed for deterministic but unique excuse
  // Different users get different excuses at same time
  const seed = seedOverride === null ? fingerprint * 7919 : seedOverride; // Prime multiplier for better distribution

  return composeExcuse(seed, vibe, reasonPool);
}

// Generate context-aware excuse for current time of day
// Uses same daily seed but modifies it based on time context for variety
export function generateContextAwareExcuse(baseSeed) {
  const hour = new Date().getHours();
  let contextModifier;
  
  // Add different prime multiplier for each time period
  if (hour >= 5 && hour < 12) {
    contextModifier = 11; // Morning
  } else if (hour >= 12 && hour < 17) {
    contextModifier = 13; // Afternoon
  } else if (hour >= 17 && hour < 21) {
    contextModifier = 17; // Evening
  } else {
    contextModifier = 19; // Night
  }
  
  const fingerprint = getCosmicFingerprint();
  const vibe = getVibeForUser(fingerprint);
  const reasonPool = getReasonPoolForFingerprint(fingerprint);
  
  // Modify seed with context multiplier to get different excuse for same day
  const contextSeed = baseSeed * contextModifier;
  
  return composeExcuse(contextSeed, vibe, reasonPool);
}

// Expose current user's vibe for UI pairing (e.g., brand captions)
export function getUserVibe() {
  const fingerprint = getCosmicFingerprint();
  return getVibeForUser(fingerprint);
}

/**
 * Generates a cosmic excuse
 * Uses offline AI-generated micro-reasons pool (REASON_ROTATION enabled)
 * Each user gets a personalized subset of reasons based on cosmic fingerprint
 * No API calls needed - pure offline deterministic generation
 */
export async function generateExcuse() {
  // Small delay for better UX (shows loading state)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const fingerprint = getCosmicFingerprint();
  const vibe = getVibeForUser(fingerprint);

  // Get personalized reason pool for this user (REASON_ROTATION)
  const reasonPool = getReasonPoolForFingerprint(fingerprint);

  // Generate random excuse, avoid recent duplicates
  let newExcuse;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    // Use timestamp + random for better seed distribution
    const randomSeed = (Date.now() + Math.random() * 1000000) % 2147483647;
    newExcuse = composeExcuse(randomSeed, vibe, reasonPool);
    attempts++;
  } while (recentExcuses.includes(newExcuse) && attempts < maxAttempts);

  // Track this excuse
  recentExcuses.push(newExcuse);
  if (recentExcuses.length > MAX_RECENT) {
    recentExcuses.shift(); // Remove oldest
  }

  return newExcuse;
}

/**
 * Generates a zodiac-flavored excuse
 * Takes the user's selected zodiac sign and generates an excuse
 * that strongly aligns with that sign's tones
 */
export async function generateZodiacExcuse(zodiacSign, seedOverride = null) {
  if (!zodiacSign || !SIGN_TONES[zodiacSign]) {
    return generateExcuse(); // Fallback to regular excuse
  }

  // Small delay for UX (shows loading state)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const fingerprint = getCosmicFingerprint();
  const reasonPool = getReasonPoolForFingerprint(fingerprint);

  // Filter out reasons that mention zodiac signs directly (Opcija B: zodiac is flavor, not mention)
  const filteredReasonPool = reasonPool.filter(
    (reason) => !containsZodiacMention(reason.text)
  );

  // Get the tones for this zodiac sign
  const zodiacTones = SIGN_TONES[zodiacSign];

  // Generate excuse that matches zodiac tones
  const generateZodiacExcuse = () => {
    const randomSeed = seedOverride
      ? (seedOverride + Math.random() * 1000000) * 1000 + (Date.now() % 1000)
      : (Date.now() + Math.random() * 1000000) % 2147483647;
    const rng = mulberry32(randomSeed);

    // Try to find setup, reason, punchline that match zodiac tones
    for (let innerAttempts = 0; innerAttempts < 10; innerAttempts++) {
      const setup = SETUPS[Math.floor(rng() * SETUPS.length)];
      // Use filtered pool to avoid zodiac mentions in the reason
      const reason =
        filteredReasonPool[Math.floor(rng() * filteredReasonPool.length)] ||
        aiReasons.reasons.find((r) => !containsZodiacMention(r.text)) ||
        aiReasons.reasons[0];
      const punchline = PUNCHLINES[Math.floor(rng() * PUNCHLINES.length)];

      const commonTone = findCommonTone(setup, reason, punchline);

      // Check if this tone matches any of the zodiac's preferred tones
      if (commonTone && zodiacTones.includes(commonTone)) {
        const reasonText =
          reason.text.charAt(0).toUpperCase() + reason.text.slice(1);
        return `${setup.text} ${reasonText}. ${punchline.text}`;
      }
    }

    // Fallback if no perfect match
    const fallbackSetup = SETUPS[Math.floor(Math.random() * SETUPS.length)];
    const fallbackReason =
      filteredReasonPool[
        Math.floor(Math.random() * filteredReasonPool.length)
      ] || aiReasons.reasons[0];
    const fallbackPunchline =
      PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];
    const reasonText =
      fallbackReason.text.charAt(0).toUpperCase() +
      fallbackReason.text.slice(1);
    return `${fallbackSetup.text} ${reasonText}. ${fallbackPunchline.text}`;
  };

  const newExcuse = generateZodiacExcuse();

  // Don't track zodiac excuses in recentExcuses (explicit user action)
  return newExcuse;
}
