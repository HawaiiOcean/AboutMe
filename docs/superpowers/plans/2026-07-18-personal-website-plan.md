# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (zh/en) single-page personal website with Astro v5 + Tailwind CSS v3, deployable as pure static files to GitHub Pages and Cloudflare Pages.

**Architecture:** Astro SSG outputs pure HTML/CSS with minimal inline JS for micro-interactions. Route-based i18n (`/zh/`, `/en/`). Content lives in separate JSON/MD data files, decoupled from component code. Single-page scroll with fixed navbar and Intersection Observer-driven scroll-reveal animations.

**Tech Stack:** Astro v5, Tailwind CSS v3, TypeScript, no UI framework (vanilla Astro components), GitHub Actions for CI/CD.

## Global Constraints

- Output MUST be pure static (no SSR, no server endpoints) — `output: 'static'` in astro.config
- Tailwind CSS v3.x (not v4) — install `tailwindcss@^3`
- All text content in `src/data/{zh,en}/` — no hardcoded strings in components
- Responsive: Mobile (<640px), Tablet (640–1024px), Desktop (>1024px)
- Colors: bg=#ffffff, surface=#f7f7f7, text-primary=#1a1a1a, text-secondary=#6b6b6b, accent=#2563eb, border=#e5e5e5
- Fonts: Inter (headings/body EN), JetBrains Mono (code labels), system Chinese font stack
- Animations: CSS transforms/transitions only, no animation library
- Accessibility: semantic HTML, focus-visible outlines, sufficient contrast, `lang` attribute on `<html>`

---

## File Map

```
personal-website/
├── astro.config.mjs              — Astro config: static output, i18n, tailwind integration
├── tailwind.config.mjs           — Tailwind v3 config: custom colors, fonts, content paths
├── postcss.config.js             — PostCSS config (required by Tailwind v3)
├── tsconfig.json                 — TypeScript config (Astro default + strict)
├── package.json                  — Dependencies & scripts
├── public/
│   └── favicon.svg               — Simple SVG favicon
├── src/
│   ├── env.d.ts                  — Astro TypeScript declarations
│   ├── types.ts                  — Shared TypeScript interfaces
│   ├── styles/
│   │   └── global.css            — Tailwind directives + base styles + scroll-reveal CSS
│   ├── i18n/
│   │   └── utils.ts              — getLangFromUrl(), getRouteForLang(), translations
│   ├── data/
│   │   ├── zh/
│   │   │   └── about.md          — Chinese personal intro (language-specific)
│   │   ├── en/
│   │   │   └── about.md          — English personal intro (language-specific)
│   │   ├── experience.json       — Bilingual experience entries
│   │   ├── projects.json         — Bilingual project entries
│   │   ├── techstack.json        — Bilingual tech stack categories
│   │   └── nav.json              — Navigation items (bilingual labels)
│   ├── layouts/
│   │   └── Base.astro            — HTML shell: <html lang>, meta, fonts, Nav, main, Footer
│   ├── components/
│   │   ├── Nav.astro             — Fixed navbar, scroll shrink, desktop links, mobile hamburger
│   │   ├── Footer.astro          — Copyright, back-to-top button
│   │   ├── Hero.astro            — Name, tagline, subtitle
│   │   ├── About.astro           — Personal intro rendered from MD
│   │   ├── Experience.astro      — Vertical timeline from JSON
│   │   ├── TechStack.astro       — Grouped tech tags with category headings
│   │   ├── Projects.astro        — Filter bar + responsive card grid
│   │   ├── ProjectCard.astro     — Single project card
│   │   ├── Contact.astro         — Contact links with SVG icons
│   │   ├── LangSwitch.astro      — Language toggle button
│   │   └── ScrollReveal.astro    — Intersection Observer wrapper
│   └── pages/
│       ├── zh/
│       │   └── index.astro       — Chinese homepage
│       ├── en/
│       │   └── index.astro       — English homepage
│       └── index.astro           — Root: HTML meta redirect based on Accept-Language
└── .github/
    └── workflows/
        └── deploy.yml            — GitHub Actions: build + deploy to Pages + Cloudflare
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `postcss.config.js`, `tsconfig.json`, `src/env.d.ts`, `src/types.ts`, `public/favicon.svg`

**Interfaces:**
- Produces: Runnable `npm run dev` with blank Astro page, Tailwind CSS active

- [ ] **Step 1: Initialize Astro project**

Run from `personal-website/`:
```bash
npm create astro@latest . -- --template minimal --skip-houston --install --typescript strict
```

After init, verify:
```bash
ls package.json astro.config.mjs tsconfig.json
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/tailwind@^5 tailwindcss@^3 postcss autoprefixer
```

- [ ] **Step 3: Write astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

- [ ] **Step 4: Write tailwind.config.mjs**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        surface: '#f7f7f7',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b6b6b',
        accent: '#2563eb',
        border: '#e5e5e5',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        content: '960px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Write postcss.config.js**

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Write tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 7: Write src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 8: Write src/types.ts**

```ts
export interface Bilingual<T = string> {
  zh: T;
  en: T;
}

