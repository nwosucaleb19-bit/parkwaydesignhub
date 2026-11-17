// ════════════════════════════════════════════════════════════════════
// Date Picker (+ Date & Time) — iOS-style month grid with a Choose button.
// Figma: ParkwayWallet 36855:14602 (date) · 36855:14712 (date & time).
// Asset: /assets/wallet/caret-right.svg (Select Time row).
// ════════════════════════════════════════════════════════════════════

const CAL_CSS = `.pk-cal { width: 324px; max-width: 100%; padding: 12px 16px; background: var(--pk-surface);
  display: flex; flex-direction: column; gap: 32px; }
.pk-cal__body { display: flex; flex-direction: column; gap: 7px; }
.pk-cal__head { display: flex; align-items: center; justify-content: space-between; padding: 5px 0; }
.pk-cal__title { display: inline-flex; align-items: center; gap: 4px; background: none; border: 0; padding: 0;
  cursor: pointer; font: 600 14.7px/20.75px Inter, sans-serif; letter-spacing: -0.37px; color: var(--pk-text); }
.pk-cal__title svg { color: var(--pk-tangerine-01); transition: transform .2s ease; }
.pk-cal__title[aria-expanded="true"] svg { transform: rotate(90deg); }
.pk-cal__nav { display: flex; gap: 8px; }
.pk-cal__navbtn { display: flex; background: none; border: 0; padding: 0; cursor: pointer; color: var(--pk-tangerine-01); }
.pk-cal__week, .pk-cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); column-gap: 3.46px; margin: 0 -10px; }
.pk-cal__grid { row-gap: 4.32px; }
.pk-cal__wd { text-align: center; text-transform: uppercase; font: 600 11.24px/15.56px Inter, sans-serif;
  color: var(--pk-calendar-weekday); }
.pk-cal__day { position: relative; height: 44px; display: grid; place-items: center; border: 0; padding: 0;
  background: none; cursor: pointer; font: 400 17.29px/20.75px -apple-system, "SF Pro Display", Inter, sans-serif;
  color: var(--pk-text); }
.pk-cal__day::before { content: ""; position: absolute; left: 50%; top: 50%; width: 38px; height: 38px;
  border-radius: 50%; transform: translate(-50%, -50%); }
.pk-cal__day > span { position: relative; }
.pk-cal__day.is-today { color: var(--pk-tangerine-01); }
.pk-cal__day.is-selected { color: var(--pk-tangerine-01); font-size: 20.75px; font-weight: 500; line-height: 25px; }
.pk-cal__day.is-selected::before { background: var(--pk-calendar-selected-bg); }
.pk-cal__day[aria-disabled="true"] { color: var(--pk-calendar-muted); cursor: default; }
.pk-cal__months { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px 0; }
.pk-cal__month { height: 44px; border: 0; border-radius: 22px; background: none; cursor: pointer;
  font: 400 17.29px -apple-system, "SF Pro Display", Inter, sans-serif; color: var(--pk-text); }
.pk-cal__month[aria-pressed="true"] { background: var(--pk-calendar-selected-bg); color: var(--pk-tangerine-01); }
.pk-cal__timerow { display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 14px 0 0; background: none; border: 0; cursor: pointer;
  font: 600 17.29px/20.75px Manrope; letter-spacing: 0.33px; color: var(--pk-text); }
.pk-cal__timeval { margin-right: 6px; font: 600 15px Manrope; color: var(--pk-tangerine-01); }
.pk-cal__timerow img { vertical-align: middle; transition: transform .2s ease; }
.pk-cal__timerow[aria-expanded="true"] img { transform: rotate(90deg); }
.pk-cal__time { display: flex; align-items: center; gap: 8px; padding-top: 12px; }
.pk-cal__selwrap { position: relative; display: inline-flex; }
.pk-cal__time select { -webkit-appearance: none; appearance: none; height: 40px; padding: 0 34px 0 14px;
  border: 1px solid var(--pk-border); border-radius: 8px; background: transparent; cursor: pointer;
  font: 600 15px Manrope; color: var(--pk-text); }
/* our own caret, inset 12px — the native arrow sits flush to the edge */
.pk-cal__selcaret { position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  display: flex; color: var(--pk-text-muted); pointer-events: none; }
.pk-cal__ampm { display: inline-flex; margin-left: auto; border: 1px solid var(--pk-border); border-radius: 8px; overflow: hidden; }
.pk-cal__ampm button { height: 38px; padding: 0 12px; border: 0; background: transparent; cursor: pointer;
  font: 600 13px Manrope; color: var(--pk-text); }
.pk-cal__ampm button[aria-pressed="true"] { background: var(--pk-calendar-selected-bg); color: var(--pk-tangerine-01); }
.pk-cal__cta { width: 100%; padding: 8px 16px; border: 0; border-radius: 8px; cursor: pointer;
  background: var(--pk-tangerine-01); color: var(--pk-white-01); font: 600 14px/1.8 Manrope; }
.pk-cal__cta:hover:not(:disabled) { background: var(--pk-tangerine-03); }
.pk-cal__cta:disabled { background: var(--pk-tangerine-04); cursor: not-allowed; }`;

