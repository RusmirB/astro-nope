# FlavorEngine Architecture

## Purpose

Modular flavor generation system that supports both static (Phase 1) and AI-assisted (Phase 2+) modes.

---

## Interface

### Main Function

```javascript
getFlavorLine(
  coreText,
  zodiacSign,
  (mode = FLAVOR_MODE.STATIC),
  (options = {})
);
```

**Parameters:**

- `coreText`: The core excuse message
- `zodiacSign`: Zodiac key (e.g., 'virgo')
- `mode`: `FLAVOR_MODE.STATIC` or `FLAVOR_MODE.AI`
- `options`: Config object (for AI: `{ apiKey, model }`)

**Returns:**

- `Promise<string|null>`: Flavor line or null if no zodiac/validation fails

---

## Modes

### Static Mode (Current - Phase 1)

- Uses `PLANET_FLAVORS` from zodiacTones.js
- Deterministic based on date + ruling planet
- Offline, instant, no API cost
- **Status:** ✅ Production ready

### AI Mode (Future - Phase 2+)

- Calls OpenAI API with strict prompt
- Validates output against content rules
- Falls back to static if validation fails
- **Status:** 🚧 Placeholder (awaiting budget + 10k users)

---

## Validation Rules

All flavor lines (static + AI) must pass:

✅ **Length:**

- Max 6 words
- Max 50 characters

✅ **Forbidden phrases:**

- tomorrow, try again, return, pause, reflect
- energies are, transits, houses, phases
- you should, you need, it's okay

✅ **Forbidden patterns:**

- Angel numbers (111, 222, 333, etc.)
- Coaching language

✅ **Repetition check:**

- Must not repeat words from core (>3 chars)

---

## Usage Example

```javascript
import { getFlavorLine, FLAVOR_MODE } from "./services/flavorEngine";

// Static mode (current)
const flavor = await getFlavorLine(
  "Pass. Calendar invited chaos. Done.",
  "virgo",
  FLAVOR_MODE.STATIC
);
// → "Mercury interference."

// AI mode (Phase 2)
const aiFlav = await getFlavorLine(
  "Pass. Calendar invited chaos. Done.",
  "virgo",
  FLAVOR_MODE.AI,
  { apiKey: process.env.OPENAI_KEY }
);
// → AI-generated or fallback to static
```

---

## Integration Plan

### Phase 1 (Current)

- ✅ Static flavor only
- ✅ Validators in place
- ✅ Repetition detection

### Phase 2 (10k+ users, premium tier)

- 🚧 Add OpenAI API integration
- 🚧 Implement opt-in premium flag
- 🚧 Track API costs per user
- 🚧 A/B test AI vs static quality

### Phase 3 (Optional)

- Fine-tune custom model on curated AstroNope copy
- Self-hosted inference (reduce API costs)

---

## Testing

```javascript
import { validateFlavor, batchValidate } from "./services/flavorEngine";

// Single validation
const result = validateFlavor("Mercury interference.");
console.log(result); // { valid: true }

// Batch validation (test entire PLANET_FLAVORS pool)
const flavors = Object.values(PLANET_FLAVORS).flat();
const { valid, invalid } = batchValidate(flavors);
console.log(`Valid: ${valid.length}, Invalid: ${invalid.length}`);
```

---

## Cost Estimates (AI Mode)

**OpenAI gpt-4o-mini:**

- ~$0.002 per flavor generation
- 10k daily users = $20/day = $600/month
- Premium tier at $3/month = break-even at 2k subscribers

**Mitigation:**

- Cache AI flavors per (coreText + zodiacSign) combo
- Free tier = static only
- Pro tier = AI flavor

---

## Benefits of This Architecture

✅ **Decoupled:** Flavor logic isolated from excuse generation  
✅ **Testable:** Validators can run on entire static pool  
✅ **Future-proof:** AI mode ready to plug in when budget allows  
✅ **Safe:** Always falls back to static if AI fails  
✅ **Consistent:** Same validation rules for both modes

---

_Last updated: 2025-12-28_
