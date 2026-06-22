import { useEffect, useState } from "react";

// ════════════════════════════════════════════════════════════════════
// PARKWAY DESIGN SYSTEM HUB
// Source of truth: Figma — "Parkway Website and Rails"
// Nodes: Colors 87:32 · Typography-Desktop 88:140 · Typography-Mobile
// 530:6673 · Spacing 95:75 · Buttons 95:97
// ════════════════════════════════════════════════════════════════════

const FIGMA_FILE = "https://www.figma.com/design/awFCtNVY5J46nHLu73MdLH/Parkway-Website-and-Rails";

// ── Tokens (extracted from Figma variables/styles) ──────────────────
const COLORS = {
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

const TYPE_DESKTOP = [
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

const TYPE_MOBILE = [
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

const SPACING = [8, 16, 24, 32, 40, 48, 56, 64];

// Button spec from Figma node 95:97
const BTN = {
  height: 54,
  radius: 27,
  font: "600 14px Manrope",
  widths: { small: 98, icon: 200, medium: 275, large: 325, xlarge: "100%" },
  primary: { default: "#F9956B", hover: "#FBBFA6", disabled: "#FDD5C4" },
  alternative: { default: "#EFEFEF", hover: "#DDDDDD", disabled: "#FBFBFB" },
  text: "#121212",
  textDisabled: "#BBBBBB",
};

// ── Code snippet generators ──────────────────────────────────────────
const cssTokens = `:root {
  /* Parkway — Atomic Tangerine (primary) */
  --pk-tangerine-01: #F9956B;  --pk-tangerine-02: #FAAA89;
  --pk-tangerine-03: #FBBFA6;  --pk-tangerine-04: #FDD5C4;
  --pk-tangerine-05: #FEEAE1;  --pk-tangerine-06: #C77756;
  --pk-tangerine-07: #955940;  --pk-tangerine-08: #643C2B;
  --pk-tangerine-09: #321E15;

  /* Parkway — Rich Grey (secondary) */
  --pk-grey-01: #121212;  --pk-grey-02: #999999;
  --pk-grey-03: #C6C6C6;  --pk-grey-04: #DDDDDD;
  --pk-grey-05: #EFEFEF;  --pk-grey-06: #FBFBFB;
  --pk-grey-07: #BBBBBB;  --pk-grey-08: #868686;
  --pk-grey-09: #444444;  --pk-grey-10: #1F1F1F;
  --pk-grey-11: #171616;  --pk-grey-12: #000000;
  --pk-white-01: #FFFFFF;

  /* Parkway — Buff (alternative) */
  --pk-buff-01: #F2DC8E;  --pk-buff-02: #F5E3A5;
  --pk-buff-03: #F7EABB;  --pk-buff-04: #FAF1D2;
  --pk-buff-05: #FCF8E8;  --pk-buff-06: #C2B072;
  --pk-buff-07: #918455;  --pk-buff-08: #615839;
  --pk-buff-09: #302C1C;

  /* Messaging */
  --pk-success: #36CC4F;
  --pk-error:   #FF0000;

  /* Spacing — 8px base unit */
  --pk-space-1: 8px;   --pk-space-2: 16px;  --pk-space-3: 24px;
  --pk-space-4: 32px;  --pk-space-5: 40px;  --pk-space-6: 48px;
  --pk-space-7: 56px;  --pk-space-8: 64px;
}`;

const tailwindTokens = `// tailwind.config.js — Parkway design tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        tangerine: {
          DEFAULT: "#F9956B", 100: "#FEEAE1", 200: "#FDD5C4",
          300: "#FBBFA6", 400: "#FAAA89", 500: "#F9956B",
          600: "#C77756", 700: "#955940", 800: "#643C2B", 900: "#321E15",
        },
        buff: {
          DEFAULT: "#F2DC8E", 100: "#FCF8E8", 200: "#FAF1D2",
          300: "#F7EABB", 400: "#F5E3A5", 500: "#F2DC8E",
          600: "#C2B072", 700: "#918455", 800: "#615839", 900: "#302C1C",
        },
        ink: {
          DEFAULT: "#121212", 50: "#FBFBFB", 100: "#EFEFEF",
          200: "#DDDDDD", 300: "#C6C6C6", 400: "#BBBBBB",
          500: "#999999", 600: "#868686", 700: "#444444",
          800: "#1F1F1F", 900: "#121212",
        },
        success: "#36CC4F",
        error: "#FF0000",
      },
      spacing: { 1: "8px", 2: "16px", 3: "24px", 4: "32px",
                 5: "40px", 6: "48px", 7: "56px", 8: "64px" },
      fontFamily: {
        display: ['"PP Right Gothic"', "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
};`;

const flutterTokens = `// parkway_tokens.dart — Parkway design tokens
import 'package:flutter/material.dart';

abstract class PkColors {
  // Atomic Tangerine (primary)
  static const tangerine01 = Color(0xFFF9956B);
  static const tangerine02 = Color(0xFFFAAA89);
  static const tangerine03 = Color(0xFFFBBFA6);
  static const tangerine04 = Color(0xFFFDD5C4);
  static const tangerine05 = Color(0xFFFEEAE1);
  static const tangerine06 = Color(0xFFC77756);
  static const tangerine07 = Color(0xFF955940);
  static const tangerine08 = Color(0xFF643C2B);
  static const tangerine09 = Color(0xFF321E15);

  // Rich Grey (secondary)
  static const grey01 = Color(0xFF121212);
  static const grey02 = Color(0xFF999999);
  static const grey03 = Color(0xFFC6C6C6);
  static const grey04 = Color(0xFFDDDDDD);
  static const grey05 = Color(0xFFEFEFEF);
  static const grey06 = Color(0xFFFBFBFB);
  static const grey07 = Color(0xFFBBBBBB);
  static const grey08 = Color(0xFF868686);
  static const grey09 = Color(0xFF444444);
  static const grey10 = Color(0xFF1F1F1F);
  static const grey11 = Color(0xFF171616);
  static const grey12 = Color(0xFF000000);
  static const white01 = Color(0xFFFFFFFF);

  // Buff (alternative)
  static const buff01 = Color(0xFFF2DC8E);
  static const buff06 = Color(0xFFC2B072);

  // Messaging
  static const success = Color(0xFF36CC4F);
  static const error = Color(0xFFFF0000);
}

abstract class PkSpacing {
  static const double s1 = 8, s2 = 16, s3 = 24, s4 = 32,
                      s5 = 40, s6 = 48, s7 = 56, s8 = 64;
}`;

const typoCssDesktop = `/* parkway-type.css — desktop ramp (PP Right Gothic + Manrope) */
.pk-h1 { font: 500 65px/1.30 "PP Right Gothic"; font-stretch: expanded; }
.pk-h2 { font: 500 50px/1.30 "PP Right Gothic"; font-stretch: expanded; }
.pk-h3 { font: 500 37px/1.25 "PP Right Gothic"; font-stretch: expanded; }
.pk-h4 { font: 500 23px/1.52 "PP Right Gothic"; font-stretch: expanded; }
.pk-h5 { font: 700 18px/1.20 Manrope; letter-spacing: -0.5px; }
.pk-h6 { font: 600 14px/1.20 Manrope; letter-spacing: 3px;
         text-transform: uppercase; }
.pk-p21 { font: 400 21px/1.60 Manrope; }
.pk-p18 { font: 400 18px/1.80 Manrope; }
.pk-p16 { font: 400 16px/1.80 Manrope; }
.pk-p14 { font: 400 14px/1.80 Manrope; }
.pk-p12 { font: 400 12px/1.80 Manrope; }
.pk-med { font-weight: 500; }

/* Mobile ramp — apply under your mobile breakpoint */
@media (max-width: 640px) {
  .pk-h1 { font-size: 38px; }  .pk-h2 { font-size: 28px; }
  .pk-h3 { font-size: 24px; line-height: 1.2; }
  .pk-h4 { font-size: 18px; }  .pk-h5 { font-size: 14px; }
  .pk-h6 { font-size: 12px; }
  .pk-p21 { font-size: 18px; } .pk-p18 { font-size: 16px; }
  .pk-p16 { font-size: 14px; } .pk-p14 { font-size: 12px; }
}`;

const typoFlutter = `// parkway_text_theme.dart — mobile ramp from Figma
import 'package:flutter/material.dart';

const _gothic = "PPRightGothic"; // bundle font in pubspec.yaml
const _manrope = "Manrope";

const pkTextTheme = TextTheme(
  displayLarge: TextStyle(   // H1 — 38pt / 130%
    fontFamily: _gothic, fontSize: 38, height: 1.30,
    fontWeight: FontWeight.w500),
  displayMedium: TextStyle(  // H2 — 28pt / 130%
    fontFamily: _gothic, fontSize: 28, height: 1.30,
    fontWeight: FontWeight.w500),
  displaySmall: TextStyle(   // H3 — 24pt / 120%
    fontFamily: _gothic, fontSize: 24, height: 1.20,
    fontWeight: FontWeight.w500),
  headlineMedium: TextStyle( // H4 — 18pt / 152%
    fontFamily: _gothic, fontSize: 18, height: 1.52,
    fontWeight: FontWeight.w500),
  titleMedium: TextStyle(    // H5 — 14pt / 120%
    fontFamily: _manrope, fontSize: 14, height: 1.20,
    fontWeight: FontWeight.w700, letterSpacing: -0.5),
  labelLarge: TextStyle(     // H6 — 12pt / 120% / +3 tracking
    fontFamily: _manrope, fontSize: 12, height: 1.20,
    fontWeight: FontWeight.w600, letterSpacing: 3),
  bodyLarge: TextStyle(      // P21 — 18pt / 160%
    fontFamily: _manrope, fontSize: 18, height: 1.60),
  bodyMedium: TextStyle(     // P18 — 16pt / 180%
    fontFamily: _manrope, fontSize: 16, height: 1.80),
  bodySmall: TextStyle(      // P16 — 14pt / 180%
    fontFamily: _manrope, fontSize: 14, height: 1.80),
  labelSmall: TextStyle(     // P14 — 12pt / 180%
    fontFamily: _manrope, fontSize: 12, height: 1.80),
);`;

const reactButton = `// PkButton.jsx — Parkway button (React)
// Figma: Buttons 95:97 · requires parkway-tokens.css
import "./parkway-tokens.css";

const WIDTHS = { small: 98, icon: 200, medium: 275, large: 325, xlarge: "100%" };

export default function PkButton({
  variant = "primary",      // "primary" | "alternative"
  size = "medium",          // "small" | "icon" | "medium" | "large" | "xlarge"
  disabled = false,
  withArrow,                // defaults to true for size="icon"
  children,
  ...rest
}) {
  const arrow = withArrow ?? size === "icon";
  return (
    <button
      className={\`pk-btn pk-btn--\${variant}\`}
      style={{ width: WIDTHS[size] }}
      disabled={disabled}
      {...rest}
    >
      <span>{children}</span>
      {arrow && <span aria-hidden="true" className="pk-btn__arrow">⟶</span>}
    </button>
  );
}

/* parkway-button.css
.pk-btn {
  height: 54px; border-radius: 27px; border: 0; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; font: 600 14px/1 Manrope, sans-serif;
  color: var(--pk-grey-01); transition: background .15s ease;
}
.pk-btn--primary            { background: var(--pk-tangerine-01); }
.pk-btn--primary:hover      { background: var(--pk-tangerine-03); }
.pk-btn--primary:disabled   { background: var(--pk-tangerine-04);
                              color: var(--pk-grey-07); cursor: not-allowed; }
.pk-btn--alternative          { background: var(--pk-grey-05); }
.pk-btn--alternative:hover    { background: var(--pk-grey-04); }
.pk-btn--alternative:disabled { background: var(--pk-grey-06);
                                color: var(--pk-grey-07); cursor: not-allowed; }
.pk-btn:focus-visible { outline: 2px solid var(--pk-grey-01); outline-offset: 2px; }
*/`;

const vueButton = `<!-- PkButton.vue — Parkway button (Vue 3) -->
<!-- Figma: Buttons 95:97 · requires parkway-tokens.css -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "primary" },   // primary | alternative
  size: { type: String, default: "medium" },        // small | icon | medium | large | xlarge
  disabled: { type: Boolean, default: false },
  withArrow: { type: Boolean, default: undefined },
});

const WIDTHS = { small: "98px", icon: "200px", medium: "275px",
                 large: "325px", xlarge: "100%" };
const width = computed(() => WIDTHS[props.size]);
const arrow = computed(() => props.withArrow ?? props.size === "icon");
</script>

<template>
  <button
    class="pk-btn"
    :class="\`pk-btn--\${variant}\`"
    :style="{ width }"
    :disabled="disabled"
  >
    <span><slot /></span>
    <span v-if="arrow" aria-hidden="true" class="pk-btn__arrow">⟶</span>
  </button>
</template>

<style scoped>
.pk-btn {
  height: 54px; border-radius: 27px; border: 0; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 6px; font: 600 14px/1 Manrope, sans-serif;
  color: var(--pk-grey-01); transition: background .15s ease;
}
.pk-btn--primary            { background: var(--pk-tangerine-01); }
.pk-btn--primary:hover      { background: var(--pk-tangerine-03); }
.pk-btn--primary:disabled   { background: var(--pk-tangerine-04);
                              color: var(--pk-grey-07); cursor: not-allowed; }
.pk-btn--alternative          { background: var(--pk-grey-05); }
.pk-btn--alternative:hover    { background: var(--pk-grey-04); }
.pk-btn--alternative:disabled { background: var(--pk-grey-06);
                                color: var(--pk-grey-07); cursor: not-allowed; }
.pk-btn:focus-visible { outline: 2px solid var(--pk-grey-01); outline-offset: 2px; }
</style>`;

const flutterButton = `// pk_button.dart — Parkway button (Flutter)
// Figma: Buttons 95:97 · requires parkway_tokens.dart
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

enum PkVariant { primary, alternative }
enum PkSize { small, icon, medium, large, xlarge }

class PkButton extends StatelessWidget {
  const PkButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = PkVariant.primary,
    this.size = PkSize.medium,
    bool? withArrow,
  }) : withArrow = withArrow ?? (size == PkSize.icon);

  final String label;
  final VoidCallback? onPressed;   // null = disabled
  final PkVariant variant;
  final PkSize size;
  final bool withArrow;

  static const _widths = {
    PkSize.small: 98.0, PkSize.icon: 200.0, PkSize.medium: 275.0,
    PkSize.large: 325.0, PkSize.xlarge: double.infinity,
  };

  @override
  Widget build(BuildContext context) {
    final primary = variant == PkVariant.primary;
    return SizedBox(
      width: _widths[size],
      height: 54,
      child: TextButton(
        onPressed: onPressed,
        style: ButtonStyle(
          shape: WidgetStatePropertyAll(RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(27))),
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.disabled)) {
              return primary ? PkColors.tangerine04 : PkColors.grey06;
            }
            if (states.contains(WidgetState.hovered) ||
                states.contains(WidgetState.pressed)) {
              return primary ? PkColors.tangerine03 : PkColors.grey04;
            }
            return primary ? PkColors.tangerine01 : PkColors.grey05;
          }),
          foregroundColor: WidgetStateProperty.resolveWith((states) =>
            states.contains(WidgetState.disabled)
              ? PkColors.grey07 : PkColors.grey01),
          textStyle: const WidgetStatePropertyAll(TextStyle(
            fontFamily: 'Manrope', fontSize: 14,
            fontWeight: FontWeight.w600)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(label),
            if (withArrow) ...[
              const SizedBox(width: 6),
              const Icon(Icons.arrow_right_alt, size: 18),
            ],
          ],
        ),
      ),
    );
  }
}`;

const usageSnippet = (fw, variant, size, state) => {
  const dis = state === "disabled";
  const label = size === "small" ? "Sign in" : "Get a demo";
  if (fw === "react")
    return `<PkButton variant="${variant}" size="${size}"${dis ? " disabled" : ""}>\n  ${label}\n</PkButton>`;
  if (fw === "vue")
    return `<PkButton variant="${variant}" size="${size}"${dis ? " disabled" : ""}>\n  ${label}\n</PkButton>`;
  return `PkButton(\n  label: '${label}',\n  variant: PkVariant.${variant},\n  size: PkSize.${size},\n  onPressed: ${dis ? "null, // disabled" : "() => handleTap(),"}\n)`;
};

// ════════════════════════════════════════════════════════════════════
// HUB CHROME — light editorial shell
// ════════════════════════════════════════════════════════════════════

const FRAMEWORKS = [
  ["react", "React"],
  ["vue", "Vue.js"],
  ["flutter", "Flutter"],
];

const PAGES = {
  overview: { label: "Getting started", group: "Overview" },
  buttons: { label: "Buttons", group: "Components", node: "95:97" },
  colors: { label: "Colors", group: "Foundations", node: "87:32" },
  typography: { label: "Typography", group: "Foundations" },
  spacing: { label: "Spacing", group: "Foundations", node: "95:75" },
};

const figmaHref = (node) =>
  node ? `${FIGMA_FILE}?node-id=${node.replace(":", "-")}&m=dev` : FIGMA_FILE;

function copyText(text, cb) {
  const done = () => { cb(true); setTimeout(() => cb(false), 1400); };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallback());
  } else fallback();
  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); done();
  }
}

