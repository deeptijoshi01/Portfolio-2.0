import { useState, useEffect, useRef } from "react";

// Work periods (month-wise — gaps between them are excluded from the count)
const WORK_PERIODS = [
  { start: new Date("2025-02-01T00:00:00"), end: new Date("2025-09-01T00:00:00") }, // Feb 2025 - Aug 2025
  { start: new Date("2025-09-01T00:00:00"), end: new Date("2026-01-01T00:00:00") }, // Sep 2025 - Dec 2025
  { start: new Date("2026-05-01T00:00:00"), end: null }, // May 2026 - Present
];

function totalWorkedMs(now) {
  let total = 0;
  for (const period of WORK_PERIODS) {
    const end = period.end ?? now;
    if (now >= period.start) {
      total += Math.min(end, now) - period.start;
    }
  }
  return total;
}

function calcExperience() {
  const now = new Date();
  const workedMs = totalWorkedMs(now);
  // Map the total worked duration onto a virtual continuous timeline
  // ending "now", so we can reuse calendar-aware Y/M/D math.
  const virtualStart = new Date(now.getTime() - workedMs);

  let totalSecs = Math.floor((now - virtualStart) / 1000);
  const secs = totalSecs % 60; totalSecs = Math.floor(totalSecs / 60);
  const mins = totalSecs % 60; totalSecs = Math.floor(totalSecs / 60);
  const hours = totalSecs % 24;
  const nowY = now.getFullYear(), nowM = now.getMonth(), nowD = now.getDate();
  const startY = virtualStart.getFullYear(), startM = virtualStart.getMonth();
  let years = nowY - startY;
  let months = nowM - startM;
  if (months < 0) { years--; months += 12; }
  let days = nowD - virtualStart.getDate();
  if (days < 0) {
    months--;
    if (months < 0) { years--; months += 12; }
    days += new Date(nowY, nowM, 0).getDate();
  }
  return { years, months, days, hours, mins, secs };
}

function FlipDigit({ value, prevValue, label, isSec }) {
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlipping(true);
      const t = setTimeout(() => { setFlipping(false); prevRef.current = value; }, 400);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="cnt-unit">
      <div className={`cnt-num-wrap ${flipping ? "cnt-flip" : ""} ${isSec ? "cnt-sec" : ""}`}>
        <span className="cnt-num">{String(value).padStart(2, "0")}</span>
        {flipping && <span className="cnt-num cnt-ghost">{String(prevRef.current).padStart(2, "0")}</span>}
      </div>
      <span className="cnt-label">{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <div className="cnt-sep" aria-hidden="true">
      <span className="cnt-sep-dot" />
      <span className="cnt-sep-dot" />
    </div>
  );
}

