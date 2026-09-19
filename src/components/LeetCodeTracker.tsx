"use client";

import { useMemo, useState } from "react";
import type { LeetCodeData, Difficulty } from "@/lib/leetcode";

const CELL = 11;
const GAP = 3;
const GUTTER = 34;
const DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  3: "Wed",
  5: "Fri",
};

const BASE = [139, 92, 246];
const LEVEL_OPACITY = [0.08, 0.22, 0.4, 0.62, 0.85];

const DIFF_STYLE: Record<Difficulty, { label: string; color: string }> = {
  Easy: { label: "Easy", color: "#00b8a3" },
  Medium: { label: "Medium", color: "#ffa116" },
  Hard: { label: "Hard", color: "#ff375f" },
};
const DIFF_ORDER: Difficulty[] = ["Easy", "Medium", "Hard"];

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

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function pctLabel(pct: number): string {
  const v = Math.round(pct);
  return v >= 100 ? "100%" : `${v}%`;
}

interface Tip {
  x: number;
  y: number;
  count: number;
  date: string;
}

export default function LeetCodeTracker({ data }: { data: LeetCodeData }) {
  const [tip, setTip] = useState<Tip | null>(null);

  const stats = useMemo(
    () => ({
      activeDays: data.activeDays,
      currentStreak: data.currentStreak,
      bestStreak: data.bestStreak,
      total: data.total,
    }),
    [data]
  );

  const difficultyMax = Math.max(
    data.difficulties.Easy,
    data.difficulties.Medium,
    data.difficulties.Hard,
    1
  );
  const monthlyMax = Math.max(...data.monthly.map((m) => m.count), 1);
  const width = GUTTER + data.weeks.length * (CELL + GAP);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href={`https://github.com/${data.owner}/${data.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LeetCode submissions repo: ${data.owner}/${data.repo}`}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-alt font-mono text-sm font-bold text-[#ffa116] transition-colors hover:border-accent/40"
          >
            LC
          </a>
          <div>
            <p className="text-sm font-semibold text-foreground">
              @{data.owner}
            </p>
            <p className="font-mono text-xs text-muted">
              leetcode_submissions · LeetSync
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Solved</span>
            <span className="font-semibold text-accent-light">
              {stats.total.toLocaleString()}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Streak</span>
            <span className="font-semibold text-accent-light">
              {stats.currentStreak} day{stats.currentStreak === 1 ? "" : "s"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Best</span>
            <span className="font-semibold text-accent-light">
              {stats.bestStreak} day{stats.bestStreak === 1 ? "" : "s"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-alt px-3 py-1.5">
            <span className="text-muted">Active</span>
            <span className="font-semibold text-accent-light">
              {stats.activeDays} day{stats.activeDays === 1 ? "" : "s"}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs text-muted">Solved by difficulty</p>
          <div className="mt-3 space-y-3">
            {DIFF_ORDER.map((d) => (
              <div key={d}>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: DIFF_STYLE[d].color }}
                      aria-hidden="true"
                    />
                    {DIFF_STYLE[d].label}
                  </span>
                  <span className="text-foreground">
                    {data.difficulties[d]}
                    <span className="text-muted">
                      {" "}
                      · {Math.round((data.difficulties[d] / stats.total) * 100)}%
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(data.difficulties[d] / difficultyMax) * 100}%`,
                      backgroundColor: DIFF_STYLE[d].color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="font-mono text-xs text-muted">
              Problems per month
            </p>
            <div className="mt-3 flex h-36 items-end gap-2">
              {data.monthly.map((m) => (
                <div
                  key={m.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <span className="font-mono text-[10px] text-accent-light">
                    {m.count > 0 ? m.count : ""}
                  </span>
                  <div
                    className="w-full rounded-t border border-transparent border-b-surface-alt"
                    style={{
                      height: `${Math.max((m.count / monthlyMax) * 100, 2)}%`,
                      backgroundColor:
                        m.count > 0
                          ? "rgba(139,92,246,0.55)"
                          : "rgba(255,255,255,0.06)",
                    }}
                    title={`${m.label}: ${m.count} solved`}
                  />
                  <span className="font-mono text-[9px] text-muted">
                    {m.label.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs text-muted">
            Submissions · LeetSync activity
          </p>
          <div className="mt-3 overflow-x-auto pb-1">
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
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, dow) => (
                        <button
                          key={`${wi}-${dow}`}
                          type="button"
                          aria-label={
                            day.date
                              ? `${formatDate(day.date)}: ${day.count} problem${day.count === 1 ? "" : "s"} solved`
                              : "Outside range"
                          }
                          className={`h-[11px] w-[11px] rounded-[3px] transition-transform hover:scale-125 hover:ring-1 hover:ring-white/60 ${
                            !day.date ? "pointer-events-none" : ""
                          }`}
                          style={{
                            backgroundColor: day.date
                              ? cellColor(day.level)
                              : "transparent",
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
                            setTip({
                              x: e.clientX,
                              y: e.clientY,
                              count: day.count,
                              date: day.date,
                            });
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
              {stats.activeDays.toLocaleString()} active days
              {data.bestTimePct != null &&
                ` · best runtime faster than ${pctLabel(data.bestTimePct)}`}
              {data.bestMemoryPct != null &&
                ` · best memory better than ${pctLabel(data.bestMemoryPct)}`}
            </p>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
              <span>Less</span>
              {LEVEL_OPACITY.map((a) => (
                <span
                  key={a}
                  className="block h-[11px] w-[11px] rounded-[3px]"
                  style={{
                    backgroundColor: `rgba(${BASE[0]},${BASE[1]},${BASE[2]},${a})`,
                  }}
                  aria-hidden="true"
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {data.topicCounts.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="font-mono text-xs text-muted">Key topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.topicCounts.slice(0, 14).map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs text-foreground"
              >
                {t.name}
                <span className="font-mono text-[10px] text-accent-light">
                  ×{t.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {data.recent.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="font-mono text-xs text-muted">Recent submissions</p>
          <ul className="mt-3 space-y-2">
            {data.recent.map((r, i) => (
              <li
                key={`${r.title}-${i}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface-alt/60 px-3 py-2"
              >
                {r.difficulty && (
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: DIFF_STYLE[r.difficulty].color }}
                    aria-hidden="true"
                  />
                )}
                {r.slug ? (
                  <a
                    href={`https://leetcode.com/problems/${r.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground transition-colors hover:text-accent-light"
                  >
                    {r.title}
                  </a>
                ) : (
                  <span className="text-sm text-foreground">{r.title}</span>
                )}
                {r.difficulty && (
                  <span
                    className="font-mono text-[10px] font-semibold"
                    style={{ color: DIFF_STYLE[r.difficulty].color }}
                  >
                    {DIFF_STYLE[r.difficulty].label}
                  </span>
                )}
                {(r.timePct != null || r.memoryPct != null) && (
                  <span className="font-mono text-[10px] text-muted">
                    {r.timePct != null && (
                      <>faster than {pctLabel(r.timePct)} time</>
                    )}
                    {r.timePct != null && r.memoryPct != null && " · "}
                    {r.memoryPct != null && (
                      <>better than {pctLabel(r.memoryPct)} mem</>
                    )}
                  </span>
                )}
                <span className="ml-auto font-mono text-[10px] text-muted">
                  {formatShortDate(r.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
            {tip.count} problem{tip.count === 1 ? "" : "s"} solved
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-background/60">
            {formatDate(tip.date)}
          </p>
        </div>
      )}
    </div>
  );
}