import { useEffect, useState } from "react";
import "./styles.css";
import { DEFAULT_PAGE, moduleOf } from "./nav.js";
import { PRODUCTS, DEFAULT_PRODUCT, getProduct, applyAccent } from "./products.js";
import { figmaHref } from "./tokens.js";
import { ArrowUpRight } from "./iconography/index.js";
import Rail from "./components/Rail.jsx";
import Directory from "./components/Directory.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Introduction from "./pages/Introduction.jsx";
import Buttons from "./pages/Buttons.jsx";
import Colors from "./pages/Colors.jsx";
import Typography from "./pages/Typography.jsx";
import Spacing from "./pages/Spacing.jsx";
import Shadows from "./pages/Shadows.jsx";
import Icons from "./pages/Icons.jsx";
import Logo from "./pages/Logo.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Placeholder from "./pages/Placeholder.jsx";

// Page registry — add a component = add its module here + an item in nav.js.
const PAGES = {
  introduction: Introduction,
  buttons: Buttons,
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  shadows: Shadows,
  icons: Icons,
  logo: Logo,
  "product-soon": ComingSoon,
};

// Hash routing: #/<product>/<page>. Back-compat: a bare #/<page> keeps the
// stored/default product; an unknown product or page falls back gracefully.
function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  let productId = DEFAULT_PRODUCT;
  let page = DEFAULT_PAGE;
  try {
    const stored = localStorage.getItem("pk-product");
    if (getProduct(stored)) productId = stored;
  } catch (e) {
    /* localStorage unavailable */
  }
  if (parts.length >= 2) {
    productId = parts[0];
    page = parts[1];
  } else if (parts.length === 1) {
    if (getProduct(parts[0])) productId = parts[0];
    else page = parts[0];
  }
  const product = getProduct(productId) || getProduct(DEFAULT_PRODUCT);
  if (!product.items[page]) page = DEFAULT_PAGE;
  return { productId: product.id, page };
}

export default function ParkwayHub() {
  const [route, setRoute] = useState(parseHash);
  const [fw, setFw] = useState("react");
  const { productId, page } = route;

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const product = getProduct(productId) || PRODUCTS[0];

  // Persist product + apply its accent to the live theme.
  useEffect(() => {
    try { localStorage.setItem("pk-product", productId); } catch (e) { /* ignore */ }
    applyAccent(product);
  }, [productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, productId]);

  const item = product.items[page] || product.items[DEFAULT_PAGE];
  const Comp = item?.page ? PAGES[item.page] : null;

  return (
    <div className="ph-app">
      <a className="ph-skip" href="#ph-main">Skip to content</a>
      <Rail product={product} activeModule={moduleOf(product.modules, page)} />
      <div className="ph-body">
        <div className="ph-main">
          <Directory product={product} activePage={page} />
          <main className="ph-content" id="ph-main" tabIndex={-1}>
            <div className="ph-pagehead">
              <div className="ph-pagehead-l">
                <span className="ph-pagekicker">{item?.module}</span>
                <h1 className="ph-pagetitle">{item?.label}</h1>
              </div>
              <div className="ph-pagehead-r">
                {item?.node && (
                  <a className="ph-cta" href={figmaHref(item.node)} target="_blank" rel="noreferrer">
                    Open in Figma <ArrowUpRight size={13} weight="bold" />
                  </a>
                )}
                <ThemeToggle />
              </div>
            </div>
            <div className="ph-inner ph-page" key={`${productId}/${page}`}>
              {Comp ? (
                <Comp fw={fw} setFw={setFw} item={item} product={product} />
              ) : (
                <Placeholder item={item} product={product} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