export interface Project {
  id: string;
  title: Bilingual;
  description: Bilingual;
  category: 'chip' | 'ai' | 'frontend';
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
  featured: boolean;
}

export interface Experience {
  type: 'education' | 'research' | 'internship' | 'activity';
  title: Bilingual;
  organization: Bilingual;
  date: string;
  description: Bilingual;
}

export interface TechCategory {
  key: string;
  name: Bilingual;
  items: { name: string }[];
}

export interface NavItem {
  id: string;
  label: Bilingual;
}
```

- [ ] **Step 9: Write src/styles/global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white text-text-primary font-sans antialiased;
  }

  ::selection {
    @apply bg-accent/20;
  }

  /* Scroll reveal initial state */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 10: Write public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#2563eb"/>
  <text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="white">H</text>
</svg>
```
(Replace "H" with your initial)

- [ ] **Step 11: Verify scaffold works**

```bash
npm run dev
```

Open http://localhost:4321 — should see a blank page. Check that `npx tailwindcss --help` works. Stop dev server.

- [ ] **Step 12: Commit**

```bash
cd /home/hanwangyang/workspace/personal-website
git init
git add -A
git commit -m "feat: scaffold Astro v5 + Tailwind CSS v3 project
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: i18n Utilities

**Files:**
- Create: `src/i18n/utils.ts`

**Interfaces:**
- Produces:
  - `getLangFromUrl(url: URL): 'zh' | 'en'`
  - `getRouteForLang(currentUrl: URL, targetLang: 'zh' | 'en'): string`
  - `useTranslations(lang: 'zh' | 'en'): { t: (bilingual: Bilingual) => string }`

- [ ] **Step 1: Write src/i18n/utils.ts**

```ts
// src/i18n/utils.ts
import type { Bilingual } from '../types';

export function getLangFromUrl(url: URL): 'zh' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'zh') return lang;
  return 'zh'; // default
}

export function getRouteForLang(currentUrl: URL, targetLang: 'zh' | 'en'): string {
  const [, , ...rest] = currentUrl.pathname.split('/');
  const path = rest.join('/');
  return `/${targetLang}/${path}`;
}

