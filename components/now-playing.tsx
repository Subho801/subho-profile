"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Track = {
  name: string;
  artist: string;
  album: string;
  image: string;
  nowPlaying: boolean;
  url: string;
  username: string;
  realname: string;
  avatar: string;
  playcount: string;
  accentColor: string;
  textColor: string;
  dateUts: string | null;
};

function getTimeAgo(uts: string | null) {
  if (!uts) return "recent";

  const seconds = Math.floor(Date.now() / 1000) - Number(uts);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "just now";
}

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch("/api/lastfm");
      const data = await res.json();
      setTrack(data);
    }

    loadTrack();
    const interval = setInterval(loadTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!track) {
    return (
      <div className="glass-card rounded-[28px] p-6">
        Loading Last.fm...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-[28px] p-6 card-glow"
    >
      <div className="relative w-12 h-12 mb-7">
  <div
    className="absolute inset-0 bg-lime-400"
    style={{
      maskImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='44' width='44' viewBox='0 0 44 44'%3E%3Cpath d='M3.371,22.058C-2.166,15.091 3.692,4.945 12.494,6.256L13.949,6.473C16.636,6.874 19.369,6.142 21.496,4.451L22.648,3.536C29.614,-2.001 39.76,3.857 38.449,12.658L38.232,14.114C37.831,16.801 38.564,19.534 40.254,21.661L41.169,22.813C46.706,29.779 40.848,39.925 32.047,38.614L30.591,38.397C27.904,37.996 25.171,38.729 23.045,40.419L21.893,41.334C14.926,46.871 4.78,41.013 6.092,32.212L6.308,30.756C6.709,28.069 5.977,25.336 4.286,23.209L3.371,22.058Z'/%3E%3C/svg%3E\")",
      WebkitMaskImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='44' width='44' viewBox='0 0 44 44'%3E%3Cpath d='M3.371,22.058C-2.166,15.091 3.692,4.945 12.494,6.256L13.949,6.473C16.636,6.874 19.369,6.142 21.496,4.451L22.648,3.536C29.614,-2.001 39.76,3.857 38.449,12.658L38.232,14.114C37.831,16.801 38.564,19.534 40.254,21.661L41.169,22.813C46.706,29.779 40.848,39.925 32.047,38.614L30.591,38.397C27.904,37.996 25.171,38.729 23.045,40.419L21.893,41.334C14.926,46.871 4.78,41.013 6.092,32.212L6.308,30.756C6.709,28.069 5.977,25.336 4.286,23.209L3.371,22.058Z'/%3E%3C/svg%3E\")",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />

  <div className="absolute inset-0 flex items-center justify-center">
    <span
      className="material-symbols-outlined text-black"
      style={{
        fontSize: "30px",
        fontVariationSettings:
          "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      graphic_eq
    </span>
  </div>
</div>
      <h2 className="text-[26px] leading-none font-semibold mb-7">
        what i'm listening to
      </h2>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative h-[230px] rounded-[22px] overflow-hidden group"
      >
        <Image
          src={track.image || "/placeholder.jpg"}
          alt={track.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div
  className="absolute inset-0"
  style={{
    backgroundColor: `${track.accentColor}55`,
  }}
/>
<div
  className="absolute inset-0"
  style={{
    background:
      "linear-gradient(to top, rgba(0,0,0,.35), rgba(0,0,0,.05))",
  }}
/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/15" />

        <div className="relative h-full p-5 flex flex-col justify-between">
          <div
  className="flex items-center gap-2 text-sm opacity-80"
  style={{
    color: track.textColor,
    textShadow: "0 1px 4px rgba(0,0,0,.35)",
  }}
>
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={track.avatar || "/placeholder-user.jpg"}
                alt={track.username}
                width={24}
                height={24}
                unoptimized
                className="object-cover"
              />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://www.last.fm/user/${track.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {track.realname || track.username}
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#f4efdf] text-[#313303] border-0"
              >
                {track.realname || track.username} (@{track.username})
              </TooltipContent>
            </Tooltip>

            <span>•</span>
            {track.nowPlaying ? (
  <span className="flex items-end gap-[3px] h-4">
    <span className="equalizer-bar w-[3px] rounded-full bg-current opacity-75" />
    <span className="equalizer-bar w-[3px] rounded-full bg-current opacity-75" />
    <span className="equalizer-bar w-[3px] rounded-full bg-current opacity-75" />
    <span className="equalizer-bar w-[3px] rounded-full bg-current opacity-75" />
  </span>
) : (
  <span>{getTimeAgo(track.dateUts)}</span>
)}
          </div>

          <div className="flex flex-col items-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://www.last.fm/music/${encodeURIComponent(
                    track.artist
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[15px] uppercase tracking-wide mb-1 hover:underline opacity-65"
style={{
  color: track.textColor,
  textShadow: "0 1px 4px rgba(0,0,0,.35)",
}}
                >
                  {track.artist}
                </a>
              </TooltipTrigger>

              <TooltipContent
                side="top"
                className="bg-[#f4efdf] text-[#313303] border-0"
              >
                {track.artist}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <h3
  className="text-[32px] leading-none font-bold hover:underline opacity-90"
style={{
  color: track.textColor,
  textShadow: "0 2px 6px rgba(0,0,0,.45)",
}}>
                    {track.name}
                  </h3>
                </a>
              </TooltipTrigger>

              <TooltipContent
                side="top"
                align="start"
                sideOffset={8}
                className="bg-[#f4efdf] text-[#313303] border-0"
              >
                {track.name}
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
  href={`https://www.last.fm/user/${track.username}`}
  target="_blank"
  rel="noreferrer"
  className="absolute bottom-3 right-3 hover:opacity-80 transition-opacity"
>
  <Image
    src="/lastfm-logo.png"
    alt="Last.fm"
    width={28}
    height={28}
    className="invert opacity-65"
  />
</a>
            </TooltipTrigger>

            <TooltipContent
              side="left"
              className="bg-[#f4efdf] text-[#313303] border-0"
            >
              powered by Last.fm
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </motion.div>
  );
}