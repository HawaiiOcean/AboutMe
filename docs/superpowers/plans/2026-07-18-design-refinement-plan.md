# Design Refinement — Precision Academic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine visual design from generic academic template to "Precision Academic" — cooler neutrals, Cormorant Garamond + IBM Plex Mono typography, orchestrated page-load entry, refined hover interactions, circuit-trace sidebar detail.

**Architecture:** All changes are CSS-level — color tokens in Tailwind config, font swaps in Base layout, animation classes in global.css, hover refinements in individual Astro components. No new JS libraries. i18n untouched.

**Tech Stack:** Astro v5, Tailwind CSS v3, CSS animations (no JS animation lib).

## Global Constraints

- Color tokens: `surface: #f8f9fb`, `text-secondary: #5f6368`, `accent: #9b7a2e`, `accent-subtle: #ede4d3`, `border: #e8eaed`, `nav-active: #fdf8ed` (keep cream)
- Fonts: Cormorant Garamond (display), Inter (body), IBM Plex Mono (technical)
- Sidebar width: `lg:w-[300px]`, right offset: `lg:ml-[300px]`
- Card border-radius: `rounded-lg` (8px)
- Motion easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`, durations 150/200/300ms
- No JS animation libraries. Respect `prefers-reduced-motion`
- i18n files untouched

---

### Task 1: Update Tailwind Config & Global CSS

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Update tailwind.config.mjs colors and fonts**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#f8f9fb',
        'text-primary': '#1a1a1a',
        'text-secondary': '#5f6368',
        accent: '#9b7a2e',
        'accent-light': '#b8943a',
        'accent-subtle': '#ede4d3',
        'nav-active': '#fdf8ed',
        border: '#e8eaed',
        cream: '#fdf8ed',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Noto Serif SC', 'serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        content: '960px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-scale': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-up': 'fade-up 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-scale': 'fade-scale 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'pulse-dot': 'pulse-dot 1.2s ease-out 1',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Update global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-text-primary font-sans antialiased;
  }

  ::selection {
    @apply bg-accent/15;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* Orchestrated entry — staggered delays via data attributes */
  .entry-item { opacity: 0; }
  .entry-item[data-delay="0"]   { animation: fade-scale 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 0ms both; }
  .entry-item[data-delay="1"]   { animation: fade-up 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 80ms both; }
  .entry-item[data-delay="2"]   { animation: fade-up 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 160ms both; }
  .entry-item[data-delay="3"]   { animation: fade-in 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 240ms both; }
  .entry-item[data-delay="4"]   { animation: fade-up 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 320ms both; }
  .entry-item[data-delay="5"]   { animation: fade-in 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) 400ms both; }

  /* Section divider */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 56px 0 48px;
  }
  .section-divider::before,
  .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8eaed;
  }
  .section-divider-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #9b7a2e;
    flex-shrink: 0;
  }
  .section-divider-dot.animate {
    animation: pulse-dot 1.2s ease-out 1 both;
  }

  /* Content fade into nav */
  .content-fade-mask {
    mask-image: linear-gradient(to bottom, transparent 0, black 40px);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 40px);
    padding-top: 40px;
    margin-top: -40px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "feat: update design tokens — colors, fonts, animations

- Colors: desaturated gold #9b7a2e, cooler surface #f8f9fb, lighter borders
- Fonts: Cormorant Garamond (serif), IBM Plex Mono (mono/technical)
- Animations: fade-in, fade-up, fade-scale keyframes with staggered entry
- Section divider component styles
- Content fade mask for nav edge
- prefers-reduced-motion support

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Update Base Layout — Fonts & Content Mask

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Update Google Fonts link and sidebar width**

Change the Google Fonts `<link>` from:
```html
href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
```
to:
```html
href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
```

Change sidebar width references from `lg:w-[320px]`/`lg:ml-[320px]` to `lg:w-[300px]`/`lg:ml-[300px]`.

Add `content-fade-mask` class to the `<main>` element.

The body structure becomes:
```astro
  <body>
    <div class="lg:flex">
      <Sidebar lang={lang} profile={profile} currentPath={currentPath} />
      <div class="lg:ml-[300px] min-h-screen w-full">
        <ContentNav lang={lang} />
        <main class="content-fade-mask px-8 py-12 max-w-3xl mx-auto">
          <slot />
        </main>
      </div>
    </div>
  </body>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: update fonts to Cormorant Garamond + IBM Plex Mono, sidebar 300px, content fade mask

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Refine Sidebar — Width, Circuit Border, Entry Animation