export function useTranslations(lang: 'zh' | 'en') {
  function t<T>(bilingual: Bilingual<T>): T {
    return bilingual[lang];
  }
  return { t };
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add i18n utility functions
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Content Data Files

**Files:**
- Create: `src/data/nav.json`, `src/data/zh/about.md`, `src/data/en/about.md`, `src/data/experience.json`, `src/data/projects.json`, `src/data/techstack.json`

**Interfaces:**
- Produces: Importable JSON/MD data files matching `types.ts` interfaces
- JSON files contain bilingual values — components use `useTranslations` to pick the right language
- Markdown files are language-specific (truly different content per language)

- [ ] **Step 1: Write src/data/nav.json**

```json
[
  { "id": "about", "label": { "zh": "关于", "en": "About" } },
  { "id": "experience", "label": { "zh": "经历", "en": "Experience" } },
  { "id": "techstack", "label": { "zh": "技术栈", "en": "Tech Stack" } },
  { "id": "projects", "label": { "zh": "作品", "en": "Projects" } },
  { "id": "contact", "label": { "zh": "联系", "en": "Contact" } }
]
```

- [ ] **Step 2: Write src/data/zh/about.md**

```md
## 关于我

我是一名研一学生，主攻芯片前端设计方向。同时对 AI 算法、AI Infra 和前端开发有浓厚兴趣。我喜欢探索计算机体系结构的底层原理，也享受用代码构建优雅的用户界面。

### 教育背景

- **XX大学** — 集成电路工程 硕士（2025 - 2028）
- **XX大学** — 电子科学与技术 学士（2021 - 2025）

### 研究兴趣

- 芯片前端设计与验证
- AI 加速器架构
- RISC-V 处理器设计
```

- [ ] **Step 3: Write src/data/en/about.md**

```md
## About Me

I'm a first-year master's student specializing in chip front-end design, with a strong interest in AI algorithms, AI infrastructure, and front-end development. I enjoy exploring the low-level principles of computer architecture as much as I love crafting elegant user interfaces with code.

### Education

- **XX University** — M.S. in Integrated Circuit Engineering (2025 - 2028)
- **XX University** — B.S. in Electronic Science and Technology (2021 - 2025)

### Research Interests

- Chip front-end design & verification
- AI accelerator architecture
- RISC-V processor design
```

- [ ] **Step 4: Write src/data/experience.json** (shared — bilingual values)

```json
[
  {
    "type": "education",
    "title": { "zh": "集成电路工程 硕士", "en": "M.S. in IC Engineering" },
    "organization": { "zh": "XX大学", "en": "XX University" },
    "date": "2025 - 2028",
    "description": { "zh": "研究方向：芯片前端设计", "en": "Research: Chip front-end design" }
  },
  {
    "type": "education",
    "title": { "zh": "电子科学与技术 学士", "en": "B.S. in Electronic Science" },
    "organization": { "zh": "XX大学", "en": "XX University" },
    "date": "2021 - 2025",
    "description": { "zh": "主修课程：数字集成电路设计、计算机体系结构、VLSI设计", "en": "Courses: Digital IC Design, Computer Architecture, VLSI Design" }
  }
]
```

- [ ] **Step 5: Write src/data/projects.json** (shared — bilingual values)

```json
[
  {
    "id": "riscv-cpu",
    "title": { "zh": "RISC-V 五级流水线 CPU", "en": "RISC-V 5-Stage Pipeline CPU" },
    "description": { "zh": "基于 Verilog 实现的五级流水线 RISC-V 处理器，支持 RV32I 指令集，通过 FPGA 验证。", "en": "A 5-stage pipelined RISC-V processor in Verilog, supporting RV32I ISA, verified on FPGA." },
    "category": "chip",
    "tags": ["Verilog", "RISC-V", "FPGA", "SystemVerilog"],
    "links": { "github": "https://github.com/username/riscv-cpu" },
    "featured": true
  },
  {
    "id": "ai-inference-accel",
    "title": { "zh": "AI 推理加速器设计", "en": "AI Inference Accelerator Design" },
    "description": { "zh": "设计一个面向 Transformer 推理的 systolic array 加速器，优化矩阵乘法效率。", "en": "Designed a systolic array accelerator for Transformer inference, optimizing matrix multiplication efficiency." },
    "category": "ai",
    "tags": ["PyTorch", "HLS", "Vivado", "Python"],
    "links": { "github": "https://github.com/username/ai-accel" },
    "featured": true
  },
  {
    "id": "personal-website",
    "title": { "zh": "个人网站", "en": "Personal Website" },
    "description": { "zh": "基于 Astro + Tailwind CSS 构建的双语个人网站，纯静态部署。", "en": "A bilingual personal website built with Astro + Tailwind CSS, pure static deployment." },
    "category": "frontend",
    "tags": ["Astro", "Tailwind CSS", "TypeScript"],
    "links": { "github": "https://github.com/username/personal-website", "demo": "https://username.github.io" },
    "featured": false
  }
]
```

- [ ] **Step 6: Write src/data/techstack.json** (shared — bilingual values)

```json
{
  "categories": [
    {
      "key": "chip-design",
      "name": { "zh": "芯片前端设计", "en": "Chip Front-End Design" },
      "items": [
        { "name": "Verilog" },
        { "name": "SystemVerilog" },
        { "name": "Vivado" },
        { "name": "ModelSim" },
        { "name": "FPGA" }
      ]
    },
    {
      "key": "ai-infra",
      "name": { "zh": "AI & Infra", "en": "AI & Infra" },
      "items": [
        { "name": "Python" },
        { "name": "PyTorch" },
        { "name": "HLS" },
        { "name": "Linux" }
      ]
    },
    {
      "key": "frontend",
      "name": { "zh": "前端开发", "en": "Frontend" },
      "items": [
        { "name": "TypeScript" },
        { "name": "React" },
        { "name": "Astro" },
        { "name": "Tailwind CSS" },
        { "name": "Figma" }
      ]
    }
  ]
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add bilingual content data files with placeholder content
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Base Layout & Font Loading

**Files:**
- Create: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `getLangFromUrl()` from i18n/utils
- Produces: `<Base>` layout component wrapping all pages — `<html>`, fonts, meta, Nav, Footer

- [ ] **Step 1: Write src/layouts/Base.astro**

```astro
---
// src/layouts/Base.astro
import { getLangFromUrl } from '../i18n/utils';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  currentPath: string;
}

const { title, description, currentPath } = Astro.props;
const url = new URL(currentPath, Astro.site ?? 'http://localhost:4321');
const lang = getLangFromUrl(url);
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <!-- Inter & JetBrains Mono from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav currentPath={currentPath} lang={lang} />
    <main class="flex-1">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Base layout with fonts and shell structure
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: ScrollReveal Component

**Files:**
- Create: `src/components/ScrollReveal.astro`

**Interfaces:**
- Produces: `<ScrollReveal>` wrapper that adds `.reveal` class and Intersection Observer script

- [ ] **Step 1: Write src/components/ScrollReveal.astro**

