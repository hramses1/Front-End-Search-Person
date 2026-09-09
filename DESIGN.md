---
name: Portal de Consulta Ciudadana
description: Expediente Sellado — carpeta de manila, hoja de papel y un sello de tinta que cae al verificar un dato.
colors:
  bg-envejecido: "#F6F0E1"
  hoja-superficie: "#FFFDF8"
  kraft-carpeta: "#C6A06A"
  kraft-tinta: "#4A3A22"
  borde-papel: "#DDCBA5"
  rojo-sello: "#A4241C"
  sello-inverso: "#FBF6EC"
  tinta-primaria: "#241F1B"
  tinta-secundaria: "#5A4C3B"
  tinta-atenuada: "#6E6151"
  estado-exito: "#2F6B3A"
  estado-error: "#8A2E12"
  estado-aviso: "#8A5A08"
typography:
  display:
    fontFamily: "'Special Elite', Courier, monospace"
    fontSize: "inherit"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.75vw, 3.0625rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.125rem, 0.95rem + 0.85vw, 1.5625rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.9375rem, 0.91rem + 0.14vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.6875rem, 0.67rem + 0.09vw, 0.75rem)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
  dato:
    fontFamily: "'Courier Prime', ui-monospace, monospace"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  base: "6px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.rojo-sello}"
    textColor: "{colors.sello-inverso}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "0 24px"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.rojo-sello}"
    textColor: "{colors.sello-inverso}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-primaria}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "0 24px"
    height: "3rem"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-secundaria}"
    typography: "{typography.label}"
    padding: "0 8px"
    height: "3rem"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-secundaria}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "3rem"
  chip-active:
    backgroundColor: "{colors.rojo-sello}"
    textColor: "{colors.sello-inverso}"
    rounded: "{rounded.pill}"
  folder-tab-label:
    backgroundColor: "{colors.kraft-carpeta}"
    textColor: "{colors.kraft-tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "4px 16px"
---

# Design System: Portal de Consulta Ciudadana

## Overview

**Creative North Star: "Expediente Sellado"**

This is a citizen-records lookup portal built as a physical case file: a manila folder holding paper sheets, with an ink stamp that falls the instant a record is verified. It replaced a prior single-font, glassmorphism system that read as generic SaaS. The kraft/manila tone is the committed surface color — carpeted headers, tabs, and footer — not a stray accent; the single saturated red is reserved exclusively for the ink stamp, "verified" state, and the one primary action per view.

This was built and shipped as Phase 1: global tokens (`tailwind.config.js`, `src/index.css`), the public landing page (`src/views/PublicLandingView.vue`), and the live cédula demo (`src/ui/components/DemoCedula.vue`). The rest of the site (dashboard, consulta sections, guides/legal pages) still carries the prior visual system and is **not** covered by this document until it migrates in a later phase — do not extend these rules to unmigrated surfaces as if they were already compliant.

**Key Characteristics:**
- Paper and kraft surfaces, never glass or blur — depth comes from stacked-paper shadows, not diffuse glows.
- One accent color, one job: the ink-stamp red means "verified" or "primary action," nothing else.
- Three typefaces with strict, narrow jobs: a typewriter face for rare ceremonial moments, a warm grotesque for everything else, a tabular mono for official data.
- The BrandMark logotype is explicitly outside this system (see Do's and Don'ts).

## Colors

Warm, paper-toned neutrals carry the vast majority of the surface; a single saturated red is rationed to verification and primary action.

### Primary
- **Rojo Sello** (`#A4241C`): the ink-stamp red. Used only for the primary button fill, the "verified" stamp mark, active/pressed chip state, focus rings, and hover accents on links and icons. Verified at 6.49:1 against the light-mode background. In dark mode it lightens to `#E2735F` to hold contrast against the near-black background — same role, adjusted value, cataloged in the sidecar (`colorMeta.rojo-sello`).

### Neutral
- **Papel Envejecido** (`#F6F0E1`): page background, light mode.
- **Hoja** (`#FFFDF8`): the paper-sheet surface sitting on top of the page background (`.hoja-card`, `.hoja-panel`, inputs).
- **Kraft Carpeta** (`#C6A06A`): the manila-folder color. Reserved for surfaces that read as "the folder itself," never as a decorative accent: page footer, folder-tab labels above the query catalog groups, the "en vivo" pill on the demo, category tags on guide cards. Deliberately **not** used on the page header — see Do's and Don'ts.
- **Kraft Tinta** (`#4A3A22`): text set on top of Kraft Carpeta surfaces.
- **Borde Papel** (`#DDCBA5`): all hairline borders — card edges, dividers, input underlines.
- **Sello Inverso** (`#FBF6EC`): text/icon color on top of the red accent (6.84:1 contrast).
- **Tinta Primaria** (`#241F1B`): default body and heading text.
- **Tinta Secundaria** (`#5A4C3B`): supporting copy, descriptions under headings.
- **Tinta Atenuada** (`#6E6151`): muted text — captions, footer links at rest, placeholder-adjacent copy.
- **Estado Éxito** (`#2F6B3A`), **Estado Error** (`#8A2E12`), **Estado Aviso** (`#8A5A08`): functional status colors. Never carry meaning by color alone — each pairs with an icon or explicit text (e.g., the live pulse dot on the demo badge, form error text).