**Files:**
- Modify: `src/components/Sidebar.astro`

- [ ] **Step 1: Add entry animation classes and circuit-trace border**

1. Change `lg:w-[320px]`→`lg:w-[300px]` in the `<aside>` class
2. Add `data-delay` attributes to each element:
   - Avatar wrapper: `class="entry-item" data-delay="0"` + existing classes
   - Name: `class="entry-item" data-delay="1"` + existing classes
   - Title: `class="entry-item" data-delay="2"` + existing classes
   - Social icons row: `class="entry-item" data-delay="3"` + existing classes
   - Research card: `class="entry-item" data-delay="4"` + existing classes
3. Replace the `border-r border-border` on the `<aside>` with this circuit-trace SVG border:

On the `<aside>`, remove `border-r border-border` and add `class="lg:fixed lg:top-0 lg:left-0 lg:w-[300px] lg:h-screen lg:overflow-y-auto w-full bg-white flex flex-col items-center px-6 py-10 lg:py-12 text-center relative"`

After the closing `</aside>`, add this SVG trace element (hidden on mobile, visible on desktop):
```html
<div class="hidden lg:block absolute top-0 left-[300px] h-full pointer-events-none" style="width: 2px;">
  <svg width="2" height="100%" class="block" preserveAspectRatio="none" viewBox="0 0 2 800" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="0" x2="1" y2="300" stroke="#e8eaed" stroke-width="1" />
    <line x1="1" y1="300" x2="1" y2="320" stroke="#e8eaed" stroke-width="1" />
    <!-- Angled trace (circuit-like) at ~40% down -->
    <polyline points="1,320 7,326 7,334 1,340" stroke="#d0d4d9" stroke-width="1" fill="none" />
    <line x1="1" y1="340" x2="1" y2="800" stroke="#e8eaed" stroke-width="1" />
  </svg>
</div>
```

Actually, simpler: just add a decorative pseudo-element or an absolutely-positioned SVG inside the sidebar div. Let me adjust — since the `<aside>` is `lg:fixed`, the circuit trace should be rendered as an absolutely positioned child or an SVG next to the sidebar.

Simplest approach: wrap sidebar + trace in a container:
```astro
<div class="lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-[300px] lg:z-30">
  <aside class="w-full h-full bg-white flex flex-col items-center px-6 py-10 lg:py-12 text-center overflow-y-auto">
    <!-- ... all sidebar content ... -->
  </aside>
  <!-- Circuit trace line on right edge -->
  <div class="hidden lg:block absolute top-0 right-0 h-full w-[2px] pointer-events-none" aria-hidden="true">
    <svg width="2" height="100%" preserveAspectRatio="none" viewBox="0 0 2 800" fill="none" class="block h-full">
      <line x1="1" y1="0" x2="1" y2="280" stroke="#e8eaed" stroke-width="1"/>
      <polyline points="1,280 7,286 7,294 1,300" stroke="#d0d4d9" stroke-width="1"/>
      <line x1="1" y1="300" x2="1" y2="800" stroke="#e8eaed" stroke-width="1"/>
    </svg>
  </div>
</div>
```

- [ ] **Step 2: Adjust right content margin to lg:ml-[300px]**

In Base.astro (already done in Task 2).

- [ ] **Step 3: Remove old `border-r border-border` from the `<aside>`**

The circuit trace replaces the border.

- [ ] **Step 4: Commit**

```bash
git add src/components/Sidebar.astro
git commit -m "feat: sidebar 300px, circuit-trace border, orchestrated entry animation

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Refine ContentNav — Sliding Underline

**Files:**
- Modify: `src/components/ContentNav.astro`

- [ ] **Step 1: Replace cream block active state with sliding underline**

Replace the nav item styling. The current `data-[active=true]:bg-nav-active` approach switches to an underline indicator:

```astro
<nav class="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border">
  <div class="max-w-3xl mx-auto px-8 py-3 flex items-center gap-6 relative">
    {links.map((link) => (
      <a
        href={`#${link.id}`}
        data-nav={link.id}
        class="relative text-sm py-2 transition-colors duration-200
               data-[active=true]:text-accent data-[active=true]:font-medium
               text-text-secondary hover:text-text-primary
               after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300
               after:w-0 data-[active=true]:after:w-full"
      >
        {link.label[lang]}
      </a>
    ))}
  </div>
