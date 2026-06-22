# Parkway Design System Hub — Redesign & Restructure

**Date:** 2026-06-12
**Status:** Approved design (pending written-spec review)
**Scope:** UI/UX redesign + code restructure of the Parkway Design System Hub (React + Vite). Not a feature change — all existing functionality is preserved.

---

## 1. Goals

1. **Logo & brand page** (Figma node 86:4) — present the two Parkway wordmark lockups and the symbol, downloadable as SVG and PNG.
2. **Re-categorize navigation** into a GitBook-style directory tree, organized into four modules.
3. **Icon rail with labels**, driven by **Phosphor** icons; seed an iconography module and document consumer install (web + Vue).
4. **Real PP Right Gothic Wide** typeface (from `public/fonts/`) replacing the Archivo stand-in in the hub UI.
5. **Light + dark mode** redesign — light follows the hashtask reference, dark follows the Knowledge Base reference; neutral/monochrome, single restrained tangerine accent.
6. **Light/dark toggle** using the Skiper `ThemeToggleButton1` visual, adapted to pure React + CSS.

### Non-goals
- Building out every placeholder component (Inputs, Navigation, Feedback, Installation, Usage guidelines, Changelog) — these appear in the directory as `SOON` placeholders only.
- Changing the snippet contract: snippets keep referencing `"PP Right Gothic"`, `--pk-*` tokens, and `PkColors`.
- Extracting real npm packages or Code Connect (roadmap items 3–4).

### Must-not-break (verified after implementation)
Component browsing · global framework switch (React/Vue/Flutter) · copy-to-clipboard (code, swatches, hex) · per-page Figma deep-links · search · hash-routed deep-linkable pages · keyboard a11y, focus states, skip link.

---

## 2. Architecture — modular split

Today everything lives in one ~1000-line `src/ParkwayHub.jsx`. Because new components will keep dropping, we split into focused modules (CLAUDE.md roadmap item 1). **Adding a component = add one page file + one registry entry.**

```
src/
  main.jsx                 (unchanged entry)
  ParkwayHub.jsx           shell composition only (rail + directory + content + theme provider)
  theme.js                 light/dark token maps, ThemeProvider, useTheme, localStorage + prefers-color-scheme
  tokens.js                Parkway design-system data: COLORS, TYPE_DESKTOP/MOBILE, SPACING, BTN
  nav.js                   directory registry (data-driven; see §4)
  iconography/
    index.js               curated Phosphor icon re-exports — single source for hub UI + Icons page
  snippets/
    tokens.js, typography.js, button.js, index.js   (the code-snippet strings, moved out verbatim)
  lib/
    copy.js                copyText clipboard helper (+ fallback)
    download.js            SVG fetch + PNG canvas rasterization (size picker)
  components/
    Rail.jsx               zone 1 — icon+label rail
    Directory.jsx          zone 2 — search + nested tree + counts + SOON/LIVE/BUILDING badges
    TopBar.jsx             page title + secondary actions + ThemeToggle
    ThemeToggle.jsx        ThemeToggleButton1 adapted to CSS
    Tabs.jsx, Select.jsx, Row.jsx, CodeBlock.jsx, CopyBtn.jsx, Stage.jsx, SectionLabel.jsx, PageIntro.jsx
  pages/
    Introduction.jsx  Buttons.jsx  Colors.jsx  Typography.jsx  Spacing.jsx  Icons.jsx  Logo.jsx  Placeholder.jsx
```

A **page registry** maps `page` keys → components:
```js
const PAGES = { introduction, buttons, colors, typography, spacing, icons, logo };
// unknown/soon keys render <Placeholder/>
```

The refactor is **behavior-preserving**: snippet strings and token data move verbatim; existing copy/search/hash-routing logic is relocated, not rewritten.

---

## 3. Theming (light + dark)

Two layers, kept distinct:
- **Theme tokens** — the hub's own chrome (surfaces, lines, text). Swap by `data-theme` on the root.
- **System tokens** — Parkway's palette (tangerine/grey/buff scales). Documented content; identical in both modes (the Colors page always shows the full palette).

Theme tokens are CSS custom properties toggled via `:root[data-theme="dark"]`:

| Token | Light | Dark | Role |
|---|---|---|---|
| `--pk-canvas` | `#FFFFFF` | `#1A1A1A` | content background |
| `--pk-rail-bg` | `#FBFBFA` | `#0E0E0E` | rail (darker than panels) |
| `--pk-panel-bg` | `#FFFFFF` | `#161616` | directory panel |
| `--pk-raised` | `#FFFFFF` | `#232323` | hover/raised elements |
| `--pk-stage` | `#FBFBFA` | `#141414` | preview canvas |
| `--pk-selected` | `#F4F4F2` | `#262626` | active nav row |
| `--pk-line` | `#E7E7E4` | `#242424` | hairline border |
| `--pk-line-soft` | `#EFEFED` | `#1F1F1F` | inner divider |
| `--pk-text` | `#1A1A1A` | `#F2F2F0` | primary text |
| `--pk-text-2` | `#52524C` | `#A5A5A0` | secondary text |
| `--pk-text-muted` | `#8A8A85` | `#7A7A75` | muted |
| `--pk-text-faint` | `#A5A5A0` | `#6A6A66` | labels/counts |
| `--pk-accent` | `#F9956B` | `#F9956B` | primary + active only |

Rules (both modes): no shadows/glows/gradients; hairline borders separate regions; soft radii 8–12px; tangerine used **only** on the primary action and active nav indicator; no purple/blue anywhere. Code blocks stay dark in both modes (matches both references).