Dark mode remaps every one of the above 1:1 to darker/lighter equivalents (e.g., background `#1C1712`, surface `#241D16`, kraft `#4A3A22`↔`#EDE0C8` ink) rather than introducing new roles. Full dark values are cataloged in the sidecar (`.impeccable/design.json`, `colorMeta.*.canonical`) rather than duplicated here as separate tokens.

### Named Rules
**The One Gesture Rule.** The accent red appears only where something is verified or actionable (primary button, stamp mark, active chip, focus ring). It never decorates a heading, a background block, or a status that isn't success/error/warning.

**The Folder, Not the Letterhead Rule.** Kraft is the committed surface for folder-like chrome (footer, tabs, pills) but is deliberately withheld from the page header. The BrandMark logotype's flag-gradient text loses contrast against mid-tone kraft, so the header stays on the plain page background instead — an intentional adaptation to protect the untouchable logotype, not a drift from the palette.

## Typography

**Display Font:** Special Elite (with Courier, monospace fallback) — used sparingly
**Body Font:** Archivo (with Helvetica Neue, Arial, sans-serif fallback)
**Label/Mono Font:** Courier Prime (with ui-monospace, monospace fallback) for tabular official data

**Character:** A warm grotesque (Archivo) carries nearly all reading and headline weight; a typewriter face (Special Elite) appears only at the two or three moments per page that are ceremonial — the stamp mark and one emphasized phrase in the hero headline — never as a running headline font. Courier Prime marks anything the visitor could verify character-by-character (cédula, RUC, plate).

### Hierarchy
- **Display** (Special Elite, 400, inherits surrounding size, line-height 1.2): applied via the `.voz-sello` class to the emphasized clause in the hero headline and to the "VERIFICADO" stamp text only. Never a full heading or paragraph.
- **Headline** (Archivo, 800, clamp 1.75rem→3.0625rem / 28px→49px, line-height 1.1): `h1`, page-level headings.
- **Title** (Archivo, 700, clamp 1.125rem→1.5625rem / 18px→25px, line-height 1.25): `h2`/`h3`-level section and card headings.
- **Body** (Archivo, 400, clamp 0.9375rem→1.0625rem / 15px→17px, line-height 1.6): paragraphs, list text; never drops below 1rem/16px at the top of the clamp.
- **Label** (Archivo, 700, clamp 0.6875rem→0.75rem / 11px→12px, uppercase, letter-spacing 0.14em): folder-tab labels, chip text, the overline pill.
- **Dato** (Courier Prime, 400, clamp 0.8125rem→0.875rem, tabular-nums, letter-spacing 0.02em): cédula, RUC, plate numbers — via the `.dato` class.

### Named Rules
**The Rare Voice Rule.** Special Elite is a ceremonial mark, not a headline typeface: it is earned by verification moments and appears at most once or twice per screen. If a heading needs weight, that's Archivo's job.

## Layout

Content sits in a single centered column (`max-w-5xl`), with fluid inline padding (`clamp(1rem, 4vw, 2rem)` via `.contenedor`) rather than stepped breakpoint padding. The hero section is the one two-column layout (`grid-cols-1 lg:grid-cols-2`): headline and CTA on the left, the live demo sheet on the right, collapsing to a single stacked column below `lg` (1024px). Vertical rhythm between sections uses the `2xl`/`3xl` spacing steps (48px/64px), reduced to 28px/40px between 640–1100px so clamp-scaled headlines don't feel oversized on mid-width screens. Breakpoints are declared explicitly rather than inherited: `xs` 480px, `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

## Elevation & Depth

This system is explicitly not glass. Depth comes from two vocabularies: a stacked-paper shadow that reads as sheets sitting on top of each other, and a directional stamp shadow that reads as ink pressed into paper. There is no blur/backdrop-filter anywhere in the shipped scope; the prior glassmorphism system's frosted panels are fully retired in this scope.

### Shadow Vocabulary
- **Hoja** (`box-shadow: 0 1px 0 var(--border-color), 0 8px 0 -6px var(--border-color), 0 14px 20px -12px rgba(36,25,15,0.28)`): the default elevation for every card/panel (`.hoja-card`, `.hoja-panel`). Reads as a sheet with two more sheets stacked underneath, not a single soft glow.
- **Sello** (`box-shadow: 0 10px 24px -8px rgba(164,36,28,0.45)`): applied only to the primary button, tinted with the accent red itself rather than a neutral shadow — it's meant to read as the button carrying the same "ink" weight as the stamp.

### Named Rules
**The Stacked-Paper Rule.** Elevation is expressed as paper sitting on paper (multiple hard-edged offset layers + one soft ambient layer), never as a single diffuse glow. If a shadow looks like a glass panel floating, it's not this system.

## Shapes

