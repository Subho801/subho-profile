"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiEpicgames } from "react-icons/si";

function formatDate(ms?: number) {
  if (!ms) return "Unknown";

  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getEpicImage(game: any) {
  const images = game.keyImages || [];

  return (
    images.find((img: any) => img.type === "OfferImageWide")?.url ||
    images.find((img: any) => img.type === "DieselStoreFrontWide")?.url ||
    images[0]?.url ||
    ""
  );
}

function getEpicUrl(game: any) {
  const slug =
    game.catalogNs?.mappings?.[0]?.pageSlug ||
    game.productSlug ||
    game.urlSlug;

  return slug
    ? `https://store.epicgames.com/en-US/p/${slug}`
    : "https://store.epicgames.com/free-games";
}

function parseEpicGames(data: any) {
  const games = data?.data?.Catalog?.searchStore?.elements || [];
  const now = Date.now();

  const freeNow: any[] = [];
  const comingSoon: any[] = [];

  games.forEach((game: any) => {
    const promo = game.promotions;
    const current = promo?.promotionalOffers?.[0]?.promotionalOffers?.[0];
    const upcoming =
      promo?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0];

    if (current) {
      const start = new Date(current.startDate).getTime();
      const end = new Date(current.endDate).getTime();

      if (start <= now && end > now) {
        freeNow.push({ ...game, promoStart: start, promoEnd: end });
      }
    }

    if (upcoming) {
      const start = new Date(upcoming.startDate).getTime();
      const end = new Date(upcoming.endDate).getTime();

      if (start > now) {
        comingSoon.push({ ...game, promoStart: start, promoEnd: end });
      }
    }
  });

  return { freeNow, comingSoon };
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
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-400">
        {eyebrow}
      </p>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />

        <p className="text-[13px] font-black uppercase tracking-wider text-white">
          {title}
        </p>

        {count && (
          <span className="ml-2 rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-zinc-400">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EpicFreebiesPage() {
  const [freeNow, setFreeNow] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/epic-freebies")
      .then((r) => r.json())
      .then((data) => {
        const parsed = parseEpicGames(data);
        setFreeNow(parsed.freeNow);
        setComingSoon(parsed.comingSoon);
        setLoading(false);
      })
      .catch(() => {
        setFreeNow([]);
        setComingSoon([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <SiEpicgames className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
                Epic Games Store
              </p>
              <h1 className="text-5xl font-bold">Epic Games Freebies</h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Current free games and upcoming Epic Games Store freebies fetched
            automatically from your Epic API.
          </p>

          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400">
            {freeNow.length + comingSoon.length} active / upcoming Epic freebies
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-500">Loading Epic freebies...</div>
        ) : (
          <>
            <section className="mb-14">
              <SectionHeader
                eyebrow="This Week"
                title="Free Right Now"
                count={`${freeNow.length} Epic freebies`}
              />

              {freeNow.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No Epic freebies found right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {freeNow.map((game) => (
                    <article
                      key={game.id}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getEpicImage(game)}
                          alt={game.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <SiEpicgames className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-lg font-bold text-white">
                          {game.title}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          Free until {formatDate(game.promoEnd)}
                        </p>

                        <div className="mt-3 text-sm">
                          <span className="mr-2 text-zinc-500 line-through">
                            Paid
                          </span>
                          <span className="font-black text-cyan-400">FREE</span>
                        </div>

                        <a
                          href={getEpicUrl(game)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-black transition-all hover:scale-105 hover:bg-cyan-300"
                        >
                          Get Game
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-14 border-t border-white/10 pt-10">
              <SectionHeader
                eyebrow="Coming Soon"
                title="Epic Upcoming Freebies"
                count={`${comingSoon.length} upcoming`}
              />

              {comingSoon.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No upcoming Epic freebies found.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {comingSoon.map((game) => (
                    <article
                      key={game.id}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getEpicImage(game)}
                          alt={game.title}
                          fill
                          unoptimized
                          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <SiEpicgames className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-lg font-bold text-white">
                          {game.title}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          Free from {formatDate(game.promoStart)}
                        </p>

                        <a
                          href={getEpicUrl(game)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex rounded-xl border border-cyan-400/40 px-4 py-2 text-sm font-black text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
                        >
                          View Store
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}