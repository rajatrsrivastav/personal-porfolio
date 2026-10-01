import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityCalendar } from "react-activity-calendar";
import {
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ── Utility ─────────────────────────────────────────── */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ── Types ───────────────────────────────────────────── */
const PR_STATUS = /** @type {const} */ ({
  MERGED: "merged",
  OPEN: "open",
  CLOSED: "closed",
});

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: PR_STATUS.MERGED, label: "Merged" },
  { key: PR_STATUS.OPEN, label: "Open" },
  { key: PR_STATUS.CLOSED, label: "Closed" },
];

const GITHUB_USERNAME = "rajatrsrivastav";
const GITHUB_API = "https://api.github.com";
const CONTRIBUTION_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
// Exclude the account's own repositories and its internal Safcurl organization.
const OSS_PR_QUERY = `is:pr author:${GITHUB_USERNAME} -user:${GITHUB_USERNAME} -org:safcurl`;

async function fetchJson(url, signal) {
  const options = { signal };
  if (url.startsWith(GITHUB_API)) {
    options.headers = { Accept: "application/vnd.github+json" };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

function buildPullRequestSearchUrl(query, perPage = 15, page = 1) {
  const params = new URLSearchParams({
    q: query,
    sort: "created",
    order: "desc",
    per_page: String(perPage),
    page: String(page),
  });
  return `${GITHUB_API}/search/issues?${params.toString()}`;
}

async function fetchAllSearchResults(query, signal, perPage, includeAll) {
  const firstPage = await fetchJson(
    buildPullRequestSearchUrl(query, perPage, 1),
    signal
  );
  const pageCount = includeAll
    ? Math.min(Math.ceil(firstPage.total_count / perPage), 10)
    : 1;
  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetchJson(
        buildPullRequestSearchUrl(query, perPage, index + 2),
        signal
      )
    )
  );
  return {
    items: [firstPage, ...remainingPages].flatMap((page) => page.items || []),
    totalCount: firstPage.total_count || 0,
  };
}

async function fetchPullRequests(signal, includeAll = false) {
  const perPage = includeAll ? 100 : 15;
  const [allResults, mergedResults] = await Promise.all([
    fetchAllSearchResults(
      OSS_PR_QUERY,
      signal,
      perPage,
      includeAll
    ),
    fetchAllSearchResults(
      `${OSS_PR_QUERY} is:merged`,
      signal,
      perPage,
      includeAll
    ),
  ]);
  const mergedUrls = new Set(
    mergedResults.items.map((item) => item.html_url)
  );

  const items = allResults.items.map((item) => {
    const repo = item.repository_url?.replace(`${GITHUB_API}/repos/`, "") || "";
    const status =
      item.state === "open"
        ? PR_STATUS.OPEN
        : mergedUrls.has(item.html_url)
          ? PR_STATUS.MERGED
          : PR_STATUS.CLOSED;

    return {
      id: item.id,
      title: item.title,
      repo,
      repoUrl: item.html_url,
      status,
      timestamp: formatRelativeTime(item.updated_at || item.created_at),
    };
  });

  return { items, totalCount: allResults.totalCount };
}

function formatRelativeTime(value) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const match = units.find(([, size]) => Math.abs(seconds) >= size);
  if (!match) return "just now";
  return formatter.format(Math.round(seconds / match[1]), match[0]);
}

/* ── Warm sunset calendar theme (amber → orange → rose) ── */
const calendarTheme = {
  light: ["#f1f3f5", "#fed7aa", "#fb923c", "#f97316", "#e11d48"],
};

/* ── Status config ───────────────────────────────────── */
const STATUS_CONFIG = {
  [PR_STATUS.MERGED]: {
    Icon: GitMerge,
    color: "text-rose-500",
  },
  [PR_STATUS.OPEN]: {
    Icon: GitPullRequest,
    color: "text-amber-500",
  },
  [PR_STATUS.CLOSED]: {
    Icon: GitPullRequestClosed,
    color: "text-neutral-400",
  },
};

/* ── Sub-components ──────────────────────────────────── */

