// ════════════════════════════════════════════════════════════════════
// Keypad — PIN (4 boxes) and Passcode (6 dots + Face ID + forgot link).
// Figma: ParkwayWallet 36855:14442 (PIN) · 36853:14359 (Passcode).
// Assets ship from the hub at /assets/wallet/: backspace.svg, face-id.svg,
// dot-filled.svg, dot-empty.svg — copy them into your app.
// ════════════════════════════════════════════════════════════════════

const KEYPAD_CSS = `.pk-keypad { display: flex; flex-direction: column; align-items: center; gap: 16px; font-family: Manrope, sans-serif; }
.pk-keypad__head { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 32px 0; }
.pk-keypad__boxes { display: flex; gap: 13px; }
.pk-keypad__box { width: 44px; height: 44px; display: grid; place-items: center;
  border: 1px solid var(--pk-border); border-radius: 8px; font: 700 20px Manrope; color: var(--pk-text); }
.pk-keypad__box.is-active { border-color: var(--pk-tangerine-01); }
.pk-keypad__dots { display: flex; gap: 16px; }
.pk-keypad__dot { position: relative; width: 15px; height: 15px; }
.pk-keypad__dot img { position: absolute; display: block; max-width: none; }
.pk-keypad__dot img.is-empty { left: -1px; top: -1px; }   /* 17px ring centred on 15px slot */
.pk-keypad__forgot { background: none; border: 0; padding: 0; cursor: pointer;
  font: 500 12px Manrope; letter-spacing: -0.24px; color: var(--pk-label); text-decoration: underline; }
.pk-keypad__grid { display: grid; grid-template-columns: repeat(3, 68px); gap: 32px; }
.pk-keypad__key { width: 68px; height: 68px; border: 0; border-radius: 100px; cursor: pointer;
  display: grid; place-items: center; background: var(--pk-key-bg);
  font: 700 20px Manrope; color: var(--pk-text); }
.pk-keypad__key:active { transform: scale(.95); }
.pk-keypad__key--ghost { background: transparent; }
.pk-keypad__key--back { width: 59px; height: 59px; border-radius: 8px; background: transparent; place-self: center; }
/* backspace.svg used as a mask so the glyph follows --pk-text in dark mode */
.pk-keypad__backspace { width: 32px; height: 32px; background: var(--pk-text);
  -webkit-mask: url(/assets/wallet/backspace.svg) center / 32px no-repeat;
  mask: url(/assets/wallet/backspace.svg) center / 32px no-repeat; }
.pk-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }`;

export const reactKeypad = `// PkKeypad.jsx — Parkway Wallet
import { useEffect, useState } from "react";
import "./parkway-keypad.css";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function PkKeypad({
  variant = "pin",                       // "pin" | "passcode"
  length = variant === "pin" ? 4 : 6,
  onComplete,                            // (code: string) => void
  onForgot,                              // passcode only
  onBiometric,                           // passcode only — shows the Face ID key
}) {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === length) onComplete?.(code);
  }, [code, length]);

  const press = (d) => setCode((c) => (c.length < length ? c + d : c));
  const back = () => setCode((c) => c.slice(0, -1));
  const onKeyDown = (e) => {
    if (/^\\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
    else if (e.key === "Backspace") { e.preventDefault(); back(); }
  };

  return (
    <div className="pk-keypad" tabIndex={0} onKeyDown={onKeyDown}
      aria-label={variant === "pin" ? "PIN keypad" : "Passcode keypad"}>
      <div className="pk-keypad__head">
        {variant === "pin" ? (
          <div className="pk-keypad__boxes" aria-hidden="true">
            {Array.from({ length }, (_, i) => (
              <span key={i} className={\`pk-keypad__box\${i === code.length ? " is-active" : ""}\`}>
                {code[i] ? "•" : ""}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div className="pk-keypad__dots" aria-hidden="true">
              {Array.from({ length }, (_, i) => (
                <span key={i} className="pk-keypad__dot">
                  {i < code.length
                    ? <img src="/assets/wallet/dot-filled.svg" width="15" height="15" alt="" />
                    : <img className="is-empty" src="/assets/wallet/dot-empty.svg" width="17" height="17" alt="" />}
                </span>
              ))}
            </div>
            <button type="button" className="pk-keypad__forgot" onClick={onForgot}>Forgot Passcode?</button>
          </>
        )}
        <span className="pk-sr" aria-live="polite">{code.length} of {length} digits entered</span>
      </div>

      <div className="pk-keypad__grid">
        {DIGITS.map((d) => (
          <button key={d} type="button" className="pk-keypad__key" onClick={() => press(d)}>{d}</button>
        ))}
        {variant === "passcode" && onBiometric ? (
          <button type="button" className="pk-keypad__key pk-keypad__key--ghost" onClick={onBiometric} aria-label="Use Face ID">
            <img src="/assets/wallet/face-id.svg" width="32" height="32" alt="" />
          </button>
        ) : <span aria-hidden="true" />}
        <button type="button" className="pk-keypad__key" onClick={() => press("0")}>0</button>
        <button type="button" className="pk-keypad__key pk-keypad__key--back" onClick={back} aria-label="Delete last digit">
          <span className="pk-keypad__backspace" />
        </button>
      </div>
    </div>
  );
}

/* parkway-keypad.css
${KEYPAD_CSS}
*/`;

