// ════════════════════════════════════════════════════════════════════
// Input Feedback Message — the tinted message that sits under a field
// after validation. Only the message is the component; the field above it
// in Figma is context. Figma: ParkwayWallet 36855:14413 (error) ·
// 36855:14427 (success). Assets: /assets/wallet/x-circle.svg, check-circle.svg.
// ════════════════════════════════════════════════════════════════════

const FEEDBACK_CSS = `.pk-feedback { display: flex; align-items: center; gap: 6px; margin: 0; padding: 8px;
  border-radius: 10px; font: 600 12px/1.415 Manrope; }
.pk-feedback img { display: block; flex: none; }
.pk-feedback--error   { background: var(--pk-feedback-error-bg);   color: var(--pk-feedback-error-fg); }
.pk-feedback--success { background: var(--pk-feedback-success-bg); color: var(--pk-feedback-success-fg); }`;

export const reactFeedback = `// PkInputFeedback.jsx — Parkway Wallet
import "./parkway-input-feedback.css";

const ICON = { error: "/assets/wallet/x-circle.svg", success: "/assets/wallet/check-circle.svg" };

export default function PkInputFeedback({ variant = "error", id, children }) {
  return (
    <p
      id={id}
      className={\`pk-feedback pk-feedback--\${variant}\`}
      role={variant === "error" ? "alert" : "status"}
    >
      <img src={ICON[variant]} width="18" height="18" alt="" />
      {children}
    </p>
  );
}

/* Link it to the field so screen readers read it with the input:
   <input aria-describedby="invoice-msg" aria-invalid={variant === "error"} />
   <PkInputFeedback id="invoice-msg" variant="error">No invoice was found</PkInputFeedback> */

/* parkway-input-feedback.css
${FEEDBACK_CSS}
*/`;

export const vueFeedback = `<!-- PkInputFeedback.vue — Parkway Wallet -->
<script setup>
defineProps({ variant: { type: String, default: "error" } }); // "error" | "success"
const ICON = { error: "/assets/wallet/x-circle.svg", success: "/assets/wallet/check-circle.svg" };
</script>

<template>
  <p class="pk-feedback" :class="\`pk-feedback--\${variant}\`" :role="variant === 'error' ? 'alert' : 'status'">
    <img :src="ICON[variant]" width="18" height="18" alt="" />
    <slot />
  </p>
</template>

<style scoped>
${FEEDBACK_CSS}
</style>`;

export const flutterFeedback = `// pk_input_feedback.dart — Parkway Wallet
// Requires flutter_svg; add assets/wallet/x-circle.svg + check-circle.svg to pubspec.yaml.
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'parkway_tokens.dart';

enum PkFeedbackVariant { error, success }

class PkInputFeedback extends StatelessWidget {
  const PkInputFeedback(this.message, {super.key, this.variant = PkFeedbackVariant.error});
  final String message;
  final PkFeedbackVariant variant;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final isError = variant == PkFeedbackVariant.error;
    final bg = isError
      ? (dark ? PkSurfaceDark.feedbackErrorBg : PkSurfaceLight.feedbackErrorBg)
      : (dark ? PkSurfaceDark.feedbackSuccessBg : PkSurfaceLight.feedbackSuccessBg);
    final fg = isError
      ? (dark ? PkSurfaceDark.feedbackErrorFg : PkSurfaceLight.feedbackErrorFg)
      : (dark ? PkSurfaceDark.feedbackSuccessFg : PkSurfaceLight.feedbackSuccessFg);

    return Semantics(
      liveRegion: true,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
        child: Row(children: [
          SvgPicture.asset(isError ? 'assets/wallet/x-circle.svg' : 'assets/wallet/check-circle.svg',
            width: 18, height: 18),
          const SizedBox(width: 6),
          Expanded(child: Text(message, style: TextStyle(fontFamily: 'Manrope',
            fontWeight: FontWeight.w600, fontSize: 12, height: 1.415, color: fg))),
        ]),
      ),
    );
  }
}`;

export function usageFeedback(fw, variant, message) {
  const msg = message.replace(/'/g, "\\'");
  if (fw === "flutter")
    return `Column(crossAxisAlignment: CrossAxisAlignment.start, children: [\n  PkTextInput(label: 'Enter Invoice Number', hint: '1006985069'),\n  const SizedBox(height: 10),\n  const PkInputFeedback('${msg}', variant: PkFeedbackVariant.${variant}),\n])`;
  return `<PkTextInput label="Enter Invoice Number" aria-describedby="invoice-msg" />\n<PkInputFeedback id="invoice-msg" variant="${variant}">\n  ${message}\n</PkInputFeedback>`;
}
