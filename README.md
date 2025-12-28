# AstroNope - Daily Cosmic Ritual

> 🌐 **Live:** [astronope.com](https://astronope.com)  
> 📦 **GitHub:** [RusmirB/astro-nope](https://github.com/RusmirB/astro-nope)

**When you don't want to explain - blame the universe.**

See [docs/PRODUCT_DECISION.md](docs/PRODUCT_DECISION.md) for Phase 1 (Simplicity First) and product principles.

A fun, entertainment-first app that delivers one deterministic cosmic excuse per day. Your daily ritual for cosmic accountability avoidance.

## Features

- 🌙 **One message per day** - Same core excuse throughout the day (daily ritual)
- ✨ **Zodiac flavor (optional)** - Selecting a sign adds a visible second line; no selection shows core only
- 📋 One-tap copy to clipboard
- 📤 Native share functionality
- 🎨 Beautiful cosmic-themed UI
- 📱 Mobile-responsive PWA
- ⚡ Zero friction - no login, no onboarding, no questions

## Core Mechanics

**Daily Ritual System:**

- Open app → Get your daily AstroNope
- Same message all day (deterministic, based on date + browser fingerprint)
- New message automatically at midnight (timezone-aware)

**Zodiac Transform (Optional):**

- Select zodiac sign → A zodiac flavor line appears below the core message
- Core message stays the same; flavor is deterministic per day and per sign
- No zodiac selected → No flavor line shown
- Zodiac is a strategic flavor choice, not an identity or profile

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:3004`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- React 18
- Vite
- Vanilla CSS (no dependencies)
- Service Worker with daily cache versioning
- Web Share API for native sharing
- localStorage for daily persistence

## Content System

- **500+ curated pop-astrology reasons** (aiReasons.json)
- Deterministic generation using seeded RNG (mulberry32)
- Three-part composition: SETUP + REASON + PUNCHLINE
- Tone-based matching for zodiac flavors
- No AI API calls - all client-side generation

## Mobile & PWA Support

The app is fully responsive and installable as PWA. Service Worker provides:

- Offline functionality
- Daily cache versioning (auto-update on new version)
- Aggressive cache-busting for instant updates

## Deployment

The app is deployed on Vercel with custom domain:

- **Production URL:** [astronope.com](https://astronope.com)
- **Vercel Dashboard:** [my-app project](https://vercel.com/rusmirbec-3391s-projects/my-app)
- **GitHub Repo:** [RusmirB/astro-nope](https://github.com/RusmirB/astro-nope)

Vercel automatically deploys on push to `main` branch.

**Manual deployment:**

```bash
npm run build
vercel --prod --yes
```

Version is tracked in `index.html` meta tag for cache invalidation.

## Documentation

- [Deployment Guide](docs/DEPLOY.md)
- [Product Decisions](docs/PRODUCT_DECISION.md)
- [Style Guide](docs/STYLE_GUIDE.md)
- [Business Logic](docs/BUSINESS_LOGIC.md)

## License

MIT
