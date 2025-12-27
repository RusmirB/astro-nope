import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

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
      const versionMatch = html.match(
        /<meta name="app-version" content="([^"]+)"/
      );
      const newVersion = versionMatch ? versionMatch[1] : "0";
      const currentVersion =
        localStorage.getItem("astronope-app-version") || "0";

      console.log(
        `Current version: ${currentVersion}, New version: ${newVersion}`
      );

      if (newVersion !== currentVersion) {
        console.log("New version detected. Clearing caches and reloading...");
        localStorage.setItem("astronope-app-version", newVersion);

        // Clear all caches
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name);
            });
          });
        }

        // Force reload from server
        window.location.href = window.location.href;
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
              // New service worker available
              console.log("New app version available. Auto-refreshing...");

              // Clear cache and reload
              if ("caches" in window) {
                caches.keys().then((names) => {
                  names.forEach((name) => {
                    caches.delete(name);
                  });
                });
              }

              // Auto-refresh the page to get the new version
              setTimeout(() => {
                window.location.reload();
              }, 1000);
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
