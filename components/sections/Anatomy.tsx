"use client";

import { useRef } from "react";
import { Card } from "@/components/card/Card";
import { LAYERS } from "@/lib/content";
import { EASE, MEDIA, gsap, seg, useGSAP } from "@/lib/gsap";

// One window per layer, in timeline progress.
const WINDOWS = [
  [0.18, 0.36],
  [0.36, 0.54],
  [0.54, 0.72],
  [0.72, 0.9],
];
// Plate depth when fully exploded, face first.
const DEPTH = [180, 60, -60, -180];
const LABEL_TOP = [296, 398, 500, 602];

const PLATE =
  "a-plate absolute -left-[190px] -top-[120px] h-[240px] w-[380px] rounded-[18px] border transition-[opacity,border-color,box-shadow] duration-300";

function LayerList({ prefix }: { prefix: string }) {
  return (
    <ol className="mt-3 flex flex-col border-t border-hairline">
      {LAYERS.map((l) => (
        <li key={l.n} className={`${prefix}-item group relative flex gap-5 border-b border-hairline py-4`}>
          <span className="pt-[3px] font-mono text-xs text-dim transition-colors duration-300 group-[.is-active]:text-signal">
            {l.n}
          </span>
          <div className="flex flex-col">
            <span className="text-[17px] text-dim transition-colors duration-300 group-[.is-active]:text-bone">
              {l.t}
            </span>
            <div className="layer-desc">
              <p className="overflow-hidden pt-2 text-[15px] leading-normal text-body">{l.d}</p>
            </div>
          </div>
          <span className={`${prefix}-bar absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-signal`} />
        </li>
      ))}
    </ol>
  );
}

