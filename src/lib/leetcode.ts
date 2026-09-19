const OWNER = process.env.LEETCODE_OWNER || "kumarankit0411";
const REPO = process.env.LEETCODE_REPO || "leetcode_submissions";
const BRANCH = "main";
const API_ROOT = `https://api.github.com/repos/${OWNER}/${REPO}`;
const RAW_ROOT = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
const CACHE_TTL = 10 * 60 * 1000;
const REVALIDATE_SECONDS = 3600;
const MIN_MONTH_LABEL_GAP_WEEKS = 2;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface LeetCodeProblem {
  number: number;
  slug: string;
  title: string;
  difficulty: Difficulty | null;
  topics: string[];
}

export interface LeetCodeDay {
  date: string;
  count: number;
  level: number;
}

export interface LeetCodeRecent {
  title: string;
  slug: string | null;
  difficulty: Difficulty | null;
  topics: string[];
  date: string;
  timePct: number | null;
  memoryPct: number | null;
}

export interface LeetCodeData {
  owner: string;
  repo: string;
  total: number;
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
  difficulties: Record<Difficulty, number>;
  languages: { ext: string; count: number }[];
  topicCounts: { name: string; count: number }[];
  weeks: LeetCodeDay[][];
  months: { label: string; index: number }[];
  monthly: { label: string; count: number }[];
  recent: LeetCodeRecent[];
  bestTimePct: number | null;
  bestMemoryPct: number | null;
  lastUpdated: string;
}

const cache = new Map<string, { at: number; data: LeetCodeData }>();

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return token ? { authorization: `Bearer ${token}` } : {};
}

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

async function fetchTopics(slug: string): Promise<string[]> {
  const query = `query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) { topicTags { name } }
  }`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(LEETCODE_GRAPHQL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": "portfolio-leetcode-tracker/1.0",
          referer: `https://leetcode.com/problems/${slug}/`,
        },
        body: JSON.stringify({ query, variables: { titleSlug: slug } }),
        cache: "force-cache",
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const json: { data?: { question?: { topicTags?: { name?: string }[] } } } =
        await res.json();
      const tags = json?.data?.question?.topicTags ?? [];
      const names = tags
        .map((t) => t?.name)
        .filter((n): n is string => typeof n === "string");
      if (names.length > 0) return names;
    } catch {
      // transient LeetCode error — retry
    }
  }
  return [];
}

async function fetchAllTopics(
  slugs: string[],
  concurrency = 10
): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, slugs.length || 1) }, async () => {
      for (;;) {
        const idx = next++;
        if (idx >= slugs.length) break;
        const slug = slugs[idx];
        out.set(slug, await fetchTopics(slug));
      }
    })
  );
  return out;
}

function fetchText(
  url: string,
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(url, {
    headers: { "user-agent": "portfolio/1.0", ...authHeaders(), ...headers },
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(15000),
  });
}

async function getTree(): Promise<string[]> {
  const res = await fetchText(`${API_ROOT}/git/trees/${BRANCH}?recursive=1`);
  if (!res.ok) throw new Error(`git tree failed: ${res.status}`);
  const json: { tree?: { path?: string }[] } = await res.json();
  return (json.tree ?? [])
    .map((t) => t.path ?? "")
    .filter((p) => p.length > 0);
}

async function getAllCommits(): Promise<{ date: string; message: string }[]> {
  const out: { date: string; message: string }[] = [];
  let page = 1;
  for (;;) {
    const res = await fetchText(
      `${API_ROOT}/commits?${new URLSearchParams({
        per_page: "100",
        page: String(page),
      })}`
    );
    if (!res.ok) throw new Error(`commits failed: ${res.status}`);
    const json: {
      commit?: { author?: { date?: string }; message?: string };
    }[] = await res.json();
    if (json.length === 0) break;
    for (const c of json) {
      const date = c?.commit?.author?.date;
      const message = c?.commit?.message;
      if (date && message) out.push({ date, message });
    }
    if (json.length < 100) break;
    page += 1;
  }
  return out;
}

async function fetchReadme(
  rawPath: string
): Promise<{ slug: string; title: string; difficulty: Difficulty | null } | null> {
  try {
    const res = await fetchText(`${RAW_ROOT}/${rawPath}`);
    if (!res.ok) return null;
    const html = await res.text();
    const link = /<a href="https:\/\/leetcode\.com\/problems\/([^"]+)">([^<]+)<\/a>/.exec(
      html
    );
    const badge = /Difficulty-(Easy|Medium|Hard)-/.exec(html);
    if (!link) return null;
    return {
      slug: link[1],
      title: link[2].replace(/&amp;/g, "&").trim(),
      difficulty: (badge?.[1] ?? null) as Difficulty | null,
    };
  } catch {
    return null;
  }
}

function titleSlugSortKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} ${String(y).slice(2)}`;
}

function weekdayMonthLabels(weeks: LeetCodeDay[][]): {
  label: string;
  index: number;
}[] {
  const out: { label: string; index: number }[] = [];
  let prev = -1;
  let lastLabeled = -Infinity;
  weeks.forEach((week, i) => {
    const last = [...week].reverse().find((d) => d && d.date);
    if (!last) return;
    const month = new Date(`${last.date}T00:00:00Z`).getUTCMonth();
    if (month !== prev) {
      prev = month;
      if (i - lastLabeled < MIN_MONTH_LABEL_GAP_WEEKS) {
        out.pop();
        out.push({ label: MONTHS[month], index: i });
        lastLabeled = i;
        return;
      }
      out.push({ label: MONTHS[month], index: i });
      lastLabeled = i;
    }
  });
  return out;
}

function startOfWeekSunday(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().slice(0, 10);
}

function levelForSolved(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const LANG_LABELS: Record<string, string> = {
  py: "Python",
  js: "JavaScript",
  ts: "TypeScript",
  java: "Java",
  cpp: "C++",
  c: "C",
  cs: "C#",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  sql: "SQL",
  sh: "Shell",
};

export async function getLeetCodeData(): Promise<LeetCodeData> {
  const key = `${OWNER}/${REPO}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;

  const [tree, commits] = await Promise.all([getTree(), getAllCommits()]);

  const folders = new Map<string, { number: number; solutions: string[] }>();
  for (const path of tree) {
    const slash = path.indexOf("/");
    if (slash === -1) continue;
    const top = path.slice(0, slash);
    const rest = path.slice(slash + 1);
    const m = /^(\d+)-[a-z0-9-]+$/.exec(top);
    if (!m) continue;
    if (!folders.has(top)) folders.set(top, { number: parseInt(m[1], 10), solutions: [] });
    if (rest !== "README.md") folders.get(top)!.solutions.push(rest);
  }

  const details = await Promise.all(
    [...folders.keys()].map(async (folder) => {
      const info = await fetchReadme(`${folder}/README.md`);
      return { folder, folderInfo: folders.get(folder)!, info };
    })
  );

  const byTitle = new Map<string, LeetCodeProblem>();
  const languageCount = new Map<string, number>();
  let total = 0;
  for (const d of details) {
    if (!d.info?.title) continue;
    const key = titleSlugSortKey(d.info.title);
    byTitle.set(key, {
      number: d.folderInfo.number,
      slug: d.info.slug ?? "",
      title: d.info.title,
      difficulty: d.info.difficulty,
      topics: [],
    });
    total += 1;
    for (const sol of d.folderInfo.solutions) {
      const dot = sol.lastIndexOf(".");
      if (dot === -1) continue;
      const ext = sol.slice(dot + 1).toLowerCase();
      if (!LANG_LABELS[ext]) continue;
      languageCount.set(ext, (languageCount.get(ext) ?? 0) + 1);
    }
  }

  const topicMap = await fetchAllTopics(
    [...byTitle.values()].map((p) => p.slug).filter((s) => s.length > 0)
  );
  for (const p of byTitle.values()) {
    p.topics = topicMap.get(p.slug) ?? [];
  }

  const topicCounts = new Map<string, number>();
  for (const p of byTitle.values()) {
    for (const t of p.topics) topicCounts.set(t, (topicCounts.get(t) ?? 0) + 1);
  }
  const topicCountList = [...topicCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const difficulties: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  for (const p of byTitle.values()) {
    if (p.difficulty) difficulties[p.difficulty] += 1;
  }

  const solvedDates = new Map<string, string>();
  const paired: LeetCodeRecent[] = [];
  const pendingDates = new Map<string, { timePct: number; memoryPct: number; date: string }>();
  for (const c of commits) {
    const tm = /^Time: \d+ ms \((\d+(?:\.\d+)?)%\) \| Memory: [\d.]+ MB \((\d+(?:\.\d+)?)%\)/.exec(
      c.message
    );
    if (tm) {
      pendingDates.set(c.date.slice(0, 10), {
        timePct: parseFloat(tm[1]),
        memoryPct: parseFloat(tm[2]),
        date: c.date,
      });
      continue;
    }
    const rm = /^Added README\.md file for (.+)$/.exec(c.message);
    if (!rm) continue;
    const title = rm[1].trim();
    const day = c.date.slice(0, 10);
    const rank = titleSlugSortKey(title);
    if (!solvedDates.has(rank)) solvedDates.set(rank, c.date);
    const perf = pendingDates.get(day);
    paired.push({
      title,
      slug: byTitle.get(rank)?.slug ?? null,
      difficulty: byTitle.get(rank)?.difficulty ?? null,
      topics: byTitle.get(rank)?.topics ?? [],
      date: c.date,
      timePct: perf?.timePct ?? null,
      memoryPct: perf?.memoryPct ?? null,
    });
    pendingDates.delete(day);
  }

  const recent = paired.slice(0, 8);
  let bestTimePct: number | null = null;
  let bestMemoryPct: number | null = null;
  for (const p of paired) {
    if (p.timePct != null && (bestTimePct == null || p.timePct > bestTimePct)) {
      bestTimePct = p.timePct;
    }
    if (p.memoryPct != null && (bestMemoryPct == null || p.memoryPct > bestMemoryPct)) {
      bestMemoryPct = p.memoryPct;
    }
  }

  const daySolved = new Map<string, { rank: string; title: string }[]>();
  for (const c of commits) {
    const rm = /^Added README\.md file for (.+)$/.exec(c.message);
    if (!rm) continue;
    const title = rm[1].trim();
    const day = c.date.slice(0, 10);
    const rank = titleSlugSortKey(title);
    if (!daySolved.has(day)) daySolved.set(day, []);
    const list = daySolved.get(day)!;
    if (!list.some((e) => e.rank === rank)) list.push({ rank, title });
  }

  const activeDaysList = [...daySolved.keys()].sort();
  const dayCount = new Map(
    activeDaysList.map((d) => [d, (daySolved.get(d) ?? []).length] as const)
  );
  const today = toISODate(new Date());
  const currentStreak = computeCurrentStreak(dayCount);
  const bestStreak = computeBestStreak(dayCount);

  const firstDay = activeDaysList[0] ?? today;
  const start = startOfWeekSunday(firstDay);
  const weeks: LeetCodeDay[][] = [];
  let cursor = new Date(`${start}T00:00:00Z`);
  const end = new Date(`${today}T00:00:00Z`);
  while (cursor <= end) {
    const week: LeetCodeDay[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const iso = toISODate(cursor);
      if (cursor > end) {
        week.push({ date: "", count: 0, level: 0 });
      } else {
        const count = dayCount.get(iso) ?? 0;
        week.push({ date: iso, count, level: levelForSolved(count) });
      }
      cursor = new Date(cursor.getTime() + 864e5);
    }
    weeks.push(week);
  }

  const monthly: { label: string; count: number }[] = [];
  const todayKey = monthKey(today);
  const todayMonth = new Date(`${todayKey}-01T00:00:00Z`);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(todayMonth.getUTCFullYear(), todayMonth.getUTCMonth() - i, 1));
    const key = monthKey(toISODate(d));
    let count = 0;
    for (const [, firstIso] of solvedDates) {
      if (monthKey(firstIso.slice(0, 10)) === key) count += 1;
    }
    monthly.push({ label: monthLabel(key), count });
  }

  const languages = [...languageCount.entries()]
    .map(([ext, count]) => ({ ext: LANG_LABELS[ext] ?? ext, count }))
    .sort((a, b) => b.count - a.count);

  const lastUpdated = commits[0]?.date ?? toISODate(new Date());

  const data: LeetCodeData = {
    owner: OWNER,
    repo: REPO,
    total,
    activeDays: activeDaysList.length,
    currentStreak,
    bestStreak,
    difficulties,
    languages,
    topicCounts: topicCountList,
    weeks,
    months: weekdayMonthLabels(weeks),
    monthly,
    recent,
    bestTimePct,
    bestMemoryPct,
    lastUpdated,
  };

  cache.set(key, { at: Date.now(), data });
  return data;
}

function computeCurrentStreak(dayCount: Map<string, number>): number {
  const keys = [...dayCount.keys()].sort();
  if (keys.length === 0) return 0;
  let streak = 0;
  const d = new Date(`${keys[keys.length - 1]}T00:00:00Z`);
  for (;;) {
    const iso = toISODate(d);
    if ((dayCount.get(iso) ?? 0) > 0) {
      streak += 1;
    } else {
      break;
    }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

function computeBestStreak(dayCount: Map<string, number>): number {
  let best = 0;
  let run = 0;
  const dates = [...dayCount.keys()].sort();
  let prev: Date | null = null;
  for (const iso of dates) {
    if ((dayCount.get(iso) ?? 0) <= 0) {
      run = 0;
      prev = null;
      continue;
    }
    const cur = new Date(`${iso}T00:00:00Z`);
    run = prev && cur.getTime() - prev.getTime() === 864e5 ? run + 1 : 1;
    if (run > best) best = run;
    prev = cur;
  }
  return best;
}