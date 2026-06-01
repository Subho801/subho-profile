"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Game = {
  title: string;
  image: string;
  hours: number;
  link: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { opacity: 1, scale: 1, y: 0 },
};

const blob =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='44.0' width='44.0' viewBox='0 0 44.0 44.0'%3E%3Cpath d='M42.43,22C45.984,28.623 43.299,34.618 36.447,36.446C34.618,43.299 28.623,45.983 22,42.43C15.377,45.984 9.381,43.299 7.553,36.447C0.701,34.618 -1.984,28.623 1.57,22C-1.984,15.377 0.701,9.381 7.553,7.553C9.381,0.701 15.377,-1.984 22,1.57C28.623,-1.984 34.618,0.701 36.446,7.553C43.299,9.381 45.983,15.377 42.43,22Z' /%3E%3C/svg%3E\")";

function BlobIcon() {
  return (
    <div className="relative flex h-[42px] w-[42px] items-center justify-center">
      {/* glow */}
      <div className="absolute inset-0 bg-lime-400/20 blur-xl" />

      {/* blob border */}
<div
  className="absolute inset-0"
  style={{
    WebkitMaskImage: blob,
    maskImage: blob,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    backgroundColor: "#bef264",
  }}
/>

{/* inner blob */}
<div
  className="absolute inset-[2px]"
  style={{
    WebkitMaskImage: blob,
    maskImage: blob,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    backgroundColor: "#324100",
  }}
/>

      {/* joystick */}
      <span
  className="material-symbols-outlined relative z-10"
  style={{
    fontSize: "25px",
    color: "#afca60",
    fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24",
    textShadow: "none",
  }}
>
  joystick
</span>
    </div>
  );
}

export function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("/api/games");
        const data = await res.json();
        setGames(data.games || []);
      } catch (err) {
        console.error("GamesGrid error:", err);
        setGames([]);
      }
    }

    loadGames();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="glass-card card-glow relative overflow-hidden rounded-2xl p-6"
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

      <div className="mb-4">
  <BlobIcon />
</div>

      <h2 className="mb-5 text-[26px] font-semibold text-white">
        what i like to play
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-5 gap-x-2.5 gap-y-5"
      >
        {games.map((game, index) => (
          <motion.a
            key={`${game.title}-${index}`}
            href={game.link}
            target="_blank"
            variants={item}
            whileHover={{ scale: 1.08, y: -6, zIndex: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-white/5"
          >
            <Image
              src={game.image}
              alt={game.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 rounded-xl ring-2 ring-lime-400/0 shadow-lg transition-all duration-300 group-hover:ring-lime-400/60 group-hover:shadow-xl group-hover:shadow-lime-400/20" />

            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="truncate text-center text-[10px] font-bold text-white drop-shadow-lg">
                {game.title}
              </p>
              <p className="text-center text-[9px] text-lime-300">
                {game.hours}h played
              </p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.a>
        ))}
      </motion.div>

      <motion.a
  href="https://yourgamerprofile.com/subho"
  target="_blank"
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="
    shine-effect
    ml-auto
    mt-5
    flex
    w-fit
    items-contain
    gap-1
    rounded-full
    bg-[#324100]
    px-4
    py-2
    text-[14px]
    text-[#afca60]
    font-semibold
  "
>
  <Image
    src="/backloggd-logo.png"
    alt="Backloggd"
    width={21}
    height={21}
    className="opacity-80 -translate-y-[-1px]"
  />

  <span>Backloggd</span>
</motion.a>
    </motion.div>
  );
}