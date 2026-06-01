import Link from "next/link";
import { ArrowLeft, Mail, Github } from "lucide-react";
import { FaSteam, FaSpotify } from "react-icons/fa";
import { Climate_Crisis } from "next/font/google";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const climate = Climate_Crisis({
  subsets: ["latin"],
  weight: "400",
});

const googleSans = {
  fontFamily: '"Google Sans Flex", sans-serif',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#202020] text-white px-6 py-10">
  <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col">
        <Link
          href="/"
          className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-lime-400 bg-lime-500/20 text-lime-300 hover:bg-lime-500/30 transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <h1 className={`${climate.className} mb-8 text-[70px] leading-none tracking-tight text-zinc-200`}>
          CONTACT
        </h1>

        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-lime-400 px-5 py-4 text-black">
          <span className="material-symbols-outlined text-[22px] text-black/70">
            waving_hand
          </span>
          <span>Need something? Want to talk? Feel free to reach out!</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="mailto:lofibeatz95@gmail.com"
            className="relative min-h-[120px] overflow-hidden rounded-2xl bg-[#121212] p-7 hover:-translate-y-1 hover:bg-[#171717] transition-all duration-300"
          >
            <h2 className="text-2xl font-medium text-white/85" style={googleSans}>Mail</h2>
            <p className="mt-2 text-[#f5f0c8]/90" style={googleSans}>lofibeatz95@gmail.com</p>
            <Mail strokeWidth={1.5} className="absolute right-[-32px] bottom-[-32px] h-[128px] w-[128px] text-zinc-300/15 pointer-events-none" />
          </a>

          <a
            href="https://discordapp.com/users/1290236398540034048"
            target="_blank"
            rel="noreferrer"
            className="relative min-h-[120px] overflow-hidden rounded-2xl bg-[#121212] p-7 hover:-translate-y-1 hover:bg-[#171717] transition-all duration-300"
          >
            <h2 className="text-2xl font-medium text-white/85" style={googleSans}>Discord</h2>
            <p className="mt-2 text-[#f5f0c8]/90" style={googleSans}>@subho7.</p>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.18] text-white/80 pointer-events-none" fill="currentColor">
              <path d="M524.5 69.8a1.5 1.5 0 0 0-.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0-1.9.9 337.5 337.5 0 0 0-14.9 30.6 447.8 447.8 0 0 0-134.4 0 309.5 309.5 0 0 0-15.1-30.6 1.9 1.9 0 0 0-1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0-.8.7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0-1-2.6 321.2 321.2 0 0 1-45.9-21.9 1.9 1.9 0 0 1-.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9.2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1-.2 3.1 301.4 301.4 0 0 1-45.9 21.8 1.9 1.9 0 0 0-1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1.7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2s23.4-59.3 52.8-59.3c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.4 59.3-52.8 59.3zm195.4 0c-29 0-52.8-26.6-52.8-59.2s23.3-59.3 52.8-59.3c29.7 0 53.3 26.8 52.8 59.2 0 32.7-23.2 59.3-52.8 59.3z" />
            </svg>
          </a>
        </div>

        <footer className="mt-[14vh] rounded-[28px] bg-[#111] p-8">
          <div className="flex gap-4">
  <Tooltip>
    <TooltipTrigger asChild>
      <a
        href="https://github.com/Subho801"
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
      >
        <Github size={20} />
      </a>
    </TooltipTrigger>
    <TooltipContent>GitHub</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <a
        href="https://steamcommunity.com/id/Subho7"
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
      >
        <FaSteam size={18} />
      </a>
    </TooltipTrigger>
    <TooltipContent>Steam</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <a
        href="https://open.spotify.com/user/31tebvc3cxn63xfiitnvxd73rrt4"
        target="_blank"
        rel="noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-black hover:scale-110 transition-all"
      >
        <FaSpotify size={18} />
      </a>
    </TooltipTrigger>
    <TooltipContent>Spotify</TooltipContent>
  </Tooltip>
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

    <span
      className="ml-[2px] text-[18px] text-zinc-300"
      style={googleSans}
    >
      .zip
    </span>
  </Link>

  <a
  href="/contact"
  className="inline-flex items-center gap-2 rounded-full bg-lime-500/30 px-6 py-3 text-sm font-semibold text-lime-300 hover:bg-lime-500/40 transition-colors"
>
  <Mail className="h-4 w-4" />
  Contact
</a>
</div>
        </footer>
      </div>
    </main>
  );
}