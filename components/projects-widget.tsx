"use client";

import { motion } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    name: "Epic Games Freebie Notifier",
    description: "An automated bot to fetch free mystery games beforehand",
    icon: "https://files.catbox.moe/v8hwtz.png",
    stars: 124,
    href: "https://epicmysterygames.com"
  },
  {
    name: "Driplist",
    description: "Calendar to view what airs when via Moctale.",
    icon: "https://files.catbox.moe/arn84n.png",
    stars: 256,
    href: "#"
  },
  {
    name: "Medal TV Quest Notifier",
    description: "Live Medal TV quest tracker with Discord alerts",
    icon: "https://files.catbox.moe/rusxk8.png",
    stars: 37,
    href: "/medal-quests"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export function ProjectsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="glass-card rounded-2xl p-6 card-glow"
    >
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
      
      {/* Bignutty-style blob */}
<div className="relative mb-5 h-[52px] w-[52px]">
  <svg
    viewBox="0 0 76 76"
    className="h-full w-full"
    style={{ fill: "#2f173f" }}
  >
    <path d="M29.475,4.061C33.938,-1.206 42.062,-1.206 46.525,4.061V4.061C48.857,6.814 52.375,8.271 55.97,7.973V7.973C62.851,7.405 68.595,13.149 68.026,20.03V20.03C67.729,23.625 69.187,27.143 71.939,29.475V29.475C77.206,33.938 77.206,42.062 71.939,46.525V46.525C69.187,48.857 67.729,52.375 68.026,55.97V55.97C68.595,62.851 62.851,68.595 55.97,68.026V68.026C52.375,67.729 48.857,69.187 46.525,71.939V71.939C42.062,77.206 33.938,77.206 29.475,71.939V71.939C27.143,69.187 23.625,67.729 20.03,68.026V68.026C13.149,68.595 7.405,62.851 7.973,55.97V55.97C8.271,52.375 6.814,48.857 4.061,46.525V46.525C-1.206,42.062 -1.206,33.938 4.061,29.475V29.475C6.814,27.143 8.271,23.625 7.973,20.03V20.03C7.405,13.149 13.149,7.405 20.03,7.973V7.973C23.625,8.271 27.143,6.814 29.475,4.061V4.061Z" />
  </svg>

  <div className="absolute inset-0 flex items-center justify-center">
    <span
      className="material-symbols-outlined"
      style={{
        color: "#b76cf7",
        fontSize: "30px",
      }}
    >
      package_2
    </span>
  </div>
</div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[26px] leading-none font-semibold">
  {"what i've made"}
</h2>
        <div className="discord-badge" style={{ color: "oklch(0.7 0.15 300)" }}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          3 Projects
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2.5"
      >
        {projects.map((project, index) => (
          <motion.a
            key={index}
            variants={item}
            href={project.href}
            className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 relative overflow-hidden"
          >
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-400/30 transition-all">
                <Image
  src={project.icon}
  alt={project.name}
  width={44}
  height={44}
  className={
    project.name === "Spotivity"
      ? "w-[32px] h-[32px] m-auto"
      : "w-full h-full object-cover"
  }
/>
                
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors duration-300">
                    {project.name}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    {project.stars}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-muted-foreground/80 transition-colors">
                  {project.description}
                </p>
              </div>
            </div>
            <ChevronRight className="relative w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 group-hover:text-purple-400 transition-all duration-300" />
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}
