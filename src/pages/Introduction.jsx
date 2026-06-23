import { Lead, SectionHeader } from "../components/primitives.jsx";
import { ArrowRight } from "../iconography/index.js";
import { linkTo } from "../products.js";

const LINKS = [
  ["colors", "Colors", "Tangerine, Rich Grey & Buff scales with messaging colors"],
  ["typography", "Typography", "PP Right Gothic display + Manrope body, desktop & mobile ramps"],
  ["spacing", "Spacing", "8px base unit system, space-1 through space-8"],
  ["buttons", "Buttons", "2 variants × 5 sizes × 3 states, live playground"],
  ["icons", "Icons", "Phosphor — Parkway's official icon set, for web & Vue"],
  ["logo", "Logo & brand", "Download the wordmark and symbol as SVG or PNG"],
];

const STEPS = [
  <>Copy <strong>parkway-tokens</strong> (CSS or Dart) from the Colors page into your project.</>,
  <>Add the type styles from the Typography page — desktop ramp for web, mobile ramp for Flutter.</>,
  <>Drop in components from the Components section; every snippet references tokens, never raw hex.</>,
  <>Need the source? Every page deep-links to its exact Figma node in Dev Mode.</>,
];

export default function Introduction({ product }) {
  const pid = product?.id || "parkway";
  return (
    <>
      <Lead>
        One source of truth — the Parkway Figma library — translated into copy-ready code for
        the web team (React &amp; Vue) and the mobile team (Flutter). Pick a framework once;
        every snippet on every page follows.
      </Lead>

      <SectionHeader label="Browse the system" />
      <div className="ph-linkrows">
        {LINKS.map(([key, title, desc]) => (
          <a key={key} className="ph-linkrow" href={linkTo(pid, key)}>
            <span>
              <span className="ph-linktitle">{title}</span>
              <span className="ph-linkdesc">{desc}</span>
            </span>
            <span className="ph-linkarrow"><ArrowRight size={16} /></span>
          </a>
        ))}
      </div>

      <SectionHeader label="Start here" />
      <ol className="ph-steps">
        {STEPS.map((step, i) => (
          <li key={i}>
            <span className="ph-stepnum">{String(i + 1).padStart(2, "0")}</span>
            <span className="ph-steptext">{step}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
