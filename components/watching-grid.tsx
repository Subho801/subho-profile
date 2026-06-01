"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type WatchItem = {
  type: "movie" | "show";
  title: string;
  link: string;
  poster: string | null;
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
const movieBlob =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 380'%3E%3Cpath d='M45.7 120.5C48.3 96 49.6 83.7 54.3 74a61 61 0 0 1 33.3-30.3C97.6 40 110 40 134.4 40h123.7c29.7 0 44.5 0 55.8 4.9 16.4 7 28.8 21 34 38.1 3.6 11.9 2 26.7-1 56.5l-12.6 120c-2.6 24.5-3.9 36.8-8.6 46.5a61 61 0 0 1-33.3 30.3c-10 3.7-22.3 3.7-46.8 3.7H121.9c-29.7 0-44.5 0-55.8-4.9-16.4-7-28.8-21-34-38.1-3.6-11.9-2-26.7 1-56.5z'%3E%3C/path%3E%3C/svg%3E\")";

export function WatchingGrid() {
  const [movies, setMovies] = useState<WatchItem[]>([]);
  const [shows, setShows] = useState<WatchItem[]>([]);

  useEffect(() => {
    async function loadWatching() {
      try {
        const [letterboxdRes, serializdRes] = await Promise.all([
          fetch("/api/letterboxd"),
          fetch("/api/serializd"),
        ]);

        const letterboxdData = await letterboxdRes.json();
        const serializdData = await serializdRes.json();

        setMovies(letterboxdData.movies || []);
        setShows(serializdData.shows || []);
      } catch (err) {
        console.error("WatchingGrid error:", err);
        setMovies([]);
        setShows([]);
      }
    }

    loadWatching();
  }, []);

  const items = [...movies.slice(0, 5), ...shows.slice(0, 5)];
  const total = items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
      className="glass-card rounded-2xl p-6 card-glow relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

      <div className="mb-4">
  <div className="relative flex h-[44px] w-[44px] items-center justify-center">
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "#c1f108",
        WebkitMaskImage: movieBlob,
        maskImage: movieBlob,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />

    <span
      className="material-symbols-outlined relative z-10"
      style={{
        color: "#445700",
        fontSize: "26px",
        fontVariationSettings:
          "'FILL' 0,'wght' 700,'GRAD' 0,'opsz' 24",
      }}
    >
      movie
    </span>
  </div>
</div>

      <div className="mb-8 flex items-center justify-between">
  <h2 className="text-[26px] font-semibold text-white">
    what i&apos;m watching
  </h2>

  <motion.a
    href={`https://letterboxd.com/${
      process.env.NEXT_PUBLIC_LETTERBOXD_USERNAME || ""
    }`}
    target="_blank"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="shine-effect relative flex items-center justify-center rounded-full bg-lime-500/30 px-4 py-2 text-[12px] font-semibold text-lime-300 hover:bg-lime-500/40"
  >
    <Image
      src="/letterboxd-logo.png"
      alt="Letterboxd"
      width={17}
      height={30}
      className="absolute left-4 opacity-80"
    />

    <span className="pl-5">Letterboxd</span>
  </motion.a>
</div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-5 gap-x-2 gap-y-5"
      >
        {items.map((watch) => (
          <PosterCard key={`${watch.type}-${watch.link}`} item={watch} />
        ))}
      </motion.div>

      <div className="mt-6 flex justify-end">
  <motion.a
    href="https://www.serializd.com/user/SubhoX/profile"
    target="_blank"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="
      shine-effect
      flex
      items-center
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
      src="/serializd-logo.png"
      alt="Serializd"
      width={21}
      height={21}
      className="opacity-80"
    />

    Serializd
  </motion.a>
</div>
    </motion.div>
  );
}

function PosterCard({ item: watch }: { item: WatchItem }) {
  return (
    <motion.a
      href={watch.link}
      target="_blank"
      variants={item}
      whileHover={{ scale: 1.1, y: -8, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group bg-white/5"
    >
      {watch.poster ? (
        <Image
          src={watch.poster}
          alt={watch.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-115"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-2 text-center text-xs text-white/60">
          {watch.title}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

      <div className="absolute inset-0 rounded-xl ring-2 ring-lime-400/0 group-hover:ring-lime-400/60 transition-all duration-300 shadow-lg group-hover:shadow-lime-400/20 group-hover:shadow-xl" />

      <div className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
        {watch.type === "movie" ? "M" : "TV"}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        <p className="text-[10px] font-bold text-white truncate text-center drop-shadow-lg">
          {watch.title}
        </p>
        <p className="text-[9px] text-lime-300 text-center">
          {watch.type === "movie" ? "Letterboxd" : "Serializd"}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.a>
  );
}