// ════════════════════════════════════════════════════════════════════
// Parkway Wallet component snippets — React, Vue 3, Flutter.
// Imported from Figma "ParkwayWallet" (Design system, node 31764:10115).
// All styling references --pk-* tokens / PkColors, never raw hex.
// ════════════════════════════════════════════════════════════════════

/* ── Text Input ─────────────────────────────────────────────────────── */
export const reactTextInput = `// PkTextInput.jsx — Parkway Wallet
export default function PkTextInput({
  label, placeholder, helper, error, disabled, trailingIcon, ...rest
}) {
  return (
    <label className="pk-field">
      {label && <span className="pk-field__label">{label}</span>}
      <span className={\`pk-input\${error ? " is-error" : ""}\`}>
        <input placeholder={placeholder} disabled={disabled} aria-invalid={!!error} {...rest} />
        {trailingIcon}
      </span>
      {(error || helper) && <span className={\`pk-field__help\${error ? " is-error" : ""}\`}>{error || helper}</span>}
    </label>
  );
}

/* parkway-input.css
.pk-field { display: grid; gap: 6px; }
.pk-field__label { font: 600 12px Manrope; color: var(--pk-label); }
.pk-input { display: flex; align-items: center; gap: 8px; height: 45px;
  padding: 0 16px; border: 1px solid var(--pk-border); border-radius: 8px;
  background: var(--pk-field-bg); transition: border-color .15s ease; }
.pk-input input { flex: 1; border: 0; outline: 0; background: none;
  font: 400 14px Manrope; color: var(--pk-text); }
.pk-input input::placeholder { color: var(--pk-placeholder); }
.pk-input:focus-within { border-color: var(--pk-tangerine-01); box-shadow: 0 0 0 3px var(--pk-focus-ring); }
.pk-input.is-error { border-color: var(--pk-error); }
.pk-field__help { font: 400 12px Manrope; color: var(--pk-text-muted); }
.pk-field__help.is-error { color: var(--pk-error); }
*/`;

export const vueTextInput = `<!-- PkTextInput.vue — Parkway Wallet -->
<script setup>
defineProps({ label: String, placeholder: String, helper: String,
  error: String, disabled: Boolean });
const model = defineModel();
</script>

<template>
  <label class="pk-field">
    <span v-if="label" class="pk-field__label">{{ label }}</span>
    <span class="pk-input" :class="{ 'is-error': error }">
      <input v-model="model" :placeholder="placeholder" :disabled="disabled" :aria-invalid="!!error" />
      <slot name="icon" />
    </span>
    <span v-if="error || helper" class="pk-field__help" :class="{ 'is-error': error }">{{ error || helper }}</span>
  </label>
</template>

<style scoped>
.pk-field { display: grid; gap: 6px; }
.pk-field__label { font: 600 12px Manrope; color: var(--pk-label); }
.pk-input { display: flex; align-items: center; gap: 8px; height: 45px;
  padding: 0 16px; border: 1px solid var(--pk-border); border-radius: 8px;
  background: var(--pk-field-bg); transition: border-color .15s ease; }
.pk-input input { flex: 1; border: 0; outline: 0; background: none;
  font: 400 14px Manrope; color: var(--pk-text); }
.pk-input:focus-within { border-color: var(--pk-tangerine-01); box-shadow: 0 0 0 3px var(--pk-focus-ring); }
.pk-input.is-error { border-color: var(--pk-error); }
.pk-field__help { font: 400 12px Manrope; color: var(--pk-text-muted); }
.pk-field__help.is-error { color: var(--pk-error); }
</style>`;

export const flutterTextInput = `// pk_text_input.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

class PkTextInput extends StatelessWidget {
  const PkTextInput({super.key, this.label, this.hint, this.helper,
    this.error, this.enabled = true, this.suffixIcon});

  final String? label, hint, helper, error;
  final bool enabled;
  final Widget? suffixIcon;

  @override
  Widget build(BuildContext context) {
    final border = (Color c) => OutlineInputBorder(
      borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: c));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (label != null) Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(label!, style: const TextStyle(
          fontFamily: 'Manrope', fontWeight: FontWeight.w600,
          fontSize: 12, color: PkColors.grey09))),
      TextField(
        enabled: enabled,
        decoration: InputDecoration(
          hintText: hint, suffixIcon: suffixIcon, errorText: error,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          enabledBorder: border(PkColors.grey04),
          focusedBorder: border(PkColors.tangerine01),
          errorBorder: border(PkColors.error),
          helperText: helper,
        ),
      ),
    ]);
  }
}`;

export function usageTextInput(fw, extra, state) {
  const err = state === "error";
  const dis = state === "disabled";
  if (fw === "flutter")
    return `PkTextInput(
  label: 'Amount',
  hint: 'Placeholder text',${extra === "helper" ? "\n  helper: 'Your remaining daily transfer limit is N200,000.00'," : ""}${err ? "\n  error: 'Enter a valid amount'," : ""}${dis ? "\n  enabled: false," : ""}${extra === "icon" ? "\n  suffixIcon: const Icon(Icons.expand_more)," : ""}
)`;
  const tag = fw === "vue" ? "PkTextInput" : "PkTextInput";
  return `<${tag}
  label="Amount"
  placeholder="Placeholder text"${extra === "helper" ? `\n  helper="Your remaining daily transfer limit is N200,000.00"` : ""}${err ? `\n  error="Enter a valid amount"` : ""}${dis ? `\n  ${fw === "vue" ? "disabled" : "disabled"}` : ""}${extra === "icon" ? `\n  ${fw === "vue" ? `>\n  <template #icon><CaretDown /></template>\n</${tag}` : `trailingIcon={<CaretDown />}`}` : ""} />`;
}

/* ── Toast Message ──────────────────────────────────────────────────── */
export const reactToast = `// PkToast.jsx — Parkway Wallet
export default function PkToast({ variant = "success", children }) {
  return (
    <div className={\`pk-toast pk-toast--\${variant}\`} role="status">
      <span className="pk-toast__icon" aria-hidden="true" />
      <span className="pk-toast__msg">{children}</span>
    </div>
  );
}

/* parkway-toast.css
.pk-toast { display: flex; align-items: center; gap: 12px;
  padding: 20px; border-radius: 10px; background: var(--pk-toast-bg);
  font: 500 14px Manrope; color: var(--pk-white-01); }
.pk-toast__icon { width: 24px; height: 24px; flex: none; border-radius: 50%; }
.pk-toast--success .pk-toast__icon { background: var(--pk-success); }
.pk-toast--warning .pk-toast__icon { background: var(--pk-error); }
*/`;

export const vueToast = `<!-- PkToast.vue — Parkway Wallet -->
<script setup>
defineProps({ variant: { type: String, default: "success" } }); // success | warning
</script>

<template>
  <div class="pk-toast" :class="\`pk-toast--\${variant}\`" role="status">
    <span class="pk-toast__icon" aria-hidden="true" />
    <span class="pk-toast__msg"><slot /></span>
  </div>
</template>

<style scoped>
.pk-toast { display: flex; align-items: center; gap: 12px; padding: 20px;
  border-radius: 10px; background: var(--pk-toast-bg);
  font: 500 14px Manrope; color: var(--pk-white-01); }
.pk-toast__icon { width: 24px; height: 24px; flex: none; border-radius: 50%; }
.pk-toast--success .pk-toast__icon { background: var(--pk-success); }
.pk-toast--warning .pk-toast__icon { background: var(--pk-error); }
</style>`;

export const flutterToast = `// pk_toast.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

enum PkToastVariant { success, warning }

class PkToast extends StatelessWidget {
  const PkToast({super.key, required this.message, this.variant = PkToastVariant.success});
  final String message;
  final PkToastVariant variant;

  @override
  Widget build(BuildContext context) {
    final ok = variant == PkToastVariant.success;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: PkColors.grey11, borderRadius: BorderRadius.circular(10)),
      child: Row(children: [
        Icon(ok ? Icons.sentiment_very_satisfied : Icons.error,
          color: ok ? PkColors.success : PkColors.error, size: 24),
        const SizedBox(width: 12),
        Expanded(child: Text(message, style: const TextStyle(
          fontFamily: 'Manrope', fontWeight: FontWeight.w500,
          fontSize: 14, color: PkColors.white01))),
      ]),
    );
  }
}`;

export function usageToast(fw, variant) {
  if (fw === "flutter")
    return `PkToast(\n  variant: PkToastVariant.${variant},\n  message: 'Transfer completed',\n)`;
  if (fw === "vue")
    return `<PkToast variant="${variant}">Transfer completed</PkToast>`;
  return `<PkToast variant="${variant}">Transfer completed</PkToast>`;
}

