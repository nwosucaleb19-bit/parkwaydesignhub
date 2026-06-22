import { useTheme } from "../theme.jsx";
import { MODULES, firstItemId } from "../nav.js";
import { RAIL_ICONS } from "../iconography/index.js";

// Zone 1 — slim icon + label rail for the four top-level modules.
export default function Rail({ activeModule }) {
  const { theme } = useTheme();
  // Full lockup (wordmark + mark); black wordmark on the light rail, white on dark.
  const logo = theme === "dark" ? "/logos/logo-dark.svg" : "/logos/logo-light.svg";
  return (
    <nav className="ph-rail" aria-label="Top-level sections">
      <a className="ph-mark" href="#/introduction" aria-label="Parkway — Introduction">
        <img src={logo} alt="Parkway" />
      </a>
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
