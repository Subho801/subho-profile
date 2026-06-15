"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DISCORD_ID = "1290236398540034048";

const badges = [
  { name: "Nitro Platinum", src: "https://cdn.discordapp.com/badge-icons/0334688279c8359120922938dcb1d6f8.png" },
  { name: "Server Booster", src: "https://cdn.discordapp.com/badge-icons/991c9f39ee33d7537d9f408c3e53141e.png" },
  { name: "HypeSquad Brilliance", src: "https://cdn.discordapp.com/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png" },
  { name: "Golden Bug Hunter", src: "https://cdn.discordapp.com/badge-icons/848f79194d4be5ff5f81505cbd0ce1e6.png" },
  { name: "Early Supporter", src: "https://cdn.discordapp.com/badge-icons/7060786766c9c840eb3019e725d2b358.png" },
  { name: "Partnered Server Owner", src: "https://cdn.discordapp.com/badge-icons/3f9748e53446a137a052f3454e2de41e.png" },
  { name: "Orbs", src: "https://cdn.discordapp.com/badge-icons/83d8a1eb09a8d64e59233eec5d4d5c2d.png" },
  { name: "Moderator Programs Alumni", src: "https://cdn.discordapp.com/badge-icons/fee1624003e2fee35cb398e125dc479b.png" },
];

function getActivityImage(activity: any) {
  const image = activity?.assets?.large_image || activity?.assets?.small_image;
  if (!image) return null;

  if (image.startsWith("http")) return image;
  if (image.startsWith("mp:")) {
    return `https://media.discordapp.net/${image.replace("mp:", "")}`;
  }
  if (image.startsWith("spotify:")) return null;

  if (activity?.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
  }

  return null;
}

export function DiscordPresence() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    let reconnect: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      socket = new WebSocket("wss://api.lanyard.rest/socket");

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.op === 1) {
          heartbeat = setInterval(() => {
            socket?.send(JSON.stringify({ op: 3 }));
          }, message.d.heartbeat_interval);

          socket.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: DISCORD_ID },
            })
          );
        }

        if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
          setData(message.d);
        }
      };

      socket.onclose = () => {
        if (heartbeat) clearInterval(heartbeat);
        reconnect = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (heartbeat) clearInterval(heartbeat);
      if (reconnect) clearTimeout(reconnect);
      socket?.close();
    };
  }, []);

  const user = data?.discord_user;

  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : "/discord-logo.png";

  const avatarDecoration = user?.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=240&passthrough=true`
    : null;

  const status = data?.discord_status ?? "offline";
  const spotify = data?.spotify;

  const activity = data?.activities?.find(
    (a: any) => a.type === 0 && a.name !== "Spotify" && a.name !== "Custom Status"
  );

  const cover = spotify?.album_art_url;
  const activityImage = getActivityImage(activity);
  const sideImage = cover || activityImage;

  const subtitle = spotify ? `by ${spotify.artist}` : activity?.details || activity?.state || null;

  const statusText =
    status === "offline"
      ? "Offline"
      : status === "dnd"
      ? "Do Not Disturb"
      : status === "idle"
      ? "Idle"
      : "Online";

  return (
    <div className="mx-auto max-w-md">
  <div className="relative overflow-visible rounded-[24px] border border-white/[0.08] bg-[#101827] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <video
  src="/discord-nameplate.webm"
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 h-full w-full object-cover opacity-45"
/>

{sideImage && (
  <Image
    src={sideImage}
    alt=""
    fill
    unoptimized
    className="scale-110 object-cover opacity-20 blur-md"
  />
)}

        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-[#101827]/95 via-[#101827]/65 to-[#101827]/20" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <Image
              src={avatar}
              alt="Discord avatar"
              fill
              unoptimized
              className="rounded-2xl object-cover"
            />

            {avatarDecoration && (
              <Image
                src={avatarDecoration}
                alt=""
                fill
                unoptimized
                className="pointer-events-none scale-[1.25] object-contain"
              />
            )}

            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#101827] bg-[#101827]">
              {status === "online" && <span className="h-3 w-3 rounded-full bg-[#23a55a]" />}
              {status === "idle" && (
                <span className="relative h-3 w-3 rounded-full bg-[#f0b232]">
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#101827]" />
                </span>
              )}
              {status === "dnd" && (
                <span className="relative h-3 w-3 rounded-full bg-[#f23f43]">
                  <span className="absolute left-1/2 top-1/2 h-[2px] w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#101827]" />
                </span>
              )}
              {status === "offline" && <span className="h-3 w-3 rounded-full bg-[#80848e]" />}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-lg font-bold text-[#d98aff]">
                {user?.global_name || user?.username || "Subho"}
              </p>

              {badges.map((badge) => (
                <div key={badge.name} className="group relative">
                  <img src={badge.src} alt={badge.name} className="h-3.5 w-3.5 cursor-pointer" />

                  <div className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#4d4148] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>

            {spotify ? (
              <>
                <p className="mt-1 truncate text-sm font-semibold text-[#d98aff]/90">
                  Listening to {spotify.song}
                </p>
                <p className="truncate text-sm text-[#d98aff]/70">
                  by {spotify.artist}
                </p>
              </>
            ) : activity ? (
              <>
                <p className="mt-1 truncate text-sm font-semibold text-[#d98aff]/90">
                  {activity.type === 0
                    ? `Playing ${activity.name}`
                    : activity.type === 3
                    ? `Watching ${activity.name}`
                    : activity.name}
                </p>

                {subtitle && (
                  <p className="truncate text-sm text-[#d98aff]/70">
                    {subtitle}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 truncate text-sm font-semibold text-[#d98aff]/90">
                {statusText}
              </p>
            )}
          </div>

          {sideImage && (
            <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:block">
              <Image
                src={sideImage}
                alt={spotify?.album ?? activity?.name ?? "Activity image"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}