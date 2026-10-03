"use client";

import { useRef } from "react";
import { ARCS, CITIES, FX } from "@/lib/content";
import { EASE, MEDIA, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

const formatRate = (r: number, base: number) => r.toFixed(base > 10 ? 3 : 4);

function Globe({ prefix }: { prefix: string }) {
  return (
    <>
      <g className={`${prefix}-globe`}>
        <circle cx="960" cy="470" r="320" fill="#0B0C0F" stroke="rgba(255,255,255,0.12)" />
        <ellipse cx="960" cy="470" rx="277" ry="320" fill="none" stroke="rgba(255,255,255,0.06)" />
        <ellipse cx="960" cy="470" rx="160" ry="320" fill="none" stroke="rgba(255,255,255,0.06)" />
        <line x1="960" y1="150" x2="960" y2="790" stroke="rgba(198,244,50,0.45)" />
        <ellipse cx="960" cy="470" rx="320" ry="56" fill="none" stroke="rgba(255,255,255,0.07)" />
        <ellipse cx="960" cy="310" rx="277" ry="48" fill="none" stroke="rgba(255,255,255,0.05)" />
        <ellipse cx="960" cy="630" rx="277" ry="48" fill="none" stroke="rgba(255,255,255,0.05)" />
        <ellipse cx="960" cy="200" rx="150" ry="26" fill="none" stroke="rgba(255,255,255,0.04)" />
        <ellipse cx="960" cy="740" rx="150" ry="26" fill="none" stroke="rgba(255,255,255,0.04)" />
        {CITIES.map((c) => (
          <circle key={c.code} cx={c.x} cy={c.y} r="4" fill="#EDEEF0" />
        ))}
      </g>
      {ARCS.map((a) => (
        <path
          key={a.d}
          className={`${prefix}-arc ${a.glow ? "drop-shadow-[0_0_5px_rgba(198,244,50,0.6)]" : ""}`}
          d={a.d}
          fill="none"
          stroke="#C6F432"
          strokeWidth={a.w}
        />
      ))}
      <g className={`${prefix}-labels`}>
        {CITIES.map((c) => (
          <text
            key={c.code}
            x={c.lx}
            y={c.ly + 9}
            fill={c.code === "LDN" ? "#EDEEF0" : "#9DA2AA"}
            className="font-mono text-[11px] tracking-[0.12em]"
          >
            {c.code}
          </text>
        ))}
      </g>
    </>
  );
}

function Rates({ prefix, className = "" }: { prefix: string; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-hairline bg-graphite px-5 py-2 ${className}`}>
      {FX.map((r) => (
        <div
          key={r.pair}
          className={`${prefix}-fx flex justify-between border-b border-white/6 py-3.5 font-mono text-[13px] last:border-b-0`}
        >
          <span>{r.pair}</span>
          <span className="fx-rate text-signal">{formatRate(r.rate, r.rate)} ▲</span>
        </div>
      ))}
    </div>
  );
}

const Copy = ({ size }: { size: string }) => (
  <>
    <span className="label">[ 06 ] Global</span>
    <h2 className={`font-medium leading-[0.95] tracking-[-0.05em] ${size}`}>
      Every currency.
      <br />
      One ledger.
    </h2>
    <p className="text-[17px] leading-[1.55] text-body">
      Hold, send and spend in local currency at the mid-market rate. Meridian converts only when you tell it to.
    </p>
  </>
);

export function Global() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const rates = gsap.utils.toArray<HTMLElement>(".fx-rate");

      // Mock ticker: a tiny wobble around each base rate while the section is on screen.
      const tick = () => {
        const t = gsap.ticker.time * 1000;
        rates.forEach((el, n) => {
          const i = n % FX.length;
          const base = FX[i].rate;
          const phase = t / 700 + i * 1.7;
          const up = Math.cos(phase) >= 0;
          const text = `${formatRate(base * (1 + Math.sin(phase) * 0.0004), base)} ${up ? "▲" : "▼"}`;
          if (el.textContent !== text) el.textContent = text;
          el.style.color = up ? "#C6F432" : "#9DA2AA";
        });
      };

      mm.add(MEDIA.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", pin: true, scrub: 1 },
        });
        gsap.set(".d-globe", { svgOrigin: "960 470" });
        tl.fromTo(
          ".d-globe",
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, ease: EASE.out, duration: 0.2 },
          0,
        )
          .fromTo(".g-text", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0)
          .fromTo(".d-labels", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.15);
        gsap.utils.toArray<SVGPathElement>(".d-arc").forEach((arc, i) => {
          tl.fromTo(arc, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.25 }, 0.15 + i * 0.13);
        });
        gsap.utils.toArray<HTMLElement>(".d-fx").forEach((row, i) => {
          tl.fromTo(row, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: EASE.out, duration: 0.1 }, 0.4 + i * 0.1);
        });
        tl.set({}, {}, 1);
      });

      mm.add(MEDIA.mobile, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".m-map", start: "top 80%", end: "bottom 40%", scrub: 1 },
        });
        gsap.set(".m-globe", { svgOrigin: "960 470" });
        tl.fromTo(
          ".m-globe",
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, ease: EASE.out, duration: 0.25 },
          0,
        ).fromTo(".m-labels", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.2);
        gsap.utils.toArray<SVGPathElement>(".m-arc").forEach((arc, i) => {
          tl.fromTo(arc, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3 }, 0.2 + i * 0.15);
        });
        gsap.from(".m-fx", {
          autoAlpha: 0,
          y: 16,
          stagger: 0.08,
          duration: 0.8,
          ease: EASE.expo,
          scrollTrigger: { trigger: ".m-rates", start: "top 85%", once: true },
        });
      });

      // Created after the pin so the spacer exists; watching it covers the whole pinned distance.
      mm.add({ desktop: MEDIA.desktop, mobile: MEDIA.mobile }, () => {
        const area = root.current!.closest(".pin-spacer") ?? root.current;
        const st = ScrollTrigger.create({ trigger: area, start: "top bottom", end: "bottom top" });
        const run = () => {
          if (st.isActive) tick();
        };
        gsap.ticker.add(run);
        return () => gsap.ticker.remove(run);
      });
    },
    { scope: root },
  );

  return (
    <section id="global" ref={root} className="beat relative overflow-hidden">
      <div className="stage desk">
        <svg className="absolute left-0 top-0" width="1440" height="900" viewBox="0 0 1440 900" aria-hidden="true">
          <Globe prefix="d" />
        </svg>
        <div className="g-text absolute left-20 top-[140px] flex w-[460px] flex-col gap-7">
          <Copy size="text-[72px]" />
        </div>
        <Rates prefix="d" className="absolute bottom-20 left-20 w-[380px]" />
      </div>

      <div className="mob mx-auto max-w-3xl px-5 py-20">
        <div className="flex flex-col gap-5">
          <Copy size="text-[44px]" />
        </div>
        <svg className="m-map mt-6 w-full" viewBox="640 150 640 640" aria-hidden="true">
          <Globe prefix="m" />
        </svg>
        <Rates prefix="m" className="m-rates mt-6" />
      </div>
    </section>
  );
}
