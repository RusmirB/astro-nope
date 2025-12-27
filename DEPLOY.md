# Deployment Guide

## Quick Deploy to Vercel (Production)

**Current deployment:** https://my-app-nine-alpha-34.vercel.app

### Standard Deployment

```bash
npm run build && npx vercel --prod
```

### Version Management

**IMPORTANT:** After each deployment with code changes, increment version in `index.html`:

```html
<meta name="app-version" content="X" />
```

This triggers automatic cache invalidation on user devices via Service Worker version checking.

**Current version:** Check `index.html` meta tag

### Cache Strategy

The app uses aggressive caching with automatic invalidation:

1. **Service Worker** (`public/sw.js`)

   - Cache name includes daily date (YYYY-MM-DD)
   - Network-first for HTML
   - Cache-first for assets
   - Old caches auto-deleted on activation

2. **Version Checking** (`src/main.jsx`)
   - Checks app-version meta tag every 30 seconds
   - Clears all caches if version mismatch
   - Auto-reloads page on new version

### Deployment Checklist

- [ ] Test locally: `npm run dev`
- [ ] Build without errors: `npm run build`
- [ ] Increment version in `index.html`
- [ ] Deploy: `npx vercel --prod`
- [ ] Test on mobile browser (cache clearing)
- [ ] Verify new version loads (check console for version logs)

### Troubleshooting Cache Issues

If users see old version:

1. Increment version number in `index.html`
2. Redeploy
3. Service Worker will auto-clear cache within 30 seconds

---

## Publishing to App Stores

### Android (Google Play) via Trusted Web Activity (TWA)

- Install Bubblewrap CLI:

```bash
npm install -g @bubblewrap/cli
```

- Initialize TWA using your live PWA manifest:

```bash
bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.json
bubblewrap build
```

- Host `assetlinks.json` at `https://YOUR_DOMAIN/.well-known/assetlinks.json` with your app package and signing key fingerprint. A placeholder file is added at `public/.well-known/assetlinks.json` — update `package_name` and `sha256_cert_fingerprints`.
- Upload the generated `.aab` to Google Play Console.

### iOS (Apple App Store) via Capacitor

- Add Capacitor and platform packages:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

- Initialize Capacitor and add platforms:

```bash
npm run build
npx cap init AstroNope com.example.astronope --npm-client npm
npx cap add ios
npx cap sync
npx cap open ios
```

- In Xcode: set signing, add icons/splash, review `Info.plist`, build and submit.
- Native share is integrated via Capacitor in `src/App.jsx` and falls back to Web Share.

### Notes

- Replace placeholders: `com.example.astronope`, `YOUR_DOMAIN`, and the SHA256 fingerprint.
- Ensure PWA icons exist (SVG + PNGs), and offline works via `public/sw.js`.
- Declare analytics usage (Plausible is cookie-free) in store privacy forms if enabled.

---

## Option 2: Netlify (Also Very Easy)

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```
   - First time: Follow prompts to login
   - You'll get a URL like `astronope.netlify.app`

**Or use Netlify Dashboard:**

- Go to https://app.netlify.com
- Drag & drop the `dist` folder
- Done!

---

## Option 3: GitHub Pages

1. Install gh-pages:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:

   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. Deploy:

   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages in your repo settings:
   - Settings → Pages → Source: `gh-pages` branch

---

## Option 4: Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Connect your GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

---

## Test Production Build Locally

Before deploying, test the production build:

```bash
npm run preview
```

Then open `http://localhost:4173`

For mobile testing on same network:

```bash
npm run preview:mobile
```

Then access from phone: `http://YOUR_IP:4173`

---

## Environment Variables (If Using AI)

If you're using AI-generated excuses, add your API key in the hosting platform:

**Vercel:**

- Project Settings → Environment Variables
- Add `VITE_OPENAI_API_KEY` or `VITE_ANTHROPIC_API_KEY`

**Netlify:**

- Site Settings → Environment Variables
- Add your keys

**Note:** After adding env vars, redeploy!

---

## Quick Deploy Commands

**Vercel:**

```bash
vercel --prod
```

**Netlify:**

```bash
netlify deploy --prod --dir=dist
```

---

## Recommended: Vercel

Vercel is the easiest and fastest:

- ✅ Free tier is generous
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Instant deployments
- ✅ Great for React apps

Just run: `npm install -g vercel && vercel`

# Deployment Guide for AstroNope

Your production build is ready in the `dist` folder! Here are the easiest ways to deploy:

## Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

   - Follow the prompts (defaults are fine)
   - Your app will be live in ~30 seconds!
   - You'll get a URL like `astronope.vercel.app`

3. For future updates, just run `vercel` again

**Or use Vercel Dashboard:**

- Go to https://vercel.com
- Sign up/login with GitHub
- Click "New Project"
- Import your repo (or drag & drop the `dist` folder)
- Deploy!

---

## Option 2: Netlify (Also Very Easy)

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```
   - First time: Follow prompts to login
   - You'll get a URL like `astronope.netlify.app`

**Or use Netlify Dashboard:**

- Go to https://app.netlify.com
- Drag & drop the `dist` folder
- Done!

---

## Option 3: GitHub Pages

1. Install gh-pages:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:

   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. Deploy:

   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages in your repo settings:
   - Settings → Pages → Source: `gh-pages` branch

---

## Option 4: Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Connect your GitHub repo
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy!

---

## Test Production Build Locally

Before deploying, test the production build:

```bash
npm run preview
```

Then open `http://localhost:4173`

For mobile testing on same network:

```bash
npm run preview:mobile
```

Then access from phone: `http://YOUR_IP:4173`

---

## Environment Variables (If Using AI)

If you're using AI-generated excuses, add your API key in the hosting platform:

**Vercel:**

- Project Settings → Environment Variables
- Add `VITE_OPENAI_API_KEY` or `VITE_ANTHROPIC_API_KEY`

**Netlify:**

- Site Settings → Environment Variables
- Add your keys

**Note:** After adding env vars, redeploy!

---

## Quick Deploy Commands

**Vercel:**

```bash
vercel --prod
```

**Netlify:**

```bash
netlify deploy --prod --dir=dist
```

---

## Recommended: Vercel

Vercel is the easiest and fastest:

- ✅ Free tier is generous
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Instant deployments
- ✅ Great for React apps

Just run: `npm install -g vercel && vercel`
