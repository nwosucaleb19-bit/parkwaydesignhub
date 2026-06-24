import { FRAMEWORKS } from "../tokens.js";
import { Lead, SectionHeader, Tabs, CodeBlock } from "../components/primitives.jsx";

const FOUR = [4, 8, 12, 16, 20, 24, 32, 40];
const EIGHT = [8, 16, 24, 32, 40, 48, 56, 64];

function Scale({ base, steps, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((v) => (
        <div key={v} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ font: "500 11px var(--pk-mono)", color: "var(--pk-text-muted)", width: 96, flex: "none" }}>
            {v / base}× · {v}px
          </span>
          <span style={{ height: 12, width: v * 4, maxWidth: "100%", borderRadius: 3, background: accent }} />
        </div>
      ))}
    </div>
  );
}

const cssGrid = `:root {
  /* Grid base units — every spacing value is a multiple of one of these */
  --pk-grid-4: 4px;   /* 4-pt: 4 8 12 16 20 24 32 40 — fine adjustments */
  --pk-grid-8: 8px;   /* 8-pt: 8 16 24 32 40 48 56 64 — layout default */
}

/* Derive any step as a multiple of the base */
.stack   { gap: calc(var(--pk-grid-8) * 3); }  /* 24px */
.icon-gap { gap: calc(var(--pk-grid-4) * 2); }  /* 8px  */`;

const dartGrid = `// parkway_grid.dart
abstract class PkGrid {
  static const double base4 = 4; // fine adjustments
  static const double base8 = 8; // layout default

  /// Snap any value to a multiple of the base unit.
  static double step(double base, int n) => base * n;
  // PkGrid.step(PkGrid.base8, 3) == 24
}`;

export default function Grid({ fw, setFw }) {
  return (
    <>
      <Lead>
        Spacing snaps to a grid so layouts stay rhythmic. Parkway uses an 8-point grid for layout,
        with a 4-point grid for fine adjustments. Every value is a multiple of its base unit.
      </Lead>

      <SectionHeader label="8-point grid" desc="The layout default — section, card, and stack spacing. Matches the Spacing tokens." />
      <div className="ph-stage" style={{ marginTop: 6 }}>
        <Scale base={8} steps={EIGHT} accent="#F9956B" />
      </div>

      <SectionHeader label="4-point grid" desc="Half-steps for tight spots — icon-to-label gaps, dense controls, optical nudges." />
      <div className="ph-stage" style={{ marginTop: 6 }}>
        <Scale base={4} steps={FOUR} accent="#FDD5C4" />
      </div>

      <SectionHeader label="How values derive" desc="Pick a base (8 for layout, 4 for fine work), then multiply. Avoid off-grid values like 5, 13, or 18." />

      <SectionHeader label="Export grid" />
      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock
        code={fw === "flutter" ? dartGrid : cssGrid}
        label={fw === "flutter" ? "parkway_grid.dart" : "parkway-grid.css (Vue & React)"}
      />
    </>
  );
}
