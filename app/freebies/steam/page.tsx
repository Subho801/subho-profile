"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";

function formatSteamDate(date?: string) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isActiveSteamFreebie(item: any) {
  const expiry = item.expiry ? new Date(item.expiry).getTime() : null;
  return !expiry || expiry > Date.now();
}

function SectionHeader({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-lime-400">
        {eyebrow}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />

        <p className="text-[13px] font-black uppercase tracking-wider text-white">
          {title}
        </p>

        {count && (
          <span className="ml-2 rounded-full border border-lime-400/15 bg-lime-400/[0.06] px-2 py-0.5 text-[11px] text-zinc-400">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SteamFreebiesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/steam-freebies")
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data.items || [])
          .filter(isActiveSteamFreebie)
          .sort((a: any, b: any) => {
            const aTime = a.expiry ? new Date(a.expiry).getTime() : Infinity;
            const bTime = b.expiry ? new Date(b.expiry).getTime() : Infinity;
            return aTime - bTime;
          });

        setGames(filtered);
        setLoading(false);
      })
      .catch(() => {
        setGames([]);
        setLoading(false);
      });
  }, []);

  const endingSoon = useMemo(() => {
    const now = Date.now();
    const twoDays = 1000 * 60 * 60 * 48;

    return games.filter((game) => {
      const expiry = game.expiry ? new Date(game.expiry).getTime() : null;
      return expiry && expiry - now <= twoDays;
    }).length;
  }, [games]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-lime-400/10 bg-gradient-to-br from-lime-400/[0.10] via-white/[0.03] to-transparent p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 ring-1 ring-lime-400/20">
              <FaSteam className="h-7 w-7 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-400">
                Steam Store
              </p>
              <h1 className="text-5xl font-bold">Steam 100% Off Games</h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Free-to-keep Steam games found automatically from your Steam freebies API.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{games.length}</div>
              <div className="text-sm text-white/45">Active Free Games</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{endingSoon}</div>
              <div className="text-sm text-white/45">Ending Soon</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-white/45">Discount</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-zinc-500">Loading Steam freebies...</div>
        ) : (
          <section className="mb-14">
            <SectionHeader
              eyebrow="Free To Keep"
              title="Steam 100% Off Games"
              count={`${games.length} free games`}
            />

            {games.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                No active Steam 100% off games right now.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {games.map((game) => {
                  const title = game.title || "Unknown Steam Game";
                  const image = game.image;
                  const gameLink =
                    game.url ||
                    game.itadUrl ||
                    "https://store.steampowered.com/";

                  return (
                    <article
                      key={game.id || game.slug || title}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:shadow-[0_0_35px_rgba(163,230,53,0.08)]"
                    >
                      {image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-4 top-4 rounded-xl bg-black/40 p-2 backdrop-blur">
                            <FaSteam className="h-6 w-6 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                          </div>
                        </div>
                      )}

                      <div className="flex h-[250px] flex-col p-5">
                        <div className="min-h-[58px]">
                          <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white">
                            {title}
                          </h2>

                          <p className="mt-1 text-xs text-zinc-500">
                            Free to keep
                            {game.expiry
                              ? ` · Ends ${formatSteamDate(game.expiry)}`
                              : ""}
                          </p>
                        </div>

                        <div className="mt-4 min-h-[70px] rounded-2xl border border-lime-400/10 bg-lime-400/[0.04] p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-lime-400">
                            Price
                          </div>

                          <div className="mt-1 text-sm">
                            <span className="mr-2 text-zinc-500 line-through">
                              {game.regularPrice
                                ? `${game.regularPrice} ${game.currency || ""}`
                                : "Paid"}
                            </span>

                            <span className="font-black text-lime-400">
                              FREE
                            </span>
                          </div>

                          <div className="text-xs text-zinc-500">
                            100% off / free to keep
                          </div>
                        </div>

                        <a
                          href={gameLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-auto inline-flex w-fit items-center justify-center rounded-xl bg-lime-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-lime-300"
                        >
                          Get Game
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}