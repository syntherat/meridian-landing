"use client";

import { useRef } from "react";
import { MARQUEE, QUOTES } from "@/lib/content";
import { MEDIA, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { getScrollVelocity } from "@/lib/smooth-scroll";

const NAME_STYLE = {
  solid: "",
  outline: "outline-text",
  accent: "text-signal",
};

function Names({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex gap-[0.55em] pr-[0.55em]" aria-hidden={hidden}>
      {MARQUEE.map((m) => (
        <span key={m.name} className={NAME_STYLE[m.style]}>
          {m.name}
        </span>
      ))}
    </div>
  );
}

export function Proof() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: MEDIA.desktop, mobile: MEDIA.mobile }, (ctx) => {
        const skewOn = Boolean(ctx.conditions?.desktop);
        const setRow1 = gsap.quickSetter(".p-row1", "css");
        const setRow2 = gsap.quickSetter(".p-row2", "css");
        const setMeter = gsap.quickSetter(".p-meter", "scaleX");
        let m = 0;
        let vel = 0;
        let skew = 0;

        // Loop position, velocity and skew all ease toward their targets each frame.
        const tick = () => {
          const r = gsap.ticker.deltaRatio(60);
          vel += (getScrollVelocity() - vel) * Math.min(1, 0.2 * r);
          const target = skewOn ? gsap.utils.clamp(-8, 8, -vel * 0.2) : 0;
          skew += (target - skew) * Math.min(1, 0.12 * r);
          m = (m + 0.0011 * r * (1 + Math.min(Math.abs(vel) * 0.08, 6))) % 1;

          setRow1({ xPercent: -m * 50, skewX: skew });
          setRow2({ xPercent: -(50 - m * 50) - 10, skewX: skew });
          setMeter(Math.min(1, Math.abs(vel) * 0.016));
        };

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        });
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  return (
    <section
      id="proof"
      ref={root}
      className="relative overflow-hidden py-20 lg:flex lg:min-h-svh lg:flex-col lg:py-[88px]"
    >
      <div className="flex items-center justify-between px-5 lg:px-20">
        <span className="label">[ 07 ] Trusted by teams that move fast</span>
        <span className="label hidden items-center gap-2.5 sm:flex" aria-hidden="true">
          Velocity
          <span className="h-0.5 w-20 bg-white/10">
            <span className="p-meter block h-0.5 origin-left scale-x-0 bg-signal" />
          </span>
        </span>
      </div>

      <div className="mt-12 lg:mt-[90px]">
        <div className="p-row1 flex w-max whitespace-nowrap text-[clamp(64px,9.2vw,132px)] font-medium leading-none tracking-[-0.055em]">
          <Names />
          <Names hidden />
        </div>
      </div>

      <div className="mt-12 lg:mt-[118px]">
        <div className="p-row2 flex w-max">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <figure
              key={i}
              aria-hidden={i >= QUOTES.length}
              className={`mr-6 flex h-[260px] w-[300px] flex-none flex-col justify-between rounded-[24px] p-6 lg:h-[300px] lg:w-[440px] lg:p-8 ${
                q.lime ? "bg-signal text-void" : "border border-white/10 bg-graphite"
              }`}
            >
              <blockquote className="text-lg leading-[1.4] tracking-[-0.02em] lg:text-[22px]">{q.text}</blockquote>
              <figcaption className={`font-mono text-xs ${q.lime ? "text-[#2A3008]" : "text-fog"}`}>{q.by}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
