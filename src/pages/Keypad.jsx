import { useEffect, useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { useTheme } from "../theme.jsx";
import { Lead, SectionHeader, Tabs, CodeBlock, PreviewStage, ModeRow } from "../components/primitives.jsx";
import { reactKeypad, vueKeypad, flutterKeypad, usageKeypad } from "../snippets/keypad.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function LiveKeypad({ variant, onEvent }) {
  const length = variant === "pin" ? 4 : 6;
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === length) onEvent(`onComplete("${code}")`);
  }, [code, length]);

  // A completed code clears on the next key press so the demo can repeat.
  const press = (d) => setCode((c) => (c.length >= length ? d : c + d));
  const back = () => setCode((c) => (c.length >= length ? "" : c.slice(0, -1)));
  const onKeyDown = (e) => {
    if (/^\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
    else if (e.key === "Backspace") { e.preventDefault(); back(); }
  };

  return (
    <div
      className="ph-keypad"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`${variant === "pin" ? "PIN" : "Passcode"} keypad — type digits or tap the keys`}
    >
      <div className="ph-keypad__head">
        {variant === "pin" ? (
          <div className="ph-keypad__boxes" aria-hidden="true">
            {Array.from({ length }, (_, i) => (
              <span key={i} className={`ph-keypad__box${i === code.length ? " is-active" : ""}`}>
                {code[i] ? "•" : ""}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div className="ph-keypad__dots" aria-hidden="true">
              {Array.from({ length }, (_, i) => (
                <span key={i} className="ph-keypad__dot">
                  {i < code.length
                    ? <img className="is-filled" src="/assets/wallet/dot-filled.svg" width="15" height="15" alt="" />
                    : <img className="is-empty" src="/assets/wallet/dot-empty.svg" width="17" height="17" alt="" />}
                </span>
              ))}
            </div>
            <button type="button" className="ph-keypad__forgot" onClick={() => onEvent("onForgot()")}>
              Forgot Passcode?
            </button>
          </>
        )}
        <span className="ph-sr" aria-live="polite">{code.length} of {length} digits entered</span>
      </div>

      <div className="ph-keypad__grid">
        {DIGITS.map((d) => (
          <button key={d} type="button" className="ph-keypad__key" onClick={() => press(d)}>{d}</button>
        ))}
        {variant === "passcode" ? (
          <button type="button" className="ph-keypad__key ph-keypad__key--ghost" aria-label="Use Face ID" onClick={() => onEvent("onBiometric()")}>
            <img src="/assets/wallet/face-id.svg" width="32" height="32" alt="" />
          </button>
        ) : (
          <span className="ph-keypad__spacer" aria-hidden="true" />
        )}
        <button type="button" className="ph-keypad__key" onClick={() => press("0")}>0</button>
        <button type="button" className="ph-keypad__key ph-keypad__key--back" aria-label="Delete last digit" onClick={back}>
          <span className="ph-keypad__backspace" />
        </button>
      </div>
    </div>
  );
}

const VARIANTS = [
  ["pin", "PIN", "4 bordered boxes. Confirms a transaction — e.g. a transfer or bill payment."],
  ["passcode", "Passcode", "6 dots + Forgot Passcode + Face ID. Unlocks the app."],
];

const PROPS_ROWS = [
  ["variant", '"pin" | "passcode"', '"pin"', "PIN shows 4 boxes; Passcode shows 6 dots, the forgot link and the Face ID key."],
  ["length", "number", "4 / 6", "Digits to collect. Defaults follow the variant."],
  ["onComplete", "(code) => void", "—", "Fires once the last digit is entered."],
  ["onForgot", "() => void", "—", "Passcode only. Tapped “Forgot Passcode?”."],
  ["onBiometric", "() => void", "—", "Passcode only. Shows the Face ID key when set."],
];

export default function Keypad({ fw, setFw }) {
  const app = useTheme();
  const [mode, setMode] = useState(app.theme);
  const [variant, setVariant] = useState("pin");
  const [event, setEvent] = useState("");
  const impl = { react: reactKeypad, vue: vueKeypad, flutter: flutterKeypad };
  const label = { react: "PkKeypad.jsx + parkway-keypad.css", vue: "PkKeypad.vue", flutter: "pk_keypad.dart" };

  return (
    <>
      <Lead>
        A numeric keypad for entering a PIN or passcode. It works with taps, clicks, or the keyboard's
        number keys. 68px round keys in a 3 × 4 grid with 32px gaps; Manrope Bold 20.
      </Lead>

      <SectionHeader label="Playground" desc="Tap the keys, or focus the keypad and type numbers." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <ModeRow mode={mode} setMode={setMode} />
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">Variant</span>
          <Tabs small value={variant} onChange={(v) => { setVariant(v); setEvent(""); }} label="Variant" items={VARIANTS.map(([k, n]) => [k, n])} />
        </div>
      </div>

      <PreviewStage mode={mode} tall stageStyle={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <LiveKeypad key={variant} variant={variant} onEvent={setEvent} />
        <p className="ph-statedesc" aria-live="polite" style={{ margin: 0, minHeight: 18, fontFamily: "var(--pk-mono)" }}>
          {event ? `→ ${event}` : ""}
        </p>
      </PreviewStage>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageKeypad(fw, variant)} label="Usage — reflects the controls above" />
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
            <li>Mask entered digits — never show the PIN in plain text.</li>
            <li>Submit on the last digit; don't make users hunt for a Confirm button.</li>
            <li>Offer Face ID on the passcode screen only when the device supports it.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't shuffle key positions — it slows people down and breaks muscle memory.</li>
            <li>Don't open the system keyboard on top of this keypad.</li>
            <li>Don't drop the “Forgot Passcode?” link from the passcode screen.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
