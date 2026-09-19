const DEFAULT_USERNAME = "kumarankit0411";
const CACHE_TTL = 10 * 60 * 1000;
const REVALIDATE_SECONDS = 3600;
const GRAPHQL_URL = "https://api.github.com/graphql";

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

export interface DayData {
  date: string;
  count: number;
  level: number;
}

export interface HeatmapData {
  username: string;
  total: number;
  source: "github" | "scrape";
  weeks: DayData[][];
  months: { label: string; index: number }[];
}

const cache = new Map<string, { at: number; data: HeatmapData }>();

function monthLabels(weeks: DayData[][]): { label: string; index: number }[] {
  const out: { label: string; index: number }[] = [];
  let prev = -1;
  weeks.forEach((week, i) => {
    const last = [...week].reverse().find((d) => d && d.date);
    if (!last) return;
    const month = new Date(`${last.date}T00:00:00Z`).getUTCMonth();
    if (month !== prev) {
      out.push({ label: MONTHS[month], index: i });
      prev = month;
    }
  });
  return out;
}

function asHeatmap(
  username: string,
  total: number,
  source: "github" | "scrape",
  weeks: DayData[][]
): HeatmapData {
  return { username, total, source, weeks, months: monthLabels(weeks) };
}

async function fetchScrape(username: string): Promise<HeatmapData> {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "user-agent": "portfolio-heatmap/1.0",
      accept: "text/html",
    },
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`GitHub scrape failed: ${res.status}`);
  const html = await res.text();

  const counts = new Map<string, number>();
  const tipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
  let m: RegExpExecArray | null;
  while ((m = tipRe.exec(html)) !== null) {
    const text = m[2].trim();
    const n = text.startsWith("No ")
      ? 0
      : parseInt((text.match(/^\d+/) ?? ["0"])[0], 10);
    counts.set(m[1], Number.isFinite(n) ? n : 0);
  }

  const cells: { date: string; level: number; count: number }[] = [];
  const dayRe =
    /data-date="([^"]+)" id="([^"]+)" data-level="([0-9])"/g;
  while ((m = dayRe.exec(html)) !== null) {
    const [, date, id, level] = m;
    cells.push({
      date,
      level: parseInt(level, 10),
      count: counts.get(id) ?? 0,
    });
  }
  if (cells.length === 0) {
    throw new Error("No contribution cells found in GitHub response");
  }

  const weekCount = Math.round(cells.length / 7);
  const weeks: (DayData | null)[][] = Array.from({ length: weekCount }, () =>
    Array.from({ length: 7 }, () => null)
  );
  cells.forEach((c, k) => {
    const dow = Math.floor(k / weekCount);
    const week = k % weekCount;
    weeks[week][dow] = { date: c.date, count: c.count, level: c.level };
  });

  const filled: DayData[][] = weeks.map((w) =>
    w.map((d) => d ?? { date: "", count: 0, level: 0 })
  );

  const total = filled
    .flat()
    .reduce((sum, d) => (d.date ? sum + d.count : sum), 0);

  return asHeatmap(username, total, "scrape", filled);
}

async function fetchGraphQL(username: string, token: string): Promise<HeatmapData> {
  const query = `query($u: String!) {
    user(login: $u) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              level
            }
          }
        }
      }
    }
  }`;
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables: { u: username } }),
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL failed: ${res.status}`);
  const json: {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions?: number;
            weeks?: {
              contributionDays?: {
                date: string;
                contributionCount: number;
                level: string;
              }[];
            }[];
          };
        };
      };
    };
  } = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal?.weeks) throw new Error("GitHub GraphQL returned no calendar");

  const levelNumbers: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTER: 1,
    SECOND_QUARTER: 2,
    THIRD_QUARTER: 3,
    FOURTH_QUARTER: 4,
  };
  const weeks: DayData[][] = cal.weeks.map((w) =>
    (w.contributionDays ?? []).map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelNumbers[d.level] ?? 0,
    }))
  );
  const total = cal.totalContributions ?? 0;
  return asHeatmap(username, total, "github", weeks);
}

export async function getContributions(
  username?: string
): Promise<HeatmapData> {
  const user = username?.trim() || process.env.GITHUB_USERNAME || DEFAULT_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  const key = user;

  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;

  const data = token
    ? await fetchGraphQL(user, token)
    : await fetchScrape(user);

  cache.set(key, { at: Date.now(), data });
  return data;
}