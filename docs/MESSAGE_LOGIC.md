# AstroNope Daily Message Logic

## Core Rules

- **One daily message per user**

  - The daily message is generated deterministically (date + browser fingerprint)
  - The message is immutable for the entire day

- **Zodiac selection**

  - Does NOT generate a new message
  - Only changes the tone/flavor of the same message (e.g. "Scorpio energy")
  - User can change zodiac up to 2 times per day
  - After 2 changes, zodiac is locked until the next day

- **No rerolls**
  - There is no way to get a different excuse for the day
  - Tomorrow brings a new message

## UX Summary

- Encourages daily ritual and return visits
- Prevents "fishing" for better excuses
- Zodiac adds personalization without breaking the ritual
- Simple, fair, and easy to communicate

---

_Last updated: 2025-12-27_
