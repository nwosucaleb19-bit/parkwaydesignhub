// ════════════════════════════════════════════════════════════════════
// Dropdown — select-only combobox built on the Text Input field styles.
// Example data: the 36 states of Nigeria + FCT.
// Pattern: WAI-ARIA "select-only combobox" (button + listbox).
// ════════════════════════════════════════════════════════════════════

const STATES_JS = `const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT — Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];`;

const DROPDOWN_CSS = `.pk-field { display: grid; gap: 6px; }
.pk-field__label { font: 600 12px Manrope; color: var(--pk-label); }
.pk-dropdown { position: relative; }
.pk-dropdown__trigger { display: flex; align-items: center; gap: 8px; width: 100%; height: 45px;
  padding: 0 16px; border: 1px solid var(--pk-border); border-radius: 8px; background: var(--pk-field-bg);
  font: 400 14px Manrope; color: var(--pk-text); text-align: left; cursor: pointer; }
.pk-dropdown__trigger:focus-visible,
.pk-dropdown__trigger[aria-expanded="true"] { outline: 0; border-color: var(--pk-tangerine-01); box-shadow: 0 0 0 3px var(--pk-focus-ring); }
.pk-dropdown__trigger[aria-invalid="true"] { border-color: var(--pk-error); }
.pk-dropdown__trigger:disabled { background: var(--pk-field-bg-disabled); color: var(--pk-grey-07); cursor: not-allowed; }
.pk-dropdown__value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pk-dropdown__value.is-placeholder { color: var(--pk-placeholder); }
.pk-dropdown__chev { display: flex; color: var(--pk-text-muted); transition: transform .2s ease; }
.pk-dropdown__trigger[aria-expanded="true"] .pk-dropdown__chev { transform: rotate(180deg); }
.pk-dropdown__menu { position: absolute; z-index: 20; left: 0; right: 0; top: calc(100% + 6px);
  max-height: 240px; overflow-y: auto; margin: 0; padding: 6px; list-style: none;
  background: var(--pk-surface); border: 1px solid var(--pk-border); border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(18,18,18,.08), 0 4px 6px -4px rgba(18,18,18,.08); }
.pk-dropdown__opt { display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 6px; font: 400 14px Manrope; color: var(--pk-text); cursor: pointer; }
.pk-dropdown__opt.is-active { background: var(--pk-tangerine-05); }
.pk-dropdown__opt[aria-selected="true"] { font-weight: 600; color: var(--pk-tangerine-06); }
.pk-field__help.is-error { font: 400 12px Manrope; color: var(--pk-error); }`;

export const reactDropdown = `// PkDropdown.jsx — Parkway Wallet
import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import "./parkway-dropdown.css";

${STATES_JS}

export default function PkDropdown({
  label, placeholder = "Select an option", options = NIGERIA_STATES,
  value, onChange, error, disabled,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const typed = useRef({ text: "", at: 0 });

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openMenu = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true); };
  const choose = (i) => { onChange?.(options[i]); setOpen(false); };

  // Type-ahead: jump to the first option starting with the typed letters.
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
      else if (e.key.length === 1) typeAhead(e.key);
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
      case "ArrowUp":   e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
      case "Home":      e.preventDefault(); setActive(0); break;
      case "End":       e.preventDefault(); setActive(last); break;
      case "Enter": case " ": e.preventDefault(); choose(active); break;
      case "Escape":    e.preventDefault(); setOpen(false); break;
      case "Tab":       setOpen(false); break;
      default: if (e.key.length === 1) typeAhead(e.key);
    }
  };

  return (
    <div className="pk-field" ref={rootRef}>
      <span className="pk-field__label" id={\`\${id}-label\`}>{label}</span>
      <div className="pk-dropdown">
        <button
          type="button" role="combobox" className="pk-dropdown__trigger"
          aria-labelledby={\`\${id}-label\`} aria-haspopup="listbox" aria-controls={\`\${id}-list\`}
          aria-expanded={open} aria-invalid={!!error || undefined}
          aria-activedescendant={open ? \`\${id}-opt-\${active}\` : undefined}
          aria-describedby={error ? \`\${id}-err\` : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          <span className={\`pk-dropdown__value\${value ? "" : " is-placeholder"}\`}>{value || placeholder}</span>
          <span className="pk-dropdown__chev" aria-hidden="true"><CaretDown size={16} /></span>
        </button>
        {open && (
          <ul className="pk-dropdown__menu" role="listbox" id={\`\${id}-list\`} ref={listRef}
            aria-labelledby={\`\${id}-label\`} tabIndex={-1}>
            {options.map((o, i) => (
              <li key={o} id={\`\${id}-opt-\${i}\`} role="option" aria-selected={o === value}
                className={\`pk-dropdown__opt\${i === active ? " is-active" : ""}\`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}   /* keep focus on the trigger */
                onClick={() => choose(i)}>
                {o}
                {o === value && <Check size={16} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className="pk-field__help is-error" id={\`\${id}-err\`}>{error}</span>}
    </div>
  );
}

/* parkway-dropdown.css
${DROPDOWN_CSS}
*/`;

