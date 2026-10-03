"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import { Button } from "./Button";
import { LogoMark } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "border-white/6 bg-void/60 backdrop-blur-md" : "border-white/6 bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:h-[76px] lg:px-20"
        aria-label="Main"
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="Meridian home">
          <LogoMark />
          <span className="text-[19px] font-medium tracking-[-0.02em]">meridian</span>
        </a>
        <div className="hidden gap-9 text-sm text-[#A3A8B0] lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-bone">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#cta" className="hidden text-[#A3A8B0] transition-colors hover:text-bone sm:inline">
            Sign in
          </a>
          <Button href="#cta" variant="light" size="sm">
            Get the card
          </Button>
        </div>
      </nav>
    </header>
  );
}
