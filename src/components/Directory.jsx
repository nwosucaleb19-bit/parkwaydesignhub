import { useState } from "react";
import { MODULES, ITEMS, moduleOf } from "../nav.js";
import { FIGMA_FILE } from "../tokens.js";
import { MagnifyingGlass, X, ArrowUpRight } from "../iconography/index.js";

function Badge({ status }) {
  if (status === "building") return <span className="ph-badge building">NEW</span>;
  if (status === "soon") return <span className="ph-badge soon">SOON</span>;
  return null;
}

function ItemRow({ it, active }) {
  if (it.external) {
    return (
      <a className="ph-item" href={it.href} target="_blank" rel="noreferrer">
        <span className="ph-itemlabel">{it.label}</span>
        <span className="ph-itemcount"><ArrowUpRight size={13} /></span>
      </a>
    );
  }
  const right = it.count != null ? it.count : it.meta || null;
  return (
    <a
      className={`ph-item${active ? " act" : ""}${it.status === "soon" ? " soon" : ""}`}
      href={`#/${it.id}`}
      aria-current={active ? "page" : undefined}
    >
      <span className="ph-itemlabel">{it.label}<Badge status={it.status} /></span>
      {right != null && <span className="ph-itemcount">{right}</span>}
    </a>
  );
}

function Search({ q, setQ }) {
  return (
    <div className="ph-dirsearch">
      <span className="ph-searchicon"><MagnifyingGlass size={15} /></span>
      <input
        type="search"
        name="dirsearch"
        autoComplete="off"
        spellCheck={false}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the system…"
        aria-label="Search the system"
      />
      {q && (
        <button type="button" className="ph-dirclear" onClick={() => setQ("")} aria-label="Clear search">
          <X size={13} />
        </button>
      )}
    </div>
  );
}

function Foot() {
  return (
    <footer className="ph-dirfoot">
      <a href={FIGMA_FILE} target="_blank" rel="noreferrer">
        Figma source <ArrowUpRight size={11} />
      </a>
      <p>Synced from Figma Dev Mode · v0.2</p>
    </footer>
  );
}

// Zone 2 — searchable directory tree.
export default function Directory({ activePage }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  if (needle) {
    const hits = Object.values(ITEMS).filter(
      (it) =>
        it.label.toLowerCase().includes(needle) ||
        it.id.includes(needle) ||
        it.module.toLowerCase().includes(needle)
    );
    return (
      <aside className="ph-dir" aria-label="Directory">
        <div className="ph-dirscroll">
          <Search q={q} setQ={setQ} />
          {hits.length ? (
            <>
              <p className="ph-group">Results · {hits.length}</p>
              {hits.map((it) => (
                <ItemRow key={it.id} it={it} active={activePage === it.id} />
              ))}
            </>
          ) : (
            <div className="ph-empty">
              <h3>No matches for &ldquo;{q}&rdquo;</h3>
              <p>Try a page name — colors, typography, buttons, logo, icons.</p>
              <button type="button" className="ph-clear" onClick={() => setQ("")}>
                Clear search
              </button>
            </div>
          )}
        </div>
        <Foot />
      </aside>
    );
  }

  // Contextual: show only the active area's items (driven by the rail).
  const activeModule = MODULES.find((m) => m.id === moduleOf(activePage)) || MODULES[0];
  return (
    <aside className="ph-dir" aria-label="Directory">
      <div className="ph-dirscroll">
        <Search q={q} setQ={setQ} />
        <p className="ph-group">{activeModule.label}</p>
        {activeModule.items.map((it) => (
          <div key={it.id}>
            <ItemRow it={it} active={activePage === it.id} />
            {it.children && activePage === it.id && (
              <div className="ph-children">
                {it.children.map((c, i) => (
                  <a key={i} className="ph-item" href={`#/${it.id}`}>
                    <span className="ph-itemlabel">{c.label}</span>
                    {c.count != null && <span className="ph-itemcount">{c.count}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Foot />
    </aside>
  );
}
