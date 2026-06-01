"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex flex-col sm:flex-row gap-6 items-start">
        {/* Avatar with online status */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-primary/30">
            <Image
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=gaming&backgroundColor=1a1a2e"
              alt="Profile avatar"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
            <div className="relative w-4 h-4 rounded-full bg-emerald-500 pulse-ring" />
          </div>
        </div>

        {/* Profile info */}
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {"I'm "}
              <span className="text-primary">bignutty</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">@bignut.zip</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Developer
              </span>
            </div>
          </div>
          
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              i like playing video games
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              i like developing software for the web
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              i like graphic and interface design
            </li>
          </ul>
        </div>

        {/* Decorative image */}
        <div className="hidden lg:block w-48 h-32 rounded-xl overflow-hidden opacity-80">
          <Image
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
            alt="Gaming setup"
            width={192}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
