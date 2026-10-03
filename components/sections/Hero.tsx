"use client";

import { useRef } from "react";
import { Card } from "@/components/card/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HERO, PARTNER_LINE } from "@/lib/content";
import { EASE, MEDIA, easeInOut, gsap, seg, useGSAP } from "@/lib/gsap";

// Card at rest (scroll 0) and settled (end of the pin), in stage pixels.
const CARD_FROM = { x: 890, y: 344, rotationY: -24, rotationX: 14, rotation: -8, scale: 1.22 };
const CARD_TO = { x: 510, y: 318, rotationY: 0, rotationX: 0, rotation: 0, scale: 0.905 };
const LINE_H = 320;

const cardBottom = (y: number, scale: number) => y + 132.5 + 132.5 * scale;

const CHIP_POS = [
  { className: "left-[784px] top-[244px]", drift: -120 },
  { className: "right-0 top-[372px]", drift: -210 },
  { className: "left-[844px] top-[716px]", drift: -300 },
];

function Chip({ chip }: { chip: (typeof HERO.chips)[number] }) {
  return (
    <div className="glass flex items-center gap-3 rounded-[14px] py-3 pl-3 pr-4">
      <span
        className={`flex size-8 items-center justify-center rounded-[9px] ${chip.lime ? "bg-signal/12" : "bg-white/6"}`}
      >
        <Icon name={chip.icon} color={chip.lime ? "#C6F432" : "#EDEEF0"} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px]">{chip.title}</span>
        <span className={`font-mono text-[13px] ${chip.lime ? "text-signal" : "text-body"}`}>{chip.amount}</span>
      </span>
    </div>
  );
}