```astro
---
// src/components/ScrollReveal.astro
---
<div class="reveal">
  <slot />
</div>

<script>
  function setupReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  }

  // Run on load and after Astro page transitions
  document.addEventListener('astro:page-load', setupReveal);
  setupReveal();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add ScrollReveal component with Intersection Observer
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: LangSwitch Component

**Files:**
- Create: `src/components/LangSwitch.astro`

**Interfaces:**
- Consumes: `getRouteForLang()` from i18n/utils
- Produces: Language toggle button navigating to the other language

- [ ] **Step 1: Write src/components/LangSwitch.astro**

```astro
---
// src/components/LangSwitch.astro
import { getRouteForLang, getLangFromUrl } from '../i18n/utils';

interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;
const url = new URL(currentPath, 'http://localhost:4321');
const currentLang = getLangFromUrl(url);
const targetLang = currentLang === 'zh' ? 'en' : 'zh';
const targetRoute = getRouteForLang(url, targetLang);
const label = currentLang === 'zh' ? 'EN' : '中';
---

<a
  href={targetRoute}
  class="inline-flex items-center justify-center w-9 h-9 rounded-full
         text-sm font-medium text-text-secondary hover:text-accent
         hover:bg-accent/5 transition-colors duration-200
         focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
  aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
>
  {label}
</a>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add language switch component
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Navigation Component

**Files:**
- Create: `src/components/Nav.astro`

**Interfaces:**
- Consumes: `getLangFromUrl()` from i18n/utils, `nav.json`, `LangSwitch`
- Produces: Fixed navbar with scroll shrink, smooth-scroll links, mobile hamburger menu

- [ ] **Step 1: Write src/components/Nav.astro**

```astro
---
// src/components/Nav.astro
import { getLangFromUrl } from '../i18n/utils';
import { useTranslations } from '../i18n/utils';
import LangSwitch from './LangSwitch.astro';
import navItems from '../data/nav.json';

interface Props {
  currentPath: string;
  lang: 'zh' | 'en';
}

const { currentPath, lang } = Astro.props;
const { t } = useTranslations(lang);
---

<header
  id="navbar"
  class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md
         transition-all duration-300 border-b border-transparent"
>
  <nav class="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo / Name -->
    <a
      href={`/${lang}/`}
      class="text-lg font-semibold text-text-primary hover:text-accent transition-colors"
    >
      Your Name
    </a>

    <!-- Desktop Links -->
    <div class="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <a
          href={`#${item.id}`}
          class="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
        >
          {t(item.label)}
        </a>
      ))}
      <LangSwitch currentPath={currentPath} />
    </div>

    <!-- Mobile Hamburger -->
    <div class="flex items-center gap-3 md:hidden">
      <LangSwitch currentPath={currentPath} />
      <button
        id="menu-btn"
        class="flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
        aria-expanded="false"
      >
        <span class="block w-5 h-0.5 bg-text-primary transition-transform duration-300 origin-center" />
        <span class="block w-5 h-0.5 bg-text-primary transition-opacity duration-300" />
        <span class="block w-5 h-0.5 bg-text-primary transition-transform duration-300 origin-center" />
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Drawer -->
  <div
    id="mobile-menu"
    class="hidden md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-sm"
  >
    <div class="flex flex-col px-6 py-4 gap-3">
      {navItems.map((item) => (
        <a
          href={`#${item.id}`}
          class="text-sm text-text-secondary hover:text-accent transition-colors py-2"
        >
          {t(item.label)}
        </a>
      ))}
    </div>
  </div>
</header>

