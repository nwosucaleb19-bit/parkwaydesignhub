// ════════════════════════════════════════════════════════════════════
// Product registry — Parkway Projects ships three products on one hub.
// Switching a product swaps its logo, accent, nav directory, and content;
// the neutral light/dark chrome stays constant. Everything is static —
// no backend. Add a product = append an entry here.
//
// To brand a scaffolded product later: give it real `accent`, a `logo`
// (set hasLogo:true), and replace `scaffoldModules()` with real modules.
// ════════════════════════════════════════════════════════════════════

import { MODULES, buildItems, scaffoldModules } from "./nav.js";

// Neutral accent for products without finalised brand tokens yet.
export const NEUTRAL_ACCENT = { base: "#8A8A85", hover: "#75756F", soft: "#EFEFED", ink: "#52524C" };

const withItems = (p) => ({ ...p, items: buildItems(p.modules) });

export const PRODUCTS = [
  withItems({
    id: "parkway",
    name: "Parkway",
    tagline: "Design system",
    status: "live",
    accent: { base: "#F9956B", hover: "#FBBFA6", soft: "#FEF1EA", ink: "#C77756" },
    hasLogo: true,
    logo: { light: "/logos/logo-light.svg", dark: "/logos/logo-dark.svg" },
    lettermark: "P",
    modules: MODULES,
  }),
  withItems({
    id: "readycash",
    name: "ReadyCash",
    tagline: "Coming soon",
    status: "soon",
    accent: NEUTRAL_ACCENT,
    hasLogo: false,
    lettermark: "R",
    modules: scaffoldModules(),
    blurb:
      "ReadyCash on the Parkway hub. Its colours, type, components, and logo populate here once finalised in Figma.",
  }),
  withItems({
    id: "swwwipe",
    name: "Swwwipe",
    tagline: "Coming soon",
    status: "soon",
    accent: NEUTRAL_ACCENT,
    hasLogo: false,
    lettermark: "S",
    modules: scaffoldModules(),
    blurb:
      "Swwwipe on the Parkway hub. Its colours, type, components, and logo populate here once finalised in Figma.",
  }),
];

export const DEFAULT_PRODUCT = "parkway";

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const linkTo = (productId, pageId) => `#/${productId}/${pageId}`;

// Apply a product's accent hue to the live theme. Only the base + hover are
// set inline; the soft/ink derivatives stay theme-aware in the stylesheet so
// dark mode keeps a readable accent.
export function applyAccent(product) {
  const a = (product && product.accent) || NEUTRAL_ACCENT;
  const s = document.documentElement.style;
  s.setProperty("--pk-accent", a.base);
  s.setProperty("--pk-accent-hover", a.hover);
}
