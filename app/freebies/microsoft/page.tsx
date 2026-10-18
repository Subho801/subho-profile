
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MicrosoftGame = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  original_price: string;
  current_price: string;
  status: string;
};

type MicrosoftResponse = {
  source: string;
  updated_at: string | null;
  total_found: number;
  scan_complete: boolean;
  games: MicrosoftGame[];
};

const FEED_URL =
  "https://raw.githubusercontent.com/Subho801/microsoft-store-notifier/main/microsoft.json";

export default function MicrosoftStorePage() {
  const [data, setData] = useState<MicrosoftResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadGames() {
      try {
        const res = await fetch(FEED_URL, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Could not load Microsoft Store feed");
        }

        const json: MicrosoftResponse = await res.json();

        if (!active) return;

        setData(json);
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGames();

    return () => {
      active = false;
    };
  }, []);

  const games = data?.games ?? [];

  const lastUpdated = data?.updated_at
    ? new Date(data.updated_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#071016] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.16] via-blue-500/[0.08] to-transparent p-7">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-cyan-400/20 bg-black/30 backdrop-blur">
              <img
                src="/microsoft-store.png"
                alt="Microsoft Store"
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Microsoft Store
              </p>

              <h1 className="text-3xl font-black md:text-6xl">
                Microsoft Store Freebies
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
            Discover paid Microsoft Store games that are temporarily free.
            Find a game you like and claim it directly from the store.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Stat label="Free Games" value={loading ? "…" : games.length} />
            <Stat label="Provider" value="Microsoft Store" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <span>
              {lastUpdated
                ? `Feed updated: ${lastUpdated}`
                : "Waiting for feed update"}
            </span>

            {data && (
              <span
                className={
                  data.scan_complete
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              >
                {data.scan_complete
                  ? "Latest scan complete"
                  : "Latest scan may be incomplete"}
              </span>
            )}
          </div>
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Free Now</h2>

          {!loading && !error && (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {games.length} {games.length === 1 ? "game" : "games"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="animate-pulse text-zinc-400">
              Checking Microsoft Store freebies...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-8">
            <h3 className="text-lg font-bold text-red-300">
              Could not load Microsoft Store freebies
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              The feed may not exist yet, or GitHub could not be reached.
              Check that microsoft.json has been generated and committed
              to your notifier repository.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
            >
              Try Again
            </button>
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h3 className="text-xl font-bold">No freebies found</h3>
            <p className="mt-2 text-sm text-zinc-500">
              No paid games currently marked free were found in the latest
              successful scan.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-zinc-600">
          Prices and availability may change. Check the Microsoft Store
          listing before claiming a game.
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function GameCard({ game }: { game: MicrosoftGame }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#101827] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]">
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-52 overflow-hidden bg-black"
        aria-label={`View ${game.title} on Microsoft Store`}
      >
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-950 to-[#101827]">
            <img
              src="/microsoft-store.png"
              alt=""
              className="h-16 w-16 object-contain opacity-70"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/50 bg-black/50 shadow-[0_0_25px_rgba(34,211,238,0.30)] backdrop-blur-xl">
          <img
            src="/microsoft-store.png"
            alt="Microsoft Store"
            className="h-7 w-7 object-contain"
          />
        </div>

        <span className="absolute right-3 top-3 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300 backdrop-blur">
          FREE
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">
            Microsoft Store
          </span>

          {game.status === "free" && (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
              Limited-time free
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-xl font-black">{game.title}</h3>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-400">
              {game.current_price || "FREE"}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500">
              Was: {game.original_price || "Paid"}
            </p>
          </div>

          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-cyan-300"
          >
            Claim ↗
          </a>
        </div>
      </div>
    </article>
  );
}
