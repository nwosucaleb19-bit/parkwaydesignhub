import { useState } from "react";
import { downloadSvg, downloadPng } from "../lib/download.js";
import { copyText } from "../lib/copy.js";
import { Lead, SectionHeader, Tabs } from "../components/primitives.jsx";
import { DownloadSimple } from "../iconography/index.js";

const LOCKUPS = [
  { id: "light", name: "On light", file: "/logos/logo-light.svg", base: "parkway-logo-light", stage: "light", meta: "logo-light.svg · 582×104", alt: "Parkway wordmark for light backgrounds" },
  { id: "dark", name: "On dark", file: "/logos/logo-dark.svg", base: "parkway-logo-dark", stage: "dark", meta: "logo-dark.svg · 582×104", alt: "Parkway wordmark for dark backgrounds" },
];

function LogoCard({ item, scale }) {
  return (
    <div className="ph-logocard">
      <div className={`ph-logostage ${item.stage}`}>
        <img src={item.file} alt={item.alt} />
      </div>
      <div className="ph-logofoot">
        <div>
          <div className="ph-logoname">{item.name}</div>
          <div className="ph-logometa">{item.meta}</div>
        </div>
        <div className="ph-dlrow">
          <button type="button" className="ph-dlbtn" onClick={() => downloadSvg(item.file, `${item.base}.svg`)}>
            <DownloadSimple size={13} weight="bold" /> SVG
          </button>
          <button type="button" className="ph-dlbtn" onClick={() => downloadPng(item.file, `${item.base}@${scale}x.png`, Number(scale))}>
            <DownloadSimple size={13} weight="bold" /> PNG
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Logo() {
  const [scale, setScale] = useState("2");
  const [ok, setOk] = useState(false);
  return (
    <>
      <Lead>
        The Parkway wordmark and symbol. Light on light, dark on dark — SVG for production, PNG for quick use.
      </Lead>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
        <span className="ph-rowlabel" style={{ fontSize: 12 }}>PNG size</span>
        <Tabs small value={scale} onChange={setScale} label="PNG export size" items={[["1", "1×"], ["2", "2×"], ["3", "3×"]]} />
        <span style={{ font: "500 11px var(--pk-mono)", color: "var(--pk-text-faint)" }}>applies to PNG downloads</span>
      </div>

      <SectionHeader label="Wordmark" desc="The full Parkway lockup. Keep clear space around it; don't recolor or stretch it." />
      <div className="ph-logogrid">
        {LOCKUPS.map((it) => (
          <LogoCard key={it.id} item={it} scale={scale} />
        ))}
      </div>

      <SectionHeader label="Symbol" desc="The mark on its own — for app icons, avatars, and tight spaces." />
      <div className="ph-logogrid">
        <LogoCard
          item={{ id: "mark", name: "Symbol", file: "/logos/parkway-mark.svg", base: "parkway-mark", stage: "neutral", meta: "parkway-mark.svg · 72×72", alt: "Parkway symbol" }}
          scale={scale}
        />
      </div>

      <SectionHeader label="Brand color" desc="The single accent used across the system." />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--pk-line-soft)", padding: "14px 2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: "#F9956B", display: "inline-block" }} aria-hidden="true" />
          <span className="ph-rowlabel">Atomic Tangerine</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ font: "500 12px var(--pk-mono)", color: "var(--pk-text-muted)" }}>#F9956B</span>
          <button type="button" className="ph-copy" onClick={() => copyText("#F9956B", setOk)} aria-live="polite">
            {ok ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </>
  );
}