</nav>
```

The `after:` pseudo-element creates a 2px gold underline that grows from 0 to full width on the active item. This naturally transitions between nav items as they activate.

Keep the existing IntersectionObserver script (unchanged).

- [ ] **Step 2: Commit**

```bash
git add src/components/ContentNav.astro
git commit -m "feat: sliding underline nav indicator replaces cream block

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Refine PublicationCard — Left-Border Accent Hover

**Files:**
- Modify: `src/components/PublicationCard.astro`

- [ ] **Step 1: Replace hover lift+shadow with left-border highlight**

Change the card wrapper from:
```astro
<article class="bg-surface rounded-xl p-5 mb-4">
```
to:
```astro
<article class="bg-surface rounded-lg p-5 mb-4 border-l-2 border-transparent transition-all duration-200 hover:border-l-accent">
```

Change title to add a slight indent on hover:
```astro
<h3 class="font-serif font-semibold text-base text-text-primary mb-1.5 leading-snug transition-transform duration-200 group-hover:translate-x-1">
```

Wrap the card in a `group`:
```astro
<article class="group bg-surface rounded-lg p-5 mb-4 border-l-2 border-transparent transition-all duration-200 hover:border-l-accent">
```

The card now:
- Has 2px left border, transparent by default, turns gold on hover
- Title shifts right 4px on hover via `group-hover:translate-x-1`
- No lift, no shadow
- Sharper corners (rounded-lg = 8px)

- [ ] **Step 2: Add mono font class to journal text**

Change journal from:
```astro
<p class="text-xs text-accent-light mt-1 font-medium">
```
to:
```astro
<p class="text-xs text-accent-light mt-1 font-medium font-mono">
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PublicationCard.astro
git commit -m "feat: publication card — left-border accent hover, sharper corners, mono journal

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Add Section Divider & Final Polish

**Files:**
- Modify: `src/components/Publications.astro`

- [ ] **Step 1: Add section divider before publications list**

Insert the divider between the heading and the publication cards:

```astro
<section id="publications" class="py-16">
  <div class="section-divider" aria-hidden="true">
    <div class="section-divider-dot" id="publications-dot"></div>
  </div>

  <div class="flex items-baseline justify-between mb-6">
    <h2 class="font-serif text-2xl font-bold text-text-primary">{heading}</h2>
  </div>

  {sorted.map((pub) => (
    <PublicationCard pub={pub} lang={lang} ownerName={ownerName} />
  ))}
</section>

<script>
  // One-time pulse animation when divider scrolls into view
  const dot = document.getElementById('publications-dot');
  if (dot) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dot.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 1 });
    observer.observe(dot);
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Publications.astro
git commit -m "feat: add section divider with animated gold dot between About and Publications

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Verify Build

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: Clean build, no errors, dist/ output correct.

- [ ] **Step 2: Quick spot-check in output**

```bash
grep -o 'Cormorant' dist/_astro/*.css | head -1
grep -o '#9b7a2e\|#f8f9fb\|#5f6368\|#e8eaed\|#ede4d3' dist/_astro/*.css | head -5
grep -o 'fade-in\|fade-up\|fade-scale\|prefers-reduced-motion' dist/_astro/*.css | head -5
```
Expected: all new color values and animation names found in the built CSS.

- [ ] **Step 3: Verify entry animation classes in HTML**

```bash
grep -c 'entry-item' dist/zh/index.html
grep -c 'data-delay' dist/zh/index.html
```
Expected: counts > 0 (animation attributes present in HTML).

- [ ] **Step 4: Commit any fixes, then final commit**

```bash
git add -A
git commit -m "chore: build verification pass

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|-----------------|------|
| Color tokens (surface, accent, border, etc.) | Task 1 |
| Typography (Cormorant Garamond, IBM Plex Mono) | Task 1, Task 2 |
| Sidebar 320→300px | Task 2, Task 3 |
| Circuit-trace border | Task 3 |
| Card border-radius 8px | Task 5 |
| Orchestrated entry animation | Task 1 (CSS), Task 3 (HTML attrs) |
| Publication card left-border hover | Task 5 |
| ContentNav sliding underline | Task 4 |
| Social icon hover scale | Task 3 (inline classes already present) |
| Content fade mask at nav | Task 1 (CSS), Task 2 (HTML) |
| Section divider with dot | Task 6 |
| prefers-reduced-motion | Task 1 |
| Scroll-spy (existing, unchanged) | Task 4 (preserves JS) |
| i18n untouched | All tasks (no i18n files modified) |
