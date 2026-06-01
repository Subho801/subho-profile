"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/[0.08]
        bg-[radial-gradient(ellipse_at_80%_50%,rgba(193,241,8,0.12)_0%,rgba(193,241,8,0.06)_35%,transparent_75%),#181818]
        h-[260px]
        px-7
        py-7
      "
    >
      <div className="relative z-10 flex h-full items-center justify-between">
        <div className="max-w-[55%]">
          <div className="relative mb-6 h-[40px] w-[40px]">
            <svg
              viewBox="0 0 182 182"
              className="h-full w-full"
              style={{ fill: "#c1f108" }}
            >
              <path d="M4.035,65.826C-12.944,26.733 26.733,-12.944 65.826,4.035L72.289,6.842C84.225,12.025 97.775,12.025 109.711,6.842L116.174,4.035C155.267,-12.944 194.944,26.733 177.965,65.826L175.158,72.289C169.975,84.225 169.975,97.775 175.158,109.711L177.965,116.174C194.944,155.267 155.267,194.944 116.174,177.965L109.711,175.158C97.775,169.975 84.225,169.975 72.289,175.158L65.826,177.965C26.733,194.944 -12.944,155.267 4.035,116.174L6.842,109.711C12.025,97.775 12.025,84.225 6.842,72.289L4.035,65.826Z" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ color: "#445700" }}
              >
                waving_hand
              </span>
            </div>
          </div>

          <h1
            className="
              text-[46px]
              leading-none
              font-black
              tracking-[-3px]
              text-white
              mb-6
            "
            style={{
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            i'm{" "}
            <span className="italic text-lime-400">
              subho
            </span>
          </h1>

          <ul className="space-y-[2px] text-[16px] text-white/92 font-medium leading-[1.15]">
            <li className="flex gap-3">
              <span className="text-lime-400">•</span>
              <span>i like playing video games</span>
            </li>

            <li className="flex gap-3">
              <span className="text-lime-400">•</span>
              <span>i like coding cool websites</span>
            </li>

            <li className="flex gap-3">
              <span className="text-lime-400">•</span>
              <span>i like watching movies & series</span>
            </li>
          </ul>
        </div>

        <div
          className="
            absolute
            right-[-8px]
            bottom-[-2px]
            w-[220px]
            h-[300px]
            overflow-visible
            pointer-events-none
          "
        >
          

          <Image
            src="/ronaldo.png"
            alt="ronaldo"
            fill
            priority
            className="
              object-contain
              object-bottom
              scale-[1.2]
              drop-shadow-[0_0_20px_rgba(193,241,8,0.15)]
            "
          />
        </div>
      </div>
    </motion.div>
  );
}