export function Anatomy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const plates = gsap.utils.toArray<HTMLElement>(".a-plate");
      const items = gsap.utils.toArray<HTMLElement>(".d-item");
      const bars = gsap.utils.toArray<HTMLElement>(".d-bar");
      const labels = gsap.utils.toArray<HTMLElement>(".a-label");
      const counter = root.current?.querySelector(".a-counter");

      // plates[] is in paint order (shell first), so flip it to match LAYERS.
      const plateFor = (i: number) => plates[plates.length - 1 - i];

      const setActive = (active: number) => {
        LAYERS.forEach((_, i) => {
          const on = active === i;
          items[i].classList.toggle("is-active", on);
          labels[i].classList.toggle("is-active", on);
          const plate = plateFor(i);
          plate.classList.toggle("is-lit", on);
          plate.style.opacity = active < 0 || on ? "1" : "0.35";
        });
      };

      mm.add(MEDIA.desktop, () => {
        let last = -2;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=300%", pin: true, scrub: 1 },
          onUpdate() {
            const p = tl.progress();
            let active = -1;
            WINDOWS.forEach(([a, b], i) => {
              if (p >= a && p < b) active = i;
            });
            if (active !== last) {
              setActive(active);
              last = active;
            }
            if (counter) counter.textContent = `0${active < 0 ? (p < 0.5 ? 1 : 4) : active + 1}`;
            bars.forEach((bar, i) =>
              gsap.set(bar, { scaleX: active === i ? seg(p, WINDOWS[i][0], WINDOWS[i][1]) : 0 }),
            );
          },
        });

        tl.fromTo(".a-text", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.09 }, 0.01)
          .fromTo(".a-text", { x: -40 }, { x: 0, ease: EASE.out, duration: 0.11 }, 0.01)
          .fromTo(".a-stage", { x: -180 }, { x: 0, ease: EASE.inOut, duration: 0.18 }, 0)
          .fromTo(".a-tiltx", { rotationX: 0 }, { rotationX: 58, ease: EASE.inOut, duration: 0.18 }, 0)
          .fromTo(".a-tiltz", { rotation: 0 }, { rotation: -36, ease: EASE.inOut, duration: 0.18 }, 0)
          .fromTo(".a-label", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.12)
          .to(".a-tiltx", { rotationX: 0, ease: EASE.inOut, duration: 0.1 }, 0.9)
          .to(".a-tiltz", { rotation: 0, ease: EASE.inOut, duration: 0.1 }, 0.9)
          .to(".a-label", { autoAlpha: 0, duration: 0.1 }, 0.9);

        LAYERS.forEach((_, i) => {
          tl.fromTo(plateFor(i), { z: 0 }, { z: DEPTH[i], ease: EASE.inOut, duration: 0.18 }, 0).to(
            plateFor(i),
            { z: 0, ease: EASE.inOut, duration: 0.1 },
            0.9,
          );
        });

        return () => setActive(-1);
      });

      mm.add(MEDIA.mobile, () => {
        gsap.utils.toArray<HTMLElement>(".m-item").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            ease: EASE.expo,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="anatomy" ref={root} className="beat relative overflow-hidden">
      <div className="stage desk">
        <div className="a-text absolute inset-y-0 left-20 flex w-[440px] flex-col justify-center gap-7">
          <span className="label">
            [ 02 ] Anatomy · <span className="a-counter text-bone">01</span> / 04
          </span>
          <h2 className="text-[72px] font-medium leading-[0.95] tracking-[-0.05em]">
            Four layers.
            <br />
            One card.
          </h2>
          <LayerList prefix="d" />
        </div>

        <div
          className="a-stage absolute left-[560px] top-0 h-[900px] w-[680px] perspective-[2400px]"
          aria-hidden="true"
        >
          <div className="a-tiltx preserve-3d absolute left-1/2 top-1/2 size-0">
            <div className="a-tiltz preserve-3d absolute size-0">
              <div
                className={`${PLATE} bg-[linear-gradient(140deg,#2D3036_0%,#16181C_40%,#22252B_65%,#0B0C0F_100%)]`}
              />
              <div className={`${PLATE} flex flex-col gap-4 bg-graphite/92 p-[30px]`}>
                {[60, 42, 74, 50].map((w, i) => (
                  <div key={w} className="flex items-center gap-2.5">
                    <span className={`size-1.5 rounded-full ${i % 2 ? "bg-white/30" : "bg-signal"}`} />
                    <span className="h-1.5 rounded-[3px] bg-white/14" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
              <div className={`${PLATE} border-[1.5px] bg-signal/4`}>
                <svg className="absolute left-0 top-0" width="380" height="240" viewBox="0 0 380 240">
                  <path
                    d="M120 120 H60 V60 H30 M120 132 H80 V190 H40 M190 106 V40 H300 M190 148 V200 H330"
                    fill="none"
                    stroke="rgba(198,244,50,0.55)"
                    strokeWidth="1"
                  />
                  <rect
                    x="120"
                    y="98"
                    width="70"
                    height="54"
                    rx="8"
                    fill="rgba(198,244,50,0.12)"
                    stroke="#C6F432"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className={`${PLATE} flex flex-col justify-between bg-white/3 px-7 py-[26px]`}>
                <span className="text-[15px] font-medium tracking-[-0.02em]">meridian</span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-bone/60">A. MORGAN</span>
              </div>
            </div>
          </div>
        </div>

        {LAYERS.map((l, i) => (
          <div
            key={l.n}
            className="a-label group absolute left-[1090px] flex w-[290px] items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-dim transition-colors duration-300 [&.is-active]:text-signal"
            style={{ top: LABEL_TOP[i] }}
            aria-hidden="true"
          >
            <span className="h-px w-[70px] bg-white/18 transition-colors duration-300 group-[.is-active]:bg-signal" />
            {l.n} {l.t}
          </div>
        ))}
      </div>

      <div className="mob mx-auto max-w-3xl px-5 py-20">
        <span className="label">[ 02 ] Anatomy</span>
        <h2 className="mt-5 text-[44px] font-medium leading-[0.95] tracking-[-0.05em]">
          Four layers.
          <br />
          One card.
        </h2>
        <div className="mx-auto my-10 w-fit [zoom:0.78] min-[480px]:[zoom:1]">
          <Card />
        </div>
        <ol className="flex flex-col border-t border-hairline">
          {LAYERS.map((l) => (
            <li key={l.n} className="m-item flex gap-5 border-b border-hairline py-5">
              <span className="pt-[3px] font-mono text-xs text-signal">{l.n}</span>
              <div className="flex flex-col gap-2">
                <span className="text-[17px]">{l.t}</span>
                <p className="text-[15px] leading-normal text-body">{l.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
