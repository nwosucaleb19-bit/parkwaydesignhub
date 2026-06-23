import { Lead, SectionHeader } from "../components/primitives.jsx";

// Intro page for a scaffolded product (ReadyCash / Swwwipe) — the switcher,
// directory, and layout are real; brand tokens land later.
export default function ComingSoon({ product }) {
  return (
    <>
      <Lead>
        {product?.blurb ||
          "This product is being set up on the Parkway hub. The structure is in place; brand tokens arrive soon."}
      </Lead>
      <SectionHeader
        label={`${product?.name || "Product"} · status`}
        desc="The navigation, theming, and layout are already live. Colours, typography, components, and the logo will populate here once this product's tokens are finalised — no rebuild needed, just data."
      />
      <ul className="ph-steps" style={{ marginTop: 4 }}>
        <li>
          <span className="ph-stepnum">01</span>
          <span className="ph-steptext">Finalise {product?.name || "the product"}'s colours, type, and logo in Figma.</span>
        </li>
        <li>
          <span className="ph-stepnum">02</span>
          <span className="ph-steptext">Drop those values into the product registry — accent, logo, and real modules.</span>
        </li>
        <li>
          <span className="ph-stepnum">03</span>
          <span className="ph-steptext">The directory, pages, and snippets light up automatically, exactly like Parkway.</span>
        </li>
      </ul>
    </>
  );
}
