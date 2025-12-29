import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

// Helper: Clear all caches (DRY)
function clearAllCaches() {
  if ("caches" in window) {
    return caches.keys().then((names) => {
      return Promise.all(names.map((name) => caches.delete(name)));
    });
  }
  return Promise.resolve();
}

// Check for version updates and force refresh if needed
let updateChecked = false;

function checkForUpdates() {
  if (updateChecked) return;
  updateChecked = true;

  // Fetch index.html to check version
  fetch("/index.html", { cache: "no-store" })
    .then((response) => response.text())
    .then((html) => {
      // Extract version from meta tag
      const versionRegex = /<meta name="app-version" content="([^"]+)"/;
      const versionMatch = versionRegex.exec(html);
      const newVersion = versionMatch ? versionMatch[1] : "0";
      const currentVersion =
        localStorage.getItem("astronope-app-version") || "0";

      console.log(
        `Current version: ${currentVersion}, New version: ${newVersion}`
      );

      if (newVersion !== currentVersion) {
        console.log("New version detected. Clearing caches and reloading...");
        localStorage.setItem("astronope-app-version", newVersion);

        // Unregister service worker
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
              registration.unregister();
            });
          });
        }

        // Clear all caches and reload
        clearAllCaches().then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        });
      }
    })
    .catch((err) => console.log("Update check failed:", err));
}

// Check for updates immediately
checkForUpdates();

// Register Service Worker for PWA with auto-update
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);

        // Check for updates every 30 seconds (aggressive)
        setInterval(() => {
          registration.update();
        }, 30 * 1000);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available - clear cache and reload
              console.log("New app version available. Auto-refreshing...");
              clearAllCaches().then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });
            }
          });
        });

        // Check immediately on load
        registration.update();
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
