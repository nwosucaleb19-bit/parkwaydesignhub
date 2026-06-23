import { firstItemId } from "../nav.js";
import { linkTo } from "../products.js";
import { RAIL_ICONS } from "../iconography/index.js";
import ProductSwitcher from "./ProductSwitcher.jsx";

// Zone 1 — product switcher + the active product's four top-level modules.
export default function Rail({ product, activeModule }) {
  return (
    <nav className="ph-rail" aria-label="Top-level sections">
      <ProductSwitcher product={product} />
      {product.modules.map((m) => {
        const Icon = RAIL_ICONS[m.icon];
        const act = activeModule === m.id;
        return (
          <a
            key={m.id}
            className={`ph-railitem${act ? " act" : ""}`}
            href={linkTo(product.id, firstItemId(product.modules, m.id))}
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
