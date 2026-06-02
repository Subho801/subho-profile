import Link from "next/link";
import Image from "next/image";
import { Mail, Github } from "lucide-react";
import { FaSteam, FaSpotify } from "react-icons/fa";
import { Climate_Crisis } from "next/font/google";

import { ProfileCard } from "@/components/profile-card";
import { SocialLinks } from "@/components/social-links";
import { ProjectsWidget } from "@/components/projects-widget";
import { NowPlaying } from "@/components/now-playing";
import { GamesGrid } from "@/components/games-grid";
import { WatchingGrid } from "@/components/watching-grid";
import { DiscordPresence } from "@/components/discord-presence";
import { AnimatedHeader } from "@/components/animated-header";

const climate = Climate_Crisis({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <AnimatedHeader />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="mb-5 lg:mb-6 max-w-3xl mx-auto">
          <DiscordPresence />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          <div className="space-y-5 lg:space-y-6">
            <ProfileCard />
            <SocialLinks />
            <WatchingGrid />
          </div>

          <div className="space-y-5 lg:space-y-6">
            <ProjectsWidget />
            <NowPlaying />
            <GamesGrid />
          </div>
        </div>

        <footer className="relative mt-24 overflow-visible rounded-[28px] bg-[#111] p-8">
          {/* Cat peek */}
<div className="group absolute right-[25px] top-[-15px] z-20">
  {/* Tooltip */}
  <div
    className="
      pointer-events-none
      absolute
      bottom-[42px]
      left-1/2
      z-50
      w-max
      -translate-x-1/2
      rounded-md
      bg-zinc-200
      px-3
      py-2
      text-[12px]
      leading-4
      text-black
      opacity-0
      shadow-lg
      transition-opacity
duration-100
delay-700

group-hover:opacity-80
    "
  >
    <div>&gt;buy wireless device</div>
    <div>&gt;look inside</div>
    <div>&gt;wires</div>
  </div>

  {/* Cat only */}
  <div
  className="
    h-[15px]
    w-[40px]
    overflow-hidden
    transition-all
    duration-300
    ease-out
    group-hover:h-[28px]
    group-hover:-translate-y-[13px]
  "
>
    <Image
      src="/cat.png"
      alt="cat"
      width={40}
      height={40}
      className="block"
    />
  </div>
</div>

          {/* Footer content */}
          <div className="relative z-10">
            <div className="flex gap-4">
              <a
                href="https://github.com/Subho801"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
              >
                <Github size={20} />
              </a>

              <a
                href="https://steamcommunity.com/id/Subho7"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
              >
                <FaSteam size={18} />
              </a>

              <a
                href="https://open.spotify.com/user/31tebvc3cxn63xfiitnvxd73rrt4"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
              >
                <FaSpotify size={18} />
              </a>
            </div>

            <div className="my-8 h-px bg-white/15" />

            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="leading-none transition-opacity hover:opacity-80"
              >
                <span className={`${climate.className} text-[24px] text-white`}>
                  subho
                </span>
                <span className="ml-[2px] text-[18px] text-zinc-300">
                  .site
                </span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-lime-500/30 px-6 py-3 text-sm font-semibold text-lime-300 hover:bg-lime-500/40 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <div className="fixed top-0 right-0 w-1.5 h-full bg-gradient-to-b from-lime-400/50 via-lime-400/30 to-lime-400/10 pointer-events-none" />
    </main>
  );
}