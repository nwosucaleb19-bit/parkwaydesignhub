import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import { reactLink, vueLink, flutterLink, usageLink } from "../snippets/wallet.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

function LinkGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.6 8.4 8.4 5.6M6.2 3.4l.8-.8a2.4 2.4 0 0 1 3.4 3.4l-.8.8M7.8 10.6l-.8.8a2.4 2.4 0 0 1-3.4-3.4l.8-.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const LINK_COLORS = {
  default: "#F9956B", hover: "#C77756", pressed: "#955940", disabled: "#FDD5C4",
};

function LiveLink({ icon, state }) {
  const color = LINK_COLORS[state];
  const underline = state === "hover" || state === "pressed";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, color,
      font: "600 14px Manrope", textDecoration: underline ? "underline" : "none",
      cursor: state === "disabled" ? "not-allowed" : "pointer",
    }}>
      {icon === "left" && <LinkGlyph />}
      Link button placeholder
      {icon === "right" && <LinkGlyph />}
    </span>
  );
}

const STATES = [
  ["default", "Default", "Tangerine-01, no underline."],
  ["hover", "Hover", "Tangerine-06 with underline."],
  ["pressed", "Pressed", "Tangerine-07 with underline."],
  ["disabled", "Disabled", "Tangerine-04, non-interactive."],
];

const PROPS_ROWS = [
  ["icon", "node", "—", "Optional glyph; pair with iconRight to place it after the label."],
  ["iconRight", "boolean", "false", "Render the icon after the label instead of before."],
  ["disabled", "boolean", "false", "Tangerine-04, non-interactive."],
  ["children / label", "string", "—", "Concise verb phrase — \"View details\", \"Resend code\"."],
];

export default function LinkButton({ fw, setFw }) {
  const [icon, setIcon] = useState("none");
  const [state, setState] = useState("default");
  const impl = { react: reactLink, vue: vueLink, flutter: flutterLink };
  const label = { react: "PkLink.jsx + parkway-link.css", vue: "PkLink.vue", flutter: "pk_link.dart" };
  return (
    <>
      <Lead>Inline text action in Manrope SemiBold 14, Tangerine-01. Optional leading or trailing icon; underlines on hover and press.</Lead>

      <SectionHeader label="Playground" desc="Adjust the controls; the preview and snippet update together." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <div style={ROW}>
          <span className="ph-rowlabel">Icon</span>
          <Tabs small value={icon} onChange={setIcon} label="Icon" items={[["none", "None"], ["left", "Left"], ["right", "Right"]]} />
        </div>
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">State</span>
          <Tabs small value={state} onChange={setState} label="State" items={STATES.map(([k, n]) => [k, n])} />
        </div>
      </div>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <LiveLink icon={icon} state={state} />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageLink(fw, icon)} label="Usage — reflects the controls above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" />
      <div className="ph-statelist">
        {STATES.map(([k, n, d]) => (
          <div key={k} className={`ph-stateline${state === k ? " act" : ""}`}>
            <button type="button" className="ph-statedot" onClick={() => setState(k)} aria-label={`Preview ${n}`} />
            <span className="ph-statelabel">{n}</span>
            <span className="ph-statedesc">{d}</span>
          </div>
        ))}
      </div>

      <SectionHeader label="Props" />
      <div className="ph-tablewrap">
        <table className="ph-table">
          <thead><tr>{["Prop", "Type", "Default", "Notes"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
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
    </>
  );
}
