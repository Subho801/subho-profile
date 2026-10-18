"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiAmd } from "react-icons/si";

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
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-orange-400">
        {eyebrow}
      </p>

      <div className="flex items-center gap-2">
        <span
  className={`h-2 w-2 animate-pulse rounded-full ${
    title.toLowerCase().includes("expired")
      ? "bg-red-400 shadow-[0_0_10px_#f87171]"
      : "bg-green-400 shadow-[0_0_10px_#4ade80]"
  }`}
/>

        <p className="text-[13px] font-black uppercase tracking-wider text-white">
          {title}
        </p>

        {count && (
          <span className="ml-2 rounded-full border border-orange-400/20 bg-orange-400/[0.08] px-2 py-0.5 text-[11px] text-zinc-400">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AMDRewardsPage() {
  const [amdPromos, setAmdPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/amd-promotions")
      .then((r) => r.json())
      .then((data) => {
        setAmdPromos(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setAmdPromos([]);
        setLoading(false);
      });
  }, []);

  const activePromos = useMemo(
    () =>
      amdPromos.filter((item) => {
        const status = String(item.status || "").toLowerCase();
        const keys = Number(item.keysAvailable || 0);

        return status === "active" && keys > 0;
      }),
    [amdPromos]
  );

  const expiredPromos = useMemo(
    () =>
      amdPromos.filter((item) => {
        const status = String(item.status || "").toLowerCase();
        const keys = Number(item.keysAvailable || 0);

        return (
          status === "expired" ||
          status === "ended" ||
          (status === "active" && keys <= 0)
        );
      }),
    [amdPromos]
  );

  const totalKeys = useMemo(
    () =>
      activePromos.reduce(
        (sum, item) => sum + Number(item.keysAvailable || 0),
        0
      ),
    [activePromos]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        {/* Hero */}
        <section className="mb-12 rounded-[32px] border border-orange-400/10 bg-gradient-to-br from-orange-500/[0.12] via-white/[0.03] to-transparent p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 ring-1 ring-orange-400/20">
              <SiAmd className="h-8 w-8 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-400">
                AMD Gaming
              </p>
              <h1 className="text-5xl font-bold">AMD Key Giveaways</h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Active AMD Gaming rewards and key drops fetched automatically from your AMD promotions API.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{activePromos.length}</div>
              <div className="text-sm text-white/45">Available Rewards</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">🔑 {totalKeys.toLocaleString()}</div>
              <div className="text-sm text-white/45">Total Keys</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">Active</div>
              <div className="text-sm text-white/45">Reward Status</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-zinc-500">Loading AMD rewards...</div>
        ) : (
          <>
            {/* Active Giveaways */}
            <section className="mb-14">
              <SectionHeader
                eyebrow="AMD Gaming"
                title="AMD Key Giveaways"
                count={`${activePromos.length} available`}
              />

              {activePromos.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No active AMD Gaming key giveaways right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {activePromos.map((item) => {
                    const title = item.title || "Unknown AMD Promotion";
                    const image = item.thumbnailImageUrl;
                    const keys = Number(item.keysAvailable || 0);
                    const platform = item.platform || "Unknown";
                    const slug = item.slug || "";

                    const promoLink = slug
                      ? `https://www.amdgaming.com/promotions/${slug}`
                      : "https://www.amdgaming.com/promotions";

                    return (
                      <article
                        key={item.id || slug || title}
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/35 hover:shadow-[0_0_35px_rgba(251,146,60,0.10)]"
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
                            <div className="absolute left-4 top-4">
                              <SiAmd className="h-8 w-8 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                            </div>
                          </div>
                        )}

                        <div className="flex h-[270px] flex-col p-5">
                          <div className="min-h-[72px]">
                            <h2 className="line-clamp-2 text-lg font-bold text-white">
                              {title}
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                              Platform: {platform}
                            </p>
                          </div>

                          <div className="mt-4 min-h-[84px] rounded-2xl border border-orange-400/10 bg-orange-400/[0.04] p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                              Keys Available
                            </div>

                            <div className="mt-1 text-2xl font-black text-orange-400">
                              🔑 {keys.toLocaleString()}
                            </div>
                          </div>

                          <a
                            href={promoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-auto inline-flex w-fit rounded-xl bg-orange-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-orange-300"
                          >
                            View Reward
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Expired Giveaways */}
            <section className="mb-14">
              <SectionHeader
                eyebrow="AMD Gaming"
                title="Expired Giveaways"
                count={`${expiredPromos.length} expired`}
              />

              {expiredPromos.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No expired giveaways found.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {expiredPromos.map((item) => {
                    const title = item.title || "Unknown AMD Promotion";
                    const image = item.thumbnailImageUrl;
                    const platform = item.platform || "Unknown";
                    const slug = item.slug || "";

                    const promoLink = slug
                      ? `https://www.amdgaming.com/promotions/${slug}`
                      : "https://www.amdgaming.com/promotions";

                    return (
                      <article
                        key={item.id || slug || title}
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/35 hover:shadow-[0_0_35px_rgba(251,146,60,0.10)]"
                      >
                        {image && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={image}
                              alt={title}
                              fill
                              unoptimized
                              className="object-cover grayscale-[35%] transition-transform duration-500 group-hover:scale-105"
                            />

                            <div className="absolute left-4 top-4">
                              <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300 backdrop-blur">
                                EXPIRED
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex h-[270px] flex-col p-5">
                          <div className="min-h-[72px]">
                            <h2 className="line-clamp-2 text-lg font-bold text-white">
                              {title}
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                              Platform: {platform}
                            </p>
                          </div>

                          <div className="mt-4 min-h-[84px] rounded-2xl border border-orange-400/10 bg-orange-400/[0.04] p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                              Keys Left
                            </div>

                            <div className="mt-1 text-2xl font-black text-red-400">
                              🔑 0
                            </div>
                          </div>

                          <a
                            href={promoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-auto inline-flex w-fit rounded-xl bg-orange-400 px-6 py-3 text-sm font-black text-black transition-all hover:scale-105 hover:bg-orange-300"
                          >
                            View Promotion
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}