export const reactDatePicker = `// PkDatePicker.jsx — Parkway Wallet
import { useEffect, useRef, useState } from "react";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import "./parkway-date-picker.css";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();
const pad = (n) => String(n).padStart(2, "0");

export default function PkDatePicker({ value = null, withTime = false, minDate, maxDate, onChoose }) {
  const today = startOfDay(new Date());
  const start = value || today;
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [selected, setSelected] = useState(value);
  const [focusDate, setFocusDate] = useState(start);
  const [monthView, setMonthView] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(value && withTime
    ? { h: value.getHours() % 12 || 12, min: value.getMinutes(), pm: value.getHours() >= 12 } : null);
  const gridRef = useRef(null);
  const moved = useRef(false);

  const isDisabled = (d) => (minDate && d < startOfDay(minDate)) || (maxDate && d > startOfDay(maxDate));
  const inView = (d) => !!d && d.getFullYear() === view.y && d.getMonth() === view.m;

  useEffect(() => {   // roving focus after arrow-key moves
    if (!moved.current) return;
    moved.current = false;
    gridRef.current?.querySelector('[tabindex="0"]')?.focus();
  }, [focusDate, view]);

  const shift = (dm) => setView((v) => {
    const d = new Date(v.y, v.m + dm, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const prev = () => (monthView ? setView((v) => ({ ...v, y: v.y - 1 })) : shift(-1));
  const next = () => (monthView ? setView((v) => ({ ...v, y: v.y + 1 })) : shift(1));

  const lead = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();
  const tabDay = inView(focusDate) ? focusDate.getDate()
    : inView(selected) ? selected.getDate() : inView(today) ? today.getDate() : 1;

  const onDayKey = (e, date) => {
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const n = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
    moved.current = true;
    setFocusDate(n);
    if (!inView(n)) setView({ y: n.getFullYear(), m: n.getMonth() });
  };

  const ready = selected && (!withTime || time);
  const choose = () => {
    const out = new Date(selected);
    if (withTime) out.setHours((time.h % 12) + (time.pm ? 12 : 0), time.min);
    onChoose?.(out);
  };

  return (
    <div className="pk-cal">
      <div className="pk-cal__body">
        <div className="pk-cal__head">
          <button type="button" className="pk-cal__title" aria-expanded={monthView}
            onClick={() => setMonthView((v) => !v)}>
            {MONTHS[view.m]} {view.y} <CaretRight size={12} weight="bold" aria-hidden="true" />
          </button>
          <div className="pk-cal__nav">
            <button type="button" className="pk-cal__navbtn" onClick={prev}
              aria-label={monthView ? "Previous year" : "Previous month"}><CaretLeft size={20} weight="bold" /></button>
            <button type="button" className="pk-cal__navbtn" onClick={next}
              aria-label={monthView ? "Next year" : "Next month"}><CaretRight size={20} weight="bold" /></button>
          </div>
        </div>

        {monthView ? (
          <div className="pk-cal__months">
            {MONTHS.map((name, i) => (
              <button key={name} type="button" className="pk-cal__month" aria-pressed={i === view.m}
                onClick={() => { setView((v) => ({ ...v, m: i })); setMonthView(false); }}>
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="pk-cal__week" aria-hidden="true">
              {WEEKDAYS.map((w) => <span key={w} className="pk-cal__wd">{w}</span>)}
            </div>
            <div className="pk-cal__grid" ref={gridRef} role="group" aria-label={\`\${MONTHS[view.m]} \${view.y}\`}>
              {Array.from({ length: lead }, (_, i) => <span key={"b" + i} aria-hidden="true" />)}
              {Array.from({ length: count }, (_, i) => {
                const date = new Date(view.y, view.m, i + 1);
                const sel = sameDay(date, selected);
                const tod = sameDay(date, today);
                const dis = isDisabled(date);
                return (
                  <button key={i} type="button"
                    className={\`pk-cal__day\${sel ? " is-selected" : ""}\${tod && !sel ? " is-today" : ""}\`}
                    tabIndex={i + 1 === tabDay ? 0 : -1}
                    aria-label={date.toLocaleDateString("en-GB", { dateStyle: "full" })}
                    aria-pressed={sel} aria-current={tod ? "date" : undefined} aria-disabled={dis || undefined}
                    onClick={() => { if (!dis) { setSelected(date); setFocusDate(date); } }}
                    onKeyDown={(e) => onDayKey(e, date)}>
                    <span>{i + 1}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {withTime && (
          <>
            <button type="button" className="pk-cal__timerow" aria-expanded={timeOpen}
              onClick={() => { setTimeOpen((o) => !o); if (!time) setTime({ h: 12, min: 0, pm: true }); }}>
              Select Time
              <span>
                {time && <span className="pk-cal__timeval">{time.h}:{pad(time.min)} {time.pm ? "PM" : "AM"}</span>}
                <img src="/assets/wallet/caret-right.svg" width="24" height="24" alt="" />
              </span>
            </button>
            {timeOpen && time && (
              <div className="pk-cal__time" role="group" aria-label="Time">
                <span className="pk-cal__selwrap">
                  <select aria-label="Hour" value={time.h} onChange={(e) => setTime({ ...time, h: +e.target.value })}>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="pk-cal__selcaret" aria-hidden="true"><CaretDown size={14} weight="bold" /></span>
                </span>
                <span aria-hidden="true">:</span>
                <span className="pk-cal__selwrap">
                  <select aria-label="Minute" value={time.min} onChange={(e) => setTime({ ...time, min: +e.target.value })}>
                    {MINUTES.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                  </select>
                  <span className="pk-cal__selcaret" aria-hidden="true"><CaretDown size={14} weight="bold" /></span>
                </span>
                <span className="pk-cal__ampm">
                  <button type="button" aria-pressed={!time.pm} onClick={() => setTime({ ...time, pm: false })}>AM</button>
                  <button type="button" aria-pressed={time.pm} onClick={() => setTime({ ...time, pm: true })}>PM</button>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <button type="button" className="pk-cal__cta" disabled={!ready} onClick={choose}>Choose</button>
    </div>
  );
}

/* parkway-date-picker.css
${CAL_CSS}
*/`;

