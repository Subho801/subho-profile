
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, KeyRound } from "lucide-react";
import Image from "next/image";

type Game = {
  appId: string;
  name: string;
  steamUrl: string;
  headerImage?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  shortDescription?: string;
};

type Giveaway = {
  id: string;
  title: string;
  url: string;
  status: string;
  keys?: number;
  remainingSlots?: number;
  requirement?: string;
  endDate?: string;
  image?: string;
  description?: string;
  games?: Game[];
};

type Feed = {
  updatedAt: string;
  giveaways: Giveaway[];
};

function timeAgo(dateString: string, now: number) {
  const timestamp = new Date(dateString).getTime();

  if (!Number.isFinite(timestamp)) return "unknown";

  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function KeyXPPage() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let mounted = true;

    async function loadGiveaways() {
      try {
        const response = await fetch("/api/keyxp", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("KeyXP feed is unavailable.");
        }

        const result: Feed = await response.json();

        if (!Array.isArray(result.giveaways)) {
          throw new Error("Invalid KeyXP response.");
        }

        if (mounted) {
          setFeed(result);
          setError("");
        }
      } catch {
        if (mounted) {
          setError("Couldn't load KeyXP giveaways. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadGiveaways();

    // Fetch updated giveaway data every 60 seconds.
    const dataTimer = window.setInterval(() => {
      void loadGiveaways();
    }, 60_000);

    // Update the relative timestamp every 30 seconds.
    const clockTimer = window.setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => {
      mounted = false;
      window.clearInterval(dataTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  const giveaways = feed?.giveaways ?? [];

  const remaining = giveaways.reduce(
    (total, giveaway) => total + (giveaway.remainingSlots ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <Link
          href="/freebies"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Freebies Hub
        </Link>

        <section className="mt-8 rounded-[32px] border border-lime-400/15 bg-gradient-to-br from-lime-400/[0.12] via-white/[0.03] to-transparent p-6 sm:p-9">
          <div>
            <div className="flex items-center gap-3">
  <Image
    src="/keyxp.png"
    alt="KeyXP logo"
    width={32}
    height={32}
    className="rounded-lg object-contain"
  />

  <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-400">
    KeyXP Tracker
  </p>
</div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              KeyXP-Giveaways
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Get free Steam game keys for answering surveys!
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-zinc-500">Active giveaways</p>
              <p className="mt-2 text-3xl font-black">
                {loading
                  ? "—"
                  : giveaways.filter((g) => g.status === "active").length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-zinc-500">Keys remaining</p>
              <p className="mt-2 text-3xl font-black text-lime-300">
  {loading
    ? "—"
    : `${remaining.toLocaleString()} / ${giveaways
        .reduce((total, giveaway) => total + (giveaway.keys ?? 0), 0)
        .toLocaleString()}`}
</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm text-zinc-500">Last Updated</p>
              <p
                className="mt-2 text-2xl font-black text-white/80"
                title={
                  feed?.updatedAt
                    ? new Date(feed.updatedAt).toLocaleString()
                    : undefined
                }
              >
                {feed?.updatedAt
                  ? timeAgo(feed.updatedAt, now)
                  : "Waiting for data"}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && !feed ? (
          <p className="mt-8 text-zinc-500">Loading KeyXP giveaways...</p>
        ) : !error && giveaways.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-xl font-bold">No giveaways found</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Check back later for new KeyXP drops.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {giveaways.map((giveaway) => (
              <article
                key={giveaway.id}
                className="overflow-hidden rounded-[28px] border border-lime-400/15 bg-[#121212] transition hover:border-lime-400/30"
              >
                {giveaway.image && (
                  <img
                    src={giveaway.image}
                    alt={giveaway.title}
                    className="h-48 w-full object-cover sm:h-64"
                  />
                )}

                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase text-lime-300">
                      {giveaway.status}
                    </span>

                    {giveaway.remainingSlots != null && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                        {giveaway.remainingSlots.toLocaleString()} keys left
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                    {giveaway.title}
                  </h2>

                  {giveaway.description && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                      {giveaway.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-zinc-500">Key availability</p>
                      <p className="mt-1 text-lg font-bold text-lime-300">
                        {giveaway.remainingSlots?.toLocaleString() ?? "Unknown"}
                        {giveaway.keys != null &&
                          ` / ${giveaway.keys.toLocaleString()}`}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-zinc-500">Requirements</p>
                      <p className="mt-1 text-sm text-zinc-200">
                        {giveaway.requirement || "Check the giveaway page"}
                      </p>
                    </div>
                  </div>

                  {giveaway.games && giveaway.games.length > 0 && (
                    <section className="mt-7">
                      <h3 className="text-lg font-bold">
                        Included games
                        <span className="ml-2 text-sm font-normal text-zinc-500">
                          ({giveaway.games.length})
                        </span>
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {giveaway.games.map((game) => (
                          <div
                            key={game.appId}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-black/25"
                          >
                            {game.headerImage && (
                              <a
                                href={game.steamUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={game.headerImage}
                                  alt={game.name}
                                  loading="lazy"
                                  className="aspect-[460/215] w-full object-cover"
                                />
                              </a>
                            )}

                            <div className="p-4">
                              <h4 className="font-bold leading-5">
                                {game.name}
                              </h4>

                              {game.releaseDate && (
                                <p className="mt-2 text-xs text-zinc-500">
                                  Released: {game.releaseDate}
                                </p>
                              )}

                              {game.shortDescription && (
                                <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-400">
                                  {game.shortDescription}
                                </p>
                              )}

                              <a
                                href={game.steamUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime-300 hover:text-lime-200"
                              >
                                View on Steam
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <a
                    href={giveaway.url || "https://keyxp.co"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02] hover:bg-lime-300"
                  >
                    Visit KeyXP Giveaway
                    <ExternalLink size={16} />
                  </a>

                  <p className="mt-3 text-xs text-zinc-600">
                    Availability can change. Confirm the requirements and
                    remaining keys on KeyXP before entering.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-600">
          Data supplied by the Subho.site KeyXP tracker.
        </p>
      </div>
    </main>
  );
}
