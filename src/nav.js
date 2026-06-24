// ════════════════════════════════════════════════════════════════════
// Navigation directory registry (data-driven).
// Add a component later = append an item here + a page module + one line
// in the PAGES registry (ParkwayHub.jsx). Statuses:
//   live      — already built
//   building  — shipped in this redesign
//   soon      — placeholder row → "Coming soon" page
// ════════════════════════════════════════════════════════════════════

import { FIGMA_FILE } from "./tokens.js";

// Parkway Wallet components live in a separate Figma file.
const WALLET_FILE = "https://www.figma.com/design/S0VLTiTi39BsU5sYq0FUyq/ParkwayWallet";
const wfig = (node) => `${WALLET_FILE}?node-id=${node}&m=dev`;

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
      { id: "textinput", label: "Text Input", page: "textinput", figma: wfig("31764-10117"), status: "building" },
      { id: "toast", label: "Toast Message", page: "toast", figma: wfig("31766-10180"), status: "building" },
      { id: "link", label: "Link button", page: "link", figma: wfig("31766-13007"), status: "building" },
      { id: "badges", label: "Badges", page: "badges", figma: wfig("31766-13029"), status: "building" },
      { id: "toggle", label: "Toggle button", page: "toggle", figma: wfig("31766-13046"), status: "building" },
      { id: "checkbox", label: "Checkbox", page: "checkbox", figma: wfig("31767-13062"), status: "building" },
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
      { id: "grid", label: "Grid", page: "grid", status: "building", meta: "4 · 8 pt" },
      { id: "shadows", label: "Shadows", page: "shadows", status: "building", count: 3 },
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

export const DEFAULT_PAGE = "introduction";

// Flat lookup for a module set: item id -> { ...item, module } (external excluded).
export function buildItems(modules) {
  const map = {};
  modules.forEach((m) =>
    m.items.forEach((it) => {
      if (!it.external) map[it.id] = { ...it, module: m.label };
    })
  );
  return map;
}

// First navigable item in a module (for rail clicks)
export function firstItemId(modules, moduleId) {
  const m = modules.find((x) => x.id === moduleId);
  const hit = m?.items.find((it) => !it.external);
  return hit ? hit.id : DEFAULT_PAGE;
}

// Which rail module owns a given item id (for active rail highlight)
export function moduleOf(modules, itemId) {
  return modules.find((m) => m.items.some((it) => it.id === itemId))?.id;
}

// Scaffold nav for not-yet-branded products: the same module structure and
// item labels as Parkway, but every item is a "soon" placeholder except a
// coming-soon Introduction. Keeps the directory looking real before tokens exist.
export function scaffoldModules() {
  return MODULES.map((m) => ({
    id: m.id,
    label: m.label,
    icon: m.icon,
    items: m.items.map((it) =>
      it.id === "introduction"
        ? { id: "introduction", label: "Introduction", page: "product-soon", status: "building" }
        : { id: it.id, label: it.label, status: "soon" }
    ),
  }));
}