**Toggle:** `ThemeToggle.jsx` reproduces Skiper `ThemeToggleButton1` — a split black/white disc that rotates 180° on toggle — with React state + a CSS `transform: rotate()` transition (no framer-motion/lucide/cn). Honors `prefers-reduced-motion`. Initial theme = stored value in `localStorage('pk-theme')`, else `prefers-color-scheme`. Lives top-right in the TopBar.

---

## 4. Navigation directory (three zones)

**Zone 1 — Rail** (slim, icon + label): brand mark, then the four modules, each a Phosphor icon + short label. Active module gets the `--pk-selected` fill. Selecting a rail item reveals/scrolls its module in the directory and opens its first available page.

**Zone 2 — Directory:** search field at top, then the registry rendered as a nested tree — uppercase module labels, item rows (label left, count/badge right), indented children with a 1px guide line (`border-left`), per the GitBook reference. Active item gets `--pk-selected`. Search filters across modules with an empty state.

**Zone 3 — Content:** TopBar (page title left; secondary actions + ThemeToggle right), then labeled sections, each with a section label + one-line muted description, then rows/previews with right-aligned controls. Preserves the existing PageIntro → Tabs → Stage → CodeBlock flow.

### Registry (`nav.js`) and statuses
```
Get started   Introduction (BUILDING) · Installation (SOON) · Usage guidelines (SOON)
Components    Buttons (LIVE) · Inputs (SOON) · Navigation (SOON) · Feedback (SOON)
Foundations   Colors / Tokens (LIVE, children: Atomic Tangerine 9, Rich Grey 13, Buff 9, Messaging 2)
              · Typography (LIVE) · Spacing (LIVE, 8) · Icons (BUILDING)
Resources     Logo & brand (BUILDING) · Figma file (external ↗) · Changelog (SOON)
```
- **LIVE** — already built, kept working.
- **BUILDING** — created this pass (Introduction, Icons, Logo & brand).
- **SOON** — placeholder row (badge, opens a styled "Coming soon" `<Placeholder/>` page); easy to promote later.

Each item: `{ id, label, page?, node?, href?, external?, status, children? }`. New component later = append an item + add its `pages/` file.

---

## 5. Icons (Phosphor)

- Install `@phosphor-icons/react`; remove the unused `@hugeicons/react`.
- `src/iconography/index.js` re-exports the curated set used by the hub (rail + UI), giving the design system one icon source.
- **Foundations → Icons** page: a searchable grid of a curated Phosphor subset with weight examples, plus install/usage docs for **web (`@phosphor-icons/react`)** and **Vue (`@phosphor-icons/vue`)** — the "web + Vue" ask, documented for consumers rather than installed into this React app. Flutter note: nearest equivalent guidance.

---

## 6. Logo & brand page (Figma 86:4)

Assets already in `public/logos/`: `logo-light.svg` (black wordmark, for light bg), `logo-dark.svg` (white wordmark, for dark bg). Both 583×152, tangerine mark `#F9956B`.

- **Wordmark** section: two cards — "On light" (white stage) and "On dark" (black stage). Preview stages are **fixed** white/black regardless of hub theme; card chrome follows the theme.
- **Symbol** section: one card with the tangerine mark alone on a neutral stage. The mark SVG (`parkway-mark.svg`) is derived by isolating the `fill="#F9956B"` path(s) from a lockup and giving them a tight viewBox.
- **Brand color** row: Atomic Tangerine swatch + `#F9956B` + copy.
- **Downloads:** each card offers **SVG** (direct file download) and **PNG** with a **1×/2×/3× size picker**. PNG is rasterized client-side (`lib/download.js`): load SVG → draw to `<canvas>` at the chosen scale → `toBlob('image/png')` → download. Transparent background preserved.

---

## 7. Fonts

`@font-face` for PP Right Gothic Wide from `public/fonts/Right Gothic Wide/web/*.woff2`:
- `PPRightGothic-WideMedium.woff2` (weight 500) — H1–H4 display per Figma spec.
- Optionally Bold/Regular for range. `font-display: swap`; `.woff` fallback for older browsers.
- Replace the `'Archivo', font-stretch:125%` stand-in in the hub's display headings (`.ph-title` etc.) with the real face.
- Manrope (body) and JetBrains Mono (code) continue from Google Fonts.

---

## 8. Page-by-page

| Page | Change |
|---|---|
| Introduction | Rename/repurpose existing Overview; same content, new shell + theming; links use the registry. |
| Buttons | Preserved (playground, tabs, code, props, states, guidance); restyled to theme tokens; controls move to the directory/panel pattern as today. |
| Colors | Preserved; palette unchanged; nested children mirror the directory tree. |
| Typography | Preserved; specimens now render in real PP Right Gothic. |
| Spacing | Preserved. |
| Icons | New — Phosphor grid + consumer install docs. |
| Logo & brand | New — §6. |
| Placeholder | New — shared "Coming soon" page for SOON items. |

---

## 9. Dependencies & build

- **Add:** `@phosphor-icons/react`. **Remove:** `@hugeicons/react`.
- **No** framer-motion / lucide / clsx (toggle is pure CSS).
- Verify: `npm run build` passes; dev server serves + transforms; manual pass on every must-not-break item in both themes.

---

## 10. Out of scope / future
Real component pages for SOON items · Installation & Usage guidelines content · Changelog (roadmap item 4) · npm packages + Code Connect (roadmap item 3) · per-component nested sub-pages.
