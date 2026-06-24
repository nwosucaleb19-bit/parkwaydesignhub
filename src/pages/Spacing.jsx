import { useState } from "react";
import { SPACING, FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";

export default function Spacing({ fw, setFw }) {
  const [sel, setSel] = useState(0);
  const cssSpace = `:root {\n${SPACING.map((s, i) => `  --pk-space-${i + 1}: ${s}px;`).join("\n")}\n}`;
  const dartSpace = `abstract class PkSpacing {\n  static const double ${SPACING.map((s, i) => `s${i + 1} = ${s}`).join(", ")};\n}`;
  return (
    <>
      <Lead>Spacing uses 8px increments — consistent rhythm, less guesswork.</Lead>

      <div className="ph-stage" style={{ marginTop: 18 }}>
        <p className="ph-stagecap">The spacing system — 8px base unit</p>
        {SPACING.map((s, i) => (
          <button
            type="button"
            key={s}
            className="ph-spacerow"
            onClick={() => setSel(i)}
            aria-pressed={sel === i}
          >
            <span className={`ph-spacelabel${sel === i ? " act" : ""}`}>
              space-{i + 1} · {s}px
            </span>
            <span className="ph-spacebar" style={{ height: s, background: sel === i ? "#F9956B" : "#FDD5C4" }} />
          </button>
        ))}
      </div>

      <SectionHeader label="Export spacing" />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock
        code={fw === "flutter" ? dartSpace : cssSpace}
        label={fw === "flutter" ? "parkway_spacing.dart" : "CSS custom properties (Vue & React)"}
      />
    </>
  );
}
