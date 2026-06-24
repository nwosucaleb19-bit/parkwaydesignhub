import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import { CaretDown } from "../iconography/index.js";
import { reactTextInput, vueTextInput, flutterTextInput, usageTextInput } from "../snippets/wallet.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

function InfoDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="#868686" strokeWidth="1.2" />
      <path d="M7 6.2v3.2M7 4.6v.2" stroke="#868686" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LiveInput({ addon, state }) {
  const error = state === "error";
  const disabled = state === "disabled";
  const focus = state === "focus";
  const filled = state === "filled";
  const border = error ? "#FF0000" : focus ? "#121212" : "#DDDDDD";
  return (
    <div style={{ width: 335, maxWidth: "100%", display: "grid", gap: 6 }}>
      <span style={{ font: "600 12px Manrope", color: "#444444" }}>Amount</span>
      <span style={{
        display: "flex", alignItems: "center", gap: 8, height: 45, padding: "0 16px",
        border: `1px solid ${border}`, borderRadius: 8,
        background: disabled ? "#FBFBFB" : "#FFFFFF",
        boxShadow: focus ? "0 0 0 3px rgba(18,18,18,.08)" : "none",
        transition: "border-color .15s ease",
      }}>
        <input
          readOnly
          disabled={disabled}
          value={filled ? "N 50,000.00" : ""}
          placeholder="Placeholder text"
          style={{ flex: 1, border: 0, outline: 0, background: "none", font: "400 14px Manrope", color: disabled ? "#BBBBBB" : "#121212" }}
        />
        {addon === "icon" && <CaretDown size={16} color="#868686" />}
      </span>
      {addon === "helper" && !error && (
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", font: "400 12px Manrope", color: "#868686" }}>
          <InfoDot />Your remaining daily transfer limit is&nbsp;<strong style={{ color: "#444444" }}>N200,000.00</strong>
        </span>
      )}
      {error && <span style={{ font: "400 12px Manrope", color: "#FF0000" }}>Enter a valid amount</span>}
    </div>
  );
}

const STATES = [
  ["default", "Default", "Resting field, hairline Grey-04 border."],
  ["focus", "Focus", "Border darkens to Grey-01 with a soft focus ring."],
  ["filled", "Filled", "Holds a value in Grey-01; border stays at rest."],
  ["error", "Error", "Red border + message, sets aria-invalid."],
  ["disabled", "Disabled", "Grey-06 fill, non-interactive."],
];

const PROPS_ROWS = [
  ["label", "string", "—", "Field label set in Manrope SemiBold 12."],
  ["placeholder", "string", "—", "Grey-02 placeholder; ends with the example pattern where useful."],
  ["helper", "string", "—", "Muted helper line under the field (e.g. limits)."],
  ["error", "string", "—", "Error message; turns the border and helper red, sets aria-invalid."],
  ["trailingIcon", "node", "—", "Optional trailing glyph — e.g. a caret for select-style inputs."],
  ["disabled", "boolean", "false", "Grey-06 fill, non-interactive."],
];

export default function TextInput({ fw, setFw }) {
  const [addon, setAddon] = useState("none");
  const [state, setState] = useState("default");
  const impl = { react: reactTextInput, vue: vueTextInput, flutter: flutterTextInput };
  const label = { react: "PkTextInput.jsx + parkway-input.css", vue: "PkTextInput.vue", flutter: "pk_text_input.dart" };
  return (
    <>
      <Lead>45px field, 8px radius, hairline border that darkens on focus. Optional trailing icon and helper line, across five states.</Lead>

      <SectionHeader label="Playground" desc="Adjust the controls; the preview and snippet update together." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <div style={ROW}>
          <span className="ph-rowlabel">Add-on</span>
          <Tabs small value={addon} onChange={setAddon} label="Add-on" items={[["none", "None"], ["icon", "Icon"], ["helper", "Helper"]]} />
        </div>
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">State</span>
          <Tabs small value={state} onChange={setState} label="State" items={STATES.map(([k, n]) => [k, n])} />
        </div>
      </div>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <LiveInput addon={addon} state={state} />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageTextInput(fw, addon, state)} label="Usage — reflects the controls above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" desc="Every interaction state the field can take." />
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
