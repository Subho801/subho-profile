"use client";

import Image from "next/image";

export function AnimatedHeader() {
  return (
    <section className="relative h-[600px] min-h-[512px] max-h-[600px] overflow-hidden bg-[#080808]">
      <video
        src="/header-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute left-1/2 top-[42%] z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
        <div
  className="
    relative
    h-full
    w-full
    overflow-hidden
    rounded-full
    border
    border-white/10
    shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_50px_rgba(183,255,0,0.50)]
  "
>
          <Image
  src="/eye.gif"
  alt="Subho"
  fill
  priority
  unoptimized
  className="object-cover z-10"
/>

<div className="avatar-shine z-20" />
        </div>
      </div>

      <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-[#080808]/10 to-background pointer-events-none" />
    </section>
  );
}