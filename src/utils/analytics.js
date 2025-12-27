// Simple analytics tracking
// Can be replaced with Google Analytics, Plausible, etc.

const ANALYTICS_ENABLED = true;

// Track events
export function trackEvent(eventName, eventData = {}) {
  if (!ANALYTICS_ENABLED) return;

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log("Analytics Event:", eventName, eventData);
  }

  // Google Analytics 4 (if configured)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventData);
  }

  // Plausible (if configured)
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, { props: eventData });
  }

  // Custom analytics endpoint (optional)
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event: eventName, data: eventData })
  // });
}

// Track page views
export function trackPageView(pageName) {
  trackEvent("page_view", { page: pageName });
}

// Track excuse generation
export function trackNewExcuse() {
  trackEvent("new_excuse");
}

// Track copy action
export function trackCopy() {
  trackEvent("copy_excuse");
}

// Track share action
export function trackShare(method = "native") {
  trackEvent("share_excuse", { method });
}

// Track favorite action
export function trackFavorite(action) {
  trackEvent("favorite_excuse", { action }); // 'add' or 'remove'
}

// Track favorites panel
export function trackFavoritesView() {
  trackEvent("view_favorites");
}

// Track image share
export function trackImageShare() {
  trackEvent("share_image");
}

// Track install prompt
export function trackInstallPrompt(action) {
  trackEvent("install_prompt", { action }); // 'shown', 'accepted', 'dismissed'
}

// Brand caption shown (suggestion panel)
export function trackBrandCaptionShown() {
  trackEvent("brand_caption_shown");
}

// Brand caption copied
export function trackBrandCaptionCopy() {
  trackEvent("brand_caption_copy");
}

// Brand caption dismissed
export function trackBrandCaptionDismissed() {
  trackEvent("brand_caption_dismissed");
}
