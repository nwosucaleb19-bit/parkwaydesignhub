import { useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";
import { reactBadge, vueBadge, flutterBadge, usageBadge } from "../snippets/wallet.js";

const BADGES = [
  ["success", "Successful", "#E7F7EA", "#1F8A3B"],
  ["failed", "Failed", "#FDECEC", "#FF0000"],
  ["pending", "Pending", "#FAF1D2", "#918455"],
  ["alternate", "Not linked", "#EFEFEF", "#444444"],
];

function Badge({ bg, fg, children, dim }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px",
      borderRadius: 11, font: "600 11px Manrope", background: bg, color: fg,
      opacity: dim ? 0.4 : 1, transition: "opacity .15s ease",
    }}>{children}</span>
  );
}

const PROPS_ROWS = [
  ["status", '"success" | "failed" | "pending" | "alternate"', '"success"', "Maps to the semantic colour pair."],
  ["children / label", "string", "—", "One word where possible — Successful, Failed, Pending."],
];

export default function Badges({ fw, setFw }) {
  const [status, setStatus] = useState("success");
  const impl = { react: reactBadge, vue: vueBadge, flutter: flutterBadge };
  const label = { react: "PkBadge.jsx + parkway-badge.css", vue: "PkBadge.vue", flutter: "pk_badge.dart" };
  return (
    <>
      <Lead>Small status pill, 22px tall, Manrope SemiBold 11 on a soft tint. Four semantic statuses for transaction and account states.</Lead>

      <SectionHeader label="Playground" desc="Pick a status; the usage snippet updates. All four shown for reference." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px" }}>
          <span className="ph-rowlabel">Status</span>
          <Tabs small value={status} onChange={setStatus} label="Status" items={BADGES.map(([k, n]) => [k, n])} />
        </div>
      </div>

      <div className="ph-stage tall" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {BADGES.map(([k, n, bg, fg]) => (
            <Badge key={k} bg={bg} fg={fg} dim={status !== k}>{n}</Badge>
          ))}
        </div>
      </div>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageBadge(fw, status)} label="Usage — reflects the control above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="Statuses" />
      <div className="ph-statelist">
        {BADGES.map(([k, n, bg, fg]) => (
          <div key={k} className={`ph-stateline${status === k ? " act" : ""}`}>
            <button type="button" className="ph-statedot" onClick={() => setStatus(k)} aria-label={`Preview ${n}`} />
            <span className="ph-statelabel">{n}</span>
            <span className="ph-statedesc" translate="no">{bg} · {fg}</span>
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
