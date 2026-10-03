"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

// Pixels per frame, signed. Zero when Lenis is off (reduced motion).
export const getScrollVelocity = () => lenis?.velocity ?? 0;

function fitStage() {
  const s = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
  document.documentElement.style.setProperty("--s", String(s));
}

export function SmoothScroll() {
  useEffect(() => {
    fitStage();
    window.addEventListener("resize", fitStage);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return () => window.removeEventListener("resize", fitStage);
    }

    lenis = new Lenis({ lerp: 0.085, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("resize", fitStage);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