/* ── Link button ────────────────────────────────────────────────────── */
export const reactLink = `// PkLink.jsx — Parkway Wallet
export default function PkLink({ icon, iconRight, children, ...rest }) {
  return (
    <a className="pk-link" {...rest}>
      {icon && !iconRight && <span className="pk-link__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconRight && <span className="pk-link__icon">{icon}</span>}
    </a>
  );
}

/* parkway-link.css
.pk-link { display: inline-flex; align-items: center; gap: 6px;
  font: 600 14px Manrope; color: var(--pk-tangerine-01);
  text-decoration: none; cursor: pointer; }
.pk-link:hover { color: var(--pk-tangerine-06); text-decoration: underline; }
.pk-link__icon { display: inline-flex; width: 14px; height: 14px; }
*/`;

export const vueLink = `<!-- PkLink.vue — Parkway Wallet -->
<script setup>
defineProps({ iconRight: Boolean });
</script>

<template>
  <a class="pk-link">
    <span v-if="$slots.icon && !iconRight" class="pk-link__icon"><slot name="icon" /></span>
    <span><slot /></span>
    <span v-if="$slots.icon && iconRight" class="pk-link__icon"><slot name="icon" /></span>
  </a>
</template>

<style scoped>
.pk-link { display: inline-flex; align-items: center; gap: 6px;
  font: 600 14px Manrope; color: var(--pk-tangerine-01); text-decoration: none; cursor: pointer; }
.pk-link:hover { color: var(--pk-tangerine-06); text-decoration: underline; }
.pk-link__icon { display: inline-flex; width: 14px; height: 14px; }
</style>`;

export const flutterLink = `// pk_link.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

class PkLink extends StatelessWidget {
  const PkLink({super.key, required this.label, this.onTap, this.icon, this.iconRight = false});
  final String label;
  final VoidCallback? onTap;
  final IconData? icon;
  final bool iconRight;

  @override
  Widget build(BuildContext context) {
    final text = Text(label, style: const TextStyle(
      fontFamily: 'Manrope', fontWeight: FontWeight.w600,
      fontSize: 14, color: PkColors.tangerine01));
    return InkWell(onTap: onTap, child: Row(mainAxisSize: MainAxisSize.min, children: [
      if (icon != null && !iconRight) ...[Icon(icon, size: 14, color: PkColors.tangerine01), const SizedBox(width: 6)],
      text,
      if (icon != null && iconRight) ...[const SizedBox(width: 6), Icon(icon, size: 14, color: PkColors.tangerine01)],
    ]));
  }
}`;

export function usageLink(fw, icon) {
  if (fw === "flutter")
    return `PkLink(\n  label: 'View details',\n  onTap: () {},${icon === "left" ? "\n  icon: Icons.link," : icon === "right" ? "\n  icon: Icons.arrow_forward, iconRight: true," : ""}\n)`;
  if (fw === "vue")
    return icon === "none"
      ? `<PkLink>View details</PkLink>`
      : `<PkLink${icon === "right" ? " iconRight" : ""}>\n  <template #icon><LinkIcon /></template>\n  View details\n</PkLink>`;
  return icon === "none"
    ? `<PkLink>View details</PkLink>`
    : `<PkLink icon={<LinkIcon />}${icon === "right" ? " iconRight" : ""}>View details</PkLink>`;
}

/* ── Badges ─────────────────────────────────────────────────────────── */
export const reactBadge = `// PkBadge.jsx — Parkway Wallet
export default function PkBadge({ status = "success", children }) {
  return <span className={\`pk-badge pk-badge--\${status}\`}>{children}</span>;
}

/* parkway-badge.css
.pk-badge { display: inline-flex; align-items: center; height: 22px;
  padding: 0 10px; border-radius: 11px; font: 600 11px Manrope; }
.pk-badge--success   { background: var(--pk-badge-success-bg); color: var(--pk-badge-success-fg); }
.pk-badge--failed    { background: var(--pk-badge-failed-bg);  color: var(--pk-badge-failed-fg); }
.pk-badge--pending   { background: var(--pk-badge-pending-bg); color: var(--pk-badge-pending-fg); }
.pk-badge--alternate { background: var(--pk-badge-alt-bg);     color: var(--pk-badge-alt-fg); }
*/`;