export const vueDropdown = `<!-- PkDropdown.vue — Parkway Wallet -->
<script setup>
import { ref, watch, nextTick, onBeforeUnmount, useId } from "vue";
import { PhCaretDown, PhCheck } from "@phosphor-icons/vue";

${STATES_JS}

const props = defineProps({
  label: String,
  placeholder: { type: String, default: "Select an option" },
  options: { type: Array, default: () => NIGERIA_STATES },
  error: String,
  disabled: Boolean,
});
const model = defineModel();

const id = useId();
const open = ref(false);
const active = ref(0);
const root = ref(null);
const list = ref(null);
let typed = { text: "", at: 0 };

const onDoc = (e) => { if (!root.value?.contains(e.target)) open.value = false; };
watch(open, (o) => {
  if (o) document.addEventListener("mousedown", onDoc);
  else document.removeEventListener("mousedown", onDoc);
});
onBeforeUnmount(() => document.removeEventListener("mousedown", onDoc));
watch([open, active], async () => {
  await nextTick();
  if (open.value) list.value?.children[active.value]?.scrollIntoView({ block: "nearest" });
});

function openMenu() { active.value = Math.max(0, props.options.indexOf(model.value)); open.value = true; }
function choose(i) { model.value = props.options[i]; open.value = false; }
function typeAhead(ch) {
  const now = Date.now();
  typed = { text: (now - typed.at < 600 ? typed.text : "") + ch.toLowerCase(), at: now };
  const i = props.options.findIndex((o) => o.toLowerCase().startsWith(typed.text));
  if (i >= 0) { active.value = i; open.value = true; }
}
function onKeyDown(e) {
  const last = props.options.length - 1;
  if (!open.value) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openMenu(); }
    else if (e.key.length === 1) typeAhead(e.key);
    return;
  }
  const keys = {
    ArrowDown: () => (active.value = Math.min(last, active.value + 1)),
    ArrowUp: () => (active.value = Math.max(0, active.value - 1)),
    Home: () => (active.value = 0),
    End: () => (active.value = last),
    Enter: () => choose(active.value),
    " ": () => choose(active.value),
    Escape: () => (open.value = false),
  };
  if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
  else if (e.key === "Tab") open.value = false;
  else if (e.key.length === 1) typeAhead(e.key);
}
</script>

<template>
  <div class="pk-field" ref="root">
    <span class="pk-field__label" :id="\`\${id}-label\`">{{ label }}</span>
    <div class="pk-dropdown">
      <button type="button" role="combobox" class="pk-dropdown__trigger"
        :aria-labelledby="\`\${id}-label\`" aria-haspopup="listbox" :aria-controls="\`\${id}-list\`"
        :aria-expanded="open" :aria-invalid="error ? true : undefined"
        :aria-activedescendant="open ? \`\${id}-opt-\${active}\` : undefined"
        :aria-describedby="error ? \`\${id}-err\` : undefined"
        :disabled="disabled" @click="open ? (open = false) : openMenu()" @keydown="onKeyDown">
        <span class="pk-dropdown__value" :class="{ 'is-placeholder': !model }">{{ model || placeholder }}</span>
        <span class="pk-dropdown__chev" aria-hidden="true"><PhCaretDown :size="16" /></span>
      </button>
      <ul v-if="open" ref="list" class="pk-dropdown__menu" role="listbox" :id="\`\${id}-list\`"
        :aria-labelledby="\`\${id}-label\`" tabindex="-1">
        <li v-for="(o, i) in options" :key="o" :id="\`\${id}-opt-\${i}\`" role="option"
          :aria-selected="o === model" class="pk-dropdown__opt" :class="{ 'is-active': i === active }"
          @mouseenter="active = i" @mousedown.prevent @click="choose(i)">
          {{ o }}
          <PhCheck v-if="o === model" :size="16" aria-hidden="true" />
        </li>
      </ul>
    </div>
    <span v-if="error" class="pk-field__help is-error" :id="\`\${id}-err\`">{{ error }}</span>
  </div>
</template>

<style scoped>
${DROPDOWN_CSS}
</style>`;

