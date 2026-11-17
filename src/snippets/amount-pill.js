// ════════════════════════════════════════════════════════════════════
// Amount Pill — quick-pick preset amounts (single select).
// Figma: ParkwayWallet 36853:14410 (default) · 36853:14404 (selected).
// Asset: /assets/wallet/pill-check.svg (41×30 corner check, selected state).
// ════════════════════════════════════════════════════════════════════

const PILL_CSS = `.pk-pills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.pk-pill { position: relative; overflow: hidden; height: 45px; padding: 12px 16px;
  border: 2px solid transparent; border-radius: 10px; background: var(--pk-pill-bg); cursor: pointer;
  font: 600 12px/1.415 Manrope; color: var(--pk-text); white-space: nowrap; }
.pk-pill[aria-checked="true"] { background: var(--pk-pill-selected-bg); border-color: var(--pk-tangerine-01); }
.pk-pill__check { position: absolute; top: -2px; right: -2px; display: block; pointer-events: none; }`;

export const reactAmountPill = `// PkAmountPills.jsx — Parkway Wallet
import "./parkway-amount-pill.css";

const naira = (n) => "₦" + n.toLocaleString("en-NG");

export function PkAmountPill({ amount, selected, onSelect, tabIndex, ...rest }) {
  return (
    <button type="button" role="radio" aria-checked={selected} tabIndex={tabIndex}
      className="pk-pill" onClick={() => onSelect(amount)} {...rest}>
      {naira(amount)}
      {selected && <img className="pk-pill__check" src="/assets/wallet/pill-check.svg" width="41" height="30" alt="" />}
    </button>
  );
}

export default function PkAmountPills({ amounts, value, onChange, label = "Choose an amount" }) {
  // Radio-group keyboard model: arrows move + select, one tab stop.
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = Math.max(0, amounts.indexOf(value));
    const next = (i + step + amounts.length) % amounts.length;
    onChange(amounts[next]);
    e.currentTarget.children[next]?.focus();
  };
  const focusable = amounts.includes(value) ? value : amounts[0];

  return (
    <div className="pk-pills" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
      {amounts.map((a) => (
        <PkAmountPill key={a} amount={a} selected={a === value} onSelect={onChange}
          tabIndex={a === focusable ? 0 : -1} />
      ))}
    </div>
  );
}

/* parkway-amount-pill.css
${PILL_CSS}
*/`;

export const vueAmountPill = `<!-- PkAmountPills.vue — Parkway Wallet -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  amounts: { type: Array, required: true },
  label: { type: String, default: "Choose an amount" },
});
const model = defineModel();   // selected amount (number)

const naira = (n) => "₦" + n.toLocaleString("en-NG");
const focusable = computed(() => (props.amounts.includes(model.value) ? model.value : props.amounts[0]));

function onKeyDown(e) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!step) return;
  e.preventDefault();
  const i = Math.max(0, props.amounts.indexOf(model.value));
  const next = (i + step + props.amounts.length) % props.amounts.length;
  model.value = props.amounts[next];
  e.currentTarget.children[next]?.focus();
}
</script>

<template>
  <div class="pk-pills" role="radiogroup" :aria-label="label" @keydown="onKeyDown">
    <button v-for="a in amounts" :key="a" type="button" role="radio" class="pk-pill"
      :aria-checked="a === model" :tabindex="a === focusable ? 0 : -1" @click="model = a">
      {{ naira(a) }}
      <img v-if="a === model" class="pk-pill__check" src="/assets/wallet/pill-check.svg" width="41" height="30" alt="" />
    </button>
  </div>
</template>

<style scoped>
${PILL_CSS}
</style>`;

export const flutterAmountPill = `// pk_amount_pills.dart — Parkway Wallet
// Requires flutter_svg; add assets/wallet/pill-check.svg to pubspec.yaml.
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'parkway_tokens.dart';

final _naira = NumberFormat.currency(locale: 'en_NG', symbol: '₦', decimalDigits: 0);

class PkAmountPills extends StatelessWidget {
  const PkAmountPills({super.key, required this.amounts, this.value, required this.onChanged});
  final List<int> amounts;
  final int? value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) => GridView.count(
    crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
    mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 2.4,
    children: [
      for (final a in amounts)
        PkAmountPill(amount: a, selected: a == value, onTap: () => onChanged(a)),
    ],
  );
}

class PkAmountPill extends StatelessWidget {
  const PkAmountPill({super.key, required this.amount, this.selected = false, required this.onTap});
  final int amount;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final bg = selected
      ? (dark ? PkSurfaceDark.pillSelected : PkSurfaceLight.pillSelected)
      : (dark ? PkSurfaceDark.pill : PkSurfaceLight.pill);
    return Semantics(
      inMutuallyExclusiveGroup: true, checked: selected, button: true,
      child: Material(
        color: bg,
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10),
          side: BorderSide(width: 2, color: selected ? PkColors.tangerine01 : Colors.transparent)),
        child: InkWell(
          onTap: onTap,
          child: Stack(children: [
            Center(child: Text(_naira.format(amount), style: TextStyle(fontFamily: 'Manrope',
              fontWeight: FontWeight.w600, fontSize: 12, height: 1.415,
              color: dark ? PkSurfaceDark.text : PkColors.grey12))),
            if (selected) Positioned(top: -2, right: -2,
              child: SvgPicture.asset('assets/wallet/pill-check.svg', width: 41, height: 30)),
          ]),
        ),
      ),
    );
  }
}`;

export function usageAmountPill(fw) {
  if (fw === "flutter")
    return `PkAmountPills(\n  amounts: const [1000, 2000, 5000, 10000, 20000, 50000],\n  value: amount,\n  onChanged: (v) => setState(() => amount = v),\n)`;
  if (fw === "vue")
    return `<PkAmountPills\n  v-model="amount"\n  :amounts="[1000, 2000, 5000, 10000, 20000, 50000]"\n/>`;
  return `<PkAmountPills\n  amounts={[1000, 2000, 5000, 10000, 20000, 50000]}\n  value={amount}\n  onChange={setAmount}\n/>`;
}
