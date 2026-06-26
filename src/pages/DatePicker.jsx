import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import {
  reactDatePicker,
  vueDatePicker,
  flutterDatePicker,
  usageDatePicker,
} from "../snippets/wallet.js";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getGrid(year, month) {
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function LiveDatePicker() {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null);

  const prev = () =>
    setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () =>
    setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const isToday = (d) =>
    d && view.year === today.getFullYear() && view.month === today.getMonth() && d === today.getDate();
  const isSel = (d) =>
    d && selected &&
    view.year === selected.getFullYear() &&
    view.month === selected.getMonth() &&
    d === selected.getDate();

  const grid = getGrid(view.year, view.month);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      padding: 25,
      width: 326,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      fontFamily: "Inter, system-ui, sans-serif",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ font: "500 17px/25px Inter, sans-serif", color: "#121212" }}>
          {MONTHS[view.month]} {view.year}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {[prev, next].map((fn, i) => (
            <button
              key={i}
              type="button"
              onClick={fn}
              aria-label={i === 0 ? "Previous month" : "Next month"}
              style={{
                background: "none",
                border: 0,
                padding: 2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {i === 0
                  ? <path d="M15 18l-6-6 6-6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M9 18l6-6-6-6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                }
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{
            textAlign: "center",
            padding: "10px 0",
            font: "400 14px/20px Inter, sans-serif",
            color: i === 0 || i === 6 ? "#F36A6A" : "#121212",
          }}>{d}</div>
        ))}
        {grid.map((d, i) => {
          const today_ = isToday(d);
          const sel = isSel(d);
          return (
            <div
              key={i}
              onClick={() => d && setSelected(new Date(view.year, view.month, d))}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: `${today_ ? "600" : "400"} 14px/20px Inter, sans-serif`,
                color: sel ? "#fff" : today_ ? "#FAAA89" : d ? "#858585" : "transparent",
                background: sel ? "#FAAA89" : "transparent",
                borderRadius: sel ? 8 : 0,
                cursor: d ? "pointer" : "default",
                margin: "2px 0",
              }}
            >{d}</div>
          );
        })}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
        <button type="button" style={{
          background: "none",
          border: 0,
          padding: "10px 20px",
          borderRadius: 4,
          font: "400 14px/20px Inter, sans-serif",
          color: "#9CA3AF",
          cursor: "pointer",
        }}>
          Close
        </button>
        <button type="button" style={{
          background: "#FAAA89",
          border: 0,
          padding: "10px 20px",
          borderRadius: 4,
          font: "400 14px/20px Inter, sans-serif",
          color: "#fff",
          cursor: "pointer",
        }}>
          Select
        </button>
      </div>
    </div>
  );
}

const PROPS_ROWS = [
  ["defaultValue / initialDate", "Date | null", "null", "Pre-selected date on first render."],
  ["onSelect", "function", "—", "Called with the chosen Date when Select is pressed."],
  ["onClose", "function", "—", "Called when Close is pressed — hide the picker in the parent."],
];

export default function DatePicker({ fw, setFw }) {
  const impl = {
    react: reactDatePicker,
    vue: vueDatePicker,
    flutter: flutterDatePicker,
  };
  const labelMap = {
    react: "PkDatePicker.jsx + parkway-date-picker.css",
    vue: "PkDatePicker.vue",
    flutter: "pk_date_picker.dart",
  };

  return (
    <>
      <Lead>
        Inline calendar date picker. Highlights today in Tangerine and the selected date with a
        filled cell. Month navigation via chevrons; weekend day headers are rendered in red.
        Uses Inter (not Manrope) to match the Wallet design.
      </Lead>

      <div className="ph-stage tall" style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
        <LiveDatePicker />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageDatePicker(fw)} label="Usage" />
      <CodeBlock code={impl[fw]} label={labelMap[fw]} />

      <SectionHeader label="Visual states" />
      <div className="ph-statelist">
        {[
          ["Default date cell", "#858585"],
          ["Today", "#FAAA89"],
          ["Selected", "#FAAA89"],
          ["Weekend header", "#F36A6A"],
        ].map(([name, color]) => (
          <div key={name} className="ph-stateline">
            <span className="ph-statedot" style={{ background: color, border: 0 }} />
            <span className="ph-statelabel">{name}</span>
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
            <li>Render inside a popover or bottom sheet — don't inline in a form.</li>
            <li>Pre-fill with the nearest valid date when a constraint exists (e.g. future-only scheduling).</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't substitute Manrope here — this component follows Inter per the Wallet spec.</li>
            <li>Don't allow past dates for future-only contexts without disabling or greying them.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
