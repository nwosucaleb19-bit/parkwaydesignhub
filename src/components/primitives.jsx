import { useState } from "react";
import { copyText } from "../lib/copy.js";
import { CaretDown } from "../iconography/index.js";

// Lead paragraph at the top of a page body.
export function Lead({ children }) {
  return <p className="ph-lead">{children}</p>;
}

// Labeled section: hairline divider + uppercase label + muted one-liner.
export function SectionHeader({ label, desc }) {
  return (
    <div className="ph-section">
      <h2 className="ph-seclabel">{label}</h2>
      {desc && <p className="ph-secdesc">{desc}</p>}
    </div>
  );
}

// Centered preview stage, or a left-aligned captioned stage.
export function Stage({ children, tall, caption }) {
  if (caption) {
    return (
      <div className={`ph-stage${tall ? " tall" : ""}`}>
        <p className="ph-stagecap">{caption}</p>
        {children}
      </div>
    );
  }
  return <div className={`ph-stage center${tall ? " tall" : ""}`}>{children}</div>;
}

export function CopyBtn({ text, dark }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => copyText(text, setOk)}
      className={`ph-copy${dark ? " dark" : ""}${ok ? " ok" : ""}`}
      aria-live="polite"
    >
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({ code, label }) {
  return (
    <figure className="ph-code" translate="no">
      <figcaption className="ph-codehead">
        <span className="ph-codelabel">{label}</span>
        <CopyBtn text={code} dark />
      </figcaption>
      <pre className="ph-codepre">{code}</pre>
    </figure>
  );
}

// Segmented tabs with roving focus + arrow-key navigation.
export function Tabs({ value, onChange, items, label, small }) {
  const onKey = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % items.length;
    if (e.key === "ArrowLeft") n = (i - 1 + items.length) % items.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = items.length - 1;
    if (n == null) return;
    e.preventDefault();
    onChange(items[n][0]);
    e.currentTarget.parentElement.children[n]?.focus();
  };
  return (
    <div className={`ph-tabs${small ? " sm" : ""}`} role="tablist" aria-label={label}>
      {items.map(([k, name], i) => (
        <button
          key={k}
          type="button"
          role="tab"
          aria-selected={value === k}
          tabIndex={value === k ? 0 : -1}
          className={`ph-tab${value === k ? " act" : ""}`}
          onClick={() => onChange(k)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

export function Select({ value, onChange, options, label }) {
  return (
    <span className="ph-selectwrap">
      <select
        className="ph-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
      <span className="ph-selectchev">
        <CaretDown size={14} weight="bold" />
      </span>
    </span>
  );
}