<script>
  // Scroll shrink effect
  const navbar = document.getElementById('navbar')!;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('shadow-sm');
      navbar.classList.add('border-border');
    } else {
      navbar.classList.remove('shadow-sm');
      navbar.classList.remove('border-border');
    }
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn')!;
  const mobileMenu = document.getElementById('mobile-menu')!;
  const bars = menuBtn.querySelectorAll('span');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));

    // Hamburger → X animation
    if (!isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add fixed navbar with scroll shrink and mobile menu
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `lang` prop
- Produces: Footer with copyright, back-to-top button

- [ ] **Step 1: Write src/components/Footer.astro**

```astro
---
// src/components/Footer.astro
interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const year = new Date().getFullYear();
const copyright = lang === 'zh'
  ? `© ${year} Your Name. All rights reserved.`
  : `© ${year} Your Name. All rights reserved.`;
---

<footer class="border-t border-border bg-surface">
  <div class="max-w-content mx-auto px-6 py-8 flex items-center justify-between">
    <p class="text-sm text-text-secondary">{copyright}</p>
    <button
      id="back-to-top"
      class="w-9 h-9 rounded-full border border-border bg-white
             flex items-center justify-center
             text-text-secondary hover:text-accent hover:border-accent
             transition-all duration-200 opacity-0 pointer-events-none"
      aria-label={lang === 'zh' ? '回到顶部' : 'Back to top'}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3.5L3.5 8M8 3.5L12.5 8M8 3.5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</footer>

<script>
  const btn = document.getElementById('back-to-top')!;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add footer with back-to-top button
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: Hero Component

**Files:**
- Create: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `lang` prop
- Produces: Hero section with name, tagline, subtitle

- [ ] **Step 1: Write src/components/Hero.astro**

```astro
---
// src/components/Hero.astro
import ScrollReveal from './ScrollReveal.astro';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const tagline = lang === 'zh' ? '芯片前端设计' : 'Chip Front-End Design';
const subtitle = lang === 'zh'
  ? '研一学生 · 探索芯片、AI 与前端开发的交汇点'
  : 'M.S. Student · Exploring the intersection of Chip Design, AI & Frontend';
---

<section id="hero" class="min-h-screen flex items-center justify-center px-6 pt-16">
  <ScrollReveal>
    <div class="text-center max-w-2xl mx-auto">
      <p class="text-sm font-mono text-accent mb-4 tracking-widest uppercase">
        {tagline}
      </p>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
        Your Name
      </h1>
      <p class="text-lg sm:text-xl text-text-secondary leading-relaxed">
        {subtitle}
      </p>
    </div>
  </ScrollReveal>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add hero section
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 10: About Component

**Files:**
- Create: `src/components/About.astro`

**Interfaces:**
- Consumes: `lang` prop, `src/data/{zh,en}/about.md`
- Produces: About section rendering markdown content

- [ ] **Step 1: Write src/components/About.astro**

```astro
---
// src/components/About.astro
import ScrollReveal from './ScrollReveal.astro';
import ZhAbout from '../data/zh/about.md';
import EnAbout from '../data/en/about.md';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const heading = lang === 'zh' ? '关于' : 'About';
---

<section id="about" class="py-32 px-6">
  <div class="max-w-content mx-auto">
    <ScrollReveal>
      <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-12">{heading}</h2>
    </ScrollReveal>
    <ScrollReveal>
      <div class="prose prose-lg max-w-none text-text-secondary">
        {lang === 'zh' ? <ZhAbout.Content /> : <EnAbout.Content />}
      </div>
    </ScrollReveal>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add about section with markdown content
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 11: Experience Component

**Files:**
- Create: `src/components/Experience.astro`

**Interfaces:**
- Consumes: `lang` prop, `src/data/{zh,en}/experience.json`
- Produces: Vertical timeline section from experience data

- [ ] **Step 1: Write src/components/Experience.astro**

```astro
---
// src/components/Experience.astro
import { useTranslations } from '../i18n/utils';
import ScrollReveal from './ScrollReveal.astro';
import type { Experience as ExperienceType } from '../types';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const { t } = useTranslations(lang);
const heading = lang === 'zh' ? '经历' : 'Experience';

import experienceData from '../data/experience.json';
const items = experienceData as ExperienceType[];

const typeLabel: Record<string, { zh: string; en: string }> = {
  education: { zh: '教育', en: 'Education' },
  research: { zh: '科研', en: 'Research' },
  internship: { zh: '实习', en: 'Internship' },
  activity: { zh: '活动', en: 'Activity' },
};
---

<section id="experience" class="py-32 px-6 bg-surface">
  <div class="max-w-content mx-auto">
    <ScrollReveal>
      <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-12">{heading}</h2>
    </ScrollReveal>

    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

      <div class="flex flex-col gap-12">
        {items.map((item, i) => (
          <ScrollReveal>
            <div class={`relative flex flex-col md:flex-row gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <!-- Timeline dot -->
              <div class="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 ring-4 ring-white" />

              <!-- Date (left side on desktop, top on mobile) -->
              <div class="pl-10 md:pl-0 md:w-1/2 md:text-right md:pr-10">
                <span class="text-sm font-mono text-accent whitespace-nowrap">{item.date}</span>
              </div>

              <!-- Content card (right side on desktop) -->
              <div class="pl-10 md:pl-0 md:w-1/2 md:pl-10">
                <div class="bg-white rounded-lg border border-border p-5 hover:shadow-sm transition-shadow duration-200">
                  <span class="text-xs font-medium text-accent uppercase tracking-wider">
                    {lang === 'zh' ? typeLabel[item.type]?.zh : typeLabel[item.type]?.en}
                  </span>
                  <h3 class="text-lg font-semibold text-text-primary mt-1">{t(item.title)}</h3>
                  <p class="text-sm text-text-secondary mt-0.5">{t(item.organization)}</p>
                  <p class="text-sm text-text-secondary mt-3 leading-relaxed">{t(item.description)}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add experience timeline section
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 12: TechStack Component

**Files:**
- Create: `src/components/TechStack.astro`

**Interfaces:**
- Consumes: `lang` prop, `src/data/{zh,en}/techstack.json`
- Produces: Grouped tech tags with category headings

- [ ] **Step 1: Write src/components/TechStack.astro**

```astro
---
// src/components/TechStack.astro
import { useTranslations } from '../i18n/utils';
import ScrollReveal from './ScrollReveal.astro';
import type { TechCategory } from '../types';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const { t } = useTranslations(lang);
const heading = lang === 'zh' ? '技术栈' : 'Tech Stack';

import techData from '../data/techstack.json';
const categories = (techData as { categories: TechCategory[] }).categories ?? [];
---

<section id="techstack" class="py-32 px-6">
  <div class="max-w-content mx-auto">
    <ScrollReveal>
      <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-12">{heading}</h2>
    </ScrollReveal>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <ScrollReveal>
          <div class="bg-surface rounded-lg border border-border p-6">
            <h3 class="text-base font-semibold text-text-primary mb-4">{t(category.name)}</h3>
            <div class="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span class="inline-flex items-center px-3 py-1.5
                             bg-white border border-border rounded-full
                             text-sm text-text-secondary font-mono
                             hover:text-accent hover:border-accent hover:bg-accent/5
                             transition-all duration-200 cursor-default">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add tech stack section with grouped tags
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 13: ProjectCard & Projects Components

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/Projects.astro`

**Interfaces:**
- Consumes: `lang` prop, `src/data/{zh,en}/projects.json`
- Produces: Filter bar + responsive card grid + individual cards

- [ ] **Step 1: Write src/components/ProjectCard.astro**

```astro
---
// src/components/ProjectCard.astro
import { useTranslations } from '../i18n/utils';
import type { Project } from '../types';

interface Props {
  project: Project;
  lang: 'zh' | 'en';
}

const { project, lang } = Astro.props;
const { t } = useTranslations(lang);

const categoryLabel: Record<string, { zh: string; en: string }> = {
  chip: { zh: '芯片', en: 'Chip' },
  ai: { zh: 'AI', en: 'AI' },
  frontend: { zh: '前端', en: 'Frontend' },
};
---

<div class="group bg-white rounded-lg border border-border p-6
            hover:-translate-y-1 hover:shadow-md
            transition-all duration-300 ease-out">
  <!-- Category badge -->
  <span class="inline-block text-xs font-medium text-accent uppercase tracking-wider mb-3">
    {lang === 'zh' ? categoryLabel[project.category]?.zh : categoryLabel[project.category]?.en}
  </span>

  <h3 class="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
    {t(project.title)}
  </h3>

  <p class="text-sm text-text-secondary leading-relaxed mb-4">
    {t(project.description)}
  </p>

  <!-- Tags -->
  <div class="flex flex-wrap gap-1.5 mb-4">
    {project.tags.map((tag) => (
      <span class="text-xs font-mono text-text-secondary bg-surface px-2 py-0.5 rounded">
        {tag}
      </span>
    ))}
  </div>

  <!-- Links -->
  <div class="flex gap-4">
    {project.links.github && (
      <a href={project.links.github} target="_blank" rel="noopener noreferrer"
         class="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub
      </a>
    )}
    {project.links.demo && (
      <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
         class="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2.5H5.5a.5.5 0 00-.5.5v8a.5.5 0 00.5.5H14a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5z"/>
          <path d="M2 5.5V13a.5.5 0 00.5.5H11"/>
        </svg>
        Demo
      </a>
    )}
  </div>
</div>
```

- [ ] **Step 2: Write src/components/Projects.astro**

```astro
---
// src/components/Projects.astro
import { useTranslations } from '../i18n/utils';
import ScrollReveal from './ScrollReveal.astro';
import ProjectCard from './ProjectCard.astro';
import type { Project } from '../types';

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const { t } = useTranslations(lang);
const heading = lang === 'zh' ? '作品' : 'Projects';

import projectsData from '../data/projects.json';
const projects: Project[] = projectsData as Project[];

const filterLabels = {
  all: { zh: '全部', en: 'All' },
  chip: { zh: '芯片', en: 'Chip' },
  ai: { zh: 'AI', en: 'AI' },
  frontend: { zh: '前端', en: 'Frontend' },
} as const;

type Filter = keyof typeof filterLabels;
const filters: Filter[] = ['all', 'chip', 'ai', 'frontend'];
---

<section id="projects" class="py-32 px-6 bg-surface">
  <div class="max-w-content mx-auto">
    <ScrollReveal>
      <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-8">{heading}</h2>
    </ScrollReveal>

    <!-- Filter bar -->
    <ScrollReveal>
      <div id="filter-bar" class="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => (
          <button
            data-filter={f}
            class={`filter-btn px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200 border
                    ${f === 'all'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-text-secondary border-border hover:text-accent hover:border-accent'
                    }`}
          >
            {lang === 'zh' ? filterLabels[f].zh : filterLabels[f].en}
          </button>
        ))}
      </div>
    </ScrollReveal>

    <!-- Project grid -->
    <div id="project-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div class="project-item" data-category={project.category}>
          <ScrollReveal>
            <ProjectCard project={project} lang={lang} />
          </ScrollReveal>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = (btn as HTMLElement).dataset.filter!;

      // Update active button style
      filterBtns.forEach((b) => {
        b.className = b.className
          .replace(/bg-accent text-white border-accent/g, '')
          + ' bg-white text-text-secondary border-border hover:text-accent hover:border-accent';
      });
      btn.className = btn.className
        .replace(/bg-white text-text-secondary border-border hover:text-accent hover:border-accent/g, '')
        + ' bg-accent text-white border-accent';

      // Filter items
      items.forEach((item) => {
        const cat = (item as HTMLElement).dataset.category!;
        if (filter === 'all' || cat === filter) {
          (item as HTMLElement).style.display = '';
        } else {
          (item as HTMLElement).style.display = 'none';
        }
      });
    });
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add projects section with card grid and category filter
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 14: Contact Component

