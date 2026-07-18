# Personal Website Design Spec

**Date:** 2026-07-18
**Status:** Approved

---

## 1. Overview

A bilingual (zh/en) personal website for a first-year master's student specializing in chip front-end design, with additional knowledge in AI algorithms, AI Infra, and front-end development. The site serves as both a professional portfolio and a personal corner — combining a comprehensive online resume with a space for experimentation.

**Core constraints:** Pure static output for deployment to both GitHub Pages and Cloudflare Pages.

---

## 2. Goals & Non-Goals

### Goals
- Present personal introduction, experience, tech stack, and projects in a clean, scannable layout
- Bilingual support (Chinese / English) with a toggle button always visible
- Responsive design: desktop + mobile
- Subtle micro-interactions that feel polished but not overwhelming
- Easy content maintenance — editing text or adding projects should not require changing component code
- Deploy to both GitHub Pages and Cloudflare Pages from a single build

### Non-Goals
- Blog / CMS functionality (can be added later)
- Dark mode toggle (can be added later as a color-scheme preference)
- Backend / API / database — pure static site

---

## 3. Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | **Astro v5** | Island architecture, zero JS by default, built-in i18n routing, outputs pure static HTML/CSS |
| Styling | **Tailwind CSS v3** | Utility-first, easy micro-interactions via utilities (group-hover, transition, etc.), large ecosystem |
| Fonts | **Inter** (headings/body), **JetBrains Mono** (code/tech labels), system Chinese fonts | Modern, clean, performant (Inter from Google Fonts) |
| Animations | CSS transitions/transforms + Intersection Observer | No heavy animation library; all micro-interactions handled with CSS and minimal vanilla JS |
| Hosting | GitHub Pages + Cloudflare Pages | Both support static site deployment from Git |
| CI/CD | GitHub Actions | Single build step, dual deploy |

---

## 4. Page Structure (Single-Page Scroll)

```
1. Hero         — Name, role tagline, brief self-description
2. About        — Personal intro, education, research direction, interests
3. Experience   — Timeline: education, research, internships, notable activities
4. Tech Stack   — Grouped display: Chip Design / AI & Infra / Frontend
5. Projects     — Card grid with category filter (All / Chip / AI / Frontend)
6. Contact      — GitHub, email, LinkedIn, etc.
7. Footer       — Copyright, language switch, back-to-top
```

**Navigation:** Fixed top navbar. Desktop: horizontal links + language toggle on the right. Mobile: hamburger menu + slide-in drawer. Language toggle always visible.

---

## 5. Visual Design

### 5.1 Color Palette (Bright Minimal)

```
Background        #ffffff
Secondary bg      #f7f7f7     (cards, sections)
Primary text      #1a1a1a
Secondary text    #6b6b6b     (dates, descriptions)
Accent            #2563eb     (links, buttons, active states)
Border            #e5e5e5     (card borders, dividers)
```

### 5.2 Typography

- **Headings (EN)**: Inter, weight 600–700
- **Body (EN)**: Inter, weight 400
- **Headings/Body (ZH)**: System font stack (PingFang SC, Microsoft YaHei, Noto Sans SC)
- **Code/Tech labels**: JetBrains Mono

### 5.3 Spacing

Generous white space. Sections separated by 120–160px vertical padding. Content max-width ~960px, centered.

### 5.4 Micro-Interactions

| Element | Interaction |
|---------|-------------|
| Navbar | Shrinks slightly + subtle shadow on scroll |
| Section content | Fade-in + translateY(20px → 0) on scroll into view (Intersection Observer) |
| Project cards | Hover: translateY(-4px) + shadow deepens |
| Tech stack tags | Hover: border/background transitions from gray to accent blue |
| Language switch | Smooth content transition, no page flash |
| Mobile menu | Hamburger icon morph + drawer slides in from right |
| Back-to-top button | Appears after scrolling past hero, smooth scroll to top on click |

All animations use CSS `transition` / `transform` for GPU-accelerated performance. No heavy animation library.

---

## 6. i18n Architecture

