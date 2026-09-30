"use client";

import { useEffect, useRef } from "react";

type Beam = { index: number; dur: number; delay: number };

const ROWS: Beam[] = [
  { index: 3, dur: 7, delay: 0 },
  { index: 6, dur: 9, delay: 2.5 },
  { index: 9, dur: 8, delay: 5 },
  { index: 12, dur: 10, delay: 1.2 },
];

const COLS: Beam[] = [
  { index: 4, dur: 6, delay: 1 },
  { index: 9, dur: 7.5, delay: 3.5 },
  { index: 17, dur: 6.5, delay: 0.4 },
  { index: 22, dur: 8, delay: 4.2 },
];

export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onPointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="backdrop pointer-events-none fixed inset-0 z-0 [--mx:50%] [--my:-400px]"
    >
      <div className="backdrop-grid absolute inset-0" />

      <div className="backdrop-cursor-grid absolute inset-0" />

      <div className="backdrop-beams absolute inset-0 overflow-hidden">
        {ROWS.map((b) => (
          <span
            key={`h${b.index}`}
            className="beam-x absolute left-0 h-px w-[220px] bg-gradient-to-r from-transparent via-accent-light to-transparent"
            style={
              {
                top: `calc(var(--cell) * ${b.index})`,
                "--beam-dur": `${b.dur}s`,
                "--beam-delay": `${b.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
        {COLS.map((b) => (
          <span
            key={`v${b.index}`}
            className="beam-y absolute top-0 h-[160px] w-px bg-gradient-to-b from-transparent via-accent-light to-transparent"
            style={
              {
                left: `calc(var(--cell) * ${b.index})`,
                "--beam-dur": `${b.dur}s`,
                "--beam-delay": `${b.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="backdrop-grain absolute inset-0" />
    </div>
  );
}