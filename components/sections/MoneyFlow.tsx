"use client";

import { useRef } from "react";
import { EARLIER, INCOMING, OPENING_BALANCE } from "@/lib/content";
import { EASE, MEDIA, MotionPathPlugin, easeInOut, easeOut, gsap, money, seg, useGSAP } from "@/lib/gsap";

const FLOW_PATH = "M560 0 V200 C560 380 660 470 840 470 L1000 470";
const ROW_H = 62;

// Newest first, so the first transaction to land sits just above the older rows.
const NEW_ROWS = [...INCOMING.keys()].reverse();

function Balance({ prefix }: { prefix: string }) {
  const [d, c] = money(OPENING_BALANCE).split(".");
  return (
    <span className="text-[44px] font-medium tabular-nums tracking-[-0.04em]">
      $<span className={`${prefix}-bal-d`}>{d}</span>
      <span className="text-dim">
        .<span className={`${prefix}-bal-c`}>{c}</span>
      </span>
    </span>
  );
}

function Row({
  a,
  n,
  meta,
  amt,
  lime,
  className = "",
}: {
  a: string;
  n: string;
  meta: string;
  amt: string;
  lime?: boolean;
  className?: string;
}) {
  return (
    <div className={`group h-[62px] ${className}`}>
      <div className="flex items-center gap-3 rounded-[14px] border border-transparent p-3 transition-colors duration-300 group-[.is-hot]:border-signal/35 group-[.is-hot]:bg-signal/6">
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white/5 font-mono text-[11px]">
          {a}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm">{n}</span>
          <span className="truncate font-mono text-[11px] uppercase text-fog transition-colors duration-300 group-[.is-hot]:text-signal">
            {meta}
          </span>
        </div>
        <span className={`whitespace-nowrap font-mono text-sm ${lime ? "text-signal" : "text-bone"}`}>{amt}</span>
      </div>
    </div>
  );
}

