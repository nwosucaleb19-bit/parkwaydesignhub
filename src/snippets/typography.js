// Typography export snippets — referenced by the Typography page.

export const typoCssDesktop = `/* parkway-type.css — desktop ramp (PP Right Gothic + Manrope) */
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

export const typoFlutter = `// parkway_text_theme.dart — mobile ramp from Figma
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
