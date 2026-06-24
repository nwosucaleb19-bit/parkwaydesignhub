import { Lead, SectionHeader } from "../components/primitives.jsx";
import { ArrowRight } from "../iconography/index.js";
import { linkTo } from "../products.js";

const LINKS = [
  ["colors", "Colors", "Tangerine, Rich Grey & Buff"],
  ["typography", "Typography", "PP Right Gothic + Manrope"],
  ["spacing", "Spacing", "8px base unit"],
  ["buttons", "Buttons", "2 × 5 × 3 playground"],
  ["icons", "Icons", "Phosphor icon set"],
  ["logo", "Logo & brand", "Wordmark & symbol, SVG/PNG"],
];

const STEPS = [
  <>Copy the tokens from <strong>Colors</strong>.</>,
  <>Add the type styles from <strong>Typography</strong>.</>,
  <>Drop in components — every snippet uses tokens, never raw hex.</>,
];

export default function Introduction({ product }) {
  const pid = product?.id || "parkway";
  return (
    <>
      <Lead>
        Tokens and components as copy-ready code for React, Vue, and Flutter.
        Pick a framework once — every snippet follows.
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
