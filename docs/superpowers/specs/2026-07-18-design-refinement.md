# Design Refinement Spec — Precision Academic

**Date:** 2026-07-18
**Status:** Approved

---

## 0. Design Philosophy

"Precision over decoration." The subject's world — chip design, silicon wafers, photomasks, circuit traces — provides a distinctive visual language. Break away from the AI-default academic template (warm cream + serif + terracotta accent) by introducing cooler neutrals, a technical mono face, and a signature circuit-trace detail.

---

## 1. Color Tokens

| Token | Current | New | Purpose |
|-------|---------|-----|---------|
| `bg-primary` | `#ffffff` | — | kept |
| `bg-surface` | `#f5f5f7` | `#f8f9fb` | cooler neutral, escape warm-cream template |
| `text-primary` | `#1a1a1a` | — | kept |
| `text-secondary` | `#6b6b6b` | `#5f6368` | slightly cooler |
| `accent` | `#b8860b` | `#9b7a2e` | desaturated gold — copper interconnect, not decorative gold |
| `accent-subtle` | — | `#ede4d3` | micro accent for hover backgrounds |
| `border` | `#e5e5e5` | `#e8eaed` | lighter, barely visible |

Update `tailwind.config.mjs` colors accordingly.

---

## 2. Typography

| Role | Current | New | Rationale |
|------|---------|-----|-----------|
| Display (headings) | Playfair Display | **Cormorant Garamond** (400/600/700) | thinner strokes, more scholarly, less generic |
| Body | Inter (400/500/600/700) | — | kept |
| Technical (tags, journal, code terms) | — | **IBM Plex Mono** (400/500) | echoes hardware description languages and EDA tools |

Update Google Fonts link in `Base.astro` and fontFamily in `tailwind.config.mjs`.

---

## 3. Layout

Two-column fixed sidebar architecture unchanged. Adjust:
- Sidebar width: 320px → 300px (tighter, more precise)
- Sidebar border-right: plain 1px solid → a thin line with one 45° angled segment in the upper third (the "circuit trace" signature)
- Section divider: 1px hairline + centered 4px gold dot between About and Publications (like a chip layout alignment marker)
- Card border-radius: `rounded-xl` (12px) → `rounded-lg` (8px) — sharper, more technical

---

## 4. Motion & Animation System

### 4.1 Design Token

```
easing: cubic-bezier(0.22, 0.61, 0.36, 1)  — fast settle, no bounce
duration-short: 150ms
duration-medium: 200ms
duration-long: 300ms
displacement: 4-8px
```

### 4.2 Orchestrated Entry (page load only)

Sidebar elements fade in sequentially, like chip modules powering up:

| Element | Delay | Animation |
|---------|-------|-----------|
| Avatar | 0ms | fade-in + scale(0.96→1) |
| Name | 80ms | fade-in + translateY(6px→0) |
| Title/Affiliation | 160ms | fade-in + translateY(6px→0) |
| Social icons | 240ms | fade-in only |
| Research card | 320ms | fade-in + translateY(4px→0) |
| Main content | 400ms | fade-in only |

Total: ~600ms. No staggered reveal on scroll — only page load.

### 4.3 Hover Micro-Interactions

| Element | Interaction |
|---------|------------|
| Publication card | left border 1px→2px, color `border`→`accent`, title shifts right 4px |
| Tech/mono tags | text color gray→gold, no background change |
| Social icons | scale(1.1) + color→accent, 200ms |
| ContentNav items | 2px gold underline slides via `translateX` transition (replaces cream block bg) |
| Like heart button | click: scale(1→1.15→1), subtle bounce |

### 4.4 Scroll-Driven Effects

- **ContentNav indicator:** 2px gold underline, position interpolates via `transform: translateX` between About and Publications as sections scroll into view. `transition: transform 300ms ease-out`.
- **Content fade at nav edge:** Right content area gets `mask-image: linear-gradient(to bottom, transparent 0, black 40px)` so scrolling content softly disappears as it nears the sticky nav bar. CSS only.

### 4.5 Section Divider

Between About and Publications: a 1px horizontal line with a centered 4px accent-colored dot. The dot has a subtle pulse animation on first scroll into view (one-time, then still). CSS-only.

---

## 5. Component Changes

### 5.1 `tailwind.config.mjs`
- New color values (accent, surface, border, etc.)
- Add `font-mono` → IBM Plex Mono
- Add `font-serif` → Cormorant Garamond

### 5.2 `Base.astro`
- Update Google Fonts link (replace Playfair → Cormorant Garamond, add IBM Plex Mono)
- Add orchestrated entry CSS animation classes
- Add scroll-driven content mask

### 5.3 `Sidebar.astro`
- Width 320→300px
- Replace plain right border with circuit-trace SVG line
- Add sequential fade-in classes to each element

### 5.4 `ContentNav.astro`
- Replace cream block active state with sliding underline

### 5.5 `PublicationCard.astro`
- Replace hover lift+shadow with left-border accent highlight
- Sharper corners

### 5.6 `Publications.astro`
- Insert section divider between About and Publications

### 5.7 `global.css`
- Add custom animation keyframes (fade-in, reveal-line)
- Add `.circuit-border` style

---

## 6. Self-Review

- ✅ Breaks warm-cream AI template via cooler neutrals + desaturated gold
- ✅ Typography: Cormorant Garamond more distinctive than Playfair; IBM Plex Mono gives technical identity
- ✅ Motion: single orchestrated entry, not scattered effects. One hover pattern (left-border) used throughout
- ✅ Signature: circuit-trace border = grounded in subject, barely visible, memorable
- ✅ Layout unchanged — no architectural risk
- ✅ i18n untouched
- ✅ All changes are CSS-level, no new JS libraries

---

## 7. Verification

1. `npm run build` passes
2. Desktop: sidebar fixed, circuit border visible, gradient content fade at nav
3. Page refresh: sequential entry animation plays
4. Hover: publication cards show left-border accent, nav items slide underline
5. Scroll: content fades into nav edge, nav indicator transitions
6. Mobile: layout unchanged (stacked), animations respect `prefers-reduced-motion`