**Files:**
- Create: `src/components/Contact.astro`

**Interfaces:**
- Consumes: `lang` prop
- Produces: Contact section with icon links

- [ ] **Step 1: Write src/components/Contact.astro**

```astro
---
// src/components/Contact.astro
import ScrollReveal from './ScrollReveal.astro';

interface ContactLink {
  label: string;
  href: string;
  icon: 'github' | 'email' | 'linkedin';
}

interface Props {
  lang: 'zh' | 'en';
}

const { lang } = Astro.props;
const heading = lang === 'zh' ? '联系方式' : 'Contact';
const subtitle = lang === 'zh'
  ? '欢迎通过以下方式联系我'
  : 'Feel free to reach out';

const links: ContactLink[] = [
  { label: 'GitHub', href: 'https://github.com/username', icon: 'github' },
  { label: 'Email', href: 'mailto:your@email.com', icon: 'email' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/username', icon: 'linkedin' },
];

const iconPaths: Record<string, string> = {
  github: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z',
  email: 'M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zm-.034 6.876l-3.553-3.241-1.192.715a1 1 0 01-.442.117h-.001a1 1 0 01-.442-.117l-1.192-.715-3.553 3.241A1 1 0 002 13h12a1 1 0 00.966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z',
  linkedin: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z',
};
---

<section id="contact" class="py-32 px-6">
  <div class="max-w-content mx-auto text-center">
    <ScrollReveal>
      <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-4">{heading}</h2>
      <p class="text-text-secondary mb-10">{subtitle}</p>
    </ScrollReveal>

    <ScrollReveal>
      <div class="flex items-center justify-center gap-6">
        {links.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col items-center gap-2 p-4
                   text-text-secondary hover:text-accent
                   transition-colors duration-200"
          >
            <div class="w-12 h-12 rounded-full border border-border
                        flex items-center justify-center
                        group-hover:border-accent group-hover:bg-accent/5
                        transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d={iconPaths[link.icon]} />
              </svg>
            </div>
            <span class="text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </ScrollReveal>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add contact section with icon links
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 15: Pages — zh/index, en/index, root redirect

**Files:**
- Create: `src/pages/zh/index.astro`, `src/pages/en/index.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: Base layout, all section components
- Produces: Three page routes — zh homepage, en homepage, root language redirect

