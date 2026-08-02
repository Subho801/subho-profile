"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";


type Giveaway = {
  id: number;
  title: string;
  raw_title?: string;
  url: string;
  image: string;
  publishedAt: string;
  arp_required: number | null;
  keys_left: number | null;
  source: string;
};

type AwaData = {
  count: number;
  items: Giveaway[];
};

export default function AlienwarePage() {
  const [data, setData] = useState<AwaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/awa")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const giveaways = useMemo(() => {
  if (!data) return [];

  return [...data.items].sort((a, b) => {
    const score = (g: Giveaway) => {
      let s = 0;

      // Live giveaways first
      if (g.keys_left !== null && g.keys_left > 0) s += 100;

      // Steam games first
      if (g.raw_title?.toLowerCase().includes("steam")) s += 50;

      // Game key giveaways
      if (g.raw_title?.toLowerCase().includes("key giveaway")) s += 20;

      // More keys = higher
      s += g.keys_left ?? 0;

      return s;
    };

    return score(b) - score(a);
  });
}, [data]);
const liveCount = giveaways.filter(
  (g) => g.keys_left !== null && g.keys_left > 0
).length;

const totalKeys = giveaways.reduce(
  (sum, g) => sum + (g.keys_left ?? 0),
  0
);
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Loading Alienware Arena...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-red-400">
        Failed to load Alienware giveaways.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        {/* Hero */}

        <section className="mb-10 rounded-[32px] border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.10] via-white/[0.03] to-transparent p-7">

          <div className="mb-5 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/20">

              <Image
                src="/alienware.png"
                alt="ALIENWARE"
                width={38}
                height={38}
              />

            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
                ALIENWARE
              </p>

              <h1 className="text-5xl font-bold">
                Live Giveaways
              </h1>

            </div>

          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Live Alienware Arena key giveaways updated automatically.
          </p>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold">
                🎮 {data.count}
              </div>

              <div className="text-sm text-zinc-500">
                Active Giveaways{data.count !== 1 ? "s" : ""}
              </div>

            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold text-green-400">
  🟢 {liveCount}
</div>

<div className="text-sm text-zinc-500">
  Live Giveaways
</div>

            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold text-cyan-400">
  🔑 {totalKeys.toLocaleString()}
</div>

<div className="text-sm text-zinc-500">
  Keys Remaining
</div>

            </motion.div>

          </div>

        </section>

                {/* Giveaways */}

        {giveaways.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-[#121212] p-12 text-center">

            <div className="text-6xl">
              😢
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              No Active Giveaways
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-zinc-500">
              Alienware Arena doesn't have any featured giveaways right now.
              <br />
              We'll automatically update this page as soon as new giveaways appear.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <AnimatePresence mode="popLayout">

              {giveaways.map((giveaway) => {

               

                return (

                  <motion.article
                    key={giveaway.id}
                    layout="position"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,.12)]"
                  >

                   <div className="relative h-56 overflow-hidden">

  <Image
    src={giveaway.image}
    alt={giveaway.title}
    fill
    unoptimized
    className="object-cover transition-transform duration-500 group-hover:scale-105"
  />

  <div className="absolute left-4 top-4">
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${
        giveaway.keys_left === null || giveaway.keys_left <= 0
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-green-500/30 bg-green-500/10 text-green-400"
      }`}
    >
      {giveaway.keys_left === null || giveaway.keys_left <= 0
        ? "🔴 OUT OF KEYS"
        : "🟢 LIVE"}
    </span>
  </div>
      <div className="absolute right-4 top-4">
  {giveaway.raw_title?.toLowerCase().includes("steam") && (
    <div className="rounded-full border border-[#1b4d72] bg-[#171a21]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
      STEAM
    </div>
  )}
</div>

</div>

                  

                    <div className="flex flex-col p-5">

                      <div className="min-h-[72px]">

                        <h2 className="line-clamp-2 text-xl font-bold text-white">

                          {giveaway.title}

                        </h2>

                        <div className="mt-2 text-sm text-zinc-500">
  <span className="font-semibold text-zinc-400">
    Published:
  </span>{" "}
  {new Date(giveaway.publishedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</div>

                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">

  <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.05] p-4">

    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
  <Image
    src="/icons/arp.png"
    alt="ARP"
    width={14}
    height={14}
  />
  <span>ARP Required</span>
</div>

    <div className="mt-2 text-3xl font-black text-cyan-400">
      {giveaway.arp_required ?? "Free"}
    </div>

  </div>

  <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.05] p-4">

    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
      Keys Left
    </div>

    <div
  className={`mt-2 text-3xl font-black ${
    giveaway.keys_left === null || giveaway.keys_left <= 0
      ? "text-zinc-500"
      : giveaway.keys_left >= 3000
      ? "text-green-400"
      : giveaway.keys_left >= 1000
      ? "text-yellow-400"
      : "text-red-400"
  }`}
>
  {giveaway.keys_left ?? 0}
</div>

  </div>

</div>

                        

                      

                      <a
                        href={giveaway.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 text-sm font-black text-black transition hover:bg-cyan-400"
                      >

                        Open Giveaway

                        <ArrowUpRight className="h-4 w-4" />

                      </a>

                    </div>

                  </motion.article>

                );

              })}

            </AnimatePresence>

          </div>

        )}

      </div>

    </main>

  );

}
