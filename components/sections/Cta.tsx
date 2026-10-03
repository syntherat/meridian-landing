"use client";

import { useRef } from "react";
import { Card } from "@/components/card/Card";
import { Button } from "@/components/ui/Button";
import { CTA, FOOTER_COLUMNS, PARTNER_LINE } from "@/lib/content";
import { EASE, Flip, MEDIA, SplitText, gsap, useGSAP } from "@/lib/gsap";

// Where the card enters from, in stage pixels.
const CARD_FROM = { x: 900, y: -320, rotationX: 30, rotation: -14, scale: 0.9 };

function Headline({ className = "" }: { className?: string }) {
  return (
    <h2 className={`c-head font-medium tracking-[-0.06em] ${className}`}>
      {CTA.line1}
      <br />
      {CTA.line2[0]} <span className="text-signal">{CTA.line2[1]}</span>
    </h2>
  );
}

function FooterLinks({ prefix }: { prefix: string }) {
  return (
    <>
      {FOOTER_COLUMNS.map((col) => (
        <div key={col.title} className={`${prefix}-col flex flex-col gap-3.5 text-sm`}>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim">{col.title}</span>
          {col.links.map((l) => (
            <a key={l} href="#top" className="text-body transition-colors hover:text-bone">
              {l}
            </a>
          ))}
        </div>
      ))}
    </>
  );
}

function Legal() {
  return (
    <>
      <span>© 2026 Meridian</span>
      <span>{PARTNER_LINE}</span>
    </>
  );
}

export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        const card = root.current!.querySelector<HTMLElement>(".c-card")!;
        const slot = root.current!.querySelector<HTMLElement>(".c-slot")!;

        // Measure the landing spot with the card at rest, then park it off stage.
        gsap.set(card, { x: 0, y: 0, rotationX: 0, rotation: 0, scale: 1 });
        const fit = Flip.fit(card, slot, { scale: true, getVars: true }) as gsap.TweenVars;
        gsap.set(card, { ...CARD_FROM, autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 60%", end: "top top", scrub: 1 },
          onUpdate() {
            slot.classList.toggle("is-filled", tl.progress() >= 0.99);
          },
        });

        tl.to(card, { autoAlpha: 1, duration: 0.1 }, 0.3)
          .to(card, { ...fit, rotationX: 0, rotation: 0, ease: EASE.inOut, duration: 0.7 }, 0.3)
          .fromTo(".c-copy", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.3);
        gsap.utils.toArray<HTMLElement>(".d-col").forEach((col, i) => {
          tl.fromTo(
            col,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, ease: EASE.out, duration: 0.15 },
            0.7 + i * 0.08,
          );
        });
        tl.set({}, {}, 1);

        // Lines rise out of their masks; re-split if fonts or widths change.
        SplitText.create(".d-head-wrap .c-head", {
          type: "lines",
          mask: "lines",
          linesClass: "c-line",
          autoSplit: true,
          onSplit(self) {
            return gsap
              .timeline({ scrollTrigger: { trigger: root.current, start: "top 60%", end: "top top", scrub: 1 } })
              .fromTo(self.lines[0], { yPercent: 100 }, { yPercent: 0, ease: EASE.out, duration: 0.35 }, 0)
              .fromTo(self.lines[1], { yPercent: 100 }, { yPercent: 0, ease: EASE.out, duration: 0.35 }, 0.15)
              .set({}, {}, 1);
          },
        });
      });

      mm.add(MEDIA.mobile, () => {
        SplitText.create(".m-head-wrap .c-head", {
          type: "lines",
          mask: "lines",
          linesClass: "c-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              stagger: 0.12,
              duration: 1.1,
              ease: EASE.expo,
              scrollTrigger: { trigger: ".m-head-wrap", start: "top 85%", once: true },
            });
          },
        });
        gsap.from(".m-card", {
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.2,
          ease: EASE.expo,
          scrollTrigger: { trigger: ".m-card", start: "top 90%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="cta" ref={root} className="beat relative overflow-hidden">
      <div className="stage desk">
        <div className="d-head-wrap absolute left-20 top-24 flex flex-col">
          <span className="label mb-7">{CTA.eyebrow}</span>
          <Headline className="text-[132px] leading-[0.9]" />
        </div>
        <div className="c-copy absolute right-20 top-[216px] flex w-[340px] flex-col gap-6">
          <p className="text-[17px] leading-[1.55] text-body">{CTA.body}</p>
          <Button href="#cta" className="self-start">
            Get the card
          </Button>
        </div>

        <footer className="absolute inset-x-0 bottom-0 grid h-[340px] grid-cols-12 gap-6 border-t border-hairline px-20 pb-10 pt-14">
          <div className="col-span-4">
            <div className="c-slot h-[191px] w-[302px] rounded-[15px] border border-dashed border-signal/45 transition-colors duration-300 [&.is-filled]:border-transparent" />
          </div>
          <div className="col-span-6 col-start-7 grid grid-cols-3 gap-6">
            <FooterLinks prefix="d" />
          </div>
          <div className="col-span-full flex justify-between self-end font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
            <Legal />
          </div>
        </footer>

        <div className="pointer-events-none absolute inset-0 perspective-[1400px]">
          <div className="c-card absolute left-0 top-0 rounded-[20px] shadow-[0_50px_90px_rgba(0,0,0,0.6)]">
            <Card />
          </div>
        </div>
      </div>

      <div className="mob mx-auto max-w-3xl px-5 pt-20">
        <div className="m-head-wrap">
          <span className="label">{CTA.eyebrow}</span>
          <Headline className="mt-5 text-[clamp(52px,15vw,96px)] leading-[0.9]" />
        </div>
        <p className="mt-6 text-[17px] leading-[1.55] text-body">{CTA.body}</p>
        <Button href="#cta" className="mt-6">
          Get the card
        </Button>

        <footer className="mt-20 border-t border-hairline py-12">
          <div className="m-card w-fit [zoom:0.72]">
            <Card />
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4">
            <FooterLinks prefix="m" />
          </div>
          <div className="mt-12 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
            <Legal />
          </div>
        </footer>
      </div>
    </section>
  );
}