export const vueKeypad = `<!-- PkKeypad.vue — Parkway Wallet -->
<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  variant: { type: String, default: "pin" },   // "pin" | "passcode"
  length: Number,
  biometric: Boolean,                           // show the Face ID key (passcode)
});
const emit = defineEmits(["complete", "forgot", "biometric"]);

const size = computed(() => props.length ?? (props.variant === "pin" ? 4 : 6));
const code = ref("");
const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

watch(code, (c) => { if (c.length === size.value) emit("complete", c); });

const press = (d) => { if (code.value.length < size.value) code.value += d; };
const back = () => { code.value = code.value.slice(0, -1); };
function onKeyDown(e) {
  if (/^\\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
  else if (e.key === "Backspace") { e.preventDefault(); back(); }
}
defineExpose({ clear: () => (code.value = "") });
</script>

<template>
  <div class="pk-keypad" tabindex="0" @keydown="onKeyDown"
    :aria-label="variant === 'pin' ? 'PIN keypad' : 'Passcode keypad'">
    <div class="pk-keypad__head">
      <div v-if="variant === 'pin'" class="pk-keypad__boxes" aria-hidden="true">
        <span v-for="i in size" :key="i" class="pk-keypad__box"
          :class="{ 'is-active': i - 1 === code.length }">{{ code[i - 1] ? "•" : "" }}</span>
      </div>
      <template v-else>
        <div class="pk-keypad__dots" aria-hidden="true">
          <span v-for="i in size" :key="i" class="pk-keypad__dot">
            <img v-if="i <= code.length" src="/assets/wallet/dot-filled.svg" width="15" height="15" alt="" />
            <img v-else class="is-empty" src="/assets/wallet/dot-empty.svg" width="17" height="17" alt="" />
          </span>
        </div>
        <button type="button" class="pk-keypad__forgot" @click="emit('forgot')">Forgot Passcode?</button>
      </template>
      <span class="pk-sr" aria-live="polite">{{ code.length }} of {{ size }} digits entered</span>
    </div>

    <div class="pk-keypad__grid">
      <button v-for="d in digits" :key="d" type="button" class="pk-keypad__key" @click="press(d)">{{ d }}</button>
      <button v-if="variant === 'passcode' && biometric" type="button"
        class="pk-keypad__key pk-keypad__key--ghost" aria-label="Use Face ID" @click="emit('biometric')">
        <img src="/assets/wallet/face-id.svg" width="32" height="32" alt="" />
      </button>
      <span v-else aria-hidden="true" />
      <button type="button" class="pk-keypad__key" @click="press('0')">0</button>
      <button type="button" class="pk-keypad__key pk-keypad__key--back" aria-label="Delete last digit" @click="back">
        <span class="pk-keypad__backspace" />
      </button>
    </div>
  </div>
</template>

<style scoped>
${KEYPAD_CSS}
</style>`;