export const vueBadge = `<!-- PkBadge.vue — Parkway Wallet -->
<script setup>
defineProps({ status: { type: String, default: "success" } }); // success | failed | pending | alternate
</script>

<template>
  <span class="pk-badge" :class="\`pk-badge--\${status}\`"><slot /></span>
</template>

<style scoped>
.pk-badge { display: inline-flex; align-items: center; height: 22px;
  padding: 0 10px; border-radius: 11px; font: 600 11px Manrope; }
.pk-badge--success   { background: var(--pk-badge-success-bg); color: var(--pk-badge-success-fg); }
.pk-badge--failed    { background: var(--pk-badge-failed-bg);  color: var(--pk-badge-failed-fg); }
.pk-badge--pending   { background: var(--pk-badge-pending-bg); color: var(--pk-badge-pending-fg); }
.pk-badge--alternate { background: var(--pk-badge-alt-bg);     color: var(--pk-badge-alt-fg); }
</style>`;

export const flutterBadge = `// pk_badge.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

enum PkStatus { success, failed, pending, alternate }

class PkBadge extends StatelessWidget {
  const PkBadge({super.key, required this.label, this.status = PkStatus.success});
  final String label;
  final PkStatus status;

  static const _bg = {
    PkStatus.success: Color(0xFFE7F7EA), PkStatus.failed: Color(0xFFFDECEC),
    PkStatus.pending: PkColors.buff04, PkStatus.alternate: PkColors.grey05,
  };
  static const _fg = {
    PkStatus.success: Color(0xFF1F8A3B), PkStatus.failed: PkColors.error,
    PkStatus.pending: PkColors.buff07, PkStatus.alternate: PkColors.grey09,
  };

  @override
  Widget build(BuildContext context) => Container(
    height: 22, padding: const EdgeInsets.symmetric(horizontal: 10),
    alignment: Alignment.center,
    decoration: BoxDecoration(color: _bg[status], borderRadius: BorderRadius.circular(11)),
    child: Text(label, style: TextStyle(fontFamily: 'Manrope',
      fontWeight: FontWeight.w600, fontSize: 11, color: _fg[status])),
  );
}`;

export function usageBadge(fw, status) {
  const label = { success: "Successful", failed: "Failed", pending: "Pending", alternate: "Not linked" }[status];
  if (fw === "flutter") return `PkBadge(status: PkStatus.${status}, label: '${label}')`;
  return `<PkBadge status="${status}">${label}</PkBadge>`;
}

/* ── Toggle ─────────────────────────────────────────────────────────── */
export const reactToggle = `// PkToggle.jsx — Parkway Wallet
export default function PkToggle({ checked, onChange, disabled, platform = "desktop" }) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled}
      className={\`pk-toggle\${checked ? " is-on" : ""}\${platform === "mobile" ? " pk-toggle--mobile" : ""}\`}
      onClick={() => onChange?.(!checked)}>
      <span className="pk-toggle__knob" />
    </button>
  );
}

/* parkway-toggle.css — desktop = pill, mobile = 8px radius
.pk-toggle { width: 40px; height: 20px; border: 0; border-radius: 999px;
  padding: 2px; background: var(--pk-track-off); cursor: pointer;
  transition: background .2s ease; }
.pk-toggle--mobile { border-radius: 8px; }
.pk-toggle.is-on { background: var(--pk-tangerine-01); }
.pk-toggle:disabled { background: var(--pk-tangerine-04); cursor: not-allowed; }
.pk-toggle__knob { display: block; width: 16px; height: 16px; border-radius: 50%;
  background: var(--pk-knob); transition: transform .2s ease; }
.pk-toggle--mobile .pk-toggle__knob { border-radius: 5px; }
.pk-toggle.is-on .pk-toggle__knob { transform: translateX(20px); }
*/`;

export const vueToggle = `<!-- PkToggle.vue — Parkway Wallet -->
<script setup>
defineProps({ disabled: Boolean, platform: { type: String, default: "desktop" } });
const model = defineModel({ type: Boolean });
</script>

<template>
  <button type="button" role="switch" :aria-checked="model" :disabled="disabled"
    class="pk-toggle" :class="{ 'is-on': model, 'pk-toggle--mobile': platform === 'mobile' }" @click="model = !model">
    <span class="pk-toggle__knob" />
  </button>
</template>

<style scoped>
.pk-toggle { width: 40px; height: 20px; border: 0; border-radius: 999px; padding: 2px;
  background: var(--pk-track-off); cursor: pointer; transition: background .2s ease; }
.pk-toggle--mobile { border-radius: 8px; }
.pk-toggle.is-on { background: var(--pk-tangerine-01); }
.pk-toggle:disabled { background: var(--pk-tangerine-04); cursor: not-allowed; }
.pk-toggle__knob { display: block; width: 16px; height: 16px; border-radius: 50%;
  background: var(--pk-knob); transition: transform .2s ease; }
.pk-toggle--mobile .pk-toggle__knob { border-radius: 5px; }
.pk-toggle.is-on .pk-toggle__knob { transform: translateX(20px); }
</style>`;