// ── Icons — single hand-drawn set, 1.5px stroke ──────────────────────
const IC = {
  overview: (
    <>
      <path d="M3.5 9.7 10 4.2l6.5 5.5" />
      <path d="M5.7 8.6v7.2h8.6V8.6" />
    </>
  ),
  components: (
    <>
      <rect x="3.5" y="3.5" width="5.6" height="5.6" rx="1.3" />
      <rect x="10.9" y="3.5" width="5.6" height="5.6" rx="1.3" />
      <rect x="3.5" y="10.9" width="5.6" height="5.6" rx="1.3" />
      <rect x="10.9" y="10.9" width="5.6" height="5.6" rx="1.3" />
    </>
  ),
  colors: (
    <path d="M10 3.6c2.7 2.9 4.5 5.1 4.5 7.2a4.5 4.5 0 1 1-9 0c0-2.1 1.8-4.3 4.5-7.2Z" />
  ),
  typography: (
    <>
      <path d="m4.6 15.6 4.3-11h.6l4.3 11" />
      <path d="M6.4 11.4h5.6" />
    </>
  ),
  spacing: (
    <>
      <path d="M4.2 4.4v11.2M15.8 4.4v11.2" />
      <path d="M7 10h6" />
      <path d="m8.6 8.4-1.7 1.6 1.7 1.6M11.4 8.4l1.7 1.6-1.7 1.6" />
    </>
  ),
  search: (
    <>
      <circle cx="9.2" cy="9.2" r="5" />
      <path d="m12.9 12.9 3.3 3.3" />
    </>
  ),
  external: (
    <>
      <path d="M8.2 4.8h7v7" />
      <path d="M15.2 4.8 5 15" />
    </>
  ),
  chevron: <path d="m6.5 8 3.5 3.6L13.5 8" />,
  arrow: <path d="M4 10h11.4M11.6 5.8l4.2 4.2-4.2 4.2" />,
  close: <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />,
};

