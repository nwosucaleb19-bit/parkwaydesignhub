import { useState } from "react";
import { BTN, FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, Select, CodeBlock } from "../components/primitives.jsx";
import { reactButton, vueButton, flutterButton, usageSnippet } from "../snippets/index.js";

function LiveButton({ variant, size, state }) {
  const pal = BTN[variant];
  const disabled = state === "disabled";
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
        background: pal[state], color: disabled ? BTN.textDisabled : BTN.text,
        font: BTN.font, fontFamily: "Manrope, sans-serif",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        cursor: disabled ? "not-allowed" : "pointer", transition: "background .15s ease",
      }}
    >
      {label}
      {size === "icon" && <span aria-hidden="true" style={{ fontSize: 16 }}>⟶</span>}
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

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

export default function Buttons({ fw, setFw }) {
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("medium");
  const [state, setState] = useState("default");
  const implCode = { vue: vueButton, react: reactButton, flutter: flutterButton };
  const implLabel = { vue: "PkButton.vue", react: "PkButton.jsx + parkway-button.css", flutter: "pk_button.dart" };
  const pal = BTN[variant];
  return (
    <>
      <Lead>
        Pill-shaped, 54px tall, set in Manrope SemiBold 14. Two variants (Primary tangerine,
        Alternative grey) across five sizes and three states. Hover the preview for the real state.
      </Lead>

      <SectionHeader label="Playground" desc="Adjust the controls; the live preview and the usage snippet below update together." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <div style={ROW}>
          <span className="ph-rowlabel">Variant</span>
          <Tabs small value={variant} onChange={setVariant} label="Variant" items={[["primary", "Primary"], ["alternative", "Alternative"]]} />
        </div>
        <div style={ROW}>
          <span className="ph-rowlabel">Size</span>
          <Select value={size} onChange={setSize} label="Size" options={["small", "icon", "medium", "large", "xlarge"]} />
        </div>
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">State</span>
          <Tabs small value={state} onChange={setState} label="State" items={[["default", "Default"], ["hover", "Hover"], ["disabled", "Disabled"]]} />
        </div>
      </div>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <LiveButton variant={variant} size={size} state={state} />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageSnippet(fw, variant, size, state)} label="Usage — reflects the controls above" />
      <CodeBlock code={implCode[fw]} label={implLabel[fw]} />

      <SectionHeader label="Props" />
      <div className="ph-tablewrap">
        <table className="ph-table">
          <thead>
            <tr>{["Prop", "Type", "Default", "Notes"].map((h) => <th key={h}>{h}</th>)}</tr>
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

      <SectionHeader label={`State tokens — ${variant}`} />
      <div className="ph-stategrid">
        {["default", "hover", "disabled"].map((s) => (
          <div key={s} className="ph-statechip">
            <span className="ph-statefill" style={{ background: pal[s] }} aria-hidden="true" />
            <span className="ph-statename">{s}</span>
            <span className="ph-statehex">{pal[s]}</span>
          </div>
        ))}
      </div>

      <SectionHeader label="Usage guidance" />
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