- [ ] **Step 1: Write src/pages/zh/index.astro**

```astro
---
// src/pages/zh/index.astro
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Experience from '../../components/Experience.astro';
import TechStack from '../../components/TechStack.astro';
import Projects from '../../components/Projects.astro';
import Contact from '../../components/Contact.astro';

const lang = 'zh' as const;
---

<Base
  title="Your Name — 个人网站"
  description="芯片前端设计方向研究生，对AI、Infra与前端开发有兴趣。"
  currentPath={Astro.url.pathname}
>
  <Hero lang={lang} />
  <About lang={lang} />
  <Experience lang={lang} />
  <TechStack lang={lang} />
  <Projects lang={lang} />
  <Contact lang={lang} />
</Base>
```

- [ ] **Step 2: Write src/pages/en/index.astro**

```astro
---
// src/pages/en/index.astro
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import About from '../../components/About.astro';
import Experience from '../../components/Experience.astro';
import TechStack from '../../components/TechStack.astro';
import Projects from '../../components/Projects.astro';
import Contact from '../../components/Contact.astro';

const lang = 'en' as const;
---

<Base
  title="Your Name — Personal Website"
  description="M.S. student in chip front-end design, passionate about AI, Infra, and front-end development."
  currentPath={Astro.url.pathname}
>
  <Hero lang={lang} />
  <About lang={lang} />
  <Experience lang={lang} />
  <TechStack lang={lang} />
  <Projects lang={lang} />
  <Contact lang={lang} />
</Base>
```

- [ ] **Step 3: Write src/pages/index.astro**

