import { useEffect, useId, useRef, useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { useTheme } from "../theme.jsx";
import { Lead, SectionHeader, Tabs, CodeBlock, PreviewStage, ModeRow } from "../components/primitives.jsx";
import { CaretDown, Check } from "../iconography/index.js";
import { NIGERIA_STATES } from "../data/nigeria-states.js";
import { reactDropdown, vueDropdown, flutterDropdown, usageDropdown } from "../snippets/dropdown.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

function LiveDropdown({ state, options = NIGERIA_STATES }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const typed = useRef({ text: "", at: 0 });
  const disabled = state === "disabled";
  const error = state === "error" ? "Select your state of residence" : null;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);

  const openMenu = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true); };
  const choose = (i) => { setValue(options[i]); setOpen(false); };
  const typeAhead = (ch) => {
    const now = Date.now();
    typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + ch.toLowerCase(), at: now };
    const i = options.findIndex((o) => o.toLowerCase().startsWith(typed.current.text));
    if (i >= 0) { setActive(i); if (!open) setOpen(true); }
  };

  const onKeyDown = (e) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openMenu(); }
      else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeAhead(e.key);
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
      case "ArrowUp": e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
      case "Home": e.preventDefault(); setActive(0); break;
      case "End": e.preventDefault(); setActive(last); break;
      case "Enter": case " ": e.preventDefault(); choose(active); break;
      case "Escape": e.preventDefault(); setOpen(false); break;
      case "Tab": setOpen(false); break;
      default: if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeAhead(e.key);
    }
  };

  return (
    <div className="ph-tfield" ref={rootRef}>
      <span className="ph-tfield__label" id={`${id}-label`}>State of residence</span>
      <div className="ph-dd">
        <span className={`ph-tfield__box${error ? " err" : ""}${disabled ? " dis" : ""}`}>
          <button
            type="button"
            role="combobox"
            className="ph-dd__trigger"
            aria-labelledby={`${id}-label`}
            aria-haspopup="listbox"
            aria-controls={`${id}-list`}
            aria-expanded={open}
            aria-invalid={error ? true : undefined}
            aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            disabled={disabled}
            onClick={() => (open ? setOpen(false) : openMenu())}
            onKeyDown={onKeyDown}
          >
            <span className={`ph-dd__value${value ? "" : " is-placeholder"}`}>{value || "Select your state"}</span>
            <span className="ph-dd__chev" aria-hidden="true"><CaretDown size={16} /></span>
          </button>
        </span>
        {open && (
          <ul className="ph-dd__menu" role="listbox" id={`${id}-list`} ref={listRef} aria-labelledby={`${id}-label`} tabIndex={-1}>
            {options.map((o, i) => (
              <li
                key={o}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={o === value}
                className={`ph-dd__opt${i === active ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                {o}
                {o === value && <Check size={16} weight="bold" aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className="ph-tfield__help err" id={`${id}-err`}>{error}</span>}
    </div>
  );
}

const STATES = [
  ["default", "Default", "Closed field with placeholder. Click or press ↓ / Enter / Space to open."],
  ["error", "Error", "Red border + message, sets aria-invalid."],
  ["disabled", "Disabled", "Dimmed, non-interactive."],
];

const PROPS_ROWS = [
  ["label", "string", "—", "Visible label, Manrope SemiBold 12 — same as Text Input."],
  ["placeholder", "string", '"Select an option"', "Shown in grey until something is picked."],
  ["options", "string[]", "NIGERIA_STATES", "The list. Defaults to the 36 states + FCT, alphabetical."],
  ["value / v-model", "string", "—", "The selected option."],
  ["onChange", "(value) => void", "—", "Fires when an option is picked."],
  ["error", "string", "—", "Error message; red border, sets aria-invalid."],
  ["disabled", "boolean", "false", "Non-interactive."],
];

export default function Dropdown({ fw, setFw }) {
  const app = useTheme();
  const [mode, setMode] = useState(app.theme);
  const [state, setState] = useState("default");
  const impl = { react: reactDropdown, vue: vueDropdown, flutter: flutterDropdown };
  const label = { react: "PkDropdown.jsx + parkway-dropdown.css", vue: "PkDropdown.vue", flutter: "pk_dropdown.dart" };

  return (
    <>
      <Lead>
        A select field built on the Text Input styles: same 45px height, border and focus ring, with a
        caret on the right. It opens a scrolling list — here, all 36 states of Nigeria plus the FCT.
      </Lead>

      <SectionHeader label="Playground" desc="Open it and pick a state. With the keyboard: arrows to move, type letters to jump (e.g. “La” → Lagos), Enter to pick, Esc to close." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <ModeRow mode={mode} setMode={setMode} />
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">State</span>
          <Tabs small value={state} onChange={setState} label="State" items={STATES.map(([k, n]) => [k, n])} />
        </div>
      </div>

      <PreviewStage mode={mode} tall stageStyle={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: 400 }}>
        <LiveDropdown state={state} />
      </PreviewStage>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageDropdown(fw, state)} label="Usage — reflects the controls above" />
      <CodeBlock code={impl[fw]} label={label[fw]} />

      <SectionHeader label="States" />
      <div className="ph-statelist">
        {STATES.map(([k, n, d]) => (
          <div key={k} className={`ph-stateline${state === k ? " act" : ""}`}>
            <button type="button" className="ph-statedot" onClick={() => setState(k)} aria-label={`Preview ${n}`} />
            <span className="ph-statelabel">{n}</span>
            <span className="ph-statedesc">{d}</span>
          </div>
        ))}
      </div>

      <SectionHeader label="Props" />
      <div className="ph-tablewrap">
        <table className="ph-table">
          <thead><tr>{["Prop", "Type", "Default", "Notes"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {PROPS_ROWS.map(([p, t, d, n]) => (
              <tr key={p}>
                <td className="ph-td-prop">{p}</td>
                <td className="ph-td-type">{t}</td>
                <td className="ph-td-default">{d}</td>
                <td className="ph-td-notes">{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader label="Usage guidelines" />
      <div className="ph-guidance">
        <div>
          <p className="ph-guidehead"><span className="ph-dot ok" aria-hidden="true" />Do</p>
          <ul className="ph-guidelist">
            <li>Use it when there are more than 5 fixed choices.</li>
            <li>Sort options alphabetically unless there's a clearer order.</li>
            <li>Keep the label visible — the placeholder disappears once a value is picked.</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't use a dropdown for 2–3 options — use Radio buttons or Tabs Toggle.</li>
            <li>Don't put free-text entry in it — that's a Text Input.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
