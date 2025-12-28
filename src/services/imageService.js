/**
 * Generates a shareable image with the excuse text on a cosmic background
 * @param {string} coreExcuse - The core excuse text
 * @param {string|null} flavor - Optional zodiac flavor line
 * @param {string|null} zodiacSign - Optional zodiac sign for emoji
 */
export async function generateExcuseImage(
  coreExcuse,
  flavor = null,
  zodiacSign = null
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size (optimized for sharing)
  canvas.width = 1200;
  canvas.height = 630; // Good aspect ratio for social media

  // Create cosmic gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0a0a0f");
  gradient.addColorStop(0.3, "#1a1a2e");
  gradient.addColorStop(0.6, "#16213e");
  gradient.addColorStop(1, "#0f3460");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add stars
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add some larger "stars"
  ctx.fillStyle = "rgba(102, 126, 234, 0.6)";
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add text with cosmic styling
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // App name at top
  ctx.font =
    'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = "#667eea";
  ctx.fillText("AstroNope", canvas.width / 2, 80);

  // Core excuse text (with word wrapping)
  ctx.fillStyle = "#ffffff";
  ctx.font =
    'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const maxWidth = canvas.width - 120;
  const lineHeight = 70;
  const words = coreExcuse.split(" ");
  let line = "";
  let y = canvas.height / 2 - 60; // Adjusted for potential flavor line

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);

  // Add flavor line if present (zodiac overlay)
  if (flavor) {
    y += lineHeight + 10;
    ctx.font =
      'italic 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = "rgba(168, 155, 255, 0.95)";
    ctx.fillText(flavor, canvas.width / 2, y);
  }

  // Add tagline at bottom (call-to-action)
  ctx.font =
    'italic 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(
    "astronope.app - your daily cosmic nope",
    canvas.width / 2,
    canvas.height - 60
  );

  // Convert to blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/png",
      0.95
    );
  });
}

/**
 * Downloads the image
 */
export function downloadImage(blob, filename = "astronope-excuse.png") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