```astro
---
// src/pages/index.astro
// Redirect to browser's preferred language
const url = new URL(Astro.request.url);
const acceptLang = Astro.request.headers.get('accept-language') || '';
const prefersZh = acceptLang.toLowerCase().includes('zh');
const targetLang = prefersZh ? 'zh' : 'en';
return Astro.redirect(`/${targetLang}/`);
---
```

- [ ] **Step 4: Delete the default src/pages/index.astro if Astro created one**

```bash
# Only if a default index.astro exists from scaffolding
rm -f src/pages/index.astro
# Then rewrite it with Step 3 content (already done above)
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add bilingual pages and root language redirect
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 16: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: CI/CD pipeline — build on push, deploy to GitHub Pages + Cloudflare Pages

- [ ] **Step 1: Write .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages & Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy-gh-pages:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  deploy-cloudflare:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: github-pages
          path: dist/

      - name: Publish to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist/ --project-name=personal-website
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add GitHub Actions deploy workflow for Pages + Cloudflare
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 17: Verify Build & Final Polish

**Files:**
- Modify: Any files needing fixes after build verification

- [ ] **Step 1: Run the build**

```bash
cd /home/hanwangyang/workspace/personal-website
npm run build
```

Expected: Build succeeds, `dist/` contains static files including `zh/index.html`, `en/index.html`, `index.html`.

- [ ] **Step 2: Verify output structure**

```bash
ls dist/
ls dist/zh/
ls dist/en/
```

Expected:
- `dist/index.html` (redirect page)
- `dist/zh/index.html`
- `dist/en/index.html`
- `dist/favicon.svg`
- CSS/JS assets in `dist/_astro/`

- [ ] **Step 3: Preview the build locally**

```bash
npx astro preview
```

Visit http://localhost:4321 — verify:
- Root `/` redirects to `/zh/` or `/en/`
- All sections present in order: Hero → About → Experience → Tech Stack → Projects → Contact
- Language switch navigates between `/zh/` and `/en/` correctly
- Mobile hamburger menu works
- Scroll reveal animations trigger on scroll
- Project filter buttons filter cards
- Back-to-top button appears and works
- All links (nav, contact, project) work

- [ ] **Step 4: Fix any issues found during verification**

Common fixes needed:
- Import paths may need adjustment if Astro version differs
- `import.meta.glob` patterns may need tweaking
- HTML content rendering (about.md markdown) may need refinement

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final polish and build verification
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 18: Initialize Git Remote & Push

- [ ] **Step 1: Create GitHub repo (manual — user action)**

Go to https://github.com/new — create a new repository (e.g., `personal-website` or `username.github.io`).

- [ ] **Step 2: Add remote and push**

```bash
cd /home/hanwangyang/workspace/personal-website
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Enable GitHub Pages in repo settings**

Go to repo Settings → Pages → Source: GitHub Actions.

- [ ] **Step 4: Set up Cloudflare Pages (manual — user action)**

1. Go to Cloudflare Dashboard → Workers & Pages → Create → Pages
2. Connect GitHub repo
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Or use the Wrangler CLI approach (already in deploy.yml): add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub repo secrets.

- [ ] **Step 5: Verify deployment**

Visit `https://<username>.github.io` (GitHub Pages) and `https://personal-website.pages.dev` (Cloudflare Pages).

---

## Spec Coverage Checklist

| Spec Requirement | Task(s) |
|-----------------|---------|
| Pure static output | Task 1 (astro config `output: 'static'`) |
| Astro v5 + Tailwind v3 | Task 1 |
| Bright minimal color palette | Task 1 (tailwind config), Task 9-14 (components use the palette) |
| Inter + JetBrains Mono + Chinese fonts | Task 1 (tailwind config), Task 4 (Base layout font loading) |
| Route-based i18n (/zh/, /en/) | Task 2 (i18n utils), Task 15 (pages) |
| Language switch button | Task 6 |
| Fixed navbar + scroll shrink + hamburger | Task 7 |
| Single-page sections: Hero→About→Experience→TechStack→Projects→Contact | Tasks 9-14, Task 15 (page assembly) |
| About from markdown | Task 10 |
| Experience timeline | Task 11 |
| Tech stack grouped tags | Task 12 |
| Project cards with category filter | Task 13 |
| Contact icon links | Task 14 |
| Footer + back-to-top | Task 8 |
| ScrollReveal (fade-in + translateY) | Task 5 |
| Project card hover lift | Task 13 (group-hover and hover:-translate-y-1) |
| Tag hover color transition | Task 12 |
| Mobile hamburger morph | Task 7 |
| Responsive (mobile/tablet/desktop) | All components use responsive Tailwind classes |
| GitHub Pages deploy | Task 16, Task 18 |
| Cloudflare Pages deploy | Task 16, Task 18 |
| GitHub Actions CI | Task 16 |
| Semantic HTML + accessibility | Task 4 (lang attr), Task 7 (aria attributes), all tasks |

