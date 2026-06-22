// ════════════════════════════════════════════════════════════════════
// Parkway design-system tokens — extracted from Figma "Parkway Website
// and Rails". These are documented CONTENT (rendered literally on the
// Colors/Typography/Spacing pages), distinct from the hub's theme tokens.
// Nodes: Colors 87:32 · Type-Desktop 88:140 · Type-Mobile 530:6673 ·
// Spacing 95:75 · Buttons 95:97 · Logo 86:4
// ════════════════════════════════════════════════════════════════════

export const FIGMA_FILE =
  "https://www.figma.com/design/awFCtNVY5J46nHLu73MdLH/Parkway-Website-and-Rails";

export const figmaHref = (node) =>
  node ? `${FIGMA_FILE}?node-id=${node.replace(":", "-")}&m=dev` : FIGMA_FILE;

export const FRAMEWORKS = [
  ["react", "React"],
  ["vue", "Vue.js"],
  ["flutter", "Flutter"],
];

export const COLORS = {
  tangerine: [
    ["tangerine-01", "#F9956B", "Primary"],
    ["tangerine-02", "#FAAA89", "Tint 1"],
    ["tangerine-03", "#FBBFA6", "Tint 2 · btn hover"],
    ["tangerine-04", "#FDD5C4", "Tint 3 · btn disabled"],
    ["tangerine-05", "#FEEAE1", "Tint 4"],
    ["tangerine-06", "#C77756", "Shade 1"],
    ["tangerine-07", "#955940", "Shade 2"],
    ["tangerine-08", "#643C2B", "Shade 3"],
    ["tangerine-09", "#321E15", "Shade 4"],
  ],
  grey: [
    ["grey-01", "#121212", "Secondary"],
    ["grey-02", "#999999", "Tint"],
    ["grey-03", "#C6C6C6", "Tint"],
    ["grey-04", "#DDDDDD", "Tint · alt hover"],
    ["grey-05", "#EFEFEF", "Tint · alt default"],
    ["grey-06", "#FBFBFB", "Tint · alt disabled"],
    ["white-01", "#FFFFFF", "White"],
    ["grey-07", "#BBBBBB", "Shade · disabled text"],
    ["grey-08", "#868686", "Shade"],
    ["grey-09", "#444444", "Shade"],
    ["grey-10", "#1F1F1F", "Shade"],
    ["grey-11", "#171616", "Shade"],
    ["grey-12", "#000000", "Black"],
  ],
  buff: [
    ["buff-01", "#F2DC8E", "Alternative"],
    ["buff-02", "#F5E3A5", "Tint 1"],
    ["buff-03", "#F7EABB", "Tint 2"],
    ["buff-04", "#FAF1D2", "Tint 3"],
    ["buff-05", "#FCF8E8", "Tint 4"],
    ["buff-06", "#C2B072", "Shade 1"],
    ["buff-07", "#918455", "Shade 2"],
    ["buff-08", "#615839", "Shade 3"],
    ["buff-09", "#302C1C", "Shade 4"],
  ],
  messaging: [
    ["success", "#36CC4F", "Success"],
    ["error", "#FF0000", "Errors"],
  ],
};

export const COLOR_GROUPS = [
  ["tangerine", "Primary — Atomic Tangerine", COLORS.tangerine],
  ["grey", "Secondary — Rich Greys & White", COLORS.grey],
  ["buff", "Alternative — Buff", COLORS.buff],
  ["messaging", "Messaging", COLORS.messaging],
];

export const TYPE_DESKTOP = [
  ["H1", "PP Right Gothic · Wide Medium", 65, "130%", 0, false],
  ["H2", "PP Right Gothic · Wide Medium", 50, "130%", 0, false],
  ["H3", "PP Right Gothic · Wide Medium", 37, "125%", 0, false],
  ["H4", "PP Right Gothic · Wide Medium", 23, "152%", 0, false],
  ["H5", "Manrope · Bold", 18, "120%", -0.5, false],
  ["H6", "Manrope · SemiBold", 14, "120%", 3, true],
  ["P21", "Manrope · Regular / Medium", 21, "160%", 0, false],
  ["P18", "Manrope · Regular / Medium", 18, "180%", 0, false],
  ["P16", "Manrope · Regular / Medium", 16, "180%", 0, false],
  ["P14", "Manrope · Regular / Medium", 14, "180%", 0, false],
  ["P12", "Manrope · Regular / Medium", 12, "180%", 0, false],
];

export const TYPE_MOBILE = [
  ["H1", "PP Right Gothic · Wide Medium", 38, "130%", 0, false],
  ["H2", "PP Right Gothic · Wide Medium", 28, "130%", 0, false],
  ["H3", "PP Right Gothic · Wide Medium", 24, "120%", 0, false],
  ["H4", "PP Right Gothic · Wide Medium", 18, "152%", 0, false],
  ["H5", "Manrope · Bold", 14, "120%", -0.5, false],
  ["H6", "Manrope · SemiBold", 12, "120%", 3, true],
  ["P21", "Manrope · Regular / Medium", 18, "160%", 0, false],
  ["P18", "Manrope · Regular / Medium", 16, "180%", 0, false],
  ["P16", "Manrope · Regular / Medium", 14, "180%", 0, false],
  ["P14", "Manrope · Regular / Medium", 12, "180%", 0, false],
];

export const SPACING = [8, 16, 24, 32, 40, 48, 56, 64];

// Button spec from Figma node 95:97
export const BTN = {
  height: 54,
  radius: 27,
  font: "600 14px Manrope",
  widths: { small: 98, icon: 200, medium: 275, large: 325, xlarge: "100%" },
  primary: { default: "#F9956B", hover: "#FBBFA6", disabled: "#FDD5C4" },
  alternative: { default: "#EFEFEF", hover: "#DDDDDD", disabled: "#FBFBFB" },
  text: "#121212",
  textDisabled: "#BBBBBB",
};
