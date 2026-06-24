# WS5 — Installation & Usage guidelines

**Date:** 2026-06-12 · **Branch:** caleb-branch · **Status:** approved

## Goal
Turn the two Get Started placeholders into real pages, and document usage guidelines for the core components. No production npm packages exist yet, so Installation documents adopting Parkway by copying token/type files — no fake `npm install`.

## 1. Installation page (`pages/Installation.jsx`, Get Started → Installation)
Framework-aware via the global React/Vue/Flutter tabs. Numbered steps + code blocks reusing existing snippets.
- **Web (react/vue):** ① add & import `parkway-tokens.css` (`cssTokens`) · ② bundle PP Right Gothic (`public/fonts`) + load Manrope & JetBrains Mono · ③ apply `parkway-type.css` (`typoCssDesktop`) · ④ copy components from Components.
- **Flutter:** ① add `parkway_tokens.dart` (`flutterTokens`) · ② declare fonts in `pubspec.yaml` · ③ apply `pkTextTheme` (`typoFlutter`) · ④ copy widgets.
- Status → `building`; nav item gains `page: "installation"`.

## 2. Per-component Usage guidelines
Add a Do/Don't `.ph-guidance` block (the existing Buttons pattern) to the core subset: **Text Input, Toast Message, Toggle, Checkbox** (Buttons already has one). Link button & Badges skipped per-component for now.
Content per component:
- **Text Input** — Do: visible label; show the format; errors inline with text. Don't: placeholder-as-label; silent disable; validate every keystroke.
- **Toast Message** — Do: one concise line, lead with outcome; auto-dismiss success, persist warnings; `role="alert"` for warnings. Don't: stack toasts; require an action inside a toast; use for field errors.
- **Toggle** — Do: instant on/off, apply immediately, label what it controls. Don't: use where a save/submit is needed; use for >2 states.
- **Checkbox** — Do: multi-select & opt-in; keep the label clickable; indeterminate for parent-of-many. Don't: use where a toggle fits a setting; rely on colour alone.

## 3. Global Usage guidelines page (`pages/UsageGuidelines.jsx`, Get Started → Usage guidelines)
Short, scannable principles, grouped:
- **When to use which** — toggle vs checkbox; link vs button; toast vs inline error.
- **Accessibility** — labels on every control; visible focus; ≥44px mobile hit targets; never colour alone.
- **Content** — concise sentence-case labels; lead with the outcome; active voice.
- **Consistency** — one primary action per view; reference tokens, never raw hex; 8-pt spacing.
- Status → `building`; nav item gains `page: "usage"`.

## Wiring
`nav.js`: `installation` and `usage` items get `page` keys + `status: "building"`. `ParkwayHub.jsx`: register `installation` and `usage` in PAGES (+ imports).

## Out of scope
Real npm packages / Code Connect (roadmap). Per-component guidelines for Link button & Badges (covered by the global page for now).

## Verify
`npm run build` green; both pages render in light & dark; framework tabs switch the Installation snippets; existing pages unaffected.
