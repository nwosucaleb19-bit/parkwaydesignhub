import { useState } from "react";
import { COLOR_GROUPS, FRAMEWORKS } from "../tokens.js";
import { copyText } from "../lib/copy.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import { cssTokens, tailwindTokens, flutterTokens } from "../snippets/index.js";

function Swatch({ name, hex, note }) {
  const [ok, setOk] = useState(false);
  const nearWhite = ["#FFFFFF", "#FBFBFB", "#FCF8E8", "#FEEAE1", "#FAF1D2"].includes(hex);
  return (
    <button type="button" onClick={() => copyText(hex, setOk)} title="Click to copy hex" className="ph-swatch">
      <span
        className="ph-swatchchip"
        style={{ background: hex, boxShadow: nearWhite ? "inset 0 0 0 1px var(--pk-line)" : "none" }}
        aria-hidden="true"
      />
      <span className="ph-swatchname">--pk-{name}</span>
      <span className={`ph-swatchmeta${ok ? " ok" : ""}`} aria-live="polite">
        {ok ? "Copied" : `${hex} · ${note}`}
      </span>
    </button>
  );
}

export default function Colors({ fw, setFw }) {
  const exportCode = { react: cssTokens, vue: cssTokens, flutter: flutterTokens };
  const exportLabel = { react: "parkway-tokens.css", vue: "parkway-tokens.css", flutter: "parkway_tokens.dart" };
  return (
    <>
      <Lead>
        Parkway's palette is built around Atomic Tangerine, with Rich Grey as the ink secondary
        and Buff as the warm alternative. Click any swatch to copy its hex.
      </Lead>

      {COLOR_GROUPS.map(([key, label, items]) => (
        <section key={key}>
          <SectionHeader label={label} />
          <div className="ph-swatchgrid">
            {items.map(([n, h, note]) => (
              <Swatch key={n} name={n} hex={h} note={note} />
            ))}
          </div>
        </section>
      ))}

      <SectionHeader label="Export tokens" />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
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