export const flutterKeypad = `// pk_keypad.dart — Parkway Wallet
// Requires flutter_svg. Add the four SVGs under assets/wallet/ in pubspec.yaml.
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'parkway_tokens.dart';

enum PkKeypadVariant { pin, passcode }

class PkKeypad extends StatefulWidget {
  const PkKeypad({super.key, this.variant = PkKeypadVariant.pin, this.length,
    this.onComplete, this.onForgot, this.onBiometric});

  final PkKeypadVariant variant;
  final int? length;
  final ValueChanged<String>? onComplete;
  final VoidCallback? onForgot;
  final VoidCallback? onBiometric; // passcode: shows the Face ID key

  @override
  State<PkKeypad> createState() => PkKeypadState();
}

class PkKeypadState extends State<PkKeypad> {
  String _code = '';
  int get _len => widget.length ?? (widget.variant == PkKeypadVariant.pin ? 4 : 6);

  void clear() => setState(() => _code = '');

  void _press(String d) {
    if (_code.length >= _len) return;
    HapticFeedback.lightImpact();
    setState(() => _code += d);
    if (_code.length == _len) widget.onComplete?.call(_code);
  }

  void _back() {
    if (_code.isEmpty) return;
    setState(() => _code = _code.substring(0, _code.length - 1));
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final text = dark ? PkSurfaceDark.text : PkSurfaceLight.text;
    final keyBg = dark ? PkSurfaceDark.keyBg : PkSurfaceLight.keyBg;
    final border = dark ? PkSurfaceDark.border : PkSurfaceLight.border;
    final label = dark ? PkSurfaceDark.label : PkSurfaceLight.label;

    Widget key(String d) => _Key(bg: keyBg, onTap: () => _press(d),
      semantics: d, child: Text(d, style: TextStyle(fontFamily: 'Manrope',
        fontWeight: FontWeight.w700, fontSize: 20, color: text)));

    final head = widget.variant == PkKeypadVariant.pin
      ? Row(mainAxisSize: MainAxisSize.min, children: [
          for (var i = 0; i < _len; i++) Container(
            width: 44, height: 44, margin: EdgeInsets.only(left: i == 0 ? 0 : 13),
            alignment: Alignment.center,
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(8),
              border: Border.all(color: i == _code.length ? PkColors.tangerine01 : border)),
            child: Text(i < _code.length ? '•' : '', style: TextStyle(fontFamily: 'Manrope',
              fontWeight: FontWeight.w700, fontSize: 20, color: text)),
          ),
        ])
      : Column(mainAxisSize: MainAxisSize.min, children: [
          Row(mainAxisSize: MainAxisSize.min, children: [
            for (var i = 0; i < _len; i++) Padding(
              padding: EdgeInsets.only(left: i == 0 ? 0 : 16),
              child: SizedBox(width: 15, height: 15, child: OverflowBox(maxWidth: 17, maxHeight: 17,
                child: SvgPicture.asset(i < _code.length
                  ? 'assets/wallet/dot-filled.svg' : 'assets/wallet/dot-empty.svg'))),
            ),
          ]),
          const SizedBox(height: 24),
          GestureDetector(onTap: widget.onForgot, child: Text('Forgot Passcode?',
            style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w500, fontSize: 12,
              letterSpacing: -0.24, color: label, decoration: TextDecoration.underline))),
        ]);

    return Semantics(
      label: '\${_code.length} of \$_len digits entered', liveRegion: true,
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Padding(padding: const EdgeInsets.symmetric(vertical: 32), child: head),
        const SizedBox(height: 16),
        for (final row in [['1','2','3'], ['4','5','6'], ['7','8','9']]) Padding(
          padding: const EdgeInsets.only(bottom: 32),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            key(row[0]), const SizedBox(width: 32), key(row[1]), const SizedBox(width: 32), key(row[2]),
          ]),
        ),
        Row(mainAxisSize: MainAxisSize.min, children: [
          widget.variant == PkKeypadVariant.passcode && widget.onBiometric != null
            ? _Key(bg: Colors.transparent, onTap: widget.onBiometric!, semantics: 'Use Face ID',
                child: SvgPicture.asset('assets/wallet/face-id.svg', width: 32, height: 32))
            : const SizedBox(width: 68, height: 68),
          const SizedBox(width: 32),
          key('0'),
          const SizedBox(width: 32),
          SizedBox(width: 68, height: 68, child: Center(child: Semantics(
            button: true, label: 'Delete last digit',
            child: InkWell(onTap: _back, borderRadius: BorderRadius.circular(8),
              child: SizedBox(width: 59, height: 59, child: Center(child: SvgPicture.asset(
                'assets/wallet/backspace.svg', width: 32, height: 32,
                colorFilter: ColorFilter.mode(text, BlendMode.srcIn)))))))),
        ]),
      ]),
    );
  }
}

class _Key extends StatelessWidget {
  const _Key({required this.bg, required this.onTap, required this.child, required this.semantics});
  final Color bg;
  final VoidCallback onTap;
  final Widget child;
  final String semantics;

  @override
  Widget build(BuildContext context) => Semantics(button: true, label: semantics,
    child: Material(color: bg, shape: const CircleBorder(),
      child: InkWell(customBorder: const CircleBorder(), onTap: onTap,
        child: SizedBox(width: 68, height: 68, child: Center(child: ExcludeSemantics(child: child))))));
}`;

export function usageKeypad(fw, variant) {
  const pass = variant === "passcode";
  if (fw === "flutter")
    return pass
      ? `PkKeypad(\n  variant: PkKeypadVariant.passcode,\n  onComplete: (code) => unlock(code),\n  onForgot: () => context.push('/reset-passcode'),\n  onBiometric: authenticateWithFaceId,\n)`
      : `PkKeypad(\n  variant: PkKeypadVariant.pin,\n  onComplete: (pin) => confirmTransfer(pin),\n)`;
  if (fw === "vue")
    return pass
      ? `<PkKeypad\n  variant="passcode"\n  biometric\n  @complete="unlock"\n  @forgot="router.push('/reset-passcode')"\n  @biometric="authenticateWithFaceId"\n/>`
      : `<PkKeypad variant="pin" @complete="confirmTransfer" />`;
  return pass
    ? `<PkKeypad\n  variant="passcode"\n  onComplete={(code) => unlock(code)}\n  onForgot={() => navigate("/reset-passcode")}\n  onBiometric={authenticateWithFaceId}\n/>`
    : `<PkKeypad\n  variant="pin"\n  onComplete={(pin) => confirmTransfer(pin)}\n/>`;
}
