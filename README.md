# Meridian

A landing page for **Meridian**, a fictional fintech product: one titanium card and a live ledger that settles, sorts and reconciles your money the moment it moves.

This is a concept project built to explore scroll choreography. The page tells its story through a single object, the card, which travels from the hero to the footer while each section is driven by scroll.

> Meridian is not a real company. All names, figures and testimonials on the page are placeholders.

## Status

Work in progress. The design and motion are finished; the build is underway.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) with ScrollTrigger, SplitText, Flip, MotionPath and DrawSVG
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- [Geist](https://vercel.com/font) and Geist Mono
- Deployed on [Vercel](https://vercel.com/)

## The scroll story

| # | Section | What happens on scroll |
|---|---|---|
| 01 | Hero | The headline lifts away word by word while the card turns to face you. Before scrolling, the card tilts with the cursor. |
| 02 | Anatomy | The card splits into four layers in 3D, and each layer lights up with its own callout before the stack closes again. |
| 03 | Money flow | A line draws itself across the page, transactions ride along it into a live ledger, and the balance counts up. |
| 04 | Features | Vertical scroll drives a horizontal rail of feature panels. |
| 05 | Numbers | Figures count up and a chart line draws in. |
| 06 | Global | Arcs draw between cities on a wireframe globe while exchange rates tick. |
| 07 | Social proof | Marquees whose speed and skew react to how fast you scroll. |
| 08 | Call to action | The headline reveals through a mask and the card lands in its slot in the footer. |

## Design

- Dark and minimal: near-black surfaces, brushed titanium on the card, and a single lime accent (`#C6F432`).
- Only `transform` and `opacity` are animated, for smooth performance.
- Reduced-motion users get simple fades with no pinning or scrubbing.
- Mobile gets its own simplified choreography.

## Getting started

Setup instructions will be added once the app is scaffolded.

## License

[MIT](LICENSE) © 2026 Sounak Pal