Corners are cut paper, not rounded plastic: the one custom radius token is a low **6px** (`rounded-base`), used on cards, buttons, inputs, and folder-tab labels. The one deliberate exception is pill-shaped (`rounded-full`) chips/filter toggles — a distinct, separately-earned shape for togglable filters, not a competing card radius. Every `.hoja-card` carries a signature dog-ear: a folded top-right corner built from two triangular gradients (one matching the page background as the "reverse" of the sheet, one a darker crease), rendered via a `::after` pseudo-element rather than an image.

## Components

### Buttons
- **Shape:** 6px radius (`rounded-base`), minimum height 48px (3rem) for tap-target compliance.
- **Primary:** solid rojo sello fill (`#A4241C`), sello-inverso text (`#FBF6EC`), carries the `shadow-sello` ink shadow. At most one visible per view.
- **Secondary:** transparent fill, 1px border in `border-color` (`#DDCBA5`), primary text color; hover shifts border and text to the accent red.
- **Tertiary:** text-only, secondary text color at rest, accent red on hover.
- **Hover / Active:** primary and secondary lift 1px on hover (`translateY(-1px)` + slight brightness on primary) and sink 1px on press (`translateY(1px)`) rather than scaling — scale distorted wide buttons' text in testing.

### Chips (folder-tab filters)
- **Style:** pill radius, transparent background, 1px border, uppercase label typography, secondary text color at rest.
- **State:** `aria-pressed="true"` fills with accent red and sello-inverso text; hover (unpressed) shifts border/text to accent red.

### Cards / Containers — Hoja Card (signature)
- **Corner Style:** 6px radius with the folded dog-ear detail on the top-right corner.
- **Background:** hoja surface color (`#FFFDF8` light / `#241D16` dark).
- **Shadow Strategy:** the Hoja stacked-paper shadow (see Elevation & Depth).
- **Border:** 1px, `border-color` token.
- **Internal Padding:** `lg`/`xl` (24px/32px), scaling to `2xl` (48px) on the closing CTA panel.

### Inputs / Fields
- **Style:** underline-only (`border-b`), transparent background, no box — matches the "writing on a form" feel; data fields additionally carry `.dato` (Courier Prime, tabular numerals).
- **Focus:** border-bottom widens and turns accent red; associated `<label>` (sibling, via `:has()`) also switches to accent red.
- **Error:** inline caption text in Estado Error color beneath the field; never color-only.

### Navigation
- **Header:** plain page background (not kraft — see Named Rules above), BrandMark left, theme toggle + auth action right, all controls normalized to 44px height (`.control-encabezado`).
- **Folder-tab labels:** small kraft-filled pill/tag (`.kraft-color` background, `.kraft-ink` text, uppercase label type) marking catalog groups and guide categories — the closest thing this system has to a section eyebrow, but it is scoped to folder/category labeling, not used as decoration above arbitrary headings.
- **Footer:** full-width kraft band closing the same visual frame the header opens, holding legal links (`.enlace-menor`, 44px tap target) and the copyright line.

### Ink Stamp (signature component)
The verification moment of the whole system, on `DemoCedula.vue`: an SVG `feTurbulence`/`feDisplacementMap` filter distorts a bordered "VERIFICADO" mark's edges and fill so it reads as ink struck onto paper rather than a clean vector badge, with a lighter, larger, rotated duplicate underneath (`mix-blend-mode: multiply`) simulating a double-struck impression. Animates in once per result via `sello-cae` (scale 2.4/rotate -14deg → settle at scale 1/-8deg, 420ms, `cubic-bezier(0.16,1,0.3,1)`), respecting `prefers-reduced-motion`. Fires exactly once per verified result — never cascaded or repeated per row.

## Do's and Don'ts

### Do:
- **Do** reserve the accent red (`#A4241C` / dark-mode `#E2735F`) for verification and primary action only — button fill, stamp mark, active chip, focus ring.
- **Do** use the Hoja stacked-paper shadow (`shadow-hoja`) for any new card/panel; do not invent a new elevation vocabulary for a single surface.
- **Do** set official/verifiable data (cédula, RUC, plate) in Courier Prime with `tabular-nums` via `.dato` — never in the body font.
- **Do** keep Special Elite scoped to the stamp mark and at most one emphasized phrase per hero-level headline.

### Don't:
- **Don't** apply kraft to the page header — the BrandMark's flag-gradient text loses contrast against mid-tone kraft; keep the header on the plain page background (see the Folder, Not the Letterhead Rule).
- **Don't** touch `BrandMark.vue`. Its flag-gradient text and three color bars (`#FFDD00`/`#0033A0`/`#ED1C24`) are intentionally outside every token in this document — confirmed as an untouchable brand asset, not an oversight to reconcile.
- **Don't** add a decorative eyebrow/kicker line above arbitrary headings. The system's only small-caps uppercase label is the folder-tab/chip/category-tag component, scoped to catalog and filter labeling — it is not a general-purpose heading ornament.
- **Don't** reintroduce blur/backdrop-filter glass panels. This system replaced that look; depth is paper-stacking or nothing.
