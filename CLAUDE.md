# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eva D Bags is a static brochure website for an artisanal Italian handbag brand. No build tools, bundlers, or package managers — just plain HTML, CSS, and vanilla JS served as static files.

## Architecture

- **`/index.html`** — English homepage (single-page layout: hero, story, collection grid, contact, footer)
- **`/it/index.html`** — Italian translation (mirrors English structure; asset paths use `../` prefix)
- **`/css/styles.css`** — Single stylesheet shared by both languages
- **`/js/main.js`** — Single JS file shared by both languages: nav scroll behavior, mobile menu toggle, IntersectionObserver fade-ins, lightbox/carousel with keyboard navigation and focus trap
- **`/images/bag{1-6}/`** — Per-bag image folders containing full-size `.webp`, thumbnails (`_thumb.webp`), and card images (`card.webp`/`card.jpg`). Hero background in `/images/hero-bg.webp`
- **`/web.config`** — IIS MIME type config for `.webp` and `.svg` (site is hosted on IIS/Azure)
- **`/brief/`** — Design brief assets (gitignored from output, reference only)

## Key Patterns

**Bag cards use data attributes for lightbox content.** Each `.bag-card` in the collection grid stores its gallery images, thumbnails, detail text, material, and size as `data-*` attributes. The JS reads these to populate the lightbox. When adding/editing a bag, update both the card HTML and these data attributes.

**Both language versions must be kept in sync.** Any structural change to `index.html` must be mirrored in `it/index.html` (with translated text and `../` asset paths). The Italian version also uses `data-material-label` and `data-size-label` attributes for localized field labels.

**Images use `<picture>` with WebP + JPG fallback.** Card thumbnails and hero images follow this pattern. Lazy loading (`loading="lazy"`) is used on collection card images.

**CSS naming follows BEM conventions** (e.g., `.bag-card__image`, `.lightbox__arrow--prev`).

## Design Tokens

- **Colors:** Background `#FAFAF7`, beige section `#F0EBE3`, text `#1A1A1A`, gold accent `#C9A96E`
- **Fonts:** Logo/brand — `Lucida Handwriting`; headings — `Cormorant Garamond` (serif); body — `Montserrat` 300/400/600 (sans-serif)
- **Breakpoints:** 768px (tablet: 2-col grid, 3-col benefits), 1024px (desktop: 3-col grid)

## Image Pipeline

Source images live in `brief/images/bag{N}/`. Optimized outputs go to `images/bag{N}/` as card (800px), gallery (800px), thumbs (200x200). ImageMagick 7.1.2 is used for processing:
```
export PATH="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI:$PATH"
```

## Bag Catalog

1. **Lulu** (bag1) — Small 26x22cm, jute/linen + raw silk
2. **Cleo** (bag2) — Medium 31x31cm, jute/linen + raw silk
3. **Siena** (bag3) — jute/linen + linen (no size listed)
4. **Julia** (bag4) — details TBC from owner
5. **Luna** (bag5) — Large 42x35cm, organic cotton + linen
6. **Chicca** (bag6) — Small 23x21cm, organic cotton + linen

## Development

No build step. Open `index.html` directly in a browser or serve with any static file server. For IIS deployment, `web.config` handles WebP/SVG MIME types.