export const vueDatePicker = `<!-- PkDatePicker.vue — Parkway Wallet -->
<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { PhCaretDown, PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

const props = defineProps({
  withTime: Boolean,
  minDate: Date,
  maxDate: Date,
});
const model = defineModel({ type: Date, default: null });   // the chosen date
const emit = defineEmits(["choose"]);

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();
const pad = (n) => String(n).padStart(2, "0");

const today = startOfDay(new Date());
const start = model.value || today;
const view = ref({ y: start.getFullYear(), m: start.getMonth() });
const selected = ref(model.value);
const focusDate = ref(start);
const monthView = ref(false);
const timeOpen = ref(false);
const time = ref(null);
const grid = ref(null);
let moved = false;

const inView = (d) => !!d && d.getFullYear() === view.value.y && d.getMonth() === view.value.m;
const isDisabled = (d) => (props.minDate && d < startOfDay(props.minDate))
  || (props.maxDate && d > startOfDay(props.maxDate));

const days = computed(() => {
  const count = new Date(view.value.y, view.value.m + 1, 0).getDate();
  return Array.from({ length: count }, (_, i) => new Date(view.value.y, view.value.m, i + 1));
});
const lead = computed(() => new Date(view.value.y, view.value.m, 1).getDay());
const tabDay = computed(() => inView(focusDate.value) ? focusDate.value.getDate()
  : inView(selected.value) ? selected.value.getDate() : inView(today) ? today.getDate() : 1);
const ready = computed(() => selected.value && (!props.withTime || time.value));

watch([focusDate, view], async () => {
  if (!moved) return;
  moved = false;
  await nextTick();
  grid.value?.querySelector('[tabindex="0"]')?.focus();
});

function shift(dm) {
  const d = new Date(view.value.y, view.value.m + dm, 1);
  view.value = { y: d.getFullYear(), m: d.getMonth() };
}
const prev = () => (monthView.value ? view.value.y-- : shift(-1));
const next = () => (monthView.value ? view.value.y++ : shift(1));

function onDayKey(e, date) {
  const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
  if (!delta) return;
  e.preventDefault();
  const n = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
  moved = true;
  focusDate.value = n;
  if (!inView(n)) view.value = { y: n.getFullYear(), m: n.getMonth() };
}
function pick(date) {
  if (isDisabled(date)) return;
  selected.value = date;
  focusDate.value = date;
}
function toggleTime() {
  timeOpen.value = !timeOpen.value;
  if (!time.value) time.value = { h: 12, min: 0, pm: true };
}
function choose() {
  const out = new Date(selected.value);
  if (props.withTime) out.setHours((time.value.h % 12) + (time.value.pm ? 12 : 0), time.value.min);
  model.value = out;
  emit("choose", out);
}
</script>

<template>
  <div class="pk-cal">
    <div class="pk-cal__body">
      <div class="pk-cal__head">
        <button type="button" class="pk-cal__title" :aria-expanded="monthView" @click="monthView = !monthView">
          {{ MONTHS[view.m] }} {{ view.y }} <PhCaretRight :size="12" weight="bold" aria-hidden="true" />
        </button>
        <div class="pk-cal__nav">
          <button type="button" class="pk-cal__navbtn" :aria-label="monthView ? 'Previous year' : 'Previous month'" @click="prev">
            <PhCaretLeft :size="20" weight="bold" />
          </button>
          <button type="button" class="pk-cal__navbtn" :aria-label="monthView ? 'Next year' : 'Next month'" @click="next">
            <PhCaretRight :size="20" weight="bold" />
          </button>
        </div>
      </div>

      <div v-if="monthView" class="pk-cal__months">
        <button v-for="(name, i) in MONTHS" :key="name" type="button" class="pk-cal__month"
          :aria-pressed="i === view.m" @click="view.m = i; monthView = false">{{ name.slice(0, 3) }}</button>
      </div>
      <template v-else>
        <div class="pk-cal__week" aria-hidden="true">
          <span v-for="w in WEEKDAYS" :key="w" class="pk-cal__wd">{{ w }}</span>
        </div>
        <div ref="grid" class="pk-cal__grid" role="group" :aria-label="\`\${MONTHS[view.m]} \${view.y}\`">
          <span v-for="i in lead" :key="'b' + i" aria-hidden="true" />
          <button v-for="date in days" :key="date.getDate()" type="button" class="pk-cal__day"
            :class="{ 'is-selected': sameDay(date, selected), 'is-today': sameDay(date, today) && !sameDay(date, selected) }"
            :tabindex="date.getDate() === tabDay ? 0 : -1"
            :aria-label="date.toLocaleDateString('en-GB', { dateStyle: 'full' })"
            :aria-pressed="sameDay(date, selected)"
            :aria-current="sameDay(date, today) ? 'date' : undefined"
            :aria-disabled="isDisabled(date) || undefined"
            @click="pick(date)" @keydown="onDayKey($event, date)">
            <span>{{ date.getDate() }}</span>
          </button>
        </div>
      </template>

      <template v-if="withTime">
        <button type="button" class="pk-cal__timerow" :aria-expanded="timeOpen" @click="toggleTime">
          Select Time
          <span>
            <span v-if="time" class="pk-cal__timeval">{{ time.h }}:{{ pad(time.min) }} {{ time.pm ? "PM" : "AM" }}</span>
            <img src="/assets/wallet/caret-right.svg" width="24" height="24" alt="" />
          </span>
        </button>
        <div v-if="timeOpen && time" class="pk-cal__time" role="group" aria-label="Time">
          <span class="pk-cal__selwrap">
            <select v-model.number="time.h" aria-label="Hour">
              <option v-for="h in HOURS" :key="h" :value="h">{{ h }}</option>
            </select>
            <span class="pk-cal__selcaret" aria-hidden="true"><PhCaretDown :size="14" weight="bold" /></span>
          </span>
          <span aria-hidden="true">:</span>
          <span class="pk-cal__selwrap">
            <select v-model.number="time.min" aria-label="Minute">
              <option v-for="m in MINUTES" :key="m" :value="m">{{ pad(m) }}</option>
            </select>
            <span class="pk-cal__selcaret" aria-hidden="true"><PhCaretDown :size="14" weight="bold" /></span>
          </span>
          <span class="pk-cal__ampm">
            <button type="button" :aria-pressed="!time.pm" @click="time.pm = false">AM</button>
            <button type="button" :aria-pressed="time.pm" @click="time.pm = true">PM</button>
          </span>
        </div>
      </template>
    </div>

    <button type="button" class="pk-cal__cta" :disabled="!ready" @click="choose">Choose</button>
  </div>
</template>

<style scoped>
${CAL_CSS}
</style>`;

