// Simple script to generate PWA icons
// Run with: node scripts/generate-icons.js
// Requires: npm install canvas (or use online tool)

console.log(`
╔══════════════════════════════════════════════════════════════╗
║          AstroNope Icon Generation Instructions              ║
╚══════════════════════════════════════════════════════════════╝

Since generating actual image files requires image libraries,
here are the easiest ways to create the required icons:

OPTION 1: Online Tool (Easiest - 5 minutes)
────────────────────────────────────────────
1. Go to: https://realfavicongenerator.net/
2. Upload a 512x512px image (or use their generator)
3. Download the generated icons
4. Place these files in public/ directory:
   - icon-192.png (192x192px)
   - icon-512.png (512x512px)

OPTION 2: Design Tool (10 minutes)
───────────────────────────────────
1. Use Figma, Canva, or any design tool
2. Create 512x512px square
3. Design with cosmic theme:
   - Purple gradient (#667eea to #764ba2)
   - Stars or planets
   - Text: "AN" or "AstroNope"
4. Export as PNG
5. Resize to 192x192px and 512x512px
6. Save to public/ directory

OPTION 3: Quick Placeholder (For Testing)
──────────────────────────────────────────
Create simple colored squares for now:
- Purple gradient background
- White text "AN"
- Can replace later with proper design

REQUIRED FILES:
────────────────
public/icon-192.png      (192x192px)
public/icon-512.png      (512x512px)
public/og-image.png      (1200x630px) - For social sharing

QUICK START:
────────────
1. Create a 512x512px image with cosmic theme
2. Use online tool: https://realfavicongenerator.net/
3. Download and place in public/ folder
4. Done!

The app will work without icons, but they're needed for:
- App installation prompts
- Home screen icons  
- Social media previews
`);