function Headline({ prefix }: { prefix: string }) {
  return (
    <h1 className="font-medium" aria-label={HERO.words.join(" ")}>
      {HERO.words.map((w, i) => (
        <span
          key={w}
          aria-hidden="true"
          className="-mb-[0.14em] mr-[0.24em] inline-block overflow-hidden pb-[0.14em] align-top"
        >
          <span className={`${prefix}-lift inline-block`}>
            <span className={`${prefix}-word inline-block ${i === HERO.words.length - 1 ? "text-signal" : ""}`}>
              {w}
            </span>
          </span>
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        gsap.set(".d-move", {
          x: CARD_FROM.x,
          y: CARD_FROM.y,
          rotationY: CARD_FROM.rotationY,
          rotationX: CARD_FROM.rotationX,
        });
        gsap.set(".d-spin", { rotation: CARD_FROM.rotation, scale: CARD_FROM.scale });
        gsap.set(".d-line", {
          x: CARD_FROM.x + 210,
          y: cardBottom(CARD_FROM.y, CARD_FROM.scale) + 10,
          scaleY: 140 / LINE_H,
          transformOrigin: "50% 0%",
        });

        const intro = gsap.timeline({ defaults: { ease: EASE.expo } });
        intro
          .from(".d-word", { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.15)
          .from(".d-card-in", { y: 80, autoAlpha: 0, duration: 1.4 }, 0.3)
          .from(".d-line-in, .d-chip-in", { autoAlpha: 0, duration: 1.4 }, 0.3)
          .from(".d-text-in", { autoAlpha: 0, duration: 0.9 }, 0.6);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=120%", pin: true, scrub: 1 },
        });

        gsap.utils.toArray<HTMLElement>(".d-lift").forEach((el, i) => {
          tl.to(el, { yPercent: -110, ease: EASE.inOut, duration: 0.28 }, i * 0.025);
        });
        tl.to(".d-text", { autoAlpha: 0, y: -40, duration: 0.3 }, 0)
          .to(".d-rings", { scale: 1.35, duration: 1 }, 0)
          .to(".d-rings", { autoAlpha: 0, duration: 0.7 }, 0)
          .to(
            ".d-move",
            { x: CARD_TO.x, y: CARD_TO.y, rotationY: 0, rotationX: 0, ease: EASE.inOut, duration: 0.75 },
            0.1,
          )
          .to(".d-spin", { rotation: 0, scale: CARD_TO.scale, ease: EASE.inOut, duration: 0.75 }, 0.1)
          .to(
            ".d-line",
            { x: CARD_TO.x + 210, y: cardBottom(CARD_TO.y, CARD_TO.scale) + 10, ease: EASE.inOut, duration: 0.75 },
            0.1,
          )
          .to(".d-line", { scaleY: (900 - cardBottom(CARD_TO.y, CARD_TO.scale) - 10) / LINE_H, duration: 0.45 }, 0.55)
          .to(".d-chip", { autoAlpha: 0, duration: 0.3 }, 0.35);
        CHIP_POS.forEach((c, i) => tl.to(`.d-chip-${i}`, { y: c.drift, duration: 1 }, 0));

        // Cursor tilt before scrolling; it fades out as the card settles.
        const tiltY = gsap.quickTo(".d-tilt", "rotationY", { duration: 0.6, ease: "power3.out" });
        const tiltX = gsap.quickTo(".d-tilt", "rotationX", { duration: 0.6, ease: "power3.out" });
        let mx = 0;
        let my = 0;
        const applyTilt = () => {
          const f = 1 - easeInOut(seg(tl.progress(), 0.1, 0.85));
          tiltY(mx * 14 * f);
          tiltX(-my * 10 * f);
        };
        const onMove = (e: MouseEvent) => {
          mx = e.clientX / window.innerWidth - 0.5;
          my = e.clientY / window.innerHeight - 0.5;
          applyTilt();
        };
        tl.eventCallback("onUpdate", applyTilt);
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      });

      mm.add(MEDIA.mobile, () => {
        gsap.from(".m-word", { yPercent: 110, duration: 1.1, stagger: 0.07, ease: EASE.expo, delay: 0.15 });
        gsap.from(".m-text-in", { autoAlpha: 0, duration: 0.9, ease: EASE.expo, delay: 0.6 });
        gsap.from(".m-card", { autoAlpha: 0, y: 60, scale: 0.92, duration: 1.4, ease: EASE.expo, delay: 0.3 });
        gsap.to(".m-card", {
          scale: 0.86,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: ".m-card", start: "top 70%", end: "bottom top", scrub: 1 },
        });
      });

      mm.add(MEDIA.reduced, () => {
        gsap.from(".mob", { autoAlpha: 0, duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="beat relative overflow-hidden">
      {/* Desktop: the 1440x900 board, scaled to fit */}
      <div className="stage desk">
        <svg
          className="d-rings absolute left-0 top-0 origin-[1100px_476px]"
          width="1440"
          height="900"
          viewBox="0 0 1440 900"
          aria-hidden="true"
        >
          <circle cx="1100" cy="476" r="240" fill="none" stroke="rgba(255,255,255,0.05)" />
          <circle cx="1100" cy="476" r="330" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 7" />
          <circle cx="1100" cy="476" r="430" fill="none" stroke="rgba(255,255,255,0.03)" />
        </svg>

        <div className="absolute left-20 top-44 z-10 flex w-[720px] flex-col">
          <div className="d-text">
            <span className="d-text-in label flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
              {HERO.eyebrow}
            </span>
          </div>
          <div className="mt-7 text-[104px] leading-[0.92] tracking-[-0.055em]">
            <Headline prefix="d" />
          </div>
          <div className="d-text">
            <div className="d-text-in">
              <p className="mt-8 max-w-[440px] text-lg leading-[1.55] text-body">{HERO.body}</p>
              <div className="mt-10 flex gap-3">
                <Button href="#cta" arrow>
                  Get the card
                </Button>
                <Button href="#anatomy" variant="secondary">
                  See how it works
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-line-in absolute inset-0">
          <div
            className="d-line absolute left-0 top-0 w-px bg-[linear-gradient(180deg,#C6F432,rgba(198,244,50,0))]"
            style={{ height: LINE_H }}
          />
        </div>

        <div className="absolute inset-0 perspective-[1600px]">
          <div className="d-card-in preserve-3d absolute inset-0">
            <div className="d-move preserve-3d absolute left-0 top-0 h-[265px] w-[420px]">
              <div className="d-tilt preserve-3d size-full">
                <div className="d-spin size-full rounded-[20px] shadow-[0_60px_100px_rgba(0,0,0,0.55)]">
                  <Card />
                </div>
              </div>
            </div>
          </div>
        </div>

        {HERO.chips.map((chip, i) => (
          <div key={chip.title} className={`d-chip d-chip-${i} absolute ${CHIP_POS[i].className}`}>
            <div className="d-chip-in">
              <Chip chip={chip} />
            </div>
          </div>
        ))}

        <div className="d-text absolute inset-x-20 bottom-9 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
          <span className="d-text-in flex items-center gap-3">
            <span className="h-7 w-px bg-white/25" />
            Scroll to unfold
          </span>
          <span className="d-text-in">{PARTNER_LINE}</span>
        </div>
      </div>

      {/* Mobile */}
      <div className="mob mx-auto max-w-3xl px-5 pb-16 pt-32">
        <span className="m-text-in label flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
          {HERO.eyebrow}
        </span>
        <div className="mt-6 text-[clamp(44px,13vw,80px)] leading-[0.92] tracking-[-0.055em]">
          <Headline prefix="m" />
        </div>
        <div className="m-text-in">
          <p className="mt-6 text-[17px] leading-[1.55] text-body">{HERO.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#cta" arrow>
              Get the card
            </Button>
            <Button href="#anatomy" variant="secondary">
              See how it works
            </Button>
          </div>
        </div>
        <div className="m-card mx-auto mt-14 w-fit origin-top [zoom:0.72] min-[480px]:[zoom:1]">
          <div className="-rotate-6 rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
            <Card />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3">
          {HERO.chips.map((chip) => (
            <div key={chip.title} className="w-fit">
              <Chip chip={chip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