function FilterTabs({ active, onChange, items }) {
  const getCount = (key) => {
    if (key === "all") return items.length;
    return items.filter((pr) => pr.status === key).length;
  };

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-100/70 border border-neutral-200/70 select-none">
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = getCount(tab.key);

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative px-3 py-1 text-xs font-medium capitalize rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer bg-transparent border-0",
              isActive
                ? "text-neutral-900 font-semibold"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/40"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeContributionTab"
                className="absolute inset-0 bg-white rounded-lg border border-neutral-200/80 shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "relative z-10 text-[10px] font-mono px-1.5 rounded-full",
                  isActive
                    ? "bg-neutral-100 text-neutral-700"
                    : "text-neutral-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ContributionRow({ pr }) {
  const cfg = STATUS_CONFIG[pr.status];
  const Icon = cfg.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-3.5 py-3.5"
    >
      {/* Status icon */}
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.color)} />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <a
          href={pr.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-800 hover:text-neutral-900 transition-colors no-underline"
        >
          {pr.title}
        </a>
        <p className="mt-0.5 text-xs text-neutral-400 font-mono">{pr.repo}</p>
      </div>

      {/* Timestamp */}
      <span className="shrink-0 text-xs text-neutral-400 pt-0.5 hidden sm:block">
        {pr.timestamp}
      </span>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────── */

export default function GithubSection({ fullPage = false }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [calendar, setCalendar] = useState({
    data: [],
    total: 0,
    loading: true,
    error: false,
  });
  const [pullRequests, setPullRequests] = useState({
    items: [],
    totalCount: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    if (!fullPage) {
      fetchJson(CONTRIBUTION_API, controller.signal)
        .then((result) => {
          const data = Array.isArray(result.contributions)
            ? result.contributions
            : [];
          setCalendar({
            data,
            total: data.reduce((sum, day) => sum + (Number(day.count) || 0), 0),
            loading: false,
            error: data.length === 0,
          });
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setCalendar({ data: [], total: 0, loading: false, error: true });
          }
        });
    }

    fetchPullRequests(controller.signal, fullPage)
      .then(({ items, totalCount }) => {
        setPullRequests({ items, totalCount, loading: false, error: false });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setPullRequests({ items: [], totalCount: 0, loading: false, error: true });
        }
      });

    return () => controller.abort();
  }, [fullPage]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pullRequests.items.filter((pr) => {
      const matchesFilter = filter === "all" || pr.status === filter;
      const matchesSearch =
        !query || `${pr.title} ${pr.repo}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, pullRequests.items, search]);

  const previewPRs = filtered.slice(0, 4);
  const displayedPRs = fullPage ? filtered : previewPRs;

  return (
    <section
      id={fullPage ? "contributions" : "activity"}
      className="mx-auto max-w-[1200px] px-6 py-16 sm:py-20 lg:py-24"
      aria-labelledby={fullPage ? "contributions-title" : "activity-title"}
    >
      {/* ── Unified Section Header ─────────────────── */}
      <header className="mb-10 text-center sm:mb-14">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2 text-center">
          OPEN SOURCE & CODE ACTIVITY
        </p>
        <h2
          id={fullPage ? "contributions-title" : "activity-title"}
          className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 text-center"
        >
          {fullPage ? "All Public " : "GitHub "}
          <span className="font-serif italic font-normal bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            {fullPage ? "Contributions" : "Activity"}
          </span>
        </h2>
      </header>

      <div className="max-w-3xl mx-auto">
        {!fullPage && (
          <>
            {/* ── Activity summary ──────────────────── */}
            <div className="flex flex-wrap justify-end gap-2 mb-4">
              <span className="text-xs font-mono text-neutral-500 bg-neutral-100/80 border border-neutral-200/60 px-3 py-1 rounded-full">
                {calendar.loading
                  ? "Loading GitHub activity"
                  : calendar.error
                    ? "Contribution data unavailable"
                    : `${calendar.total.toLocaleString()} contributions in the last year`}
              </span>
            </div>

            {/* ── Contribution Graph (on canvas, no card) ── */}
            <div className="overflow-x-auto pb-2 [&_.react-activity-calendar]:mx-auto">
              {!calendar.loading && !calendar.error && (
                <ActivityCalendar
                  data={calendar.data}
                  theme={calendarTheme}
                  blockSize={13}
                  blockMargin={3}
                  blockRadius={3}
                  fontSize={11}
                  hideColorLegend={false}
                  hideMonthLabels={false}
                  hideTotalCount
                  labels={{
                    legend: {
                      less: "Less active",
                      more: "More active",
                    },
                  }}
                  style={{
                    color: "#9ca3af",
                  }}
                />
              )}
              {calendar.loading && (
                <p className="py-8 text-center text-sm text-neutral-400">
                  Loading contribution calendar…
                </p>
              )}
              {calendar.error && (
                <p className="py-8 text-center text-sm text-neutral-400">
                  Live contribution calendar is temporarily unavailable.
                </p>
              )}
            </div>

            {/* ── Divider ──────────────────────────────── */}
            <div className="my-10 border-t border-neutral-200/70" />
          </>
        )}

        {/* ── Open Source Contributions ─────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              {fullPage ? "Public Pull Requests" : "Open Source Contributions"}
            </h3>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">
              Verified upstream pull requests across public ecosystems
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {fullPage && (
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pull requests"
                aria-label="Search pull requests"
                className="w-full sm:w-56 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400"
              />
            )}
            <FilterTabs active={filter} onChange={setFilter} items={pullRequests.items} />
          </div>
        </div>

        {/* PR list clean divide-y rows */}
        <div className="divide-y divide-neutral-200/70 border-y border-neutral-200/70">
          <AnimatePresence mode="popLayout">
            {displayedPRs.map((pr) => (
              <ContributionRow key={pr.id} pr={pr} />
            ))}
          </AnimatePresence>

          {pullRequests.loading && (
            <p className="py-8 text-center text-sm text-neutral-400">
              Loading public pull requests…
            </p>
          )}
          {pullRequests.error && (
            <p className="py-8 text-center text-sm text-neutral-400">
              Public pull request activity is temporarily unavailable.
            </p>
          )}
          {!pullRequests.loading && !pullRequests.error && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-400">
              {pullRequests.items.length === 0
                ? "No public pull requests found."
                : "No pull requests in this category."}
            </p>
          )}
        </div>

        {/* Footer link */}
        <div className="mt-8 flex justify-center">
          {fullPage ? (
            <a
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5",
                "border border-neutral-200 text-sm font-medium text-neutral-700",
                "transition-all no-underline",
                "hover:border-neutral-300 hover:bg-neutral-50"
              )}
            >
              Back to Homepage
            </a>
          ) : (
            <a
              href="/contributions"
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl px-5 py-2.5",
                "border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-700 shadow-2xs",
                "transition-all no-underline hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-xs"
              )}
            >
              <span>
                View All Contributions (
                {pullRequests.loading
                  ? "…"
                  : pullRequests.totalCount.toLocaleString()}
                )
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
