import { useState, useEffect } from "react";
import "./App.css";
import {
  generatePersonalizedExcuse,
  generateContextAwareExcuse,
  getCurrentTimeContext,
  getUserVibe,
} from "./services/excuseService";
import { getDailyExcuse } from "./services/dailyExcuseService";
import InstallPrompt from "./components/InstallPrompt";
import ZodiacSelector from "./components/ZodiacSelector";
import {
  trackPageView,
  trackNewExcuse,
  trackCopy,
  trackShare,
  trackFavorite,
  trackFavoritesView,
  trackImageShare,
  trackBrandCaptionShown,
  trackBrandCaptionCopy,
  trackBrandCaptionDismissed,
} from "./utils/analytics";
import {
  getSuggestedBrandCaption,
  hasBrandCaptionShown,
  markBrandCaptionShown,
  incrementSessionShareCount,
} from "./utils/brand";
import {
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
  getFavorites,
} from "./services/favoritesService";
import { generateExcuseImage, downloadImage } from "./services/imageService";
import {
  getSelectedZodiac,
  flavorExcuse,
  splitExcuseWithFlavor,
  ZODIAC_SIGNS,
} from "./utils/zodiacTones";

// Phase 1: Zero input, zero identity, zero friction
function App() {
  const [excuse, setExcuse] = useState("");
  const [baseSeed, setBaseSeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showBrandCaption, setShowBrandCaption] = useState(false);
  const [brandCaption, setBrandCaption] = useState("");
  const [brandCaptionTimer, setBrandCaptionTimer] = useState(null);
  const [showZodiacSelector, setShowZodiacSelector] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState(getSelectedZodiac());
  // Uklanjamo reroll logiku
  const [isDailyMessage, setIsDailyMessage] = useState(true);
  const [showCosmicTransition, setShowCosmicTransition] = useState(false);
  const [showUniverseIntro, setShowUniverseIntro] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [timeContext, setTimeContext] = useState(getCurrentTimeContext());
  const [showContextExcuse, setShowContextExcuse] = useState(false);
  const [showMerchBanner, setShowMerchBanner] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const getBaseExcuse = () => {
    if (isDailyMessage && baseSeed !== null) {
      // If context mode is active, generate context-aware excuse
      if (showContextExcuse) {
        return generateContextAwareExcuse(baseSeed);
      }
      return generatePersonalizedExcuse(baseSeed);
    }
    return excuse;
  };

  const getFlavoredExcuse = () => {
    const base = getBaseExcuse();
    if (!selectedZodiac) return base;
    return flavorExcuse(base, selectedZodiac);
  };

  const getSplitExcuse = () => {
    const base = getBaseExcuse();
    return splitExcuseWithFlavor(base, selectedZodiac);
  };

  // Calculate and update streak
  const updateStreak = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const streakKey = "astronope_streak";
    const stored = JSON.parse(localStorage.getItem(streakKey) || "null");

    if (!stored || stored.lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
        "en-CA",
        {
          timeZone: tz,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );

      let newStreak = 1;
      if (stored?.lastVisit === yesterday) {
        // Consecutive day
        newStreak = (stored.streak || 0) + 1;
      }

      localStorage.setItem(
        streakKey,
        JSON.stringify({
          lastVisit: today,
          streak: newStreak,
        })
      );

      setStreak(newStreak);
    } else {
      setStreak(stored.streak || 1);
    }

    // Set formatted date (polish): "Today · Dec 27"
    const date = new Date();
    const monthDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    setTodayDate(`Today · ${monthDay}`);
  };

  useEffect(() => {
    trackPageView("home");
    updateStreak();
    setTimeout(() => setShowUniverseIntro(false), 2000);

    // DEV ONLY: Clear Service Worker cache on localhost
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      navigator.serviceWorker?.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log("🧹 Service Worker unregistered for dev mode");
        });
      });
      caches?.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
        console.log("🧹 Cache cleared for dev mode");
      });
    }

    // Preload base seed from localStorage to avoid flicker
    try {
      const saved = JSON.parse(
        localStorage.getItem("astronope_daily_seed") || "null"
      );
      const today = new Date().toLocaleDateString("en-CA");
      if (saved && saved.date === today && typeof saved.seed === "number") {
        setBaseSeed(saved.seed);
        setExcuse(generatePersonalizedExcuse(saved.seed));
        setIsDailyMessage(true);
        setIsLoading(false);
      }
    } catch {}

    (async () => {
      try {
        const result = await getDailyExcuse({
          userId: null,
          astroSign: null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setBaseSeed(result.seed);
        setExcuse(generatePersonalizedExcuse(result.seed));
        // Persist for the rest of the day
        try {
          const today = new Date().toLocaleDateString("en-CA");
          localStorage.setItem(
            "astronope_daily_seed",
            JSON.stringify({ date: today, seed: result.seed })
          );
        } catch {}
        setIsDailyMessage(true);
        setIsLoading(false);
        trackNewExcuse();
      } catch (e) {
        console.error("getDailyExcuse error:", e);
        setExcuse("The universe is having connectivity issues. Try again.");
        setIsLoading(false);
      }
    })();
    // Zodiac changes are now unlimited - no counter needed
    updateFavoritesList();
  }, []);

  useEffect(() => {
    if (excuse) {
      setFavoriteStatus(checkIsFavorite(excuse));
    }
  }, [excuse]);

  // Uklanjamo loadNewExcuse - nema rerollova

  const updateFavoritesList = () => {
    setFavorites(getFavorites());
  };

  const handleToggleFavorite = () => {
    const current = getBaseExcuse();
    if (!current) return;

    if (favoriteStatus) {
      removeFavorite(current);
      showToast("Removed from favorites");
      trackFavorite("remove");
    } else {
      addFavorite(current);
      showToast("Added to favorites! ⭐");
      trackFavorite("add");
    }
    setFavoriteStatus(!favoriteStatus);
    updateFavoritesList();
  };

  const handleLoadFavorite = async (favoriteExcuse) => {
    // Favorites are tools, not daily replacements
    // Copy to clipboard for reuse elsewhere
    const success = await copyTextRobust(favoriteExcuse);
    if (success) {
      showToast("Copied! The universe won't judge. 📋");
      trackCopy();
    } else {
      showToast("Copy failed. Try again.");
    }
    setShowFavorites(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
  };

  // Robust copy helper: Clipboard API → selection-based → textarea fallback
  const copyTextRobust = async (text) => {
    // Prefer modern Clipboard API in secure contexts
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {}
    }

    // Selection-based fallback: select the visible excuse element and copy
    try {
      const el = document.querySelector(".excuse-text");
      if (el) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = document.createRange();
          range.selectNodeContents(el);
          selection.addRange(range);
        }
        const ok = document.execCommand("copy");
        // Clear selection if we set it
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
        if (ok) return true;
      }
    } catch {}

    // Hidden textarea fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (ok) return true;
    } catch {}

    return false;
  };

  const maybeShowBrandCaption = () => {
    // Always increment share count for merch banner tracking
    const vibe = getUserVibe();
    const currentShareCount = incrementSessionShareCount();
    setShareCount(currentShareCount);

    // Show brand caption only once per session
    if (!hasBrandCaptionShown()) {
      const caption = getSuggestedBrandCaption(vibe, currentShareCount);
      setBrandCaption(caption);
      setShowBrandCaption(true);
      // Auto-hide after 30s
      if (brandCaptionTimer) clearTimeout(brandCaptionTimer);
      const t = setTimeout(() => setShowBrandCaption(false), 30000);
      setBrandCaptionTimer(t);
      markBrandCaptionShown();
      trackBrandCaptionShown();
    }

    // Check if we should show merch banner (after 3+ shares)
    if (
      currentShareCount >= 3 &&
      !localStorage.getItem("astronope_merch_shown")
    ) {
      setTimeout(() => {
        setShowMerchBanner(true);
        localStorage.setItem("astronope_merch_shown", "true");
      }, 2000);
    }
  };

  const handleCopy = async () => {
    const ok = await copyTextRobust(getFlavoredExcuse());
    if (ok) {
      showToast("Copied to clipboard! ✨");
      trackCopy();
      maybeShowBrandCaption();
    } else {
      console.warn("Failed to copy via all methods");
      // Silent fail - don't show error toast
    }
  };

  // Helper: Format excuse for sharing (includes flavor + URL)
  const getShareableText = (includeUrl = true) => {
    const { core, flavor } = getSplitExcuse();
    let text = core;

    // Add flavor if zodiac is selected
    if (flavor) {
      text += `\n${flavor}`;
    }

    // Add branding + URL for viral growth
    if (includeUrl) {
      text += `\n\n🌌 astronope.com - your daily cosmic nope`;
    }

    return text;
  };

  const handleShare = async () => {
    // Use Web Share API (works on mobile browsers and PWA)
    if (navigator.share) {
      try {
        // Try to share as image if possible (primarily mobile)
        try {
          const { core, flavor } = getSplitExcuse();
          const imageBlob = await generateExcuseImage(
            core,
            flavor,
            selectedZodiac
          );
          if (
            navigator.canShare &&
            navigator.canShare({
              files: [
                new File([imageBlob], "astronope.png", { type: "image/png" }),
              ],
            })
          ) {
            const file = new File([imageBlob], "astronope-excuse.png", {
              type: "image/png",
            });
            await navigator.share({
              title: "AstroNope - Daily Cosmic Nope",
              text: getShareableText(),
              files: [file],
            });
            trackShare("image");
            maybeShowBrandCaption();
            return;
          }
        } catch (imgError) {
          // Fall through to text share (Firefox, desktop browsers)
        }

        // Fallback to text share
        await navigator.share({
          title: "AstroNope — Daily Cosmic Nope",
          text: getShareableText(),
        });
        trackShare("text");
        maybeShowBrandCaption();
      } catch (error) {
        // AbortError = user clicked back/cancel, silent dismiss
        if (error.name === "AbortError") {
          return;
        }
        // Other errors: fallback to copy silently
        console.warn("Share failed, falling back to copy:", error);
        await handleCopy();
      }
    } else {
      // No share API available (laptop), fallback to copy silently
      await handleCopy();
    }
  };

  const handleCopyBrandCaption = async () => {
    if (!brandCaption) return;
    try {
      await navigator.clipboard.writeText(brandCaption);
      showToast("Caption copied! ✨");
      trackBrandCaptionCopy();
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = brandCaption;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Caption copied! ✨");
        trackBrandCaptionCopy();
      } catch {}
      ta.remove();
    }
  };

  const handleDismissBrandCaption = () => {
    if (brandCaptionTimer) clearTimeout(brandCaptionTimer);
    setShowBrandCaption(false);
    trackBrandCaptionDismissed();
  };

  const handleZodiacSelect = () => {
    const newZodiac = getSelectedZodiac();
    setSelectedZodiac(newZodiac);
    setShowZodiacSelector(false);
  };

  const handleZodiacChange = (zodiacSign) => {
    if (!zodiacSign) {
      setSelectedZodiac(null);
      showToast("Zodiac flavor removed");
      setShowZodiacSelector(false);
      return;
    }
    // Provera: da li je isti znak već selektovan?
    if (selectedZodiac === zodiacSign) {
      showToast(`Already using ${zodiacSign} energy ✨`);
      setShowZodiacSelector(false);
      return;
    }
    // Unlimited promene - nema limita!
    setSelectedZodiac(zodiacSign);
    // Vizuelni "universe updated" efekat
    setShowCosmicTransition(true);
    setTimeout(() => setShowCosmicTransition(false), 800);
    // Samo menja ton prikaza, ne generiše novu poruku
    showToast(`Zodiac changed to ${zodiacSign}!`);
    // Ensure picker closes immediately regardless of child animation
    setShowZodiacSelector(false);
  };

  const handleShareImage = async () => {
    if (!excuse) return;

    try {
      setIsLoading(true);
      const { core, flavor } = getSplitExcuse();
      const imageBlob = await generateExcuseImage(core, flavor, selectedZodiac);

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [
            new File([imageBlob], "astronope.png", { type: "image/png" }),
          ],
        })
      ) {
        const file = new File([imageBlob], "astronope-excuse.png", {
          type: "image/png",
        });
        try {
          await navigator.share({
            title: "AstroNope — Daily Cosmic Nope",
            text: getShareableText(),
            files: [file],
          });
          showToast("Image shared! 🎨");
          trackImageShare();
        } catch (shareError) {
          // AbortError = user clicked back, silent dismiss
          if (shareError.name !== "AbortError") {
            console.warn("Share failed:", shareError);
            showToast("Failed to share. Try downloading instead.");
          }
        }
      } else {
        // Fallback: download the image
        downloadImage(imageBlob);
        showToast("Image downloaded! 📥");
        trackImageShare();
      }
    } catch (error) {
      console.error("Error generating image:", error);
      showToast("Failed to generate image. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="stars"></div>
      {toast && <div className="toast">{toast}</div>}
      <InstallPrompt />

      {/* Universe Intro Animation - First Load */}
      {showUniverseIntro && (
        <div className="universe-intro">
          <div className="universe-intro-stars">
            {[...Array(20)].map((_, i) => {
              const angle = (Math.PI * 2 * i) / 20;
              const distance = 200;
              return (
                <div
                  key={i}
                  className="intro-star"
                  style={{
                    left: "50%",
                    top: "50%",
                    "--tx": `${Math.cos(angle) * distance}px`,
                    "--ty": `${Math.sin(angle) * distance}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              );
            })}
          </div>
          <div className="universe-intro-text">The universe has spoken...</div>
        </div>
      )}

      {/* Cosmic Transition Animation */}
      {showCosmicTransition && (
        <div className="cosmic-transition">
          <div className="cosmic-stars">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="cosmic-star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Streak Inline (desktop-focused) */}
      {/* Show streak inline only when it starts to matter */}
      {/* Keep the UI calmer by removing the floating badge */}

      {/* Favorites Button - Top Right */}
      <button
        className="favorites-button"
        onClick={() => {
          setShowFavorites(!showFavorites);
          if (!showFavorites) trackFavoritesView();
        }}
        disabled={isLoading}
        title="View favorites"
      >
        ⭐{" "}
        {favorites.length > 0 && (
          <span className="favorites-count">{favorites.length}</span>
        )}
      </button>

      {/* Streak Counter - Top Left */}
      {streak > 0 && (
        <div className="streak-counter" title={`${streak} day streak`}>
          {streak >= 3 ? "🔥" : "⚡"} {streak}
        </div>
      )}

      <div className="container">
        {/* ...existing code... */}

        <div className="excuse-container">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Consulting the cosmos...</p>
            </div>
          ) : (
            (() => {
              const splitExcuse = getSplitExcuse();
              return (
                <div className="excuse-card">
                  <div className="excuse-date">
                    {timeContext.emoji} {todayDate}
                  </div>

                  {isDailyMessage && (
                    <div className="daily-label">
                      {showContextExcuse
                        ? timeContext.label
                        : "This is your AstroNope today"}
                    </div>
                  )}
                  <div className="excuse-text">
                    <div className="excuse-core">{splitExcuse.core}</div>
                    {splitExcuse.flavor && (
                      <div className="excuse-flavor">{splitExcuse.flavor}</div>
                    )}
                  </div>
                  {isDailyMessage && (
                    <div className="daily-hint">No further questions.</div>
                  )}
                  {selectedZodiac && (
                    <div className="zodiac-indicator">
                      ✨{" "}
                      {selectedZodiac.charAt(0).toUpperCase() +
                        selectedZodiac.slice(1)}{" "}
                      energy
                    </div>
                  )}

                  <div className="excuse-brand">astronope.com</div>
                </div>
              );
            })()
          )}
        </div>

        {/* Zodiac Button - Subtle, Below Excuse */}
        <div className="zodiac-button-container">
          <button
            className="btn-zodiac-flavor"
            onClick={() => setShowZodiacSelector(true)}
            disabled={isLoading || !excuse}
            title={
              selectedZodiac
                ? `Change zodiac (${selectedZodiac})`
                : "Blame my zodiac ✨"
            }
          >
            {selectedZodiac
              ? `Change zodiac (${selectedZodiac}) ✨`
              : "Blame my zodiac ✨"}
          </button>

          {/* Context Toggle Button */}
          <button
            className="btn-context-toggle"
            onClick={() => {
              setShowContextExcuse(!showContextExcuse);
              setTimeContext(getCurrentTimeContext());
              showToast(
                showContextExcuse
                  ? "Daily excuse"
                  : `${getCurrentTimeContext().label}`
              );
            }}
            disabled={isLoading || !baseSeed}
            title={
              showContextExcuse
                ? "Show daily excuse"
                : "Show excuse for this time"
            }
          >
            {showContextExcuse ? "📅 Daily" : `${timeContext.emoji} Now`}
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="buttons">
          {/* FEATURE FLAG: "Another one" button hidden - logic preserved for future use */}
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={isLoading || !getBaseExcuse()}
          >
            Copy
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleShare}
            disabled={isLoading || !getBaseExcuse()}
          >
            Share
          </button>
          <button
            className={`btn btn-favorite ${favoriteStatus ? "favorited" : ""}`}
            onClick={handleToggleFavorite}
            disabled={isLoading || !getBaseExcuse()}
            title={
              favoriteStatus ? "Remove from favorites" : "Add to favorites"
            }
          >
            {favoriteStatus ? "⭐" : "☆"}
          </button>
        </div>

        {/* Favorites Panel */}
        {showFavorites && (
          <div className="favorites-panel">
            <h3>Your Favorite Excuses</h3>
            {favorites.length === 0 ? (
              <p className="no-favorites">
                No favorites yet. Add some by clicking the star! ⭐
              </p>
            ) : (
              <div className="favorites-list">
                {favorites.map((fav, index) => (
                  <div key={index} className="favorite-item">
                    <p>{fav}</p>
                    <div className="favorite-actions">
                      <button
                        className="btn-small"
                        onClick={() => handleLoadFavorite(fav)}
                        title="Copy to clipboard for reuse"
                      >
                        Copy & Use
                      </button>
                      <button
                        className="btn-small"
                        onClick={() => {
                          removeFavorite(fav);
                          updateFavoritesList();
                          if (excuse === fav) {
                            setFavoriteStatus(false);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Brand Caption Suggestion — subtle, optional, once per session */}
        {showBrandCaption && brandCaption && (
          <div className="brand-caption">
            <div className="brand-caption-header">Suggested caption ✨</div>
            <div className="brand-caption-content">
              <span className="brand-caption-text">{brandCaption}</span>
              <button className="btn-small" onClick={handleCopyBrandCaption}>
                Copy
              </button>
              <button
                className="btn-small brand-caption-close"
                aria-label="Dismiss suggested caption"
                title="Dismiss"
                onClick={handleDismissBrandCaption}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Merch Banner - Show after 3+ shares */}
        {showMerchBanner && (
          <div className="merch-banner">
            <button
              className="merch-banner-close"
              onClick={() => setShowMerchBanner(false)}
              aria-label="Close merch banner"
            >
              ×
            </button>
            <div className="merch-banner-content">
              <div className="merch-banner-title">🌌 Wear Your Excuse</div>
              <p className="merch-banner-text">
                {getBaseExcuse().split(".")[0]} on a t-shirt? Why not.
              </p>
              <a
                href="https://astronope.com/merch"
                target="_blank"
                rel="noopener noreferrer"
                className="merch-banner-button"
                onClick={() => {
                  // Track merch click
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "merch_click", {
                      event_category: "Monetization",
                      event_label: "Merch Banner Click",
                    });
                  }
                }}
              >
                Browse Merch →
              </a>
            </div>
          </div>
        )}

        {/* Zodiac Selector Modal */}
        {showZodiacSelector && (
          <ZodiacSelector
            onClose={() => setShowZodiacSelector(false)}
            onSelectZodiac={handleZodiacChange}
          />
        )}
      </div>
    </div>
  );
}

// QA helper: list flavored outputs for current base across all signs
if (typeof window !== "undefined") {
  window.__astroNopeInspect = () => {
    try {
      // Find base via a temporary computation using saved seed
      const saved = JSON.parse(
        localStorage.getItem("astronope_daily_seed") || "null"
      );
      const seed = saved?.seed;
      const base =
        typeof seed === "number" ? generatePersonalizedExcuse(seed) : null;
      const out = ZODIAC_SIGNS.map((s) => ({
        sign: s.key,
        text: flavorExcuse(base || "", s.key),
      }));
      console.table(out);
      return out;
    } catch (e) {
      console.warn("inspect failed:", e);
      return [];
    }
  };
}

export default App;
