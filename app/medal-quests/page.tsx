"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaSteam } from "react-icons/fa";
import { SiEpicgames, SiAmd } from "react-icons/si";

function cleanText(text?: string) {
  if (!text) return "";
  return text.replace(/^Quest:\s*/i, "").replace(/<[^>]*>/g, "").trim();
}

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

function isActiveQuest(quest: any) {
  const endsAt = quest.config?.endsAt;
  if (!endsAt) return true;
  return Number(endsAt) > Date.now();
}

function isGameKeyGiveaway(quest: any) {
  const config = quest.config || {};
  const title = config.messages?.name || "";
  const reward = config.reward || {};
  const rewardName = reward.messages?.name || "";
  const rewardDesc = reward.messages?.description || "";
  const rewardLink = reward.rewardLink || "";
  const actionLink = reward.actionLink || "";

  const text = `${title} ${rewardName} ${rewardDesc} ${rewardLink} ${actionLink}`.toLowerCase();

  const hasKey = title.toLowerCase().includes("key");
  const isSteam =
    text.includes("steam") ||
    text.includes("steampowered.com") ||
    reward.actionType === "CODE";

  const blockedWords = [
    "robux",
    "premium",
    "profile background",
    "background",
    "skin",
    "gun skin",
    "gift card",
    "speed",
    "keyboard",
    "mouse",
    "trial",
    "avatar",
    "cosmetic",
  ];

  return hasKey && isSteam && !blockedWords.some((word) => text.includes(word));
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
    const upcoming = promo?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0];

    if (current) {
      const start = new Date(current.startDate).getTime();
      const end = new Date(current.endDate).getTime();

      if (start <= now && end > now) {
        freeNow.push({ ...game, promoStart: start, promoEnd: end });
      }
    } else if (upcoming) {
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

export default function MedalQuestsPage() {
  const [quests, setQuests] = useState<any[]>([]);
  const [epicNow, setEpicNow] = useState<any[]>([]);
  const [epicUpcoming, setEpicUpcoming] = useState<any[]>([]);
  const [steamFreebies, setSteamFreebies] = useState<any[]>([]);
  const [amdPromos, setAmdPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/medal-quests").then((r) => r.json()),
      fetch("/api/epic-freebies").then((r) => r.json()),
      fetch("/api/steam-freebies").then((r) => r.json()),
      fetch("/api/amd-promotions").then((r) => r.json()),
    ])
      .then(([medalData, epicData, steamData, amdData]) => {
        const medalFiltered = (medalData.items || [])
          .filter(isActiveQuest)
          .filter(isGameKeyGiveaway)
          .sort((a: any, b: any) => {
            return (a.config?.startsAt || 0) - (b.config?.startsAt || 0);
          });

        const epicParsed = parseEpicGames(epicData);

        const steamFiltered = (steamData.items || []).filter((item: any) => {
          const expiry = item.expiry ? new Date(item.expiry).getTime() : null;
          return !expiry || expiry > Date.now();
        });

        const amdFiltered = (amdData.items || []).filter((item: any) => {
          const keys = Number(item.keysAvailable || 0);
          const status = String(item.status || "").toLowerCase();
          return status === "active" && keys > 0;
        });

        setQuests(medalFiltered);
        setEpicNow(epicParsed.freeNow);
        setEpicUpcoming(epicParsed.comingSoon);
        setSteamFreebies(steamFiltered);
        setAmdPromos(amdFiltered);
        setLoading(false);
      })
      .catch(() => {
        setQuests([]);
        setEpicNow([]);
        setEpicUpcoming([]);
        setSteamFreebies([]);
        setAmdPromos([]);
        setLoading(false);
      });
  }, []);

  const totalCount = useMemo(
    () =>
      quests.length +
      epicNow.length +
      epicUpcoming.length +
      steamFreebies.length +
      amdPromos.length,
    [quests, epicNow, epicUpcoming, steamFreebies, amdPromos]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            Free Games & Giveaways Notifier
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            Epic Games freebies, Steam 100% off games, Medal TV quests, AMD rewards and more.
          </p>

          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-zinc-400">
            {totalCount} active / upcoming giveaways
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-500">Loading giveaways...</div>
        ) : (
          <>
            <section className="mb-14">
              <SectionHeader
                eyebrow="This Week"
                title="Free Right Now"
                count={`${epicNow.length} Epic freebies`}
              />

              {epicNow.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No Epic freebies found right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {epicNow.map((game) => (
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
                count={`${epicUpcoming.length} upcoming`}
              />

              {epicUpcoming.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No upcoming Epic freebies found.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {epicUpcoming.map((game) => (
                    <article
                      key={game.id}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
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

            <section className="mb-14 border-t border-white/10 pt-10">
              <SectionHeader
                eyebrow="Steam"
                title="100% Off Games"
                count={`${steamFreebies.length} free to keep`}
              />

              {steamFreebies.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No active Steam 100% off games right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {steamFreebies.map((game) => (
                    <article
                      key={game.id || game.slug || game.title}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]"
                    >
                      {game.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={game.image}
                            alt={game.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-4 top-4">
                            <FaSteam className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <h2 className="text-lg font-bold text-white">
                          {game.title}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          Free to keep
                          {game.expiry ? ` · Ends ${formatSteamDate(game.expiry)}` : ""}
                        </p>

                        <div className="mt-3 text-sm">
                          <span className="mr-2 text-zinc-500 line-through">
                            {game.regularPrice
                              ? `${game.regularPrice} ${game.currency || ""}`
                              : "Paid"}
                          </span>
                          <span className="font-black text-cyan-400">FREE</span>
                        </div>

                        <a
                          href={game.url || game.itadUrl || "https://store.steampowered.com/"}
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
                eyebrow="Live Right Now"
                title="Medal TV Key Giveaways"
                count={`${quests.length} key giveaways`}
              />

              {quests.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No active Medal TV key giveaways right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {quests.map((quest) => {
                    const config = quest.config || {};
                    const reward = config.reward || {};
                    const rewardMsg = reward.messages || {};

                    const title = config.messages?.name || "Unknown Quest";
                    const questText = cleanText(config.messages?.detailedDescription);
                    const banner = config.assets?.banner;
                    const rewardIcon = reward.assets?.icon;
                    const questLink = `https://medal.tv/quests?questId=${quest.id}`;

                    const steamCheckText = `
                      ${title}
                      ${questText}
                      ${rewardMsg.name || ""}
                      ${rewardMsg.description || ""}
                      ${reward.rewardLink || ""}
                      ${reward.actionLink || ""}
                    `.toLowerCase();

                    const isSteamQuest =
                      steamCheckText.includes("steam") ||
                      steamCheckText.includes("steampowered.com");

                    return (
                      <article
                        key={quest.id}
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]"
                      >
                        {banner && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={banner}
                              alt={title}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {isSteamQuest && (
                              <div className="absolute left-4 top-4">
                                <FaSteam className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-5">
                          <div className="mb-3 flex items-start gap-3">
                            {rewardIcon && (
                              <Image
                                src={rewardIcon}
                                alt=""
                                width={42}
                                height={42}
                                unoptimized
                                className="rounded-lg border border-white/10"
                              />
                            )}

                            <div>
                              <h2 className="text-lg font-bold leading-tight text-white">
                                {title}
                              </h2>

                              <p className="mt-1 text-xs text-zinc-500">
                                Ends {formatDate(config.endsAt)}
                              </p>
                            </div>
                          </div>

                          <p className="mb-4 line-clamp-3 text-sm text-zinc-400">
                            {questText}
                          </p>

                          <div className="mb-5">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                              Reward
                            </div>

                            <div className="font-semibold text-white">
                              {rewardMsg.name || "Unknown Reward"}
                            </div>

                            <div className="text-sm text-zinc-400">
                              {rewardMsg.description || "Redeem and play on Steam"}
                            </div>
                          </div>

                          <a
                            href={questLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-black transition-all hover:scale-105 hover:bg-cyan-300"
                          >
                            View Quest
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="mb-14 border-t border-white/10 pt-10">
              <SectionHeader
                eyebrow="AMD Gaming"
                title="AMD Key Giveaways"
                count={`${amdPromos.length} available`}
              />

              {amdPromos.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">
                  No active AMD Gaming key giveaways right now.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {amdPromos.map((item) => {
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
                        className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]"
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
                              <SiAmd className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            </div>
                          </div>
                        )}

                        <div className="p-5">
                          <h2 className="text-lg font-bold text-white">
                            {title}
                          </h2>

                          <p className="mt-1 text-xs text-zinc-500">
                            Platform: {platform}
                          </p>

                          <div className="my-5">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                              Keys Available
                            </div>

                            <div className="font-black text-cyan-400">
                              🔑 {keys}
                            </div>
                          </div>

                          <a
                            href={promoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-black transition-all hover:scale-105 hover:bg-cyan-300"
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
          </>
        )}
      </div>
    </main>
  );
}
