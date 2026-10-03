"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin);

// Cubic in/out and out, which GSAP calls power2.
export const EASE = {
  inOut: "power2.inOut",
  out: "power2.out",
  expo: "expo.out",
};

// Breakpoints shared by every section's gsap.matchMedia().
export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
};

export const clamp01 = gsap.utils.clamp(0, 1);

// Progress of p through the window [a, b], clamped to 0..1.
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const easeOut = gsap.parseEase(EASE.out);
export const easeInOut = gsap.parseEase(EASE.inOut);

export const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin };
