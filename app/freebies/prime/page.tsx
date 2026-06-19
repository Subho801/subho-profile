"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";

type PrimeGame = {
  title: string;
  platform: string;
  status: string;
  url: string;
  image: string;
  leaving: string;
  source: string;
};

type PrimeResponse = {
  updatedAt: string | null;
  count: number;
  items: PrimeGame[];
};

const LUNA_CLAIM_URL = "https://luna.amazon.com/claims/home";

const titleFixes: Record<string, string> = {
  "Sugardew Island - Your cozy farm shop": "Sugardew Island",
  "XCOM®: Chimera Squad": "XCOM: Chimera Squad",
  "GI Joe: Wrath of Cobra": "G.I. JOE: Wrath of Cobra",
};

function fixTitle(title: string) {
  return titleFixes[title] || title;
}

function parseLeavingDate(date: string) {
  return new Date(date.replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3"));
}

function getDaysLeft(date: string) {
  const end = parseLeavingDate(date).getTime();
  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
}

function platformName(platform: string) {
  if (platform === "Prime Gaming") return "Prime Gaming";
  return platform;
}

function platformPillClass(platform: string) {
  if (platform === "GOG") return "bg-cyan-500/15 text-cyan-300";
  if (platform === "Epic") return "bg-blue-500/15 text-blue-300";
  return "bg-purple-500/15 text-purple-300";
}

function platformGlow(platform: string) {
  if (platform === "GOG") {
    return "border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.30)]";
  }

  if (platform === "Epic") {
    return "border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.30)]";
  }

  return "border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.30)]";
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "GOG") {
    return <SiGogdotcom className="h-7 w-7 text-cyan-300" />;
  }

  if (platform === "Epic") {
    return <SiEpicgames className="h-7 w-7 text-blue-300" />;
  }

  return (
    <img
      src="/prime-gaming.png"
      alt="Prime Gaming"
      className="h-7 w-7 object-contain"
    />
  );
}

export default function PrimeGamingPage() {
  const [data, setData] = useState<PrimeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prime-gaming")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const items = useMemo(() => {
    return [...(data?.items || [])].sort(
      (a, b) =>
        parseLeavingDate(a.leaving).getTime() -
        parseLeavingDate(b.leaving).getTime()
    );
  }, [data]);

  const epicCount = items.filter((g) => g.platform === "Epic").length;
  const gogCount = items.filter((g) => g.platform === "GOG").length;
  const primeCount = items.filter((g) => g.platform === "Prime Gaming").length;

  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.16] via-purple-500/[0.08] to-transparent p-7">
          <div className="flex items-center gap-5">
  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-500/20 bg-black/30 backdrop-blur">
    <img
      src="/luna-logo.png"
      alt="Amazon Luna"
      className="h-12 w-12 object-contain"
    />
  </div>

  <div>
    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
      Amazon Luna
    </p>

    <h1 className="text-4xl font-black md:text-6xl">
      Prime Gaming Free Games
    </h1>
  </div>
</div>

          <p className="mt-4 max-w-2xl text-sm text-zinc-400">
            Current claimable Prime Gaming games, sorted by expiry date.
          </p>

          {data && (
            <div className="mt-7 grid gap-4 md:grid-cols-4">
              <Stat label="Total Games" value={items.length} />
              <Stat label="Epic Games" value={epicCount} />
              <Stat label="GOG Games" value={gogCount} />
              <Stat label="Prime Games" value={primeCount} />
            </div>
          )}
        </section>

        <h2 className="mb-5 text-2xl font-black">Expiring Soon</h2>

        {loading ? (
          <p className="text-zinc-500">Checking Prime Gaming games...</p>
        ) : items.length === 0 ? (
          <p className="text-zinc-500">No Prime Gaming games found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((game) => (
              <GameCard key={game.title} game={game} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function GameCard({ game }: { game: PrimeGame }) {
  const daysLeft = getDaysLeft(game.leaving);
  const isExpiringSoon = daysLeft <= 14;

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-[#101827] transition-all duration-300 hover:-translate-y-1 ${
        isExpiringSoon
          ? "border-red-400/30 hover:border-red-400/60"
          : "border-blue-400/20 hover:border-blue-400/50"
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-black">
        <img
          src={game.image}
          alt={fixTitle(game.title)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <div
          className={`absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-black/50 shadow-xl backdrop-blur-xl ${platformGlow(
            game.platform
          )}`}
        >
          <PlatformIcon platform={game.platform} />
        </div>
      </div>

      <div className="flex h-[215px] flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${platformPillClass(
              game.platform
            )}`}
          >
            {platformName(game.platform)}
          </span>

          {isExpiringSoon && (
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
              Expiring Soon
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-xl font-black">
          {fixTitle(game.title)}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-400">Claimable</p>
            <p className="mt-1 text-xs text-zinc-500">
              Ends {game.leaving} · {daysLeft} days left
            </p>
          </div>

          <a
            href={LUNA_CLAIM_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition-all hover:scale-105 hover:bg-blue-400"
          >
            Claim
          </a>
        </div>
      </div>
    </article>
  );
}