export const flutterDatePicker = `// pk_date_picker.dart — Parkway Wallet
// Requires flutter_svg + phosphor_flutter; add assets/wallet/caret-right.svg to pubspec.yaml.
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'parkway_tokens.dart';

const _months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const _weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

class PkDatePicker extends StatefulWidget {
  const PkDatePicker({super.key, this.initialDate, this.withTime = false,
    this.minDate, this.maxDate, required this.onChoose});

  final DateTime? initialDate;
  final bool withTime;
  final DateTime? minDate, maxDate;
  final ValueChanged<DateTime> onChoose;

  @override
  State<PkDatePicker> createState() => _PkDatePickerState();
}

class _PkDatePickerState extends State<PkDatePicker> {
  final _today = DateUtils.dateOnly(DateTime.now());
  late DateTime _view = DateTime((widget.initialDate ?? _today).year, (widget.initialDate ?? _today).month);
  late DateTime? _selected = widget.initialDate == null ? null : DateUtils.dateOnly(widget.initialDate!);
  TimeOfDay? _time;
  bool _monthView = false, _timeOpen = false;

  bool _disabled(DateTime d) =>
    (widget.minDate != null && d.isBefore(DateUtils.dateOnly(widget.minDate!))) ||
    (widget.maxDate != null && d.isAfter(DateUtils.dateOnly(widget.maxDate!)));

  void _shift(int delta) => setState(() => _view = _monthView
    ? DateTime(_view.year + delta, _view.month)
    : DateTime(_view.year, _view.month + delta));

  bool get _ready => _selected != null && (!widget.withTime || _time != null);

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final text = dark ? PkSurfaceDark.text : PkSurfaceLight.text;
    final selBg = dark ? PkSurfaceDark.calendarSelected : PkSurfaceLight.calendarSelected;
    const sf = '.SF Pro Display'; // iOS system face; falls back to the platform default elsewhere

    final header = Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(children: [
        InkWell(
          onTap: () => setState(() => _monthView = !_monthView),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Text('\${_months[_view.month - 1]} \${_view.year}', style: TextStyle(fontFamily: 'Inter',
              fontWeight: FontWeight.w600, fontSize: 14.7, letterSpacing: -0.37, color: text)),
            const SizedBox(width: 4),
            AnimatedRotation(turns: _monthView ? .25 : 0, duration: const Duration(milliseconds: 200),
              child: const PhosphorIcon(PhosphorIconsBold.caretRight, size: 12, color: PkColors.tangerine01)),
          ]),
        ),
        const Spacer(),
        IconButton(onPressed: () => _shift(-1), tooltip: _monthView ? 'Previous year' : 'Previous month',
          icon: const PhosphorIcon(PhosphorIconsBold.caretLeft, size: 20, color: PkColors.tangerine01)),
        IconButton(onPressed: () => _shift(1), tooltip: _monthView ? 'Next year' : 'Next month',
          icon: const PhosphorIcon(PhosphorIconsBold.caretRight, size: 20, color: PkColors.tangerine01)),
      ]),
    );

    Widget day(DateTime d) {
      final sel = DateUtils.isSameDay(d, _selected);
      final tod = DateUtils.isSameDay(d, _today);
      final dis = _disabled(d);
      return Semantics(
        button: true, selected: sel, enabled: !dis,
        label: MaterialLocalizations.of(context).formatFullDate(d),
        child: InkResponse(
          onTap: dis ? null : () => setState(() => _selected = d),
          radius: 19,
          child: Center(child: Container(
            width: 38, height: 38, alignment: Alignment.center,
            decoration: BoxDecoration(color: sel ? selBg : null, shape: BoxShape.circle),
            child: ExcludeSemantics(child: Text('\${d.day}', style: TextStyle(
              fontFamily: sf,
              fontSize: sel ? 20.75 : 17.29,
              fontWeight: sel ? FontWeight.w500 : FontWeight.w400,
              color: dis
                ? (dark ? PkSurfaceDark.calendarMuted : PkSurfaceLight.calendarMuted)
                : (sel || tod) ? PkColors.tangerine01 : text,
            ))),
          )),
        ),
      );
    }

    final lead = DateTime(_view.year, _view.month, 1).weekday % 7;
    final count = DateUtils.getDaysInMonth(_view.year, _view.month);

    final grid = _monthView
      ? GridView.count(crossAxisCount: 3, shrinkWrap: true, childAspectRatio: 2.2,
          physics: const NeverScrollableScrollPhysics(), children: [
          for (var m = 1; m <= 12; m++) InkWell(
            borderRadius: BorderRadius.circular(22),
            onTap: () => setState(() { _view = DateTime(_view.year, m); _monthView = false; }),
            child: Container(alignment: Alignment.center,
              decoration: BoxDecoration(color: m == _view.month ? selBg : null,
                borderRadius: BorderRadius.circular(22)),
              child: Text(_months[m - 1].substring(0, 3), style: TextStyle(fontFamily: sf, fontSize: 17.29,
                color: m == _view.month ? PkColors.tangerine01 : text))),
          ),
        ])
      : Column(children: [
          Row(children: [for (final w in _weekdays) Expanded(child: Center(child: Text(w,
            style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, fontSize: 11.24,
              color: dark ? PkSurfaceDark.calendarWeekday : PkSurfaceLight.calendarWeekday))))]),
          const SizedBox(height: 7),
          GridView.count(crossAxisCount: 7, shrinkWrap: true, mainAxisSpacing: 4.32,
            crossAxisSpacing: 3.46, childAspectRatio: 0.98,
            physics: const NeverScrollableScrollPhysics(), children: [
            for (var i = 0; i < lead; i++) const SizedBox.shrink(),
            for (var d = 1; d <= count; d++) day(DateTime(_view.year, _view.month, d)),
          ]),
        ]);

    final timeRow = !widget.withTime ? const SizedBox.shrink() : Column(children: [
      InkWell(
        onTap: () => setState(() { _timeOpen = !_timeOpen; _time ??= const TimeOfDay(hour: 12, minute: 0); }),
        child: Padding(padding: const EdgeInsets.only(top: 14), child: Row(children: [
          Text('Select Time', style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w600,
            fontSize: 17.29, letterSpacing: 0.33, color: text)),
          const Spacer(),
          if (_time != null) Text(_time!.format(context), style: const TextStyle(fontFamily: 'Manrope',
            fontWeight: FontWeight.w600, fontSize: 15, color: PkColors.tangerine01)),
          const SizedBox(width: 6),
          AnimatedRotation(turns: _timeOpen ? .25 : 0, duration: const Duration(milliseconds: 200),
            child: SvgPicture.asset('assets/wallet/caret-right.svg', width: 24, height: 24)),
        ])),
      ),
      if (_timeOpen) SizedBox(height: 160, child: _PkTimeWheel(
        initial: _time!, onChanged: (t) => setState(() => _time = t))),
    ]);

    return Container(
      width: 324,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: dark ? PkSurfaceDark.surface : PkSurfaceLight.surface,
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        header, const SizedBox(height: 7), grid, timeRow,
        const SizedBox(height: 32),
        SizedBox(width: double.infinity, child: FilledButton(
          onPressed: _ready ? () {
            final d = _selected!;
            widget.onChoose(widget.withTime
              ? DateTime(d.year, d.month, d.day, _time!.hour, _time!.minute) : d);
          } : null,
          style: FilledButton.styleFrom(
            backgroundColor: PkColors.tangerine01,
            disabledBackgroundColor: PkColors.tangerine04,
            foregroundColor: PkColors.white01,
            disabledForegroundColor: PkColors.white01,
            padding: const EdgeInsets.symmetric(vertical: 8),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            textStyle: const TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.w600, fontSize: 14, height: 1.8),
          ),
          child: const Text('Choose'),
        )),
      ]),
    );
  }
}

/// Inline hour/minute wheel for the Select Time row (iOS-style).
class _PkTimeWheel extends StatelessWidget {
  const _PkTimeWheel({required this.initial, required this.onChanged});
  final TimeOfDay initial;
  final ValueChanged<TimeOfDay> onChanged;

  @override
  Widget build(BuildContext context) => CupertinoDatePicker(
    mode: CupertinoDatePickerMode.time,
    minuteInterval: 1,
    initialDateTime: DateTime(2000, 1, 1, initial.hour, initial.minute),
    onDateTimeChanged: (d) => onChanged(TimeOfDay(hour: d.hour, minute: d.minute)),
  );
}`;

export function usageDatePicker(fw, withTime, disablePast) {
  if (fw === "flutter")
    return `showModalBottomSheet(\n  context: context,\n  builder: (_) => PkDatePicker(${withTime ? "\n    withTime: true," : ""}${disablePast ? "\n    minDate: DateTime.now()," : ""}\n    onChoose: (date) {\n      setState(() => picked = date);\n      Navigator.pop(context);\n    },\n  ),\n)`;
  if (fw === "vue")
    return `<PkDatePicker\n  v-model="picked"${withTime ? "\n  with-time" : ""}${disablePast ? "\n  :min-date=\"new Date()\"" : ""}\n  @choose="sheetOpen = false"\n/>`;
  return `<PkDatePicker${withTime ? "\n  withTime" : ""}${disablePast ? "\n  minDate={new Date()}" : ""}\n  onChoose={(date) => {\n    setPicked(date);\n    setSheetOpen(false);\n  }}\n/>`;
}
