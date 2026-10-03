"use client";

import { useRef } from "react";
import { FEATURES } from "@/lib/content";
import { EASE, MEDIA, easeOut, gsap, useGSAP } from "@/lib/gsap";

const RAIL_TRAVEL = 1960;
const PANEL_STEP = 760;
const PANEL_LEFT = 200;

function Visual({ f }: { f: (typeof FEATURES)[number] }) {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5 rounded-[18px] border border-white/6 bg-steel p-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fog">{f.k}</span>
      <span className="text-[26px] font-medium tracking-[-0.03em]">{f.v}</span>
      <div className="h-1 rounded-sm bg-white/10">
        <div className="r-bar h-1 origin-left rounded-sm bg-signal" style={{ width: `${f.w}%` }} />
      </div>
    </div>
  );
}

export function Features() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        const panels = gsap.utils.toArray<HTMLElement>(".r-panel");
        const tilts = gsap.utils.toArray<HTMLElement>(".r-tilt");
        const bars = gsap.utils.toArray<HTMLElement>(".d-panel .r-bar");
        const segs = gsap.utils.toArray<HTMLElement>(".r-seg");
        const counter = root.current?.querySelector(".r-counter");
        let last = -1;

        const render = (progress: number) => {
          const x = -RAIL_TRAVEL * progress;
          panels.forEach((panel, i) => {
            const left = PANEL_LEFT + i * PANEL_STEP + x;
            const focus = 1 - Math.min(1, Math.abs(left - PANEL_LEFT) / PANEL_STEP);
            gsap.set(panel, { scale: 0.92 + 0.08 * focus, opacity: 0.35 + 0.65 * focus });
            gsap.set(tilts[i], { rotation: (1 - focus) * 6 });
            gsap.set(bars[i], { scaleX: easeOut(focus) });
          });

          const active = Math.min(3, Math.round((-x / PANEL_STEP) * (3 / 2.58)));
          if (active !== last) {
            last = active;
            if (counter) counter.textContent = `0${active + 1}`;
            segs.forEach((s, i) => {
              s.style.background = i < active ? "#EDEEF0" : i === active ? "#C6F432" : "rgba(255,255,255,0.15)";
            });
          }
        };

        const rail = gsap.to(".r-rail", {
          x: -RAIL_TRAVEL,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=300%", pin: true, scrub: 1 },
          onUpdate: () => render(rail.progress()),
        });
        render(0);

        // Panel content slides in as the rail carries each panel into view.
        panels.forEach((panel) => {
          const st = { trigger: panel, containerAnimation: rail, start: "left right", end: "left 51.4%", scrub: true };
          gsap.fromTo(
            panel.querySelector(".r-inner"),
            { autoAlpha: 0, x: 80 },
            { autoAlpha: 1, x: 0, ease: EASE.out, scrollTrigger: st },
          );
          gsap.fromTo(
            panel.querySelector(".r-vis"),
            { autoAlpha: 0, x: 140 },
            { autoAlpha: 1, x: 0, ease: EASE.out, scrollTrigger: { ...st } },
          );
        });
      });

      mm.add(MEDIA.mobile, () => {
        gsap.utils.toArray<HTMLElement>(".m-panel").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 40,
            duration: 1,
            ease: EASE.expo,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="features" ref={root} className="beat relative overflow-hidden">
      <div className="stage desk">
        <div className="absolute inset-x-20 top-[72px] flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <span className="label">[ 04 ] What it does</span>
            <h2 className="text-[56px] font-medium leading-none tracking-[-0.05em]">Four things, done properly.</h2>
          </div>
          <div className="label flex items-center gap-4">
            <span>
              <span className="r-counter text-bone">01</span> / 04
            </span>
            <div className="flex gap-1.5">
              {FEATURES.map((f) => (
                <span key={f.n} className="r-seg h-0.5 w-8 bg-white/15 transition-colors duration-300" />
              ))}
            </div>
          </div>
        </div>

        <div className="r-rail absolute inset-0">
          {FEATURES.map((f, i) => (
            <article
              key={f.n}
              className="r-panel d-panel absolute top-60 h-[560px] w-[720px] overflow-hidden rounded-[28px] border border-hairline bg-graphite p-12"
              style={{ left: PANEL_LEFT + i * PANEL_STEP }}
            >
              <div className="r-inner flex h-full flex-col justify-between">
                <span className="font-mono text-xs text-signal">{f.n}</span>
                <div className="flex max-w-[300px] flex-col gap-4">
                  <h3 className="text-[40px] font-medium leading-none tracking-[-0.045em]">{f.t}</h3>
                  <p className="text-[15px] leading-[1.55] text-body">{f.d}</p>
                </div>
              </div>
              <div className="r-vis absolute right-12 top-[120px] h-[300px] w-[280px]">
                <div className="r-tilt size-full">
                  <Visual f={f} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mob mx-auto max-w-3xl px-5 py-20">
        <span className="label">[ 04 ] What it does</span>
        <h2 className="mt-5 text-[40px] font-medium leading-none tracking-[-0.05em]">Four things, done properly.</h2>
        <div className="mt-10 flex flex-col gap-4">
          {FEATURES.map((f) => (
            <article
              key={f.n}
              className="m-panel flex flex-col gap-8 rounded-[24px] border border-hairline bg-graphite p-6"
            >
              <span className="font-mono text-xs text-signal">{f.n}</span>
              <div className="flex flex-col gap-3">
                <h3 className="text-[30px] font-medium leading-none tracking-[-0.045em]">{f.t}</h3>
                <p className="text-[15px] leading-[1.55] text-body">{f.d}</p>
              </div>
              <div className="h-[180px]">
                <Visual f={f} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
