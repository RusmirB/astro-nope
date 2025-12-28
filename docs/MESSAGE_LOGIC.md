# AstroNope Daily Message Logic

## Core Rules

- **One daily core message**

  - Generated deterministically (date + soft fingerprint)
  - Immutable for the entire day (no rerolls)

- **Zodiac selection (optional)**

  - Does NOT generate a new message
  - Adds a visible second line (flavor) only when a zodiac is selected
  - Unlimited changes per day; selecting the same sign does nothing
  - Flavor is a pure function of sign → ruling planet → deterministic phrase

- **No rerolls**
  - There is no way to get a different core excuse for the day
  - Tomorrow brings a new core message

### Default Tone

- Core message is biased toward **dry/sarcastic** tone for clarity and shareability
- Zodiac selection adds a cosmic flavor line; tone of core stays independent

## UX Summary

- Encourages daily ritual and return visits
- Prevents "fishing" for better core excuses
- Zodiac adds personalization without breaking the ritual (overlay, not identity)
- Simple, fair, and easy to communicate

---

_Last updated: 2025-12-28_
