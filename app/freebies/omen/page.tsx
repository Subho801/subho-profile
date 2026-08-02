"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";


type Giveaway = {
  codename: string;
  game: string;
  title: string;
  description: string;
  button: string;
  image: string;
  expire: number;
};

type OmenData = {
  updated: number;
  count: number;
  items: Giveaway[];
};

function timeAgo(timestamp: number) {
  const diff = Math.floor((Date.now() / 1000) - timestamp);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
}

function timeRemaining(timestamp: number) {
  const diff = timestamp - Math.floor(Date.now() / 1000);

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / 86400);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;

  const hours = Math.floor((diff % 86400) / 3600);

  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;

  const mins = Math.floor((diff % 3600) / 60);

  return `${mins} min`;
}

export default function OmenPage() {
  const [data, setData] = useState<OmenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/omen")
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
    return data.items;
  }, [data]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        Loading HP OMEN...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-red-400">
        Failed to load HP OMEN giveaways.
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
                src="/omen.png"
                alt="HP OMEN"
                width={38}
                height={38}
              />

            </div>

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
                HP OMEN
              </p>

              <h1 className="text-5xl font-bold">
                Sweepstakes
              </h1>

            </div>

          </div>

          <p className="max-w-2xl text-sm text-zinc-400">
            Live HP OMEN Gaming Hub giveaways powered directly from HP's API.
          </p>

          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">

            <span>🕒</span>

            <span>
              Updated {timeAgo(data.updated)}
            </span>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold">
                🎟 {data.count}
              </div>

              <div className="text-sm text-zinc-500">
                Current Giveaway{data.count !== 1 ? "s" : ""}
              </div>

            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold text-green-400">
                 🟢 Live
              </div>

              <div className="text-sm text-zinc-500">
                Status
              </div>

            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >

              <div className="text-2xl font-bold">
                ⏰ {giveaways.length ? timeRemaining(giveaways[0].expire) : "-"}
              </div>

              <div className="text-sm text-zinc-500">
                Ends In
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
              No giveaways found
            </h2>

            <p className="mt-2 text-zinc-500">
              Try another search term.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <AnimatePresence mode="popLayout">

              {giveaways.map((giveaway) => {

                const active =
                  giveaway.expire > Date.now() / 1000;

                return (

                  <motion.article
                    key={giveaway.codename}
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
                        alt={giveaway.game}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${
                            active
                              ? "border-green-500/30 bg-green-500/10 text-green-400"
                              : "border-red-500/30 bg-red-500/10 text-red-400"
                          }`}
                        >
                          {active ? "🟢 Active" : "🔴 Ended"}
                        </span>

                      </div>

                    </div>

                    <div className="flex flex-col p-5">

                      <div className="min-h-[72px]">

                        <h2 className="line-clamp-2 text-xl font-bold text-white">

                          {giveaway.game}

                        </h2>

                        <p className="mt-2 line-clamp-3 text-sm text-zinc-500">

                          {giveaway.description}

                        </p>

                      </div>

                      <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.05] px-5 py-4">

                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">

                          Ends In

                        </div>

                        <div className="mt-2 flex items-center gap-2 text-3xl font-black text-cyan-400">

                          <span>⏰</span>

                          <span>
                            {timeRemaining(giveaway.expire)}
                          </span>

                        </div>

                        <div className="mt-2 text-sm text-zinc-500">

                          {new Date(
                            giveaway.expire * 1000
                          ).toLocaleString()}

                        </div>

                      </div>

                      <a
                        href={giveaway.button}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 text-sm font-black text-black transition hover:bg-cyan-400"
                      >

                        Enter Giveaway

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