function Ic({ name, size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {IC[name]}
    </svg>
  );
}

// ── Primitives ───────────────────────────────────────────────────────

function CopyBtn({ text, dark }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => copyText(text, setOk)}
      className={`ph-copy${dark ? " dark" : ""}${ok ? " ok" : ""}`}
      aria-live="polite"
    >
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code, label }) {
  return (
    <figure className="ph-code" translate="no">
      <figcaption className="ph-codehead">
        <span className="ph-codelabel">{label}</span>
        <CopyBtn text={code} dark />
      </figcaption>
      <pre className="ph-codepre">{code}</pre>
    </figure>
  );
}

function Tabs({ value, onChange, items, label, small }) {
  const onKey = (e, idx) => {
    let next = null;
    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next == null) return;
    e.preventDefault();
    onChange(items[next][0]);
    e.currentTarget.parentElement.children[next]?.focus();
  };
  return (
    <div className={`ph-tabs${small ? " sm" : ""}`} role="tablist" aria-label={label}>
      {items.map(([k, name], i) => (
        <button
          key={k}
          type="button"
          role="tab"
          aria-selected={value === k}
          tabIndex={value === k ? 0 : -1}
          className={`ph-tab${value === k ? " act" : ""}`}
          onClick={() => onChange(k)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <span className="ph-selectwrap">
      <select
        className="ph-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
      <span className="ph-selectchev"><Ic name="chevron" size={14} /></span>
    </span>
  );
}

function GroupLabel({ children }) {
  return <p className="ph-grouplabel">{children}</p>;
}

// Panel row — label left, value/control right, hairline divider.
// Renders an <a> for navigation (href), a <button> for state changes
// (onClick), or a plain row when it hosts a control.
function Row({ label, value, control, active, onClick, href, current }) {
  const inner = (
    <>
      <span className="ph-rowlabel">{label}</span>
      {control || (value != null && <span className="ph-rowval">{value}</span>)}
    </>
  );
  const cls = `ph-row clickable${active ? " act" : ""}`;
  if (href) {
    return (
      <a className={cls} href={href} aria-current={current && active ? "page" : undefined}>
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} aria-pressed={active}>
        {inner}
      </button>
    );
  }
  return <div className="ph-row">{inner}</div>;
}

function SectionLabel({ children }) {
  return <h2 className="ph-seclabel">{children}</h2>;
}

function PageIntro({ kicker, title, blurb, node, deviceNote }) {
  return (
    <header className="ph-intro">
      <p className="ph-kicker">{kicker}</p>
      <h1 className="ph-title">{title}</h1>
      {blurb && <p className="ph-blurb">{blurb}</p>}
      {node && (
        <a className="ph-nodechip" href={figmaHref(node)} target="_blank" rel="noreferrer">
          <span className="ph-nodedot" aria-hidden="true" />
          Figma {node}
          {deviceNote ? ` · ${deviceNote}` : ""}
          <Ic name="external" size={11} />
        </a>
      )}
    </header>
  );
}

function Stage({ children, center = true, tall }) {
  return (
    <div className={`ph-stage${center ? " center" : ""}${tall ? " tall" : ""}`}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// RIGHT-PANEL PAGE CONTENT
// ════════════════════════════════════════════════════════════════════

const COLOR_GROUPS = [
  ["tangerine", "Primary — Atomic Tangerine", COLORS.tangerine],
  ["grey", "Secondary — Rich Greys & White", COLORS.grey],
  ["buff", "Alternative — Buff", COLORS.buff],
  ["messaging", "Messaging", COLORS.messaging],
];

function Swatch({ name, hex, note }) {
  const [ok, setOk] = useState(false);
  const nearWhite = ["#FFFFFF", "#FBFBFB", "#FCF8E8", "#FEEAE1", "#FAF1D2"].includes(hex);
  return (
    <button
      type="button"
      onClick={() => copyText(hex, setOk)}
      title="Click to copy hex"
      className="ph-swatch"
    >
      <span
        className="ph-swatchchip"
        style={{ background: hex, boxShadow: nearWhite ? "inset 0 0 0 1px #EFEFEF" : "none" }}
        aria-hidden="true"
      />
      <span className="ph-swatchname">--pk-{name}</span>
      <span className={`ph-swatchmeta${ok ? " ok" : ""}`} aria-live="polite">
        {ok ? "Copied" : `${hex} · ${note}`}
      </span>
    </button>
  );
}

function ColorsMain({ fw, setFw, group }) {
  const exportCode = { react: cssTokens, vue: cssTokens, flutter: flutterTokens };
  const exportLabel = { react: "parkway-tokens.css", vue: "parkway-tokens.css", flutter: "parkway_tokens.dart" };
  const groups = group === "all" ? COLOR_GROUPS : COLOR_GROUPS.filter(([k]) => k === group);
  return (
    <>
      <PageIntro
        kicker="Foundations"
        title="Colors"
        node="87:32"
        blurb="Parkway's palette is built around Atomic Tangerine with Rich Grey as the ink secondary and Buff as the warm alternative. Click any swatch to copy its hex."
      />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      {groups.map(([key, label, items]) => (
        <section key={key}>
          <SectionLabel>{label}</SectionLabel>
          <div className="ph-swatchgrid">
            {items.map(([n, h, note]) => (
              <Swatch key={n} name={n} hex={h} note={note} />
            ))}
          </div>
        </section>
      ))}
      <SectionLabel>Export tokens</SectionLabel>
      <CodeBlock code={exportCode[fw]} label={exportLabel[fw]} />
      {fw !== "flutter" && (
        <>
          <p className="ph-note">Using Tailwind? The same palette as a config extension:</p>
          <CodeBlock code={tailwindTokens} label="tailwind.config.js" />
        </>
      )}
    </>
  );
}

const TYPE_SAMPLE = "The Future of African Banking & Financial Services.";
const TYPE_BODY_SAMPLE =
  "Shorten route-to-market for innovators with a suite of everything they need to launch and grow.";

function specimenStyle([, face, size, lh, ls, upper], cap = 64) {
  const gothic = face.includes("Gothic");
  return {
    margin: 0,
    color: "#121212",
    fontFamily: gothic ? "'Archivo', sans-serif" : "'Manrope', sans-serif",
    fontStretch: gothic ? "125%" : "normal",
    fontWeight: face.includes("Bold") && !face.includes("Semi") ? 700 : face.includes("SemiBold") ? 600 : gothic ? 500 : 400,
    fontSize: Math.min(size, cap),
    lineHeight: parseFloat(lh) / 100,
    letterSpacing: ls,
    textTransform: upper ? "uppercase" : "none",
    overflowWrap: "break-word",
  };
}

function TypographyMain({ fw, setFw, device, entry, ramp, onSelect }) {
  const node = device === "desktop" ? "88:140" : "530:6673";
  const [tag, face, size, lh, ls, upper] = entry;
  const specs = [
    ["Typeface", face],
    ["Size", `${size}pt`],
    ["Line height", lh],
    ["Tracking", ls ? `${ls}px` : "0"],
    ["Case", upper ? "Uppercase" : "Sentence"],
  ];
  return (
    <>
      <PageIntro
        kicker="Foundations"
        title="Typography"
        node={node}
        deviceNote={device}
        blurb="Display headings are set in PP Right Gothic Wide Medium; H5/H6 and all paragraph styles use Manrope. The hub previews the display face with a wide fallback — production code should bundle PP Right Gothic."
      />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <Stage center={false}>
        <p className="ph-stagecap">{tag} — {face}</p>
        <p style={specimenStyle(entry)}>{tag.startsWith("P") ? TYPE_BODY_SAMPLE : TYPE_SAMPLE}</p>
      </Stage>
      <div className="ph-specrows">
        {specs.map(([k, v]) => (
          <div className="ph-row" key={k}>
            <span className="ph-rowlabel">{k}</span>
            <span className="ph-rowval">{v}</span>
          </div>
        ))}
      </div>
      <SectionLabel>Full ramp — {device}</SectionLabel>
      <div className="ph-ramp">
        {ramp.map((r) => (
          <button
            type="button"
            key={r[0]}
            className={`ph-rampitem${r[0] === tag ? " act" : ""}`}
            onClick={() => onSelect(r[0])}
          >
            <span className="ph-rampmeta">
              {r[0]} · {r[2]}pt · {r[3]}{r[4] ? ` · ${r[4]}px` : ""}
            </span>
            <span style={specimenStyle(r, 34)}>
              {r[0].startsWith("P") ? TYPE_BODY_SAMPLE : TYPE_SAMPLE}
            </span>
          </button>
        ))}
      </div>
      <SectionLabel>Export type styles</SectionLabel>
      <CodeBlock
        code={fw === "flutter" ? typoFlutter : typoCssDesktop}
        label={fw === "flutter" ? "parkway_text_theme.dart" : "parkway-type.css (Vue & React)"}
      />
    </>
  );
}

function SpacingMain({ fw, setFw, sel, onSelect }) {
  const cssSpace = `:root {\n${SPACING.map((s, i) => `  --pk-space-${i + 1}: ${s}px;`).join("\n")}\n}`;
  const dartSpace = `abstract class PkSpacing {\n  static const double ${SPACING.map((s, i) => `s${i + 1} = ${s}`).join(", ")};\n}`;
  return (
    <>
      <PageIntro
        kicker="Foundations"
        title="Spacing"
        node="95:75"
        blurb="Spacing for and between components is done in increments of 8px. The 8px base unit reduces guesswork, keeps rhythm visually harmonious, and scales well across devices."
      />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <Stage center={false}>
        <p className="ph-stagecap">The spacing system — 8px base unit</p>
        {SPACING.map((s, i) => (
          <button
            type="button"
            key={s}
            className="ph-spacerow"
            onClick={() => onSelect(i)}
            aria-pressed={sel === i}
          >
            <span className={`ph-spacelabel${sel === i ? " act" : ""}`}>
              space-{i + 1} · {s}px
            </span>
            <span
              className="ph-spacebar"
              style={{ height: s, background: sel === i ? "#F9956B" : "#FEEAE1" }}
            />
          </button>
        ))}
      </Stage>
      <SectionLabel>Export spacing</SectionLabel>
      <CodeBlock
        code={fw === "flutter" ? dartSpace : cssSpace}
        label={fw === "flutter" ? "parkway_spacing.dart" : "CSS custom properties (Vue & React)"}
      />
    </>
  );
}

// ── Buttons component page ───────────────────────────────────────────

function LiveButton({ variant, size, state }) {
  const pal = BTN[variant];
  const disabled = state === "disabled";
  const bg = pal[state];
  const label = size === "small" ? "Sign in" : "Get a demo";
  const w = BTN.widths[size];
  return (
    <button
      type="button"
      disabled={disabled}
      className={state === "default" ? `ph-live-${variant}` : ""}
      style={{
        height: BTN.height, borderRadius: BTN.radius, border: 0,
        width: w === "100%" ? "100%" : w, maxWidth: "100%",
        background: bg, color: disabled ? BTN.textDisabled : BTN.text,
        font: BTN.font, fontFamily: "Manrope, sans-serif",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        cursor: disabled ? "not-allowed" : "pointer", transition: "background .15s ease",
      }}
    >
      {label}{size === "icon" && <span aria-hidden="true" style={{ fontSize: 16 }}>⟶</span>}
    </button>
  );
}

const PROPS_ROWS = [
  ["variant", '"primary" | "alternative"', '"primary"', "Tangerine for the page's main action; grey Alternative elsewhere."],
  ["size", '"small" | "icon" | "medium" | "large" | "xlarge"', '"medium"', "Fixed widths 98 / 200 / 275 / 325px; xlarge fills its container. All are 54px tall."],
  ["disabled", "boolean", "false", "Tangerine-04 / Grey-06 fill with Grey-07 text. Flutter: pass onPressed: null."],
  ["withArrow", "boolean", 'size === "icon"', "Trailing ⟶ glyph; on by default for the icon size, opt-in elsewhere."],
  ["children / label", "string", "—", '"Sign in" pattern for small; sentence-case verbs ("Get a demo") for the rest.'],
];

function ButtonsMain({ fw, setFw, variant, size, state }) {
  const implCode = { vue: vueButton, react: reactButton, flutter: flutterButton };
  const implLabel = { vue: "PkButton.vue", react: "PkButton.jsx + parkway-button.css", flutter: "pk_button.dart" };
  const pal = BTN[variant];
  return (
    <>
      <PageIntro
        kicker="Components"
        title="Buttons"
        node="95:97"
        blurb="Pill-shaped, 54px tall, set in Manrope SemiBold 14. Two variants (Primary tangerine, Alternative grey) across five sizes and three interaction states. Hover the live preview to feel the real hover state."
      />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <Stage tall>
        <div style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "center" }}>
          <LiveButton variant={variant} size={size} state={state} />
        </div>
      </Stage>
      <CodeBlock code={usageSnippet(fw, variant, size, state)} label="Usage — reflects the controls on the left" />
      <CodeBlock code={implCode[fw]} label={implLabel[fw]} />

      <SectionLabel>Props</SectionLabel>
      <div className="ph-tablewrap">
        <table className="ph-table">
          <thead>
            <tr>
              {["Prop", "Type", "Default", "Notes"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS_ROWS.map(([p, t, d, n]) => (
              <tr key={p}>
                <td className="ph-td-prop">{p}</td>
                <td className="ph-td-type">{t}</td>
                <td className="ph-td-default">{d}</td>
                <td className="ph-td-notes">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionLabel>State tokens — {variant}</SectionLabel>
      <div className="ph-stategrid">
        {["default", "hover", "disabled"].map((s) => (
          <div key={s} className="ph-statechip">
            <span className="ph-statefill" style={{ background: pal[s] }} aria-hidden="true" />
            <span className="ph-statename">{s}</span>
            <span className="ph-statehex">{pal[s]}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Usage guidance</SectionLabel>
      <div className="ph-guidance">
        <div>
          <p className="ph-guidehead"><span className="ph-dot ok" aria-hidden="true" />Do</p>
          <ul className="ph-guidelist">
            <li>Use one Primary button per view; pair it with Alternative for secondary actions.</li>
            <li>Keep labels to 1–3 words in sentence case.</li>
            <li>Use xlarge full-width on mobile checkout-style flows.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't change the 27px pill radius or 54px height per surface.</li>
            <li>Don't recolor states manually — the tokens already encode hover/disabled.</li>
            <li>Don't rely on color alone for disabled; keep the control non-interactive.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

// ── Overview page ────────────────────────────────────────────────────

const OVERVIEW_LINKS = [
  ["colors", "Colors", "Tangerine, Rich Grey & Buff scales with messaging colors"],
  ["typography", "Typography", "PP Right Gothic display + Manrope body, desktop & mobile ramps"],
  ["spacing", "Spacing", "8px base unit system, space-1 through space-8"],
  ["buttons", "Buttons", "2 variants × 5 sizes × 3 states, live playground"],
];

const START_STEPS = [
  <>Copy <strong>parkway-tokens</strong> (CSS or Dart) from the Colors page into your project.</>,
  <>Add the type styles from the Typography page — desktop ramp for web, mobile ramp for Flutter.</>,
  <>Drop in components from the Components section; every snippet references tokens, never raw hex.</>,
  <>Need the source? Every page deep-links to its exact Figma node in Dev Mode.</>,
];

function OverviewMain() {
  return (
    <>
      <PageIntro
        kicker="Parkway design system"
        title="Built for handoff"
        blurb="One source of truth — the Parkway Figma library — translated into copy-ready code for the web team (Vue & React) and the mobile team (Flutter). Pick a framework once; every snippet on every page follows."
      />
      <SectionLabel>Browse the system</SectionLabel>
      <div className="ph-linkrows">
        {OVERVIEW_LINKS.map(([key, title, desc]) => (
          <a key={key} className="ph-linkrow" href={`#/${key}`}>
            <span>
              <span className="ph-linktitle">{title}</span>
              <span className="ph-linkdesc">{desc}</span>
            </span>
            <span className="ph-linkarrow"><Ic name="arrow" size={16} /></span>
          </a>
        ))}
      </div>
      <SectionLabel>Start here</SectionLabel>
      <ol className="ph-steps">
        {START_STEPS.map((step, i) => (
          <li key={i}>
            <span className="ph-stepnum">{String(i + 1).padStart(2, "0")}</span>
            <span className="ph-steptext">{step}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// LEFT PANEL — contextual navigator & controls
// ════════════════════════════════════════════════════════════════════

function NavRows({ page, only }) {
  const groups = [];
  Object.entries(PAGES).forEach(([key, meta]) => {
    if (only && !only.includes(key)) return;
    let g = groups.find((x) => x.name === meta.group);
    if (!g) { g = { name: meta.group, items: [] }; groups.push(g); }
    g.items.push([key, meta]);
  });
  return groups.map((g) => (
    <div key={g.name}>
      <GroupLabel>{g.name}</GroupLabel>
      {g.items.map(([key, meta]) => (
        <Row
          key={key}
          label={meta.label}
          value={meta.node || ""}
          active={page === key}
          current
          href={`#/${key}`}
        />
      ))}
    </div>
  ));
}

function SearchPanel({ q, setQ }) {
  const needle = q.trim().toLowerCase();
  const hits = Object.entries(PAGES).filter(
    ([key, meta]) =>
      meta.label.toLowerCase().includes(needle) ||
      key.includes(needle) ||
      meta.group.toLowerCase().includes(needle)
  );
  if (!hits.length) {
    return (
      <div className="ph-empty">
        <p className="ph-emptytitle">No matches for &ldquo;{q}&rdquo;</p>
        <p className="ph-emptyhint">Try a page name — colors, typography, spacing, buttons.</p>
        <button type="button" className="ph-emptyclear" onClick={() => setQ("")}>
          Clear search
        </button>
      </div>
    );
  }
  return (
    <div>
      <GroupLabel>Results · {hits.length}</GroupLabel>
      {hits.map(([key, meta]) => (
        <Row key={key} label={meta.label} value={meta.group} href={`#/${key}`} />
      ))}
    </div>
  );
}

function ButtonsPanel({ page, variant, setVariant, size, setSize, state, setState }) {
  return (
    <>
      <NavRows page={page} only={["buttons"]} />
      <GroupLabel>Properties</GroupLabel>
      <Row
        label="Variant"
        control={
          <Tabs
            small
            value={variant}
            onChange={setVariant}
            label="Variant"
            items={[["primary", "Primary"], ["alternative", "Alternative"]]}
          />
        }
      />
      <Row
        label="Size"
        control={
          <Select
            value={size}
            onChange={setSize}
            label="Size"
            options={["small", "icon", "medium", "large", "xlarge"]}
          />
        }
      />
      <Row
        label="State"
        control={
          <Tabs
            small
            value={state}
            onChange={setState}
            label="State"
            items={[["default", "Default"], ["hover", "Hover"], ["disabled", "Disabled"]]}
          />
        }
      />
      <p className="ph-panelhint">
        The usage snippet on the right mirrors these selections.
      </p>
    </>
  );
}

function ColorsPanel({ group, setGroup }) {
  const rows = [
    ["all", "All colors", COLOR_GROUPS.reduce((n, [, , items]) => n + items.length, 0)],
    ...COLOR_GROUPS.map(([key, label, items]) => [key, label.split(" — ")[1] || label, items.length]),
  ];
  return (
    <>
      <GroupLabel>Palette</GroupLabel>
      {rows.map(([key, label, count]) => (
        <Row
          key={key}
          label={label}
          value={String(count)}
          active={group === key}
          onClick={() => setGroup(key)}
        />
      ))}
    </>
  );
}

function TypographyPanel({ device, setDevice, ramp, sel, onSelect }) {
  return (
    <>
      <GroupLabel>Device</GroupLabel>
      <Row
        label="Ramp"
        control={
          <Tabs
            small
            value={device}
            onChange={setDevice}
            label="Device ramp"
            items={[["desktop", "Desktop"], ["mobile", "Mobile"]]}
          />
        }
      />
      <GroupLabel>Styles</GroupLabel>
      {ramp.map(([tag, , size, lh]) => (
        <Row
          key={tag}
          label={tag}
          value={`${size}pt · ${lh}`}
          active={sel === tag}
          onClick={() => onSelect(tag)}
        />
      ))}
    </>
  );
}

function SpacingPanel({ sel, onSelect }) {
  return (
    <>
      <GroupLabel>Scale</GroupLabel>
      {SPACING.map((s, i) => (
        <Row
          key={s}
          label={`space-${i + 1}`}
          value={`${s}px`}
          active={sel === i}
          onClick={() => onSelect(i)}
        />
      ))}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// SHELL
// ════════════════════════════════════════════════════════════════════

const RAIL = [
  ["overview", "Overview", "overview"],
  ["buttons", "Components", "components"],
  ["colors", "Colors", "colors"],
  ["typography", "Typography", "typography"],
  ["spacing", "Spacing", "spacing"],
];

const pageFromHash = () => {
  const key = window.location.hash.replace(/^#\/?/, "");
  return PAGES[key] ? key : "overview";
};

export default function ParkwayHub() {
  const [page, setPage] = useState(pageFromHash);
  const [fw, setFw] = useState("react");
  const [q, setQ] = useState("");

  // Deep-linkable pages — #/colors, #/buttons … Back/forward supported.
  useEffect(() => {
    const onHash = () => {
      const key = window.location.hash.replace(/^#\/?/, "");
      if (PAGES[key]) setPage(key);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Per-page controls (lifted so the left panel and top bar can drive them)
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("medium");
  const [btnState, setBtnState] = useState("default");
  const [device, setDevice] = useState("desktop");
  const [typeSel, setTypeSel] = useState("H1");
  const [colorGroup, setColorGroup] = useState("all");
  const [spaceSel, setSpaceSel] = useState(0);

  const ramp = device === "desktop" ? TYPE_DESKTOP : TYPE_MOBILE;
  const typeEntry = ramp.find((r) => r[0] === typeSel) || ramp[0];
  const node =
    page === "typography"
      ? device === "desktop" ? "88:140" : "530:6673"
      : PAGES[page]?.node;

  return (
    <div className="ph-app">
      <style>{CSS}</style>
      <a className="ph-skip" href="#ph-main">Skip to content</a>

      {/* Far-left icon rail */}
      <nav className="ph-rail" aria-label="Sections">
        <span className="ph-mark" aria-hidden="true">P</span>
        {RAIL.map(([key, label, icon]) => (
          <a
            key={key}
            className={`ph-railbtn${page === key ? " act" : ""}`}
            href={`#/${key}`}
            aria-label={label}
            aria-current={page === key ? "page" : undefined}
            title={label}
          >
            <Ic name={icon} size={18} />
          </a>
        ))}
      </nav>

      <div className="ph-body">
        {/* Slim top bar */}
        <header className="ph-top">
          <a
            className="ph-brand"
            href={FIGMA_FILE}
            target="_blank"
            rel="noreferrer"
            title="Open the Parkway Figma library"
            translate="no"
          >
            <span className="ph-brandname">Parkway</span>
            <span className="ph-brandsub">Design system</span>
          </a>
          <div className="ph-searchwrap">
            <span className="ph-searchicon"><Ic name="search" size={15} /></span>
            <input
              className="ph-search"
              type="search"
              name="search"
              autoComplete="off"
              spellCheck={false}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages and components…"
              aria-label="Search pages and components"
            />
            {q && (
              <button
                type="button"
                className="ph-searchclear"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                <Ic name="close" size={13} />
              </button>
            )}
          </div>
          <a className="ph-cta" href={figmaHref(node)} target="_blank" rel="noreferrer">
            Open in Figma
            <Ic name="external" size={13} />
          </a>
        </header>

        <div className="ph-main">
          {/* Left panel — navigator + controls */}
          <aside className="ph-left">
            <div className="ph-leftscroll">
              {q.trim() ? (
                <SearchPanel q={q} setQ={setQ} />
              ) : (
                <>
                  {page === "overview" && <NavRows page={page} />}
                  {page === "buttons" && (
                    <ButtonsPanel
                      page={page}
                      variant={variant} setVariant={setVariant}
                      size={size} setSize={setSize}
                      state={btnState} setState={setBtnState}
                    />
                  )}
                  {page === "colors" && <ColorsPanel group={colorGroup} setGroup={setColorGroup} />}
                  {page === "typography" && (
                    <TypographyPanel
                      device={device} setDevice={setDevice}
                      ramp={ramp} sel={typeEntry[0]} onSelect={setTypeSel}
                    />
                  )}
                  {page === "spacing" && <SpacingPanel sel={spaceSel} onSelect={setSpaceSel} />}
                </>
              )}
            </div>
            <footer className="ph-foot">
              <a href={FIGMA_FILE} target="_blank" rel="noreferrer">
                Figma source file <Ic name="external" size={11} />
              </a>
              <p>Synced from Figma Dev Mode · v0.1</p>
            </footer>
          </aside>

          {/* Right panel — preview + code */}
          <main className="ph-right" id="ph-main" tabIndex={-1}>
            <div className="ph-inner ph-page" key={page}>
              {page === "overview" && <OverviewMain />}
              {page === "colors" && <ColorsMain fw={fw} setFw={setFw} group={colorGroup} />}
              {page === "typography" && (
                <TypographyMain
                  fw={fw} setFw={setFw}
                  device={device} entry={typeEntry} ramp={ramp} onSelect={setTypeSel}
                />
              )}
              {page === "spacing" && (
                <SpacingMain fw={fw} setFw={setFw} sel={spaceSel} onSelect={setSpaceSel} />
              )}
              {page === "buttons" && (
                <ButtonsMain fw={fw} setFw={setFw} variant={variant} size={size} state={btnState} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// STYLES — light editorial system. White surfaces, #EFEFEF hairlines,
// ink #121212, one accent (Atomic Tangerine, used sparingly).
// ════════════════════════════════════════════════════════════════════

const CSS = `
:root {
  --ink: #121212;
  --ink-2: #444444;
  --mut: #868686;
  --mut-2: #999999;
  --line: #EFEFEF;
  --line-2: #F5F5F5;
  --paper: #FFFFFF;
  --canvas: #FBFBFB;
  --accent: #F9956B;
  --accent-hover: #FBBFA6;
  --accent-soft: #FEEAE1;
  --accent-ink: #955940;
  --ok: #36CC4F;
  --err: #FF0000;
  --sans: 'Manrope', sans-serif;
  --disp: 'Archivo', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
  color-scheme: light;
}
* { box-sizing: border-box; }
html { -webkit-tap-highlight-color: transparent; }
::selection { background: #FDD5C4; }
:where(button, a, input, select):focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
button, a, input, select { touch-action: manipulation; }
button { font-family: var(--sans); }
a.ph-row, a.ph-railbtn, a.ph-linkrow { text-decoration: none; }

/* Skip link — visible only when keyboard-focused */
.ph-skip {
  position: fixed;
  top: 12px; left: 12px;
  z-index: 20;
  background: var(--ink);
  color: #FFFFFF;
  font: 600 12px var(--sans);
  padding: 10px 16px;
  border-radius: 9px;
  text-decoration: none;
  transform: translateY(-200%);
}
.ph-skip:focus-visible { transform: translateY(0); }
#ph-main:focus { outline: none; }

/* ── App frame ─────────────────────────────────────────────────── */
.ph-app {
  display: flex;
  min-height: 100dvh;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
}

/* Icon rail */
.ph-rail {
  width: 64px;
  flex-shrink: 0;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 0;
  position: sticky;
  top: 0;
  height: 100dvh;
  background: var(--paper);
}
.ph-mark {
  width: 30px; height: 30px;
  border-radius: 9px;
  background: var(--accent);
  color: var(--ink);
  font: 700 15px/30px var(--sans);
  text-align: center;
  margin-bottom: 12px;
}
.ph-railbtn {
  width: 42px; height: 42px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--mut);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background .18s var(--ease), color .18s var(--ease);
}
.ph-railbtn:hover { background: var(--canvas); color: var(--ink); }
.ph-railbtn.act { background: var(--accent-soft); color: var(--ink); }
.ph-railbtn:active { transform: scale(0.96); }

/* Body column */
.ph-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* ── Top bar ───────────────────────────────────────────────────── */
.ph-top {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--paper);
  z-index: 10;
}
.ph-brand {
  display: flex;
  align-items: baseline;
  gap: 8px;
  text-decoration: none;
  color: var(--ink);
  flex-shrink: 0;
}
.ph-brandname { font: 700 15px var(--sans); letter-spacing: -0.1px; }
.ph-brandsub {
  font: 600 9.5px var(--sans);
  letter-spacing: 2.2px;
  text-transform: uppercase;
  color: var(--mut);
}
.ph-searchwrap {
  position: relative;
  flex: 1;
  max-width: 380px;
  margin: 0 auto;
}
.ph-searchicon {
  position: absolute;
  left: 11px; top: 50%;
  transform: translateY(-50%);
  color: var(--mut-2);
  display: flex;
}
.ph-search {
  width: 100%;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--canvas);
  padding: 0 32px 0 34px;
  font: 400 13px var(--sans);
  color: var(--ink);
  outline: none;
  transition: border-color .18s var(--ease), background .18s var(--ease);
}
.ph-search::placeholder { color: var(--mut-2); }
.ph-search:focus { border-color: #C6C6C6; background: var(--paper); }
.ph-search::-webkit-search-cancel-button,
.ph-search::-webkit-search-decoration { -webkit-appearance: none; appearance: none; }
.ph-searchclear {
  position: absolute;
  right: 7px; top: 50%;
  transform: translateY(-50%);
  width: 22px; height: 22px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--mut);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.ph-searchclear:hover { color: var(--ink); background: var(--line); }
.ph-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  background: var(--accent);
  color: var(--ink);
  font: 600 12.5px var(--sans);
  text-decoration: none;
  transition: background .18s var(--ease), transform .12s var(--ease);
}
.ph-cta:hover { background: var(--accent-hover); }
.ph-cta:active { transform: scale(0.97); }

/* ── Two-panel master-detail ───────────────────────────────────── */
.ph-main { flex: 1; display: flex; align-items: stretch; min-width: 0; }
.ph-left {
  width: clamp(300px, 33vw, 440px);
  flex-shrink: 0;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 56px;
  height: calc(100dvh - 56px);
}
.ph-leftscroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 10px 28px 24px; }
.ph-foot {
  border-top: 1px solid var(--line);
  padding: 14px 28px 18px;
}
.ph-foot a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 600 11px var(--sans);
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--ink-2);
  text-decoration: none;
}
.ph-foot a:hover { color: var(--ink); }
.ph-foot p { font: 400 11px/1.6 var(--sans); color: var(--mut-2); margin: 6px 0 0; }

.ph-right { flex: 1; min-width: 0; }
.ph-inner { max-width: 920px; padding: 44px 56px 120px; }

/* Gentle page entry — transform/opacity only */
.ph-page { animation: ph-rise .32s var(--ease); }
@keyframes ph-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Panel rows — label left, value right, hairline divider ────── */
.ph-grouplabel {
  font: 600 10.5px var(--sans);
  letter-spacing: 2.2px;
  text-transform: uppercase;
  color: var(--mut);
  margin: 26px 0 4px;
}
.ph-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 15px 2px;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
}
button.ph-row { border-top: 0; border-left: 0; border-right: 0; cursor: pointer; }
.ph-row.clickable { position: relative; cursor: pointer; }
.ph-row.clickable:hover .ph-rowlabel { color: var(--ink); }
.ph-row.clickable.act { padding-left: 14px; }
.ph-row.clickable.act::before {
  content: "";
  position: absolute;
  left: 0; top: 14px; bottom: 14px;
  width: 2px;
  border-radius: 1px;
  background: var(--accent);
}
.ph-rowlabel {
  font: 600 13.5px var(--sans);
  color: var(--ink-2);
  transition: color .15s var(--ease);
}
.ph-row.clickable.act .ph-rowlabel { color: var(--ink); }
.ph-rowval {
  font: 500 11px var(--mono);
  font-variant-numeric: tabular-nums;
  color: var(--mut);
  text-align: right;
}
.ph-panelhint { font: 400 12px/1.7 var(--sans); color: var(--mut); margin: 16px 2px 0; }

/* Search empty state */
.ph-empty { padding: 36px 2px; }
.ph-emptytitle { font: 600 14px var(--sans); color: var(--ink); margin: 0 0 6px; }
.ph-emptyhint { font: 400 12.5px/1.7 var(--sans); color: var(--mut); margin: 0 0 16px; }
.ph-emptyclear {
  border: 1px solid var(--line);
  background: var(--paper);
  border-radius: 16px;
  padding: 7px 14px;
  font: 600 12px var(--sans);
  color: var(--ink-2);
  cursor: pointer;
  transition: border-color .15s var(--ease);
}
.ph-emptyclear:hover { border-color: #C6C6C6; color: var(--ink); }

/* ── Page intro ────────────────────────────────────────────────── */
.ph-intro { margin-bottom: 28px; }
.ph-kicker {
  font: 600 11px var(--sans);
  letter-spacing: 2.6px;
  text-transform: uppercase;
  color: var(--accent-ink);
  margin: 0 0 12px;
}
.ph-title {
  font-family: var(--disp);
  font-weight: 500;
  font-stretch: 125%;
  font-size: clamp(28px, 3.4vw, 38px);
  line-height: 1.12;
  letter-spacing: -0.3px;
  color: var(--ink);
  margin: 0;
  text-wrap: balance;
}
.ph-blurb {
  font: 400 15px/1.8 var(--sans);
  color: var(--mut);
  max-width: 620px;
  margin: 14px 0 0;
  text-wrap: pretty;
}
.ph-nodechip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 16px;
  font: 500 11px var(--mono);
  color: var(--ink-2);
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 15px;
  padding: 6px 12px;
  transition: border-color .15s var(--ease);
}
.ph-nodechip:hover { border-color: #C6C6C6; color: var(--ink); }
.ph-nodedot {
  width: 7px; height: 7px;
  border-radius: 2px;
  background: var(--accent);
}

/* Section microlabel — hairline top, generous air */
.ph-seclabel {
  font: 600 11px var(--sans);
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--mut);
  border-top: 1px solid var(--line);
  padding-top: 20px;
  margin: 56px 0 20px;
}

/* ── Tabs (framework + small segmented controls) ───────────────── */
.ph-tabs {
  display: inline-flex;
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}
.ph-tab {
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  padding: 7px 18px;
  font: 600 12.5px var(--sans);
  color: var(--mut);
  cursor: pointer;
  transition: color .15s var(--ease), background .15s var(--ease);
}
.ph-tab:hover { color: var(--ink); }
.ph-tab.act {
  background: var(--paper);
  border-color: var(--line);
  color: var(--ink);
}
.ph-tab:active { transform: scale(0.98); }
.ph-tabs.sm .ph-tab { padding: 5px 11px; font-size: 11.5px; border-radius: 6px; }
.ph-tabs.sm { border-radius: 8px; flex-wrap: wrap; justify-content: flex-end; }

/* Quiet select with chevron */
.ph-selectwrap { position: relative; display: inline-flex; align-items: center; }
.ph-select {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper);
  font: 600 12.5px var(--sans);
  color: var(--ink);
  padding: 7px 30px 7px 12px;
  cursor: pointer;
  transition: border-color .15s var(--ease);
}
.ph-select:hover { border-color: #C6C6C6; }
.ph-selectchev {
  position: absolute;
  right: 9px;
  pointer-events: none;
  color: var(--mut);
  display: flex;
}

/* ── Preview stage ─────────────────────────────────────────────── */
.ph-stage {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 40px 36px;
  margin-top: 20px;
}
.ph-stage.center { display: grid; place-items: center; min-height: 200px; }
.ph-stage.tall { min-height: 280px; }
.ph-stagecap {
  font: 600 10.5px var(--sans);
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--mut-2);
  margin: 0 0 22px;
}

/* ── Code block — flat dark container ──────────────────────────── */
.ph-code {
  margin: 20px 0 0;
  border-radius: 11px;
  overflow: hidden;
  background: #121212;
}
.ph-codehead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #1F1F1F;
  padding: 10px 16px;
}
.ph-codelabel {
  font: 500 11px var(--mono);
  letter-spacing: 0.4px;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ph-codepre {
  margin: 0;
  padding: 20px;
  color: #EFEFEF;
  font: 400 12.5px/1.7 var(--mono);
  overflow: auto;
  overscroll-behavior: contain;
  max-height: 460px;
}

/* Copy button — quiet ghost */
.ph-copy {
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink-2);
  font: 600 11px var(--sans);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 14px;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color .15s var(--ease), color .15s var(--ease);
}
.ph-copy:hover { border-color: #C6C6C6; color: var(--ink); }
.ph-copy:active { transform: scale(0.97); }
.ph-copy.dark { background: transparent; border-color: #444444; color: #C6C6C6; }
.ph-copy.dark:hover { border-color: #868686; color: #FFFFFF; }
.ph-copy.ok, .ph-copy.dark.ok { border-color: var(--ok); color: var(--ok); }

.ph-note { font: 400 13.5px/1.8 var(--sans); color: var(--mut); margin: 20px 0 0; }

/* ── Colors page ───────────────────────────────────────────────── */
.ph-swatchgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: 14px 18px;
}
.ph-swatch {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.ph-swatchchip {
  height: 64px;
  border-radius: 9px;
  transition: transform .18s var(--ease);
}
.ph-swatch:hover .ph-swatchchip { transform: translateY(-2px); }
.ph-swatchname {
  font: 500 11px var(--mono);
  color: var(--ink);
  margin-top: 9px;
}
.ph-swatchmeta {
  font: 400 11px var(--sans);
  color: var(--mut);
  margin-top: 3px;
}
.ph-swatchmeta.ok { color: var(--ok); font-weight: 600; }

/* ── Typography page ───────────────────────────────────────────── */
.ph-specrows { margin-top: 4px; }
.ph-ramp { display: flex; flex-direction: column; }
.ph-rampitem {
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  padding: 18px 2px 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.ph-rampitem:hover .ph-rampmeta { color: var(--ink-2); }
.ph-rampitem.act { padding-left: 16px; }
.ph-rampitem.act::before {
  content: "";
  position: absolute;
  left: 0; top: 18px; bottom: 20px;
  width: 2px;
  border-radius: 1px;
  background: var(--accent);
}
.ph-rampmeta {
  font: 500 11px var(--mono);
  font-variant-numeric: tabular-nums;
  color: var(--mut);
  transition: color .15s var(--ease);
}

/* ── Spacing page ──────────────────────────────────────────────── */
.ph-spacerow {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 7px 0;
  cursor: pointer;
  text-align: left;
}
.ph-spacerow:hover .ph-spacelabel { color: var(--ink-2); }
.ph-spacelabel {
  font: 500 11px var(--mono);
  font-variant-numeric: tabular-nums;
  color: var(--mut);
  width: 110px;
  flex-shrink: 0;
  transition: color .15s var(--ease);
}
.ph-spacelabel.act { color: var(--ink); }
.ph-spacebar {
  flex: 1;
  max-width: 520px;
  border-radius: 3px;
  transition: background .2s var(--ease);
}

/* ── Buttons page ──────────────────────────────────────────────── */
.ph-live-primary:hover { background: #FBBFA6 !important; }
.ph-live-alternative:hover { background: #DDDDDD !important; }

.ph-tablewrap { overflow-x: auto; }
.ph-table { border-collapse: collapse; width: 100%; }
.ph-table th {
  text-align: left;
  font: 600 10.5px var(--sans);
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--mut);
  padding: 0 24px 12px 0;
  border-bottom: 1px solid var(--line);
}
.ph-table td {
  padding: 14px 24px 14px 0;
  border-bottom: 1px solid var(--line-2);
  vertical-align: top;
}
.ph-td-prop { font: 700 13px var(--sans); color: var(--ink); white-space: nowrap; }
.ph-td-type { font: 400 12px var(--mono); color: var(--accent-ink); }
.ph-td-default { font: 400 12px var(--mono); color: var(--mut); white-space: nowrap; }
.ph-td-notes { font: 400 13.5px/1.7 var(--sans); color: var(--ink-2); min-width: 220px; }

.ph-stategrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
}
.ph-statechip { display: flex; flex-direction: column; }
.ph-statefill {
  height: 54px;
  border-radius: 9px;
  box-shadow: inset 0 0 0 1px var(--line);
}
.ph-statename {
  font: 600 12px var(--sans);
  color: var(--ink);
  text-transform: capitalize;
  margin-top: 9px;
}
.ph-statehex { font: 400 11px var(--mono); color: var(--mut); margin-top: 2px; }

.ph-guidance {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}
.ph-guidehead {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 700 13px var(--sans);
  color: var(--ink);
  margin: 0 0 10px;
}
.ph-dot { width: 7px; height: 7px; border-radius: 50%; }
.ph-dot.ok { background: var(--ok); }
.ph-dot.err { background: var(--err); }
.ph-guidelist {
  font: 400 13.5px/1.9 var(--sans);
  color: var(--ink-2);
  margin: 0;
  padding-left: 18px;
}
.ph-guidelist li + li { margin-top: 6px; }

/* ── Overview page ─────────────────────────────────────────────── */
.ph-linkrows { display: flex; flex-direction: column; }
.ph-linkrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  padding: 20px 2px;
  cursor: pointer;
  text-align: left;
}
.ph-linktitle {
  display: block;
  font: 600 15px var(--sans);
  color: var(--ink);
}
.ph-linkdesc {
  display: block;
  font: 400 13px/1.6 var(--sans);
  color: var(--mut);
  margin-top: 4px;
}
.ph-linkarrow {
  color: var(--mut-2);
  flex-shrink: 0;
  display: flex;
  transition: transform .2s var(--ease), color .2s var(--ease);
}
.ph-linkrow:hover .ph-linkarrow { transform: translateX(3px); color: var(--ink); }

.ph-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 640px;
}
.ph-steps li {
  display: flex;
  gap: 18px;
  padding: 16px 2px;
  border-bottom: 1px solid var(--line-2);
}
.ph-stepnum {
  font: 500 11px var(--mono);
  font-variant-numeric: tabular-nums;
  color: var(--accent-ink);
  padding-top: 3px;
  flex-shrink: 0;
}
.ph-steptext { font: 400 14px/1.8 var(--sans); color: var(--ink-2); }
.ph-steptext strong { color: var(--ink); font-weight: 600; }

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 940px) {
  .ph-app { flex-direction: column; }
  .ph-rail {
    width: 100%;
    height: auto;
    flex-direction: row;
    padding: 8px max(14px, env(safe-area-inset-right)) 8px max(14px, env(safe-area-inset-left));
    border-right: 0;
    border-bottom: 1px solid var(--line);
    position: static;
  }
  .ph-mark { margin-bottom: 0; margin-right: 8px; }
  .ph-top {
    position: static;
    padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
    gap: 12px;
  }
  .ph-brandsub { display: none; }
  .ph-main { flex-direction: column; }
  .ph-left {
    width: 100%;
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .ph-leftscroll { padding: 4px 20px 20px; }
  .ph-foot { padding: 12px 20px 16px; }
  .ph-inner { padding: 32px 20px 80px; }
  .ph-stage { padding: 28px 20px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
