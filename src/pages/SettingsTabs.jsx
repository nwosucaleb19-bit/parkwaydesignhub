import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import {
  reactSettingsTabs,
  vueSettingsTabs,
  flutterSettingsTabs,
  usageSettingsTabs,
} from "../snippets/wallet.js";

const TAB_OPTIONS = [
  ["physical", "Physical"],
  ["virtual",  "Virtual"],
];

function LiveSettingsTabs({ value, onChange }) {
  const idx = TAB_OPTIONS.findIndex(([k]) => k === value);
  const pct = 100 / TAB_OPTIONS.length;
  return (
    <div style={{ position: "relative", borderBottom: "1px solid #E5E7EB", width: "100%" }}>
      <div style={{ display: "flex" }}>
        {TAB_OPTIONS.map(([key, label]) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              style={{
                flex: 1,
                height: 33,
                border: 0,
                background: "transparent",
                paddingBottom: 4,
                font: active ? "600 14px/1 Manrope, sans-serif" : "500 14px/1 Manrope, sans-serif",
                color: active ? "#4B5563" : "#9CA3AF",
                cursor: "pointer",
                transition: "color .15s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div style={{
        position: "absolute",
        bottom: -1,
        height: 3,
        width: `${pct}%`,
        left: `${idx * pct}%`,
        background: "#F9956B",
        borderRadius: "4px 4px 0 0",
        transition: "left .2s ease",
      }} />
    </div>
  );
}

const PROPS_ROWS = [
  ["tabs", "Array<[string, string]>", "required", "Array of [key, label] pairs."],
  ["value / modelValue", "string", "required", "Key of the active tab."],
  ["onChange / onChanged", "function", "—", "Called with the new key on tab press."],
];

export default function SettingsTabs({ fw, setFw }) {
  const [active, setActive] = useState("virtual");
  const impl = {
    react: reactSettingsTabs,
    vue: vueSettingsTabs,
    flutter: flutterSettingsTabs,
  };
  const label = {
    react: "PkSettingsTabs.jsx + parkway-settings-tabs.css",
    vue: "PkSettingsTabs.vue",
    flutter: "pk_settings_tabs.dart",
  };

  return (
    <>
      <Lead>
        Underline tab bar for card settings. A 3px Tangerine-01 indicator slides between tabs;
        the active label uses a darker weight and colour than inactive ones.
      </Lead>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <LiveSettingsTabs value={active} onChange={setActive} />
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageSettingsTabs(fw, active)} label="Usage — reflects active tab above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" />
      <div className="ph-statelist">
        {TAB_OPTIONS.map(([key, lbl]) => (
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
            <li>Use full-width so the indicator distributes evenly across all tabs.</li>
            <li>Keep to 2–3 options; beyond that consider a segmented scroll or dropdown.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't mix this with the pill-style TabsToggle on the same screen.</li>
            <li>Don't truncate tab labels — they must fit on one line without ellipsis.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
