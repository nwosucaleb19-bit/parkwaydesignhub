import { useEffect, useRef, useState } from "react";
import { FRAMEWORKS } from "../tokens.js";
import { useTheme } from "../theme.jsx";
import { Lead, SectionHeader, Tabs, CodeBlock, PreviewStage, ModeRow } from "../components/primitives.jsx";
import { CaretDown, CaretLeft, CaretRight } from "../iconography/index.js";
import { reactDatePicker, vueDatePicker, flutterDatePicker, usageDatePicker } from "../snippets/date-picker.js";

const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "14px 2px", borderBottom: "1px solid var(--pk-line-soft)" };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const pad = (n) => String(n).padStart(2, "0");
const fmtTime = (t) => `${t.h}:${pad(t.min)} ${t.pm ? "PM" : "AM"}`;
const longDate = (d) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function LiveCalendar({ withTime, disablePast, onChoose }) {
  const today = startOfDay(new Date());
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(null);
  const [focusDate, setFocusDate] = useState(today);
  const [monthView, setMonthView] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(null);
  const gridRef = useRef(null);
  const moved = useRef(false);

  const isDisabled = (d) => disablePast && d < today;
  const inView = (d) => !!d && d.getFullYear() === view.y && d.getMonth() === view.m;

  // After an arrow-key move, put focus on the new roving day.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    gridRef.current?.querySelector('[tabindex="0"]')?.focus();
  }, [focusDate, view]);

  const shiftMonth = (delta) => setView((v) => {
    const d = new Date(v.y, v.m + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const prev = () => (monthView ? setView((v) => ({ ...v, y: v.y - 1 })) : shiftMonth(-1));
  const next = () => (monthView ? setView((v) => ({ ...v, y: v.y + 1 })) : shiftMonth(1));

  const lead = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();
  const tabDay = inView(focusDate) ? focusDate.getDate()
    : inView(selected) ? selected.getDate()
    : inView(today) ? today.getDate() : 1;

  const onDayKey = (e, date) => {
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const n = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
    moved.current = true;
    setFocusDate(n);
    if (!inView(n)) setView({ y: n.getFullYear(), m: n.getMonth() });
  };

  const pick = (date) => {
    if (isDisabled(date)) return;
    setSelected(date);
    setFocusDate(date);
  };

  const toggleTime = () => {
    setTimeOpen((o) => !o);
    if (!time) setTime({ h: 12, min: 0, pm: true });
  };

  const ready = selected && (!withTime || time);
  const choose = () => {
    if (!ready) return;
    const out = new Date(selected);
    if (withTime) out.setHours((time.h % 12) + (time.pm ? 12 : 0), time.min);
    onChoose(out);
  };

  return (
    <div className="ph-cal">
      <div className="ph-cal__body">
        <div className="ph-cal__head">
          <button type="button" className="ph-cal__title" aria-expanded={monthView} onClick={() => setMonthView((v) => !v)}>
            {MONTHS[view.m]} {view.y}
            <CaretRight size={12} weight="bold" aria-hidden="true" />
          </button>
          <div className="ph-cal__nav">
            <button type="button" className="ph-cal__navbtn" onClick={prev} aria-label={monthView ? "Previous year" : "Previous month"}>
              <CaretLeft size={20} weight="bold" />
            </button>
            <button type="button" className="ph-cal__navbtn" onClick={next} aria-label={monthView ? "Next year" : "Next month"}>
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>

        {monthView ? (
          <div className="ph-cal__months">
            {MONTHS.map((name, i) => (
              <button
                key={name}
                type="button"
                className={`ph-cal__month${i === view.m ? " is-selected" : ""}`}
                aria-pressed={i === view.m}
                onClick={() => { setView((v) => ({ ...v, m: i })); setMonthView(false); }}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="ph-cal__week" aria-hidden="true">
              {WEEKDAYS.map((w) => <span key={w} className="ph-cal__wd">{w}</span>)}
            </div>
            <div className="ph-cal__grid" ref={gridRef} role="group" aria-label={`${MONTHS[view.m]} ${view.y}`}>
              {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} className="ph-cal__day--empty" aria-hidden="true" />)}
              {Array.from({ length: count }, (_, i) => {
                const d = i + 1;
                const date = new Date(view.y, view.m, d);
                const sel = sameDay(date, selected);
                const tod = sameDay(date, today);
                const dis = isDisabled(date);
                return (
                  <button
                    key={d}
                    type="button"
                    className={`ph-cal__day${sel ? " is-selected" : ""}${tod && !sel ? " is-today" : ""}`}
                    tabIndex={d === tabDay ? 0 : -1}
                    aria-label={longDate(date)}
                    aria-pressed={sel}
                    aria-current={tod ? "date" : undefined}
                    aria-disabled={dis || undefined}
                    onClick={() => pick(date)}
                    onKeyDown={(e) => onDayKey(e, date)}
                  >
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {withTime && (
          <>
            <button type="button" className="ph-cal__timerow" aria-expanded={timeOpen} onClick={toggleTime}>
              Select Time
              <span className="ph-cal__timerow-r">
                {time && <span className="ph-cal__timeval">{fmtTime(time)}</span>}
                <img src="/assets/wallet/caret-right.svg" width="24" height="24" alt="" />
              </span>
            </button>
            {timeOpen && time && (
              <div className="ph-cal__time" role="group" aria-label="Time">
                <span className="ph-cal__selwrap">
                  <select className="ph-cal__select" aria-label="Hour" value={time.h} onChange={(e) => setTime({ ...time, h: +e.target.value })}>
                    {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="ph-cal__selcaret" aria-hidden="true"><CaretDown size={14} weight="bold" /></span>
                </span>
                <span className="ph-cal__colon" aria-hidden="true">:</span>
                <span className="ph-cal__selwrap">
                  <select className="ph-cal__select" aria-label="Minute" value={time.min} onChange={(e) => setTime({ ...time, min: +e.target.value })}>
                    {MINUTES.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                  </select>
                  <span className="ph-cal__selcaret" aria-hidden="true"><CaretDown size={14} weight="bold" /></span>
                </span>
                <span className="ph-cal__ampm">
                  <button type="button" aria-pressed={!time.pm} onClick={() => setTime({ ...time, pm: false })}>AM</button>
                  <button type="button" aria-pressed={time.pm} onClick={() => setTime({ ...time, pm: true })}>PM</button>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <button type="button" className="ph-cal__cta" disabled={!ready} onClick={choose}>Choose</button>
    </div>
  );
}

const VARIANTS = [["date", "Date"], ["datetime", "Date & time"]];

const PROPS_ROWS = [
  ["value / v-model", "Date | null", "null", "Selected date. Shown with a pale-tangerine circle."],
  ["withTime", "boolean", "false", "Adds the “Select Time” row (hour, minute, AM/PM)."],
  ["minDate / maxDate", "Date", "—", "Dates outside the range are greyed and can't be picked."],
  ["onChoose", "(date) => void", "—", "Fires when Choose is pressed. Includes the time when withTime is on."],
];

export default function DatePicker({ fw, setFw }) {
  const app = useTheme();
  const [mode, setMode] = useState(app.theme);
  const [variant, setVariant] = useState("date");
  const [past, setPast] = useState("allowed");
  const [event, setEvent] = useState("");
  const withTime = variant === "datetime";
  const impl = { react: reactDatePicker, vue: vueDatePicker, flutter: flutterDatePicker };
  const labelMap = { react: "PkDatePicker.jsx + parkway-date-picker.css", vue: "PkDatePicker.vue", flutter: "pk_date_picker.dart" };

  const onChoose = (d) => {
    const opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
    if (withTime) Object.assign(opts, { hour: "numeric", minute: "2-digit", hour12: true });
    setEvent(`onChoose(${d.toLocaleString("en-GB", opts)})`);
  };

  return (
    <>
      <Lead>
        A month calendar with a full-width Choose button, in iOS style. Today's date is tangerine; the
        selected date gets a pale-tangerine circle. The Date & time variant adds a “Select Time” row.
        Tap the month title to jump to another month.
      </Lead>

      <SectionHeader label="Playground" desc="Pick a date, then Choose. With the keyboard, arrow keys move between days." />
      <div style={{ border: "1px solid var(--pk-line)", borderRadius: 12, padding: "2px 18px", marginTop: 6 }}>
        <ModeRow mode={mode} setMode={setMode} />
        <div style={ROW}>
          <span className="ph-rowlabel">Variant</span>
          <Tabs small value={variant} onChange={(v) => { setVariant(v); setEvent(""); }} label="Variant" items={VARIANTS} />
        </div>
        <div style={{ ...ROW, borderBottom: 0 }}>
          <span className="ph-rowlabel">Past dates</span>
          <Tabs small value={past} onChange={setPast} label="Past dates" items={[["allowed", "Allowed"], ["disabled", "Disabled"]]} />
        </div>
      </div>

      <PreviewStage mode={mode} tall stageStyle={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <LiveCalendar key={variant} withTime={withTime} disablePast={past === "disabled"} onChoose={onChoose} />
        <p className="ph-statedesc" aria-live="polite" style={{ margin: 0, minHeight: 18, fontFamily: "var(--pk-mono)" }}>
          {event ? `→ ${event}` : ""}
        </p>
      </PreviewStage>

      <Tabs value={fw} onChange={setFw} items={FRAMEWORKS} label="Framework" />
      <CodeBlock code={usageDatePicker(fw, withTime, past === "disabled")} label="Usage — reflects the controls above" />
      <CodeBlock code={impl[fw]} label={labelMap[fw]} />

      <SectionHeader label="Day states" />
      <div className="ph-statelist">
        {[
          ["Default", "var(--pk-cal-text)", false, "SF Pro Display Regular 17.3 — black in light mode, off-white in dark."],
          ["Today", "#F9956B", false, "Tangerine text, no fill."],
          ["Selected", "#F9956B", true, "38px Tangerine-05 circle, tangerine Medium 20.7."],
          ["Out of range", "var(--pk-cal-muted)", false, "Grey-03. Shown but can't be picked (minDate / maxDate)."],
        ].map(([name, color, filled, desc]) => (
          <div key={name} className="ph-stateline">
            <span className="ph-statedot" style={{ background: filled ? "#FEEAE1" : "transparent", border: `2px solid ${color}` }} />
            <span className="ph-statelabel">{name}</span>
            <span className="ph-statedesc">{desc}</span>
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
            <li>Show it in a bottom sheet on mobile — the Choose button closes the sheet.</li>
            <li>Set minDate for future-only flows like scheduled transfers.</li>
            <li>Use Date & time only when the time actually matters (e.g. scheduling).</li>
          </ul>
        </div>
        <div>
          <p className="ph-guidehead"><span className="ph-dot err" aria-hidden="true" />Don't</p>
          <ul className="ph-guidelist">
            <li>Don't hide out-of-range dates — grey them so the grid stays aligned.</li>
            <li>Don't use it for birthdays far in the past — a typed date field is faster.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
