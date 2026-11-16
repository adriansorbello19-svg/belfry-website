# Belfry website — project instructions

Static HTML/CSS/JS site built section by section from Figma
(file key `1xiTxp6IRAtEUN4xRH35y9`, "Belfry-Website").

## Brand + type rules (client direction — do not override)
- Colours, gradients and type tokens live in `css/tokens.css`; see `BRAND.md`. Never hardcode a brand colour.
- **H1:** Manrope, two weights — first line Bold (700), second line Regular (400) via `<span class="t-h1__light">`. Size 70px.
- **H2 and other headings:** Manrope SemiBold (600); H2 is 40px — `.t-h2`; H3 is 26px — `.t-h3`. FAQ questions also SemiBold (Figma's Bold not used). Figma's 42px "Header 2" is set as H2 40px.
- **Body copy:** Inter Regular (400), **16px (px, not pt) / 24px**, and **15px / 22px on mobile (≤760px)** — `.t-body`. If Figma shows another body size, use 16px and mention the difference to the user.
- **Footer small print** (address, copyright, footer links): Inter Regular 14px / 20px — `.t-small`.
- **FAQ answers and demo tile body copy on mobile (≤760px):** 14px / 20px (other body copy on mobile is 15px).
- **Labels** (nav, buttons, tabs, eyebrows, list titles): Inter SemiBold (600), 16px / 24px, **15px / 22px on mobile (≤760px)** — `.t-label`.
- No other font families (Figma's Poppins nav was replaced with Inter).

## Spacing
- Every gap between sections uses `--section-gap` (tokens.css): **160px** desktop, 100px ≤1024px (tablet and mobile). Gaps across band joins (two halves) and above the footer (minus its frame) add up to the same value.

## Build workflow per section
1. Pull design context + screenshot from Figma for the given node; download assets into `assets/img/` (never hotlink figma.com URLs).
2. Check Figma strokes/fills against the render: the code export drops gradient strokes.
3. Render with Playwright at 1440px and 390px and compare against the Figma screenshot.
4. Commit and push to `main`.
5. Publish a preview link (below).

## Preview links — ALWAYS include the Layout Inspector
Every preview must carry the Layout Inspector toggle (`dev/inspector.js`): it shows margins,
padding and flex/grid gaps, and labels every text component (font/weight/size/line-height) and
media component (rendered size, source size, filename).
- Build: `python3 scripts/build-preview.py <page>.html <scratchpad>/preview`
- Publish `<scratchpad>/preview/<page>.html` to the **same** Artifact URL for that page, with
  `css/*`, `js/*`, `assets/img/*` and `dev/inspector.js` passed as `files`.
- `dev/inspector.js` is preview-only: never link it from production pages.

Preview URLs:
- Scheduling: https://claude.ai/artifact/GYLKst6UZsridsDB9kBe5P
