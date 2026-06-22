import { useEffect, useState } from "react";
import "./styles.css";
import { ITEMS, DEFAULT_PAGE, moduleOf } from "./nav.js";
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
import Icons from "./pages/Icons.jsx";
import Logo from "./pages/Logo.jsx";
import Placeholder from "./pages/Placeholder.jsx";

// Page registry — add a component = add its module here + an item in nav.js.
const PAGES = {
  introduction: Introduction,
  buttons: Buttons,
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  icons: Icons,
  logo: Logo,
};

const pageFromHash = () => {
  const key = window.location.hash.replace(/^#\/?/, "");
  return ITEMS[key] ? key : DEFAULT_PAGE;
};

export default function ParkwayHub() {
  const [page, setPage] = useState(pageFromHash);
  const [fw, setFw] = useState("react");

  // Deep-linkable, back/forward-friendly hash routing.
  useEffect(() => {
    const onHash = () => {
      const key = window.location.hash.replace(/^#\/?/, "");
      if (ITEMS[key]) setPage(key);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const item = ITEMS[page] || ITEMS[DEFAULT_PAGE];
  const Comp = item?.page ? PAGES[item.page] : null;

  return (
    <div className="ph-app">
      <a className="ph-skip" href="#ph-main">Skip to content</a>
      <Rail activeModule={moduleOf(page)} />
      <div className="ph-body">
        <div className="ph-main">
          <Directory activePage={page} />
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
            <div className="ph-inner ph-page" key={page}>
              {Comp ? <Comp fw={fw} setFw={setFw} item={item} /> : <Placeholder item={item} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
