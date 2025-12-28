// 🎨 FLAVOR ENGINE
// Generates zodiac flavor lines that overlay the core message
// Supports both static (Phase 1) and AI-assisted (Phase 2+) modes

/**
 * Flavor generation modes:
 * - 'static': Uses predefined PLANET_FLAVORS (deterministic, offline, fast)
 * - 'ai': Uses OpenAI API to generate personalized flavor (requires API key, premium feature)
 */
export const FLAVOR_MODE = {
  STATIC: "static",
  AI: "ai",
};

// Validation rules for flavor lines (applies to both static and AI)
const VALIDATION_RULES = {
  maxWords: 6,
  maxChars: 50,
  forbiddenPhrases: [
    "tomorrow",
    "try again",
    "come back",
    "return",
    "align",
    "pause",
    "reflect",
    "consider",
    "energies are",
    "transits",
    "houses",
    "phases",
  ],
  forbiddenPatterns: [
    /\d{3}/g, // No 111, 222, 333 etc
    /angel number/i,
    /you should/i,
    /you need/i,
    /it's okay/i,
  ],
};

/**
 * Validates a flavor line against AstroNope content rules
 * @param {string} flavorText - The flavor text to validate
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateFlavor(flavorText) {
  if (!flavorText || typeof flavorText !== "string") {
    return { valid: false, reason: "Empty or invalid flavor" };
  }

  const text = flavorText.trim();

  // Length checks
  const wordCount = text.split(/\s+/).length;
  if (wordCount > VALIDATION_RULES.maxWords) {
    return {
      valid: false,
      reason: `Too long: ${wordCount} words (max ${VALIDATION_RULES.maxWords})`,
    };
  }

  if (text.length > VALIDATION_RULES.maxChars) {
    return {
      valid: false,
      reason: `Too long: ${text.length} chars (max ${VALIDATION_RULES.maxChars})`,
    };
  }

  // Forbidden phrases
  const lowerText = text.toLowerCase();
  for (const phrase of VALIDATION_RULES.forbiddenPhrases) {
    if (lowerText.includes(phrase)) {
      return { valid: false, reason: `Contains forbidden phrase: "${phrase}"` };
    }
  }

  // Forbidden patterns (regex)
  for (const pattern of VALIDATION_RULES.forbiddenPatterns) {
    if (pattern.test(text)) {
      return { valid: false, reason: `Matches forbidden pattern: ${pattern}` };
    }
  }

  return { valid: true };
}

/**
 * Check if flavor repeats words from core message
 * @param {string} coreText - The core excuse text
 * @param {string} flavorText - The flavor text
 * @returns {boolean} - True if repetition detected
 */
export function hasRepetition(coreText, flavorText) {
  if (!coreText || !flavorText) return false;

  const coreWords = new Set(
    coreText
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3) // Only check words longer than 3 chars
  );

  const flavorWords = flavorText
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  return flavorWords.some((word) => coreWords.has(word));
}

/**
 * Get flavor line for a zodiac sign (static mode)
 * Uses deterministic selection based on date + ruling planet
 * @param {string} coreText - The core excuse text
 * @param {string} zodiacSign - The zodiac sign key (e.g., 'virgo')
 * @returns {string|null} - Flavor line or null if no zodiac
 */
export function getStaticFlavor(coreText, zodiacSign) {
  if (!zodiacSign) return null;

  // Import planet flavors from zodiacTones (lazy import to avoid circular deps)
  const { getPlanetFlavorForSign } = require("../utils/zodiacTones");

  const flavorText = getPlanetFlavorForSign(zodiacSign);

  // Validate before returning
  const validation = validateFlavor(flavorText);
  if (!validation.valid) {
    console.warn(`Static flavor validation failed: ${validation.reason}`);
    return null; // Fallback: no flavor
  }

  // Check repetition
  if (hasRepetition(coreText, flavorText)) {
    console.warn("Static flavor repeats core words, skipping");
    return null;
  }

  return flavorText;
}

/**
 * Get AI-generated flavor line (Phase 2+ feature)
 * @param {string} coreText - The core excuse text
 * @param {string} zodiacSign - The zodiac sign key
 * @param {object} options - API options (apiKey, model, etc.)
 * @returns {Promise<string|null>} - AI flavor or null if failed
 */
export async function getAIFlavor(coreText, zodiacSign, options = {}) {
  // Phase 2 implementation placeholder
  // Will call OpenAI API with strict prompt + validators

  console.warn("AI flavor mode not yet implemented");

  // Fallback to static for now
  return getStaticFlavor(coreText, zodiacSign);

  /* Phase 2 implementation:
  
  const prompt = `Given this core excuse:
"${coreText}"

Add a short zodiac flavor line (max 6 words) for ${zodiacSign}.
Tone: dry, modern, sarcastic.
No mysticism. No explanations.
Do not repeat words from the core.

Output only the flavor line, nothing else.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a sarcastic excuse generator. Be brief, dry, and modern.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 20,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content?.trim();

    if (!aiText) {
      throw new Error('Empty AI response');
    }

    // Validate AI output
    const validation = validateFlavor(aiText);
    if (!validation.valid) {
      console.warn(`AI flavor validation failed: ${validation.reason}`);
      return getStaticFlavor(coreText, zodiacSign); // Fallback
    }

    // Check repetition
    if (hasRepetition(coreText, aiText)) {
      console.warn('AI flavor repeats core words, using static fallback');
      return getStaticFlavor(coreText, zodiacSign);
    }

    return aiText;

  } catch (error) {
    console.error('AI flavor generation failed:', error);
    return getStaticFlavor(coreText, zodiacSign); // Always fallback to static
  }
  */
}

/**
 * Main interface: Get flavor line based on mode
 * @param {string} coreText - The core excuse text
 * @param {string} zodiacSign - The zodiac sign key (e.g., 'virgo')
 * @param {string} mode - FLAVOR_MODE.STATIC or FLAVOR_MODE.AI
 * @param {object} options - Additional options (for AI mode: apiKey, model)
 * @returns {Promise<string|null>} - Flavor line or null
 */
export async function getFlavorLine(
  coreText,
  zodiacSign,
  mode = FLAVOR_MODE.STATIC,
  options = {}
) {
  if (!zodiacSign) {
    return null; // No zodiac = no flavor
  }

  switch (mode) {
    case FLAVOR_MODE.STATIC:
      return getStaticFlavor(coreText, zodiacSign);

    case FLAVOR_MODE.AI:
      return await getAIFlavor(coreText, zodiacSign, options);

    default:
      console.warn(`Unknown flavor mode: ${mode}, defaulting to static`);
      return getStaticFlavor(coreText, zodiacSign);
  }
}

/**
 * Batch validate multiple flavor lines (useful for testing JSON pool)
 * @param {string[]} flavorLines - Array of flavor texts
 * @returns {{ valid: string[], invalid: Array<{text: string, reason: string}> }}
 */
export function batchValidate(flavorLines) {
  const valid = [];
  const invalid = [];

  for (const line of flavorLines) {
    const validation = validateFlavor(line);
    if (validation.valid) {
      valid.push(line);
    } else {
      invalid.push({ text: line, reason: validation.reason });
    }
  }

  return { valid, invalid };
}
