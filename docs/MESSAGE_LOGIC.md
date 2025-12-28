# AstroNope Daily Message Logic

## Core Philosophy

AstroNope is a **dismissive refusal generator**, not a horoscope app.

Messages should feel:

- Short, confident, final
- Socially shareable (Slack, WhatsApp, Viber, Twitter)
- Sarcastic without being mystical

The universe is used as an **excuse**, not a belief system.

---

## Message Structure (MANDATORY)

Each AstroNope message has **two optional layers**:

### A) Core Message (ALWAYS present)

- **Max 12 words**
- Dry, dismissive, confident refusal
- Format: `[Setup]. [Reason]. [Closer].`
- Can be non-cosmic or lightly cosmic

Examples:

- "Pass. Calendar invited chaos. Done."
- "Nope. Brain entered airplane mode. Period."
- "Skip. Energy clocked out early. Moving on."

❌ Core must NOT mention:

- Zodiac signs
- Angel numbers (111, 222, 333, etc.)
- Astrology jargon (transits, houses, phases)

---

### B) Flavor Line (OPTIONAL)

Used ONLY when:

- User selects a zodiac sign
- Or clicks "Blame my zodiac"

Rules:

- **Max 6 words**
- Reinterprets the _same decision_, does NOT replace it
- Feels like an overlay, not a second excuse
- Deterministic per sign + day (ruling planet logic)

Examples:

- "Scorpio energy. No explanations."
- "Gemini energy. Outbox jammed."
- "Virgo energy. Overthinking denied."

❌ Flavor must NOT:

- Contradict the core message
- Repeat core words verbatim
- Introduce numerology

---

## Daily Message Behavior

- **One daily core message**

  - Generated deterministically (date + device fingerprint)
  - Immutable for the entire day (no rerolls)

- **Zodiac selection (optional)**

  - Does NOT generate a new message
  - Adds a visible second line (flavor) only when selected
  - Unlimited changes per day
  - Selecting the same sign shows a toast, no other effect

- **No rerolls**
  - No way to get a different core excuse for the day
  - Tomorrow brings a new core message

---

## Tone Rules (VERY IMPORTANT)

AstroNope tone is:

- **dry > funny**
- **confident > mystical**
- **modern > spiritual**

Preferred vocabulary:

- Pass, skip, nope, denied
- Out, closed, done, period
- System error (as human metaphor)
- Message not delivered

Avoid:

- "The universe whispers"
- "Energies are heavy"
- "Transits blocked"
- "333 / 777 / angel numbers"
- Therapy-speak
- Toxic positivity

---

## Length Constraints

- **Core:** max 12 words
- **Flavor:** max 6 words
- **No emojis** in message text (UI labels only)

---

## Share Test (FINAL CHECK)

Before approving a message, ask:

✅ Would someone paste this into Slack, WhatsApp, or Twitter?

If it sounds embarrassing or too mystical → reject it.

---

_Last updated: 2025-12-28_
