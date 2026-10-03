"use client";

import { useRef } from "react";
import { CHART_POINTS, MONTHS, NUMBERS } from "@/lib/content";
import { EASE, MEDIA, gsap, useGSAP } from "@/lib/gsap";

const LINE = CHART_POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const AREA = `${LINE} L1280 380 L0 380 Z`;
const DURATION = 1.6;

function Stats({ prefix }: { prefix: string }) {
  const stat = "flex flex-col gap-2.5 border-t pt-5";
  const value = "text-[clamp(36px,4vw,52px)] font-medium tabular-nums tracking-[-0.045em]";
  const caption = "font-mono text-xs uppercase tracking-[0.1em] text-fog";
  return (
    <div className="grid grid-cols-3 gap-4 lg:gap-6">
      <div className={`${stat} border-white/12`}>
        <span className={value}>
          $<span className={`${prefix}-saved`}>{NUMBERS.saved.toLocaleString("en-US")}</span>
        </span>
        <span className={caption}>Saved this year</span>
      </div>
      <div className={`${stat} border-white/12`}>
        <span className={value}>
          $0<span className="text-dim">.00</span>
        </span>
        <span className={caption}>FX fees paid</span>
      </div>
      <div className={`${stat} border-signal`}>
        <span className={`${value} ${prefix}-cur text-signal`}>{NUMBERS.currencies}</span>
        <span className={caption}>Currencies held</span>
      </div>
    </div>
  );
}

function Chart({ prefix, className = "" }: { prefix: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[24px] border border-white/6 bg-graphite ${className}`}>
      <svg className="absolute inset-0 size-full" viewBox="0 0 1280 420" aria-hidden="true">
        <defs>
          <linearGradient id={`${prefix}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C6F432" stopOpacity="0.16" />
            <stop offset="1" stopColor="#C6F432" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${prefix}-clip`}>
            <rect className={`${prefix}-clip`} x="0" y="0" width="1280" height="420" />
          </clipPath>
        </defs>
        {[140, 230, 320].map((y) => (
          <line key={y} x1="0" y1={y} x2="1280" y2={y} stroke="rgba(255,255,255,0.04)" />
        ))}
        <path
          className={`${prefix}-fill`}
          d={AREA}
          fill={`url(#${prefix}-area)`}
          clipPath={`url(#${prefix}-clip)`}
          opacity="0.9"
        />
        <path
          className={`${prefix}-line`}
          d={LINE}
          fill="none"
          stroke="#C6F432"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <g className={`${prefix}-head`} opacity="0">
          <circle r="5" fill="#C6F432" />
          <circle r="14" fill="none" stroke="rgba(198,244,50,0.35)" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <div className="absolute inset-x-8 bottom-3.5 flex justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-dim max-sm:inset-x-4 max-sm:text-[9px]">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Plays once. Positions are written as fractions of DURATION.
      const play = (prefix: string, trigger: string) => {
        const q = gsap.utils.selector(root);
        const at = (p: number) => p * DURATION;
        const counts = { saved: 0, cur: 0 };
        const write = () => {
          q(`.${prefix}-saved`)[0].textContent = Math.round(counts.saved).toLocaleString("en-US");
          q(`.${prefix}-cur`)[0].textContent = String(Math.round(counts.cur));
        };
        write();

        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: { trigger: q(trigger)[0], start: "top 70%", once: true },
        });
        tl.from(q(`.${prefix}-headline`), { autoAlpha: 0, y: 30, duration: at(0.4) }, 0)
          .to(counts, { saved: NUMBERS.saved, duration: at(0.6), onUpdate: write }, 0)
          .to(counts, { cur: NUMBERS.currencies, duration: at(0.5), onUpdate: write }, at(0.1))
          .fromTo(
            q(`.${prefix}-line`),
            { drawSVG: "0%" },
            { drawSVG: "100%", ease: EASE.inOut, duration: at(0.7) },
            at(0.1),
          )
          .fromTo(q(`.${prefix}-clip`), { scaleX: 0 }, { scaleX: 1, ease: EASE.inOut, duration: at(0.7) }, at(0.1))
          .set(q(`.${prefix}-head`), { opacity: 1 }, at(0.1))
          .to(q(`.${prefix}-head`), { motionPath: { path: LINE }, ease: EASE.inOut, duration: at(0.7) }, at(0.1))
          .fromTo(q(`.${prefix}-fill`), { opacity: 0 }, { opacity: 0.9, ease: "none", duration: at(0.5) }, at(0.5));
      };

      mm.add(MEDIA.desktop, () => play("d", ".d-wrap"));
      mm.add(MEDIA.mobile, () => play("m", ".m-wrap"));
    },
    { scope: root },
  );

  return (
    <section id="numbers" ref={root} className="beat relative overflow-hidden">
      <div className="d-wrap stage desk">
        <div className="d-headline absolute inset-x-20 top-[88px] grid grid-cols-12 items-end gap-6">
          <div className="col-span-5 flex flex-col gap-5">
            <span className="label">[ 05 ] Your year, counted</span>
            <h2 className="text-[64px] font-medium leading-[0.98] tracking-[-0.05em]">
              See where it all went. And where it grew.
            </h2>
          </div>
          <div className="col-span-7">
            <Stats prefix="d" />
          </div>
        </div>
        <Chart prefix="d" className="absolute inset-x-20 bottom-20 h-[420px]" />
      </div>

      <div className="m-wrap mob mx-auto max-w-3xl px-5 py-20">
        <div className="m-headline">
          <span className="label">[ 05 ] Your year, counted</span>
          <h2 className="mt-5 text-[40px] font-medium leading-[0.98] tracking-[-0.05em]">
            See where it all went. And where it grew.
          </h2>
          <div className="mt-10">
            <Stats prefix="m" />
          </div>
        </div>
        <Chart prefix="m" className="relative mt-10 aspect-[1280/420]" />
      </div>
    </section>
  );
}
