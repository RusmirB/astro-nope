# SEO Setup Checklist

## ✅ Completed (Just Now)

### Meta Tags & URLs

- [x] Updated canonical URL to `astronope.com`
- [x] Fixed Open Graph URLs (Facebook/LinkedIn)
- [x] Fixed Twitter Card URLs
- [x] Improved meta descriptions (more keyword-rich)
- [x] Added keywords: "daily excuse generator", "cosmic excuses", etc.
- [x] Added author meta tag
- [x] Added OG image dimensions and alt text

### Structured Data

- [x] Added Schema.org WebApplication markup
- [x] Included application category, price, ratings
- [x] Helps Google understand app purpose

### Technical SEO

- [x] Fixed Plausible analytics domain to `astronope.com`
- [x] Added preconnect hint for Plausible (performance)
- [x] Updated sitemap.xml with correct domain and image metadata
- [x] Updated README.md with correct domain
- [x] Improved title tag: "AstroNope — Your Daily Cosmic Nope | Daily Excuse Generator"

---

## 🔴 TODO (You Need to Do)

### 1. Generate OG Image (CRITICAL)

**Status:** File referenced but doesn't exist yet

**Requirements:**

- Size: 1200x630px (Facebook/Twitter standard)
- Format: PNG or JPG
- Save as: `/public/og-image.png`

**Content:**

```
[AstroNope Logo/Text]
Your Daily Cosmic Nope
When you don't want to explain, blame the universe
```

**Tools:**

- Canva (easiest): canva.com/create/twitter-header
- Figma (if designer)
- Photopea (free Photoshop alternative)

**Quick hack:** Use current app screenshot + add text overlay

---

### 2. Google Search Console Setup

**Steps:**

1. Go to: https://search.google.com/search-console
2. Add property: `astronope.com`
3. Verify ownership (choose DNS or HTML meta tag method)
4. Submit sitemap: `https://astronope.com/sitemap.xml`
5. Request indexing for homepage
6. Check for crawl errors

**Expected:** Indexed within 24-48 hours

---

### 3. Vercel Domain Configuration

**Ensure:**

- `astronope.com` points to Vercel project
- DNS CNAME or A record configured
- SSL certificate active (Vercel auto-provisions)
- Redirects from www.astronope.com → astronope.com (optional but recommended)

**Check:**

```bash
# Test if domain is live
curl -I https://astronope.com
```

---

### 4. Plausible Analytics Setup

**Steps:**

1. Go to: https://plausible.io
2. Add site: `astronope.com`
3. Verify script is loading (check Network tab in browser)
4. Set up goals (optional):
   - "Share" event
   - "Copy" event
   - "Zodiac Selection" event

---

### 5. Submit to Directories (Easy Backlinks)

**Free submissions (15 min each):**

- Product Hunt: producthunt.com/posts/create
- AlternativeTo: alternativeto.net/software/submit
- Slant: slant.co (search "excuse generator", add AstroNope)
- BetaList: betalist.com/submit
- Indie Hackers: indiehackers.com/products/new

**Impact:** Natural backlinks = SEO boost

---

### 6. Test Share Previews

**Before launching, test:**

**Facebook:**

- https://developers.facebook.com/tools/debug/
- Enter: `astronope.com`
- Click "Scrape Again"
- Verify OG image shows

**Twitter:**

- https://cards-dev.twitter.com/validator
- Enter: `astronope.com`
- Verify card preview

**LinkedIn:**

- Post inspector: https://www.linkedin.com/post-inspector/
- Enter: `astronope.com`

---

## 📊 SEO Keywords Strategy

### Primary Keywords (Target)

1. **"daily excuse generator"** (low competition, high intent)
2. **"cosmic excuse app"** (branded, unique)
3. **"astrology humor app"** (niche)

### Long-tail Keywords

- "sarcastic excuse generator"
- "daily nope app"
- "funny excuse for work"
- "zodiac excuse generator"

### Content Strategy (Future)

- Blog: "10 Best Excuses for Any Situation"
- FAQ page: "How does AstroNope work?"
- About page: "Why we built AstroNope"

---

## 🚀 Launch Checklist (Before Going Live)

- [ ] OG image generated and uploaded to `/public/og-image.png`
- [ ] Google Search Console verified
- [ ] Domain pointing to Vercel (test live URL)
- [ ] Plausible analytics verified (events tracking)
- [ ] Share previews tested (FB, Twitter, LinkedIn)
- [ ] robots.txt accessible at `astronope.com/robots.txt`
- [ ] sitemap.xml accessible at `astronope.com/sitemap.xml`
- [ ] PWA install working on mobile
- [ ] SSL certificate active (HTTPS)

---

## 📈 Post-Launch Monitoring

**Week 1:**

- Check Google Search Console for indexing
- Monitor Plausible for traffic sources
- Test share links in real social posts

**Week 2:**

- Submit to directories (Product Hunt, etc.)
- Monitor Reddit/Twitter mentions
- Track conversion rate (visitors → installs)

**Week 3:**

- Check Google rankings for "daily excuse generator"
- Analyze top traffic sources
- Iterate based on user feedback

---

## 🔥 Quick Wins (Do These First)

1. **Generate OG image** (30 min)
2. **Verify Google Search Console** (15 min)
3. **Test astronope.com is live** (5 min)
4. **Test share preview on Twitter** (5 min)

**Total time:** ~1 hour to be launch-ready

---

_Last updated: 2025-12-28_
