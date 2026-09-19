"use client";

import { useMemo, useState } from "react";
import type { HeatmapData } from "@/lib/github";

const CELL = 11;
const GAP = 3;
const GUTTER = 34;
const DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  3: "Wed",
  5: "Fri",
};

const BASE = [20, 184, 166];
const LEVEL_OPACITY = [0.09, 0.22, 0.38, 0.58, 0.8];

function cellColor(level: number): string {
  const a = LEVEL_OPACITY[Math.max(0, Math.min(4, level))] ?? 0;
  return `rgba(${BASE[0]},${BASE[1]},${BASE[2]},${a})`;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

interface Tip {
  x: number;
  y: number;
  count: number;
  date: string;
}

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function GitHubHeatmap({ data }: { data: HeatmapData }) {
  const [tip, setTip] = useState<Tip | null>(null);

  const today = useMemo(() => toLocalISODate(new Date()), []);

  const stats = useMemo(() => {
    const days = data.weeks.flat().filter((d) => d && d.date);
    let maxStreak = 0;
    let run = 0;
    for (let i = 0; i < days.length; i++) {
      run = days[i].level > 0 ? run + 1 : 0;
      if (run > maxStreak) maxStreak = run;
    }
    let current = 0;
    let i = days.length - 1;
    if (days[i] && days[i].level === 0) i -= 1;
    for (; i >= 0; i--) {
      if (days[i].level > 0) current += 1;
      else break;
    }
    const active = days.filter((d) => d.level > 0).length;
    return { maxStreak, current, active };
  }, [data]);

  const width = GUTTER + data.weeks.length * (CELL + GAP);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub profile: ${data.username}`}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-alt transition-colors hover:border-accent/40"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <div>
            <p className="text-sm font-semibold text-foreground">
              @{data.username}
            </p>
            <p className="font-mono text-xs text-muted">
              Last {data.weeks.length * 7} days of activity
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Total</span>
            <span className="font-semibold text-accent-light">
              {data.total.toLocaleString()}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Streak</span>
            <span className="font-semibold text-accent-light">
              {stats.current} day{stats.current === 1 ? "" : "s"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Best</span>
            <span className="font-semibold text-accent-light">
              {stats.maxStreak} day{stats.maxStreak === 1 ? "" : "s"}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div style={{ minWidth: width }}>
          <div className="relative mb-1 ml-[34px] h-5 font-mono text-[10px] leading-5 text-muted">
            {data.months.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                className="absolute top-0 whitespace-nowrap"
                style={{ left: m.index * (CELL + GAP) }}
              >
                {m.label}
              </span>
            ))}
          </div>
<div className="flex">
              <div
                className="mr-1 flex flex-col gap-[3px] font-mono text-[10px] text-muted"
                style={{ width: 30 }}
              >
                {Array.from({ length: 7 }, (_, dow) => (
                  <span
                    key={dow}
                    className="flex h-[11px] items-center leading-none"
                  >
                    {DAY_LABELS[dow] ?? ""}
                  </span>
                ))}
              </div>
              <div className="flex gap-[3px]">
                {data.weeks.map((week, wi) => (
                  <div
                    key={wi}
                    className="flex flex-col gap-[3px]"
                  >
                {week.map((day, dow) => (
                  <button
                    key={`${wi}-${dow}`}
                    type="button"
                    aria-label={
                      day.date
                        ? `${formatDate(day.date)}: ${day.count} contribution${day.count === 1 ? "" : "s"}`
                        : "Outside range"
                    }
                    className={`h-[11px] w-[11px] rounded-[3px] transition-transform hover:scale-125 hover:ring-1 hover:ring-white/60 ${
                      !day.date ? "pointer-events-none" : ""
                    }`}
                    style={{
                      backgroundColor: day.date ? cellColor(day.level) : "transparent",
                      boxShadow:
                        day.date && day.date === today
                          ? "inset 0 0 0 1px rgba(255,255,255,0.7)"
                          : undefined,
                    }}
                    onPointerEnter={(e) => {
                      if (!day.date) return;
                      setTip({
                        x: e.clientX,
                        y: e.clientY,
                        count: day.count,
                        date: day.date,
                      });
                    }}
                    onPointerMove={(e) => {
                      if (!day.date) return;
                      setTip({ x: e.clientX, y: e.clientY, count: day.count, date: day.date });
                    }}
                    onPointerLeave={() => setTip(null)}
                  />
                ))}
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="font-mono text-[11px] text-muted">
          {stats.active.toLocaleString()} active days across{" "}
          {data.weeks.length * 7} days {data.source === "github" ? "· live GitHub API" : ""}
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span>Less</span>
          {LEVEL_OPACITY.map((a) => (
            <span
              key={a}
              className="block h-[11px] w-[11px] rounded-[3px]"
              style={{ backgroundColor: `rgba(${BASE[0]},${BASE[1]},${BASE[2]},${a})` }}
              aria-hidden="true"
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {tip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-border bg-foreground px-3 py-2 text-left shadow-xl"
          style={
            tip.y < 80
              ? {
                  left: tip.x,
                  top: tip.y + 18,
                  transform: "translate(-50%, 0)",
                }
              : {
                  left: tip.x,
                  top: tip.y - 6,
                  transform: "translate(-50%, -100%)",
                }
          }
        >
          <p className="font-mono text-xs font-semibold text-background">
            {tip.count} contribution{tip.count === 1 ? "" : "s"}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-background/60">
            {formatDate(tip.date)}
          </p>
        </div>
      )}
    </div>
  );
}