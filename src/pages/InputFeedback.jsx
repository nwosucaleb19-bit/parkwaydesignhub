import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { useTheme } from "../theme.jsx";
import { Lead, SectionHeader, Tabs, CodeBlock, PreviewStage, ModeRow } from "../components/primitives.jsx";
import { reactFeedback, vueFeedback, flutterFeedback, usageFeedback } from "../snippets/input-feedback.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

const MESSAGES = {
  error: "No invoice was found",
  success: "This invoice has already been paid",
};
const ICON = { error: "/assets/wallet/x-circle.svg", success: "/assets/wallet/check-circle.svg" };

export function Feedback({ variant, children, id }) {
  return (
    <p id={id} className={`ph-feedback ph-feedback--${variant}`} role={variant === "error" ? "alert" : "status"} style={{ margin: 0 }}>
      <img src={ICON[variant]} width="18" height="18" alt="" />
      {children}
    </p>
  );
}

const VARIANTS = [
  ["error", "Error", "Red tint + X icon. The value failed validation — say what went wrong."],
  ["success", "Success", "Green tint + check icon. Confirms the value, or flags something to note."],
];

const PROPS_ROWS = [
  ["variant", '"error" | "success"', '"error"', "Sets the tint, text colour and icon."],
  ["children", "string", "—", "The message. One short sentence, no full stop."],
  ["id", "string", "—", "Point the field's aria-describedby at this so screen readers read it with the input."],
];

export default function InputFeedback({ fw, setFw }) {
  const app = useTheme();
  const [mode, setMode] = useState(app.theme);
  const [variant, setVariant] = useState("error");
  const [context, setContext] = useState("alone");
  const impl = { react: reactFeedback, vue: vueFeedback, flutter: flutterFeedback };
  const label = { react: "PkInputFeedback.jsx + parkway-input-feedback.css", vue: "PkInputFeedback.vue", flutter: "pk_input_feedback.dart" };
  const message = MESSAGES[variant];

  return (
    <>
      <Lead>
        The tinted message under a field after it's checked. Error is red with an X; success is green
        with a check. Manrope SemiBold 12, 8px padding, 10px radius, full width of the field.
      </Lead>

      <SectionHeader label="Playground" desc="Switch the variant, or show the message under a field." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <ModeRow mode={mode} setMode={setMode} />
        <div style={ROW}>
          <span className="ph-rowlabel">Variant</span>
          <Tabs small value={variant} onChange={setVariant} label="Variant" items={VARIANTS.map(([k, n]) => [k, n])} />
        </div>
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">Context</span>
          <Tabs small value={context} onChange={setContext} label="Context" items={[["alone", "Message only"], ["field", "Under a field"]]} />
        </div>
      </div>

      <PreviewStage mode={mode} tall center>
        <div className="ph-feedback-wrap">
          {context === "field" && (
            <div className="ph-tfield" style={{ width: "100%" }}>
              <label className="ph-tfield__label" htmlFor="pk-fb-input">Enter Invoice Number</label>
              <span className={`ph-tfield__box${variant === "error" ? " err" : ""}`}>
                <input
                  id="pk-fb-input"
                  defaultValue="1006985069"
                  aria-describedby="pk-fb-msg"
                  aria-invalid={variant === "error" || undefined}
                  autoComplete="off"
                />
              </span>
            </div>
          )}
          <Feedback key={variant} id="pk-fb-msg" variant={variant}>{message}</Feedback>
        </div>
      </PreviewStage>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageFeedback(fw, variant, message)} label="Usage — reflects the controls above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="Variants" />
      <div className="ph-statelist">
        {VARIANTS.map(([k, n, d]) => (
          <div key={k} className={`ph-stateline${variant === k ? " act" : ""}`}>
            <button type="button" className="ph-statedot" onClick={() => setVariant(k)} aria-label={`Preview ${n}`} />
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

      <SectionHeader label="Usage guidelines" />
      <div className="ph-guidance">
        <div>
          <p className="ph-guidehead"><span className="ph-dot ok" aria-hidden="true" />Do</p>
          <ul className="ph-guidelist">
            <li>Place it 10px under the field it describes, matching the field's width.</li>
            <li>Say what happened in plain words — “No invoice was found”.</li>
            <li>Link it to the field with aria-describedby.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't show it before the user has finished typing or submitted.</li>
            <li>Don't stack several messages under one field — show the most important one.</li>
            <li>Don't use it for page-level alerts; use a Toast instead.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
