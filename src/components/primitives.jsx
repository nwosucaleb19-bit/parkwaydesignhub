import { useEffect, useState } from "react";
import { copyText } from "../lib/copy.js";
import { useTheme } from "../theme.jsx";
import { CaretDown } from "../iconography/index.js";

// One shared highlighter, lazily loaded — only the languages/themes the hub
// uses, and code-split out of the main bundle (loads on first code block).
let _hl;
function getHighlighter() {
  if (!_hl) {
    _hl = (async () => {
      const [core, oniguruma, gLight, gDark, jsx, js, vue, dart, css, yaml, bash, html] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/oniguruma"),
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
        import("@shikijs/langs/jsx"),
        import("@shikijs/langs/javascript"),
        import("@shikijs/langs/vue"),
        import("@shikijs/langs/dart"),
        import("@shikijs/langs/css"),
        import("@shikijs/langs/yaml"),
        import("@shikijs/langs/bash"),
        import("@shikijs/langs/html"),
      ]);
      return core.createHighlighterCore({
        themes: [gLight.default, gDark.default],
        langs: [jsx.default, js.default, vue.default, dart.default, css.default, yaml.default, bash.default, html.default],
        engine: oniguruma.createOnigurumaEngine(import("shiki/wasm")),
      });
    })();
  }
  return _hl;
}

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

const LANG_LABEL = { jsx: "JSX", js: "JavaScript", vue: "Vue", dart: "Dart", css: "CSS", yaml: "YAML", bash: "Bash", html: "HTML" };

function inferLang(label = "") {
  const l = label.toLowerCase();
  if (l.includes(".vue")) return "vue";
  if (l.includes(".dart")) return "dart";
  if (l.includes(".css")) return "css";
  if (l.includes("pubspec") || l.includes(".yaml") || l.includes(".yml")) return "yaml";
  if (l.includes("fonts setup")) return "html";
  if (l.includes("bash") || l.includes("cli") || l.includes("npm")) return "bash";
  if (l.includes(".js") || l.includes("tailwind")) return "js";
  return "jsx";
}

// Syntax-highlighted code card (shiki) — follows the hub's light/dark theme.
export function CodeBlock({ code, label, lang }) {
  const { theme } = useTheme();
  const language = lang || inferLang(label);
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    getHighlighter()
      .then((hl) => hl.codeToHtml(code, { lang: language, theme: theme === "dark" ? "github-dark" : "github-light" }))
      .then((h) => { if (alive) setHtml(h); })
      .catch(() => { if (alive) setHtml(null); });
    return () => { alive = false; };
  }, [code, language, theme]);

  return (
    <figure className="ph-code" translate="no">
      <figcaption className="ph-codehead">
        <span className="ph-codelang">{LANG_LABEL[language] || language}</span>
        <span className="ph-codelabel">{label}</span>
        <CopyBtn text={code} />
      </figcaption>
      {html ? (
        <div className="ph-codebody" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="ph-codebody"><pre className="ph-codefallback"><code>{code}</code></pre></div>
      )}
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