export const flutterToggle = `// pk_toggle.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

class PkToggle extends StatelessWidget {
  const PkToggle({super.key, required this.value, this.onChanged});
  final bool value;
  final ValueChanged<bool>? onChanged;

  @override
  Widget build(BuildContext context) => Switch(
    value: value, onChanged: onChanged,
    activeTrackColor: PkColors.tangerine01,
    inactiveTrackColor: PkColors.grey04,
    thumbColor: const WidgetStatePropertyAll(PkColors.white01),
  );
}`;

export function usageToggle(fw, state, platform = "desktop") {
  const mob = platform === "mobile";
  if (fw === "flutter")
    return `PkToggle(\n  value: ${state === "on" ? "true" : "false"},\n  onChanged: ${state === "disabled" ? "null, // disabled" : "(v) => setState(() => on = v),"}\n)`;
  if (fw === "vue")
    return `<PkToggle v-model="on"${mob ? ' platform="mobile"' : ""}${state === "disabled" ? " disabled" : ""} />`;
  return `<PkToggle checked={${state === "on" ? "true" : "false"}} onChange={setOn}${mob ? ' platform="mobile"' : ""}${state === "disabled" ? " disabled" : ""} />`;
}

/* ── Checkbox ───────────────────────────────────────────────────────── */
export const reactCheckbox = `// PkCheckbox.jsx — Parkway Wallet
export default function PkCheckbox({ checked, onChange, disabled, label }) {
  return (
    <label className={\`pk-check\${disabled ? " is-disabled" : ""}\`}>
      <input type="checkbox" checked={checked} disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)} />
      <span className="pk-check__box" aria-hidden="true" />
      {label && <span className="pk-check__label">{label}</span>}
    </label>
  );
}

/* parkway-checkbox.css
.pk-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.pk-check input { position: absolute; opacity: 0; }
.pk-check__box { width: 20px; height: 20px; border-radius: 6px;
  border: 1.5px solid var(--pk-border); background: var(--pk-field-bg);
  transition: all .15s ease; }
.pk-check input:checked + .pk-check__box { background: var(--pk-tangerine-01);
  border-color: var(--pk-tangerine-01);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.5 8.5l3 3 6-6' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: contain; }
.pk-check input:focus-visible + .pk-check__box { outline: 2px solid var(--pk-tangerine-01); outline-offset: 2px; }
*/`;

export const vueCheckbox = `<!-- PkCheckbox.vue — Parkway Wallet -->
<script setup>
defineProps({ disabled: Boolean, label: String });
const model = defineModel({ type: Boolean });
</script>

<template>
  <label class="pk-check" :class="{ 'is-disabled': disabled }">
    <input type="checkbox" v-model="model" :disabled="disabled" />
    <span class="pk-check__box" aria-hidden="true" />
    <span v-if="label" class="pk-check__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.pk-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.pk-check input { position: absolute; opacity: 0; }
.pk-check__box { width: 20px; height: 20px; border-radius: 6px;
  border: 1.5px solid var(--pk-border); background: var(--pk-field-bg); transition: all .15s ease; }
.pk-check input:checked + .pk-check__box { background: var(--pk-tangerine-01); border-color: var(--pk-tangerine-01); }
</style>`;

export const flutterCheckbox = `// pk_checkbox.dart — Parkway Wallet
import 'package:flutter/material.dart';
import 'parkway_tokens.dart';

class PkCheckbox extends StatelessWidget {
  const PkCheckbox({super.key, required this.value, this.onChanged});
  final bool value;
  final ValueChanged<bool?>? onChanged;

  @override
  Widget build(BuildContext context) => Checkbox(
    value: value, onChanged: onChanged,
    activeColor: PkColors.tangerine01,
    side: const BorderSide(color: PkColors.grey04, width: 1.5),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
  );
}`;

export function usageCheckbox(fw, checked) {
  if (fw === "flutter")
    return `PkCheckbox(\n  value: ${checked ? "true" : "false"},\n  onChanged: (v) => setState(() => agreed = v ?? false),\n)`;
  if (fw === "vue") return `<PkCheckbox v-model="agreed" label="I agree" />`;
  return `<PkCheckbox checked={${checked ? "true" : "false"}} onChange={setAgreed} label="I agree" />`;
}
