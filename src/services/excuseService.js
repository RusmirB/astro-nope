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

// Simple seeded RNG
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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
    deviceSeed = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("astronope_device_seed", deviceSeed);
  }

  // Hash to create fingerprint
  const fingerprint = `${tz}-${dow}-${month}-${timeOfDay}-${deviceSeed}`;
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    hash = (hash << 5) - hash + fingerprint.charCodeAt(i);
    hash |= 0;
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

// Layer 1: SETUP (Short, human, clear)
// These sound like a real person who just decided not to do it
const SETUPS = [
  { text: "Not today.", tones: [TONE.CASUAL, TONE.DRY] },
  { text: "I'm out for today.", tones: [TONE.CASUAL] },
  { text: "Today's a no.", tones: [TONE.CASUAL] },
  { text: "Gonna sit this one out.", tones: [TONE.CASUAL, TONE.PLAYFUL] },
  { text: "Not happening.", tones: [TONE.CASUAL, TONE.DRY] },
  { text: "I'm benching myself.", tones: [TONE.PLAYFUL] },
  { text: "Can't today.", tones: [TONE.CASUAL] },
  { text: "Nope.", tones: [TONE.DRY] },
  { text: "Today's off limits.", tones: [TONE.CASUAL] },
  { text: "I'm a ghost today.", tones: [TONE.PLAYFUL] },
  { text: "Hard pass.", tones: [TONE.DRY] },
  { text: "Taking a personal day.", tones: [TONE.CASUAL] },
  { text: "Not in the cards.", tones: [TONE.CASUAL] },
  { text: "I'm staying put.", tones: [TONE.CASUAL] },
  { text: "Today's not it.", tones: [TONE.CASUAL] },
  { text: "Gonna have to pass.", tones: [TONE.CASUAL] },
  { text: "I'm out.", tones: [TONE.DRY] },
  { text: "Not possible.", tones: [TONE.CASUAL] },
  { text: "Can't swing it.", tones: [TONE.PLAYFUL] },
  { text: "I'm skipping this.", tones: [TONE.CASUAL] },
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

// Layer 3: PUNCHLINE (Short, punchy, can be a tweet by itself)
// These CLOSE the joke and deliver the laugh
const PUNCHLINES = [
  { text: "Let's try again tomorrow.", tones: [TONE.CASUAL] },
  { text: "We move on.", tones: [TONE.DRY] },
  { text: "Blame the stars.", tones: [TONE.DRY] },
  { text: "I don't make the rules.", tones: [TONE.DRY] },
  { text: "Not my decision.", tones: [TONE.DRY] },
  { text: "The planets said so.", tones: [TONE.PLAYFUL] },
  { text: "It's written in the stars.", tones: [TONE.CASUAL] },
  { text: "Science.", tones: [TONE.DRY] },
  { text: "That's the vibe today.", tones: [TONE.CASUAL] },
  { text: "Sorry, not sorry.", tones: [TONE.PLAYFUL] },
  { text: "Take it up with the moon.", tones: [TONE.DRY] },
  { text: "Don't shoot the messenger.", tones: [TONE.PLAYFUL] },
  { text: "Blame outer space.", tones: [TONE.PLAYFUL] },
  { text: "No questions asked.", tones: [TONE.DRY] },
  { text: "That's just how it is.", tones: [TONE.CASUAL] },
  { text: "The universe has spoken.", tones: [TONE.CASUAL] },
  { text: "Can't fight cosmic forces.", tones: [TONE.PLAYFUL] },
  { text: "See you on the flip side.", tones: [TONE.PLAYFUL] },
  { text: "Better luck next century.", tones: [TONE.DRY] },
  { text: "Come back when Mercury aligns.", tones: [TONE.DRY] },
  { text: "Next time, maybe.", tones: [TONE.CASUAL] },
  { text: "The cosmos has decided.", tones: [TONE.CASUAL] },
  { text: "That's just facts.", tones: [TONE.DRY] },
  { text: "It is what it is.", tones: [TONE.CASUAL] },
  { text: "Respect the universe.", tones: [TONE.PLAYFUL] },
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

// Compose excuse using seeded RNG (with optional vibe preference)
// Now uses AI_REASONS from pool instead of hardcoded ABSURDITIES
function composeExcuse(seed, vibePreference = null, reasonPool = null) {
  const rng = mulberry32(seed);

  let setup, reason, punchline, commonTone;
  let attempts = 0;

  // Use provided pool or fallback to all reasons
  const reasonsToUse = reasonPool || AI_REASONS;

  // Try up to 5 times to find a good combination
  while (attempts < 5) {
    setup = SETUPS[Math.floor(rng() * SETUPS.length)];
    reason = reasonsToUse[Math.floor(rng() * reasonsToUse.length)];
    punchline = PUNCHLINES[Math.floor(rng() * PUNCHLINES.length)];

    // Find common tone across all three
    commonTone = findCommonTone(setup, reason, punchline);

    // If vibe preference exists, weight towards it (but allow other tones)
    if (vibePreference && commonTone) {
      // For dry vibes, prefer DRY tone
      if (
        vibePreference === VIBE_BUCKETS.DRY_SARCASTIC &&
        commonTone === TONE.DRY
      ) {
        break;
      }
      // For playful vibes, prefer PLAYFUL tone
      if (
        vibePreference === VIBE_BUCKETS.CHAOS_ENERGY &&
        commonTone === TONE.PLAYFUL
      ) {
        break;
      }
      // For casual vibes, prefer CASUAL tone
      if (
        vibePreference === VIBE_BUCKETS.PEACEFUL_NOPE &&
        commonTone === TONE.CASUAL
      ) {
        break;
      }
    }

    if (commonTone) break; // Found a good combo (even if not perfect vibe match)

    attempts++;
  }

  // Fallback if no match found (shouldn't happen, but safety)
  if (!commonTone) {
    setup = SETUPS[0];
    reason = reasonsToUse[0] || {
      text: "The universe had other plans",
      tones: [TONE.CASUAL],
    };
    punchline = PUNCHLINES[0];
  }

  // Capitalize reason text properly
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
  const seed = seedOverride !== null ? seedOverride : fingerprint * 7919; // Prime multiplier for better distribution

  return composeExcuse(seed, vibe, reasonPool);
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

  // We want to find an excuse that has at least one of the zodiac's tones
  let newExcuse;
  let attempts = 0;
  const maxAttempts = 15;

  do {
    // Use provided seed or generate random one
    const randomSeed = seedOverride
      ? (seedOverride + attempts) * 1000 + (Date.now() % 1000)
      : (Date.now() + Math.random() * 1000000) % 2147483647;
    const rng = mulberry32(randomSeed);

    let setup, reason, punchline, commonTone;
    let innerAttempts = 0;

    // Try to find setup, reason, punchline that match zodiac tones
    while (innerAttempts < 10) {
      setup = SETUPS[Math.floor(rng() * SETUPS.length)];
      // Use filtered pool to avoid zodiac mentions in the reason
      reason =
        filteredReasonPool[Math.floor(rng() * filteredReasonPool.length)] ||
        aiReasons.reasons.find((r) => !containsZodiacMention(r.text)) ||
        aiReasons.reasons[0];
      punchline = PUNCHLINES[Math.floor(rng() * PUNCHLINES.length)];

      commonTone = findCommonTone(setup, reason, punchline);

      // Check if this tone matches any of the zodiac's preferred tones
      if (commonTone && zodiacTones.includes(commonTone)) {
        break; // Found a good match for this zodiac
      }

      innerAttempts++;
    }

    // Compose the excuse
    const reasonText =
      reason.text.charAt(0).toUpperCase() + reason.text.slice(1);
    newExcuse = `${setup.text} ${reasonText}. ${punchline.text}`;

    // Zodiac excuse is explicit user action, no need to avoid recent excuses
    // (Different from daily random which should avoid repeats)
    break;
  } while (attempts < maxAttempts);

  // Don't track zodiac excuses in recentExcuses (explicit user action)
  return newExcuse;
}