**Route-based i18n:**
- `/en/` — English version
- `/zh/` — Chinese version
- `/` — Redirect to browser's preferred language (Accept-Language header or navigator.language)

**Content structure:**
```
src/content/
├── zh/
│   ├── about.md
│   ├── experience.json
│   ├── projects.json
│   └── techstack.json
└── en/
    ├── about.md
    ├── experience.json
    ├── projects.json
    └── techstack.json
```

**Language switch button:** Top-right of navbar. Clicking navigates to the corresponding page in the other language (e.g., `/zh/` → `/en/`). Current language is visually indicated.

---

## 7. Component Tree

```
layouts/
  Base.astro              — Shell: <html>, meta tags, fonts, Nav + Footer + LangSwitch

components/
  Nav.astro               — Fixed navbar, scroll shrink, desktop links / mobile hamburger
  Footer.astro            — Copyright, back-to-top button
  Hero.astro              — Name, tagline, optional subtle background decoration
  About.astro             — Personal intro from markdown content
  Experience.astro        — Vertical timeline from JSON data
  TechStack.astro         — Grouped tech tags with category headings
  Projects.astro          — Filter bar + responsive card grid
  ProjectCard.astro       — Individual project card (thumbnail, title, tags, links)
  Contact.astro           — Contact links with icons
  LangSwitch.astro        — Bilingual toggle button
  ScrollReveal.astro      — Wrapper component: observes visibility for scroll-triggered animation

pages/
  zh/index.astro          — Chinese homepage
  en/index.astro          — English homepage
  index.astro             — Root: detect language and redirect
```

---

## 8. Content Data Schemas

### projects.json
```json
[
  {
    "id": "riscv-cpu",
    "title": { "zh": "RISC-V CPU 设计", "en": "RISC-V CPU Design" },
    "description": { "zh": "...", "en": "..." },
    "category": "chip",
    "tags": ["Verilog", "SystemVerilog", "FPGA"],
    "links": { "github": "...", "demo": "..." },
    "featured": true
  }
]
```

### experience.json
```json
[
  {
    "type": "education",
    "title": { "zh": "XX大学 集成电路工程 硕士", "en": "M.S. in IC Engineering, XX University" },
    "date": "2025 - 2028",
    "description": { "zh": "...", "en": "..." }
  }
]
```

### techstack.json
```json
{
  "categories": [
    {
      "key": "chip-design",
      "name": { "zh": "芯片前端设计", "en": "Chip Front-End Design" },
      "items": [
        { "name": "Verilog", "icon": "..." },
        { "name": "SystemVerilog", "icon": "..." }
      ]
    }
  ]
}
```

### about.md
Markdown files per language with free-form text content.

---

## 9. Deployment Pipeline

```
Developer pushes to main
        ↓
GitHub Actions triggers
        ↓
npm install && npm run build
        ↓
dist/ generated (pure static HTML/CSS/JS)
        ↓
    ┌───────────────────┐
    ↓                   ↓
Deploy to            Deploy to
gh-pages branch      Cloudflare Pages
(GitHub Pages)       (via Git integration
                      or wrangler CLI)
```

- **GitHub Pages:** Push `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages`
- **Cloudflare Pages:** Auto-detects Astro build command. Can be set up via Cloudflare Dashboard Git integration (no extra Action needed), or via `wrangler pages deploy` in Actions

---

## 10. Browser & Device Support

- **Desktop:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile:** iOS Safari, Android Chrome
- **Responsive breakpoints:** Mobile (< 640px), Tablet (640–1024px), Desktop (> 1024px)
- **Accessibility:** Semantic HTML, focus-visible outlines, sufficient color contrast, `lang` attribute on `<html>`

---

## 11. Open Questions & Future Enhancements

- Dark mode toggle (deferred — light-only initially)
- Blog section (deferred — can add Astro content collections later)
- Analytics (simple privacy-friendly counter like Plausible or self-hosted Umami)
- Actual particle / circuit-board SVG decoration in Hero (nice-to-have, implement if time allows)
