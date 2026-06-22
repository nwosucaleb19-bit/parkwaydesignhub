// ════════════════════════════════════════════════════════════════════
// Navigation directory registry (data-driven).
// Add a component later = append an item here + a page module + one line
// in the PAGES registry (ParkwayHub.jsx). Statuses:
//   live      — already built
//   building  — shipped in this redesign
//   soon      — placeholder row → "Coming soon" page
// ════════════════════════════════════════════════════════════════════

import { FIGMA_FILE } from "./tokens.js";

export const MODULES = [
  {
    id: "get-started",
    label: "Get started",
    icon: "BookOpen",
    items: [
      { id: "introduction", label: "Introduction", page: "introduction", status: "building" },
      { id: "installation", label: "Installation", status: "soon" },
      { id: "usage", label: "Usage guidelines", status: "soon" },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: "SquaresFour",
    items: [
      { id: "buttons", label: "Buttons", page: "buttons", node: "95:97", status: "live", meta: "2×5×3" },
      { id: "inputs", label: "Inputs", status: "soon" },
      { id: "navigation", label: "Navigation", status: "soon" },
      { id: "feedback", label: "Feedback", status: "soon" },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    icon: "Swatches",
    items: [
      {
        id: "colors",
        label: "Colors / Tokens",
        page: "colors",
        node: "87:32",
        status: "live",
        count: 33,
        children: [
          { label: "Atomic Tangerine", count: 9 },
          { label: "Rich Grey & White", count: 13 },
          { label: "Buff", count: 9 },
          { label: "Messaging", count: 2 },
        ],
      },
      { id: "typography", label: "Typography", page: "typography", node: "88:140", status: "live" },
      { id: "spacing", label: "Spacing", page: "spacing", node: "95:75", status: "live", count: 8 },
      { id: "icons", label: "Icons", page: "icons", status: "building", meta: "Phosphor" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: "FolderOpen",
    items: [
      { id: "logo", label: "Logo & brand", page: "logo", node: "86:4", status: "building" },
      { id: "figma", label: "Figma file", href: FIGMA_FILE, external: true },
      { id: "changelog", label: "Changelog", status: "soon" },
    ],
  },
];

// Flat lookup: item id -> { ...item, module } (external links excluded)
export const ITEMS = {};
MODULES.forEach((m) =>
  m.items.forEach((it) => {
    if (!it.external) ITEMS[it.id] = { ...it, module: m.label };
  })
);

export const DEFAULT_PAGE = "introduction";

// First navigable item in a module (for rail clicks)
export function firstItemId(moduleId) {
  const m = MODULES.find((x) => x.id === moduleId);
  const hit = m?.items.find((it) => !it.external);
  return hit ? hit.id : DEFAULT_PAGE;
}

// Which rail module owns a given item id (for active rail highlight)
export function moduleOf(itemId) {
  return MODULES.find((m) => m.items.some((it) => it.id === itemId))?.id;
}
