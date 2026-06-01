"use client";

import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import Image from "next/image";

const socialLinks = [
  { icon: "github", name: "Subho801", platform: "GitHub", connected: true, url: "https://github.com/Subho801" },
  { icon: "steam", name: "Subho ♡", platform: "Steam", connected: true, url: "https://steamcommunity.com/id/Subho7" },
  { icon: "discord", name: "Subho7.", platform: "Discord", connected: true, url: "https://discordapp.com/users/1290236398540034048" },
  { icon: "gog", name: "Subho7", platform: "GOG", connected: true, url: "https://www.gog.com/u/Subho7" },
  { icon: "xbox", name: "Subho", platform: "Xbox", connected: true, url: "https://www.xbox.com/en-IN/play/user/Subho%20X6025" },
  { icon: "lastfm", name: "Subho_X", platform: "Last.fm", connected: true, url: "https://www.last.fm/user/Subho_X" },
  { icon: "playstation", name: "Subho9760", platform: "PlayStation", connected: true, url: "https://profile.playstation.com/" },
  { icon: "letterboxd", name: "Subho_X", platform: "Letterboxd", connected: true, url: "https://letterboxd.com/Subho_X/" },
];

function BrandIcon({ src, alt, size = 22 }: { src: string; alt: string; size?: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="
        grayscale
        brightness-75
        opacity-60
        transition-all
        duration-300
        group-hover:grayscale-0
        group-hover:brightness-100
        group-hover:opacity-100
      "
    />
  );
}

const getIcon = (name: string) => {
  const icons: Record<string, JSX.Element> = {
    github: <BrandIcon src="/github-logo.png" alt="GitHub" size={22} />,
    steam: <BrandIcon src="/steam-logo.png" alt="Steam" size={22} />,
    discord: <BrandIcon src="/discord-logo.png" alt="Discord" size={20} />,
    gog: <BrandIcon src="/gog-logo.png" alt="GOG" size={20} />,
    xbox: <BrandIcon src="/xbox-logo.png" alt="Xbox" size={22} />,
    lastfm: (
  <Image
    src="/lastfm-logo.png"
    alt="Last.fm"
    width={22}
    height={22}
    className="
      opacity-60
      transition-all
      duration-300
      group-hover:opacity-100
      group-hover:[filter:brightness(0)_saturate(100%)_invert(15%)_sepia(96%)_saturate(6932%)_hue-rotate(356deg)_brightness(92%)_contrast(119%)]
    "
  />
),
    playstation: <BrandIcon src="/playstation-logo.png" alt="PlayStation" size={22} />,
    letterboxd: <BrandIcon src="/letterboxd-logo.png" alt="Letterboxd" size={22} />,
  };

  return icons[name] || null;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0 },
};

export function SocialLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      className="glass-card relative overflow-hidden rounded-[28px] p-6 card-glow"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-lime-400/5 blur-3xl" />
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

      <div className="mb-5 relative h-[40px] w-[40px]">
        <svg viewBox="0 0 40.1 40.1" className="h-full w-full" style={{ fill: "#c1f108" }}>
          <path d="M5.024 34.976c-6.699-6.7-6.699-17.56 0-24.26l5.692-5.692c6.7-6.699 17.56-6.699 24.26 0 6.7 6.7 6.7 17.56 0 24.26l-5.692 5.692c-6.7 6.7-17.56 6.7-24.26 0z" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]" style={{ color: "#445700" }}>
            connect_without_contact
          </span>
        </div>
      </div>

      <h2 className="mb-8 text-[26px] font-semibold text-white">
        where to find me
      </h2>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            variants={item}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center justify-between overflow-hidden rounded-xl px-3 py-1.5 transition-all duration-300 hover:bg-white/[0.03]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-lime-500/0 via-lime-500/5 to-lime-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center">
                {getIcon(link.icon)}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-white/90">
                    {link.name}
                  </p>

                  {link.connected && (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-lime-500/20">
                      <Check className="h-2 w-2 text-lime-400" />
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-white/45">{link.platform}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-end">
        <a
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-lime-500/30 px-6 py-3 text-sm font-semibold text-lime-300 transition-colors hover:bg-lime-500/40"
        >
          <Mail className="h-4 w-4" />
          Contact
        </a>
      </div>
    </motion.div>
  );
}