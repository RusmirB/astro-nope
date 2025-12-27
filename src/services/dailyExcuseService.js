import {
  FALLBACK_EXCUSES,
  generatePersonalizedExcuse,
  getCosmicFingerprint,
} from "./excuseService";

// Max number of rerolls per day (1 default message + MAX_DAILY_REROLLS transformations = 2 total messages)
const MAX_DAILY_REROLLS = 2;

// Derive a stable daily seed using local date and timezone
export function getDailySeed(
  userId,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  const now = new Date();
  // Get date in the target timezone (yyyy-mm-dd)
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now).reduce((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {});
  const ymd = `${parts.year}-${parts.month}-${parts.day}`;

  // Use cosmic fingerprint if no userId, otherwise use userId
  const identifier = userId || getCosmicFingerprint().toString();
  const base = `${identifier}-${ymd}-${timezone}`;

  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Fetch or store a daily excuse (uses cosmic fingerprint for personalization)
export async function getDailyExcuse({
  userId,
  astroSign,
  timezone,
  useReroll = false,
  rerollCountOverride = null,
}) {
  // Phase 1: local-only deterministic daily excuse, no backend
  // Uses cosmic fingerprint for unique-feeling personalization
  const key = "astronope_daily_excuse";
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    const storedDate = stored?.date;

    // If we have a stored excuse for today and it's not a reroll request, return it
    if (stored && storedDate === today && !useReroll) {
      return {
        excuse: stored.excuse,
        seed: stored.seed,
        source: "personalized",
        rerollsLeft: MAX_DAILY_REROLLS - (stored.rerollCount || 0),
      };
    }

    // Handle reroll: check if we have rerolls left for today
    if (useReroll && storedDate === today) {
      // Use override count if provided (from UI state), otherwise use stored
      const rerollCount =
        rerollCountOverride !== null
          ? rerollCountOverride
          : stored.rerollCount || 0;
      if (rerollCount >= MAX_DAILY_REROLLS) {
        // No rerolls left, return current excuse
        return {
          excuse: stored.excuse,
          seed: stored.seed,
          source: "personalized",
          rerollsLeft: 0,
        };
      }
      // Generate new seed for reroll using secondary seed
      const baseSeed = getDailySeed(userId, tz);
      // Add timestamp component to ensure each reroll generates different message
      // even if clicked rapidly
      const timestamp = Math.floor(Date.now() / 100) % 10000; // Last 4 digits of timestamp
      const rerollSeed = baseSeed + (rerollCount + 1) * 1000 + timestamp;
      const newExcuse = generatePersonalizedExcuse(rerollSeed);

      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            date: today,
            excuse: newExcuse,
            seed: rerollSeed,
            tz,
            rerollCount: rerollCount + 1,
          })
        );
      } catch {}

      return {
        excuse: newExcuse,
        seed: rerollSeed,
        source: "personalized",
        rerollsLeft: MAX_DAILY_REROLLS - (rerollCount + 1),
      };
    }
  } catch {}

  // Generate personalized excuse for first time today
  const seed = getDailySeed(userId, tz);
  const excuse = generatePersonalizedExcuse(seed);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({ date: today, excuse, seed, tz, rerollCount: 0 })
    );
  } catch {}
  return { excuse, seed, source: "personalized", rerollsLeft: 3 };
}