export default function ExperienceCounter() {
  const [exp, setExp] = useState(calcExperience());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setExp(calcExperience()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { key: "years", value: exp.years, label: "Years" },
    { key: "months", value: exp.months, label: "Months" },
    { key: "days", value: exp.days, label: "Days" },
    { key: "hours", value: exp.hours, label: "Hours" },
    { key: "mins", value: exp.mins, label: "Mins" },
    { key: "secs", value: exp.secs, label: "Secs" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');

        .cnt-bar {
          position: relative;
          z-index: 2;
          padding: 2.8rem 1.25rem 2.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        /* top accent line */
        .cnt-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--x-gold, #c9a35d), transparent);
          opacity: 0;
          animation: cntLineIn 1.2s .6s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes cntLineIn {
          to { opacity: 1; width: min(320px, 80vw); }
        }

        .cnt-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transform: translateY(-8px);
          animation: cntFadeDown .8s .3s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes cntFadeDown {
          to { opacity: 1; transform: translateY(0); }
        }

        .cnt-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--x-sage, #9fb39a);
          box-shadow: 0 0 8px var(--x-sage, #9fb39a);
          animation: cntPulse 2s ease-in-out infinite;
        }
        @keyframes cntPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .35; transform: scale(.6); }
        }

        .cnt-top-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: var(--x-muted2, rgba(243,237,225,.25));
        }

        /* digits row */
        .cnt-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          opacity: 0;
          transform: translateY(16px) scale(.96);
          filter: blur(6px);
          animation: cntRowIn 1s .45s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes cntRowIn {
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        .cnt-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 clamp(10px, 2.5vw, 22px);
          position: relative;
        }
        .cnt-unit:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 6px;
          height: calc(100% - 32px);
          width: 1px;
          background: linear-gradient(to bottom, var(--x-border2, rgba(201,163,93,.28)), transparent);
        }

        .cnt-num-wrap {
          position: relative;
          overflow: hidden;
          height: clamp(52px, 9vw, 82px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cnt-num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(42px, 8vw, 78px);
          line-height: 1;
          letter-spacing: -.02em;
          color: var(--x-text, #f3ede1);
          min-width: 2ch;
          text-align: center;
          transition: color .3s;
        }

        .cnt-sec .cnt-num {
          background: linear-gradient(135deg, var(--x-gold, #c9a35d), var(--x-rose, #c98f9f));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cnt-ghost {
          position: absolute;
          top: 0;
          opacity: .25;
          animation: cntFlipOut .4s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes cntFlipOut {
          0% { transform: translateY(0); opacity: .25; }
          100% { transform: translateY(-100%); opacity: 0; }
        }

        .cnt-flip .cnt-num:not(.cnt-ghost) {
          animation: cntFlipIn .4s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes cntFlipIn {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .cnt-label {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--x-muted2, rgba(243,237,225,.25));
          margin-top: 8px;
          transition: color .3s;
        }
        .cnt-sec + .cnt-label,
        .cnt-unit:last-child .cnt-label {
          /* secs label slightly different */
        }
        .cnt-unit:has(.cnt-sec) .cnt-label {
          color: var(--x-gold, #c9a35d);
          opacity: .5;
        }

        .cnt-sep {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0 2px;
          padding-top: clamp(14px, 2.5vw, 24px);
        }
        .cnt-sep-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--x-gold, #c9a35d);
          opacity: .25;
        }

        /* bottom sub */
        .cnt-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translateY(8px);
          animation: cntFadeDown .8s .8s cubic-bezier(.16,1,.3,1) forwards;
        }
        .cnt-sub-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .14em;
          color: var(--x-muted2, rgba(243,237,225,.25));
        }
        .cnt-sub-gold {
          color: var(--x-gold, #c9a35d);
          font-weight: 500;
        }
        .cnt-sub-line {
          width: 16px;
          height: 1px;
          background: var(--x-border2, rgba(201,163,93,.28));
        }

        /* subtle glow behind the whole counter */
        .cnt-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(300px, 60vw, 600px);
          height: 120px;
          background: radial-gradient(ellipse, var(--x-glow, rgba(201,163,93,.12)), transparent 70%);
          pointer-events: none;
          opacity: 0;
          animation: cntGlowIn 1.5s .6s ease-out forwards;
          z-index: -1;
        }
        @keyframes cntGlowIn {
          to { opacity: 1; }
        }

        @media (max-width: 480px) {
          .cnt-bar { padding: 2rem 0.8rem 1.8rem; gap: 1.2rem; }
          .cnt-unit { padding: 0 7px; }
          .cnt-unit:not(:last-child)::after { display: none; }
          .cnt-sep { display: none; }
          .cnt-label { font-size: 7px; letter-spacing: .16em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cnt-bar *, .cnt-bar *::before, .cnt-bar *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="cnt-bar" role="timer" aria-label="Total work experience counter">
        <div className="cnt-glow" aria-hidden="true" />

        <div className="cnt-top-row">
          <span className="cnt-live-dot" aria-hidden="true" />
          <span className="cnt-top-label">Total Work Experience</span>
        </div>

        <div className="cnt-row">
          {units.map((u, i) => (
            <span key={u.key} style={{ display: "contents" }}>
              {i > 0 && <Separator />}
              <FlipDigit
                value={u.value}
                label={u.label}
                isSec={u.key === "secs"}
              />
            </span>
          ))}
        </div>

        <div className="cnt-sub">
          <span className="cnt-sub-line" aria-hidden="true" />
          <span className="cnt-sub-text">
            Live since <span className="cnt-sub-gold">Feb 2025</span> · Deepti Joshi
          </span>
          <span className="cnt-sub-line" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}