function Ledger({ prefix, className = "" }: { prefix: string; className?: string }) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-[28px] border border-hairline bg-graphite p-7 shadow-[0_40px_100px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">Ledger</span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-fog">TODAY</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] tracking-[0.12em] text-fog">BALANCE</span>
        <Balance prefix={prefix} />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className={`${prefix}-rows`}>
          {NEW_ROWS.map((i) => (
            <Row key={INCOMING[i].a} {...INCOMING[i]} className={`${prefix}-row ${prefix}-row-${i}`} />
          ))}
          {EARLIER.map((r) => (
            <Row key={r.a} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MoneyFlow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Shared ledger renderer: landed[i] is 0..1 for each incoming transaction.
      const renderLedger = (prefix: string, landed: number[], hotUntil: boolean) => {
        const q = gsap.utils.selector(root);
        const total = OPENING_BALANCE + INCOMING.reduce((s, tx, i) => s + tx.delta * landed[i], 0);
        const [d, c] = money(total).split(".");
        q(`.${prefix}-bal-d`)[0].textContent = d;
        q(`.${prefix}-bal-c`)[0].textContent = c;

        const sum = landed.reduce((s, l) => s + l, 0);
        gsap.set(q(`.${prefix}-rows`), { y: -(INCOMING.length - sum) * ROW_H });

        let newest = -1;
        landed.forEach((l, i) => {
          if (l > 0) newest = i;
        });
        INCOMING.forEach((_, i) => {
          const row = q(`.${prefix}-row-${i}`)[0];
          row.style.opacity = String(landed[i]);
          row.classList.toggle("is-hot", i === newest && hotUntil);
        });
      };

      mm.add(MEDIA.desktop, () => {
        const path = root.current!.querySelector<SVGPathElement>(".f-path")!;
        const raw = MotionPathPlugin.cacheRawPathMeasurements(MotionPathPlugin.getRawPath(path));
        const at = (frac: number) => MotionPathPlugin.getPositionOnPath(raw, gsap.utils.clamp(0, 1, frac));
        const chips = gsap.utils.toArray<HTMLElement>(".f-chip");
        const heads = gsap.utils.toArray<SVGCircleElement>(".f-head");

        gsap.set(chips, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        renderLedger("d", [0, 0, 0], false);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", pin: true, scrub: 1 },
          onUpdate() {
            const p = tl.progress();
            const draw = seg(p, 0, 0.55);
            const head = at(draw);
            heads.forEach((h) => {
              h.setAttribute("cx", String(head.x));
              h.setAttribute("cy", String(head.y));
              h.style.opacity = draw > 0 && draw < 1 ? "1" : "0";
            });

            // A chip never runs ahead of the line that is drawing it.
            chips.forEach((chip, i) => {
              const t = seg(p, 0.12 + i * 0.14, 0.5 + i * 0.14);
              const pos = at(Math.min(easeInOut(t), draw));
              gsap.set(chip, { x: pos.x, y: pos.y, autoAlpha: t > 0 && t < 1 ? 1 : 0 });
            });

            const landed = INCOMING.map((_, i) => easeOut(seg(p, 0.5 + i * 0.14, 0.58 + i * 0.14)));
            renderLedger("d", landed, p < 0.98);
          },
        });

        tl.fromTo(".f-text", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0)
          .fromTo(".f-panel", { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, ease: EASE.out, duration: 0.15 }, 0)
          .fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.55 }, 0)
          .set({}, {}, 1);
      });

      mm.add(MEDIA.mobile, () => {
        renderLedger("m", [0, 0, 0], false);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".m-ledger", start: "top 85%", end: "bottom 45%", scrub: 1 },
          onUpdate() {
            const p = tl.progress();
            const landed = INCOMING.map((_, i) => easeOut(seg(p, 0.3 + i * 0.2, 0.45 + i * 0.2)));
            renderLedger("m", landed, p < 0.98);
          },
        });
        tl.fromTo(".m-flow-line", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9 }, 0).set({}, {}, 1);
      });

      mm.add(MEDIA.reduced, () => {
        renderLedger("m", [1, 1, 1], false);
      });
    },
    { scope: root },
  );

  return (
    <section id="ledger" ref={root} className="beat relative overflow-hidden">
      <div className="stage desk">
        <div className="f-text absolute inset-y-0 left-20 flex w-[400px] flex-col justify-center gap-7">
          <span className="label">[ 03 ] Live ledger</span>
          <h2 className="text-[72px] font-medium leading-[0.95] tracking-[-0.05em]">
            Every swipe,
            <br />
            settled.
          </h2>
          <p className="text-[17px] leading-[1.55] text-body">
            Transactions post the moment the card is tapped, sorted by category and matched to their receipts. There is
            no pending column.
          </p>
        </div>

        <svg className="absolute left-0 top-0" width="1440" height="900" viewBox="0 0 1440 900" aria-hidden="true">
          <path d={FLOW_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="3 7" />
          <path
            className="f-path drop-shadow-[0_0_6px_rgba(198,244,50,0.6)]"
            d={FLOW_PATH}
            fill="none"
            stroke="#C6F432"
            strokeWidth="2"
          />
          <circle className="f-head" cx="560" cy="0" r="5" fill="#C6F432" opacity="0" />
          <circle className="f-head" cx="560" cy="0" r="14" fill="none" stroke="rgba(198,244,50,0.35)" opacity="0" />
        </svg>

        {INCOMING.map((tx) => (
          <div
            key={tx.a}
            className="f-chip absolute left-0 top-0 flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-signal/45 bg-[rgba(20,22,26,0.88)] py-[9px] pl-[9px] pr-3.5 shadow-[0_0_30px_rgba(198,244,50,0.12)]"
            aria-hidden="true"
          >
            <span className="flex size-[26px] items-center justify-center rounded-[7px] bg-signal/12 font-mono text-[11px] text-signal">
              {tx.a}
            </span>
            <span className="text-[13px]">{tx.n}</span>
            <span className={`font-mono text-[13px] ${tx.lime ? "text-signal" : "text-body"}`}>{tx.amt}</span>
          </div>
        ))}

        <Ledger prefix="d" className="f-panel absolute left-[1000px] top-[130px] h-[640px] w-[360px]" />
      </div>

      <div className="mob mx-auto max-w-3xl px-5 py-20">
        <span className="label">[ 03 ] Live ledger</span>
        <h2 className="mt-5 text-[44px] font-medium leading-[0.95] tracking-[-0.05em]">
          Every swipe,
          <br />
          settled.
        </h2>
        <p className="mt-5 text-[17px] leading-[1.55] text-body">
          Transactions post the moment the card is tapped, sorted by category and matched to their receipts. There is no
          pending column.
        </p>
        <div className="m-ledger relative mt-10 pl-6">
          <svg
            className="absolute left-0 top-0 h-full w-2"
            viewBox="0 0 8 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="100"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              strokeDasharray="3 7"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="m-flow-line"
              x1="4"
              y1="0"
              x2="4"
              y2="100"
              stroke="#C6F432"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <Ledger prefix="m" className="h-[560px]" />
        </div>
      </div>
    </section>
  );
}
