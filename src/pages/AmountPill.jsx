import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { useTheme } from "../theme.jsx";
import { Lead, SectionHeader, Tabs, CodeBlock, PreviewStage, ModeRow } from "../components/primitives.jsx";
import { reactAmountPill, vueAmountPill, flutterAmountPill, usageAmountPill } from "../snippets/amount-pill.js";

const AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];
const naira = (n) => "₦" + n.toLocaleString("en-NG");

function Pill({ amount, selected, onSelect, tabIndex }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      className="ph-pill"
      onClick={() => onSelect?.(amount)}
    >
      {naira(amount)}
      {selected && <img className="ph-pill__check" src="/assets/wallet/pill-check.svg" width="41" height="30" alt="" />}
    </button>
  );
}

function LivePills({ value, onChange }) {
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = Math.max(0, AMOUNTS.indexOf(value));
    const next = (i + step + AMOUNTS.length) % AMOUNTS.length;
    onChange(AMOUNTS[next]);
    e.currentTarget.children[next]?.focus();
  };
  const focusable = AMOUNTS.includes(value) ? value : AMOUNTS[0];
  return (
    <div className="ph-pills" role="radiogroup" aria-label="Choose an amount" onKeyDown={onKeyDown}>
      {AMOUNTS.map((a) => (
        <Pill key={a} amount={a} selected={a === value} onSelect={onChange} tabIndex={a === focusable ? 0 : -1} />
      ))}
    </div>
  );
}

const PROPS_ROWS = [
  ["amounts", "number[]", "—", "Preset amounts in naira. Rendered as ₦ with thousands separators."],
  ["value", "number", "—", "The selected amount. Only one pill can be selected."],
  ["onChange", "(amount) => void", "—", "Fires on tap, or on arrow keys (radio-group keyboard model)."],
  ["label", "string", '"Choose an amount"', "Accessible name for the group."],
];

export default function AmountPill({ fw, setFw }) {
  const app = useTheme();
  const [mode, setMode] = useState(app.theme);
  const [value, setValue] = useState(10000);
  const impl = { react: reactAmountPill, vue: vueAmountPill, flutter: flutterAmountPill };
  const label = { react: "PkAmountPills.jsx + parkway-amount-pill.css", vue: "PkAmountPills.vue", flutter: "pk_amount_pills.dart" };

  return (
    <>
      <Lead>
        Preset amounts for quick picks, like airtime or transfer top-ups. Only one can be selected.
        The selected pill gets a tangerine border, a 10% tangerine fill, and a check in the corner.
      </Lead>

      <SectionHeader label="Playground" desc="Pick an amount — click, or use the arrow keys." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <ModeRow mode={mode} setMode={setMode} divider={false} />
      </div>

      <PreviewStage mode={mode} tall center>
        <LivePills value={value} onChange={setValue} />
      </PreviewStage>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageAmountPill(fw)} label="Usage" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" />
      <PreviewStage mode={mode} center stageStyle={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
        {[["Default", 20000, false], ["Selected", 10000, true]].map(([n, a, sel]) => (
          <div key={n} style={{ display: "grid", gap: 10, justifyItems: "center", width: 108 }}>
            <div style={{ width: "100%", display: "grid" }} role="radiogroup" aria-label={`${n} example`}>
              <Pill amount={a} selected={sel} tabIndex={-1} />
            </div>
            <span className="ph-statedesc">{n}</span>
          </div>
        ))}
      </PreviewStage>

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
            <li>Pair pills with an amount field — picking a pill fills the field.</li>
            <li>Keep it to 3–6 presets in a 3-column grid.</li>
            <li>Order amounts from low to high.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't allow more than one selected pill.</li>
            <li>Don't use pills as the only way to enter an amount.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
