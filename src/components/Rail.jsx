import { MODULES, firstItemId } from "../nav.js";
import { RAIL_ICONS } from "../iconography/index.js";

// Zone 1 — slim icon + label rail for the four top-level modules.
export default function Rail({ activeModule }) {
  return (
    <nav className="ph-rail" aria-label="Top-level sections">
      <span className="ph-mark" aria-hidden="true">P</span>
      {MODULES.map((m) => {
        const Icon = RAIL_ICONS[m.icon];
        const act = activeModule === m.id;
        return (
          <a
            key={m.id}
            className={`ph-railitem${act ? " act" : ""}`}
            href={`#/${firstItemId(m.id)}`}
            aria-current={act ? "page" : undefined}
            title={m.label}
          >
            {Icon && <Icon size={20} weight={act ? "fill" : "regular"} />}
            <span className="ph-raillabel">{m.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
