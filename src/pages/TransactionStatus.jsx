import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import {
  reactTransactionStatus,
  vueTransactionStatus,
  flutterTransactionStatus,
  usageTransactionStatus,
} from "../snippets/wallet.js";

const FIGMA_NODE = "31774-13288";

const STATUSES = [
  { key: "successful", label: "Successful" },
  { key: "pending",    label: "Pending" },
  { key: "failed",     label: "Failed" },
];

function LiveTransactionStatus({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {STATUSES.map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              width: 101,
              height: 38,
              borderRadius: 8,
              border: active ? "2px solid #F9956B" : "2px solid transparent",
              background: active ? "transparent" : "#FBFBFB",
              font: "600 12px/1 Manrope, sans-serif",
              color: active ? "#F9956B" : "#C6C6C6",
              cursor: "pointer",
              transition: "border-color .15s ease, color .15s ease, background .15s ease",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const PROPS_ROWS = [
  ["value", "string", "required", "Active filter key: 'successful' | 'pending' | 'failed'."],
  ["onChange / onChanged", "function", "—", "Called with the new key when a button is clicked."],
];

export default function TransactionStatus({ fw, setFw }) {
  const [active, setActive] = useState("successful");
  const impl = {
    react: reactTransactionStatus,
    vue: vueTransactionStatus,
    flutter: flutterTransactionStatus,
  };
  const label = {
    react: "PkTransactionStatus.jsx + parkway-transaction-status.css",
    vue: "PkTransactionStatus.vue",
    flutter: "pk_transaction_status.dart",
  };

  return (
    <>
      <Lead>
        Three-option filter row for transaction history: Successful, Pending, and Failed. The active
        state uses a Tangerine-01 border and text; inactive buttons sit on a near-white fill.
      </Lead>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <LiveTransactionStatus value={active} onChange={setActive} />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageTransactionStatus(fw, active)} label="Usage — reflects active state above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" />
      <div className="ph-statelist">
        {STATUSES.map(({ key, label: lbl }) => (
          <div key={key} className="ph-stateline">
            <span
              className="ph-statedot"
              style={{
                background: key === active ? "#F9956B" : "transparent",
                border: "2px solid #F9956B",
              }}
            />
            <span className="ph-statelabel">{lbl}{key === active ? " — active" : ""}</span>
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
            <li>Keep exactly three options — this component is designed as a tri-state filter.</li>
            <li>Persist the active filter in URL state or component state for navigation stability.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't use this for more than 3 items — use a full select or chip list instead.</li>
            <li>Don't change the label text; these map to backend transaction status values.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
