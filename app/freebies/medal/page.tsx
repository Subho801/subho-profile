
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";
import { Award, KeyRound, Gamepad2, History } from "lucide-react";

function cleanText(text?: string) {
  if (!text) return "";
  return text.replace(/^Quest:\s*/i, "").replace(/<[^>]*>/g, "").trim();
}

function formatDate(ms?: number) {
  if (!ms) return "Unknown";

  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isActiveQuest(quest: any) {
  const endsAt = quest.config?.endsAt;

  // If no expiry is provided, keep it in the live section.
  if (!endsAt) return true;

  return Number(endsAt) > Date.now();
}



function getQuestPriority(quest: any) {
  const config = quest.config || {};
  const reward = config.reward || {};
  const messages = config.messages || {};
  const rewardMessages = reward.messages || {};

  // Only the quest TITLE determines whether it is a game key.
  const title = String(messages.name || "").toLowerCase();

  // Priority 5: Explicit game-key giveaways only.
  if (
    /\bgame\s*keys?\b/i.test(title) ||
    /\bsteam\s*keys?\b/i.test(title) ||
    /\bcd\s*keys?\b/i.test(title) ||
    /\bproduct\s*keys?\b/i.test(title) ||
    /\bkeys?\s+giveaway\b/i.test(title) ||
    /\bgiveaway\b.*\bkeys?\b/i.test(title)
  ) {
    return 5;
  }

  // Use the remaining metadata only for non-key categories.
  const text = [
    title,
    messages.description,
    messages.detailedDescription,
    rewardMessages.name,
    rewardMessages.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/\broblox\b|\brobux\b|\bugc\b/i.test(text)) {
    return 4;
  }

  if (
    /\b(game|gaming|steam|xbox|playstation|dlc|skin|cosmetic|in-game|gamepass|game pass|fortnite|minecraft|valorant|epic games|gog|weapon|loot)\b/i.test(
      text
    )
  ) {
    return 3;
  }

  if (/\bpremium\b|\bsubscription\b|\bmembership\b/i.test(text)) {
    return 2;
  }

  if (
    /\bprofile background\b|\bbackground\b|\bbadge\b|\bdecoration\b/i.test(
      text
    )
  ) {
    return 1;
  }

  return 0;
}



function sortQuests(items: any[], expired = false) {
  return [...items].sort((a, b) => {
    const priorityDifference =
      getQuestPriority(b) - getQuestPriority(a);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const aEnd = Number(a.config?.endsAt) || 0;
    const bEnd = Number(b.config?.endsAt) || 0;

    // Live quests: ending soon first.
    // Expired quests: most recently expired first.
    return expired ? bEnd - aEnd : aEnd - bEnd;
  });
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
  const expired = title.toLowerCase().includes("expired");

  return (
    <div className="mb-6">
      <p
        className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${
          expired ? "text-red-400" : "text-lime-400"
        }`}
      >
        {eyebrow}
      </p>

      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 animate-pulse rounded-full ${
            expired
              ? "bg-red-400 shadow-[0_0_10px_#f87171]"
              : "bg-lime-400 shadow-[0_0_10px_#a3e635]"
          }`}
        />

        <p className="text-[13px] font-black uppercase tracking-wider text-white">
          {title}
        </p>

        {count && (
          <span
            className={`ml-2 rounded-full border px-2 py-0.5 text-[11px] text-zinc-400 ${
              expired
                ? "border-red-400/15 bg-red-400/[0.06]"
                : "border-lime-400/15 bg-lime-400/[0.06]"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MedalFreebiesPage() {
  const [quests, setQuests] = useState<any[]>([]);
  const [apiExpiredQuests, setApiExpiredQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/medal-quests")
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch Medal quests");
        }

        return r.json();
      })
            .then((data) => {
        if (cancelled) return;

        const activeItems = Array.isArray(data.active?.items)
          ? data.active.items
          : Array.isArray(data.active)
          ? data.active
          : Array.isArray(data.items)
          ? data.items
          : [];

        const expiredItems = Array.isArray(data.expired?.items)
          ? data.expired.items
          : Array.isArray(data.expired)
          ? data.expired
          : [];

        setQuests(activeItems);
        setApiExpiredQuests(expiredItems);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;

        console.error("Medal API error:", err);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const liveQuests = useMemo(
    () => sortQuests(quests.filter(isActiveQuest)),
    [quests]
  );

  const expiredQuests = useMemo(() => {
  const now = Date.now();

  // Combine explicitly returned expired quests with quests
  // whose end time has passed in the active response.
  const combined = [...apiExpiredQuests, ...quests].filter(
    (quest) => {
      const endsAt = Number(quest.config?.endsAt);

      return (
        endsAt > 0 &&
        endsAt <= now
      );
    }
  );

  // Deduplicate quests that appear in both API responses.
  const unique = Array.from(
    new Map(
      combined.map((quest) => [
        String(quest.id),
        quest,
      ])
    ).values()
  );

  return sortQuests(unique, true);
}, [quests, apiExpiredQuests]);

  const endingSoon = useMemo(() => {
    const now = Date.now();
    const twoDays = 48 * 60 * 60 * 1000;

    return liveQuests.filter((quest) => {
      const endsAt = Number(quest.config?.endsAt);

      return (
        endsAt > now &&
        endsAt - now <= twoDays
      );
    }).length;
  }, [liveQuests]);

  const gameKeyCount = useMemo(
    () =>
      liveQuests.filter((quest) => getQuestPriority(quest) === 5).length,
    [liveQuests]
  );

  const renderQuestCard = (quest: any, expired = false) => {
    const config = quest.config || {};
    const reward = config.reward || {};
    const rewardMsg = reward.messages || {};

    const title = config.messages?.name || "Unknown Quest";
    const questText = cleanText(
      config.messages?.detailedDescription ||
      config.messages?.description
    );

    const banner = config.assets?.banner;
    const rewardIcon = reward.assets?.icon;

    const questLink = `https://medal.tv/quests?questId=${encodeURIComponent(
      String(quest.id)
    )}`;

    const rewardLink =
      reward.rewardLink ||
      reward.actionLink ||
      questLink;

    const priority = getQuestPriority(quest);

    
const priorityLabel =
  priority === 5
    ? "GAME KEY"
    : priority === 4
    ? "ROBLOX / ROBUX"
    : priority === 3
    ? "GAMING REWARD"
    : priority === 2
    ? "PREMIUM"
    : priority === 1
    ? "PROFILE REWARD"
    : "OTHER QUEST";


    return (
      <article
        key={quest.id ?? title}
        className={`group flex flex-col overflow-hidden rounded-3xl border bg-[#121212] transition-all duration-300 hover:-translate-y-1 ${
          expired
            ? "border-white/10 hover:border-red-400/35 hover:shadow-[0_0_35px_rgba(248,113,113,0.10)]"
            : "border-white/10 hover:border-lime-400/30 hover:shadow-[0_0_35px_rgba(163,230,53,0.10)]"
        }`}
      >
        {banner ? (
          <div className="relative h-48 overflow-hidden bg-black/30">
            <Image
              src={banner}
              alt={title}
              fill
              unoptimized
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                expired ? "grayscale-[35%]" : ""
              }`}
            />

            <div className="absolute left-4 top-4">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${
                  expired
                    ? "border-red-400/30 bg-red-500/20 text-red-300"
                    : "border-green-400/30 bg-green-500/20 text-green-300"
                }`}
              >
                {expired ? "EXPIRED" : "● LIVE"}
              </span>
            </div>

            <div className="absolute right-4 top-4 rounded-xl bg-black/50 p-2 backdrop-blur">
              {priority === 3 ? (
                <FaSteam className="h-5 w-5 text-lime-300" />
              ) : (
                <Gamepad2 className="h-5 w-5 text-lime-300" />
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex h-28 items-center gap-3 bg-white/[0.025] px-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <Award className="h-7 w-7 text-lime-400" />
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                expired
                  ? "border-red-400/30 bg-red-500/10 text-red-300"
                  : "border-green-400/30 bg-green-500/10 text-green-300"
              }`}
            >
              {expired ? "EXPIRED" : "● LIVE"}
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            {rewardIcon && (
              <Image
                src={rewardIcon}
                alt=""
                width={42}
                height={42}
                unoptimized
                className="shrink-0 rounded-lg border border-white/10"
              />
            )}

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white">
                {title}
              </h2>

              <p
                className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                  priority === 3
                    ? "text-lime-400"
                    : priority === 2
                    ? "text-purple-400"
                    : priority === 1
                    ? "text-sky-400"
                    : "text-zinc-500"
                }`}
              >
                {priorityLabel}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            {expired ? "Expired:" : "Ends:"}{" "}
            {formatDate(config.endsAt)}
          </p>

          <p className="mt-4 min-h-[48px] line-clamp-2 text-sm text-zinc-400">
            {questText || rewardMsg.description || "Medal TV quest reward."}
          </p>

          <a
            href={rewardLink}
            target="_blank"
            rel="noreferrer"
            className={`mt-4 block rounded-2xl border p-3 transition-all duration-300 ${
              expired
                ? "border-red-400/10 bg-red-400/[0.025] hover:border-red-400/25"
                : "border-lime-400/10 bg-lime-400/[0.04] hover:border-lime-400/30 hover:bg-lime-400/[0.08]"
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  expired ? "text-red-300" : "text-lime-400"
                }`}
              >
                Reward
              </span>

              <span
                className={`text-[10px] ${
                  expired ? "text-red-300/70" : "text-lime-400"
                }`}
              >
                Open ↗
              </span>
            </div>

            <div className="font-semibold text-white">
              {rewardMsg.name || "Unknown Reward"}
            </div>

            <div className="text-sm text-zinc-400">
              {rewardMsg.description || "View reward details"}
            </div>
          </a>

          <a
            href={questLink}
            target="_blank"
            rel="noreferrer"
            className={`mt-4 inline-flex w-fit items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition-all hover:scale-105 ${
              expired
                ? "border border-red-400/20 bg-red-400/[0.06] text-red-300 hover:bg-red-400/10"
                : "bg-lime-400 text-black hover:bg-lime-300"
            }`}
          >
            {expired ? (
              <>
                <History className="h-4 w-4" />
                View Expired Quest
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                View Quest
              </>
            )}
          </a>
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/freebies"
          className="mb-10 inline-flex text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Freebies Hub
        </Link>

        <section className="mb-12 rounded-[32px] border border-lime-400/10 bg-gradient-to-br from-lime-400/[0.10] via-white/[0.03] to-transparent p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 ring-1 ring-lime-400/20">
  <Image
    src="/medal.png"
    alt="Medal TV"
    width={32}
    height={32}
    unoptimized
    className="h-8 w-8 object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(132,204,22,0.8)]"
  />
</div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-400">
                Medal TV
              </p>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Medal TV Rewards
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Discover Medal TV game keys, Roblox rewards, gaming items,
            and other quests. Live and expired rewards are organized
            separately and ranked by reward type.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold">{liveQuests.length}</div>
              <div className="text-sm text-white/45">Live Quests</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold text-lime-400">
                {gameKeyCount}
              </div>
              <div className="text-sm text-white/45">Game Key Quests</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold text-amber-400">
                {endingSoon}
              </div>
              <div className="text-sm text-white/45">Ending Within 48 Hours</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-2xl font-bold text-red-400">
                {expiredQuests.length}
              </div>
              <div className="text-sm text-white/45">Expired Quests</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center gap-3 py-10 text-zinc-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
            Loading Medal TV rewards...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-8 text-red-300">
            Failed to load Medal TV rewards. Check your API route and try again.
          </div>
        ) : (
          <>
            <section className="mb-14">
              <SectionHeader
                eyebrow="Live Right Now"
                title="Live Medal TV Rewards"
                count={`${liveQuests.length} quests`}
              />

              {liveQuests.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No live Medal TV quests were returned by the API.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {liveQuests.map((quest) => renderQuestCard(quest))}
                </div>
              )}
            </section>

            <section className="mb-14">
              <SectionHeader
                eyebrow="Past Rewards"
                title="Expired Giveaways"
                count={`${expiredQuests.length} expired`}
              />

              {expiredQuests.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-zinc-400">
                  No expired Medal TV quests were returned by the API.
                  Expired rewards will appear here when available in the API response.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {expiredQuests.map((quest) =>
                    renderQuestCard(quest, true)
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