export const flutterDropdown = `// pk_dropdown.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'parkway_tokens.dart';

const nigeriaStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT — Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

class PkDropdown extends StatelessWidget {
  const PkDropdown({super.key, required this.label, this.hint = 'Select an option',
    this.options = nigeriaStates, this.value, this.onChanged, this.error, this.enabled = true});

  final String label, hint;
  final List<String> options;
  final String? value, error;
  final ValueChanged<String?>? onChanged;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final s = (Color l, Color d) => dark ? d : l;
    OutlineInputBorder border(Color c, [double w = 1]) => OutlineInputBorder(
      borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c, width: w));
    final text = TextStyle(fontFamily: 'Manrope', fontSize: 14,
      color: s(PkSurfaceLight.text, PkSurfaceDark.text));

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(label, style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w600,
          fontSize: 12, color: s(PkSurfaceLight.label, PkSurfaceDark.label))),
      ),
      DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        menuMaxHeight: 240,
        borderRadius: BorderRadius.circular(8),
        dropdownColor: s(PkSurfaceLight.surface, PkSurfaceDark.surface),
        icon: PhosphorIcon(PhosphorIconsRegular.caretDown, size: 16,
          color: s(PkColors.grey08, PkColors.grey02)),
        hint: Text(hint, style: text.copyWith(color: s(PkSurfaceLight.placeholder, PkSurfaceDark.placeholder))),
        style: text,
        onChanged: enabled ? onChanged : null,
        items: [
          for (final o in options) DropdownMenuItem(value: o, child: Text(o,
            style: o == value
              ? text.copyWith(fontWeight: FontWeight.w600, color: PkColors.tangerine06)
              : text)),
        ],
        decoration: InputDecoration(
          errorText: error,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          enabledBorder: border(s(PkSurfaceLight.border, PkSurfaceDark.border)),
          focusedBorder: border(PkColors.tangerine01),
          errorBorder: border(PkColors.error),
          focusedErrorBorder: border(PkColors.error),
          disabledBorder: border(s(PkSurfaceLight.border, PkSurfaceDark.border)),
          filled: !enabled,
          fillColor: s(PkColors.grey06, Colors.transparent),
        ),
      ),
    ]);
  }
}`;

export function usageDropdown(fw, state) {
  const err = state === "error";
  const dis = state === "disabled";
  if (fw === "flutter")
    return `PkDropdown(\n  label: 'State of residence',\n  hint: 'Select your state',\n  value: state,\n  onChanged: (v) => setState(() => state = v),${err ? "\n  error: 'Select your state of residence'," : ""}${dis ? "\n  enabled: false," : ""}\n)`;
  if (fw === "vue")
    return `<PkDropdown\n  v-model="state"\n  label="State of residence"\n  placeholder="Select your state"${err ? `\n  error="Select your state of residence"` : ""}${dis ? "\n  disabled" : ""}\n/>`;
  return `<PkDropdown\n  label="State of residence"\n  placeholder="Select your state"\n  value={state}\n  onChange={setState}${err ? `\n  error="Select your state of residence"` : ""}${dis ? "\n  disabled" : ""}\n/>`;
}
