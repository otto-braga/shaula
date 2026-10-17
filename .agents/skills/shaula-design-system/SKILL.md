---
name: shaula-design-system
description: "Public frontend design system, editorial layout patterns, typography, color tokens, and UI component conventions for the Shaula cultural catalog & archive project."
---

# Shaula: Public Frontend Design System

This skill defines the visual language, layout architecture, typographic hierarchy, and component patterns for the **Shaula** public-facing frontend (`resources/js/pages/` and `resources/js/components/public/`).

Use this skill whenever creating, refactoring, or styling public pages and components so they remain cohesive with Shaula's clean, editorial, archival aesthetic.

---

## 1. Core Design Philosophy

Shaula's public interface follows an **Editorial Archival Minimalist** style inspired by museum catalogs, art criticism journals, and brutalist-editorial grids:

1. **Structural Hairline Grids:** Sections and columns are separated by visible `1px` border lines (`divide-x`, `divide-y`, `border-t`, `border-b`, `border-l`) rather than floating cards, drop shadows, or heavy background fills.
2. **Monochromatic Palette:** High-contrast black, white, and neutral grays (`zinc`, `gray`, `slate`) keep visual focus on the artworks, archival photographs, and critical essays.
3. **Sharp Geometry:** Images, buttons, pagination controls, and containers use crisp, unrounded edges (avoid `rounded-lg` or `rounded-xl` cards on public pages) and rely on aspect-ratio cropping (`aspect-square`, `aspect-video`) for visual rhythm.
4. **Typographic Affordances:** Interactive links and cards signal interactivity primarily through `hover:underline` / `group-hover:underline`, subtle image zoom (`group-hover:scale-105`), and directional icons (`ArrowUpRight`, `ArrowRight`).

---

## 2. Color & Surface Tokens

Defined in `resources/css/app.css` using Tailwind CSS v4 (`@tailwindcss/vite`) with `.dark` variant support:

| Role | Light Mode Classes | Dark Mode Classes | Usage |
| :--- | :--- | :--- | :--- |
| **Page Background** | `bg-white` / `bg-background` | `dark:bg-zinc-950` / `dark:bg-background` | Main canvas (`PublicLayout`, content wrappers). |
| **Primary Text** | `text-zinc-950` / `text-gray-900` / `text-black` | `dark:text-zinc-50` / `dark:text-gray-100` | Headings, primary titles, active filter labels. |
| **Body / Prose Text** | `text-zinc-800` / `text-gray-700` | `dark:text-zinc-200` / `dark:text-gray-300` | Long-form article content, biographies, descriptions. |
| **Secondary / Excerpt Text** | `text-gray-600` / `text-slate-700` | `dark:text-zinc-300` / `dark:text-zinc-400` | Card summaries (`line-clamp-*`), secondary metadata. |
| **Muted / Caption Text** | `text-zinc-500` / `text-slate-500` / `text-gray-500` | `dark:text-zinc-400` | Dates, counts, section kickers, author subtitles, empty states. |
| **Dividers & Hairlines** | `border-gray-200` / `border-zinc-200` / `border-slate-300` | `dark:border-zinc-800` | Column/row `divide-x`, `divide-y`, timeline axes, section borders. |
| **Active Control Surface** | `bg-black text-white border-black` (or `bg-zinc-900`) | `dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100` | Active pagination page, active alphabet filter button. |
| **Inactive Control Surface** | `bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400` | `dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800` | Inactive pagination and filter buttons. |
| **Image Placeholder Surface** | `bg-zinc-100` / `bg-slate-100` | `dark:bg-zinc-800` / `dark:bg-zinc-900` | Image wrappers while loading or framing media. |

> **Rule:** Never introduce bright primary colors (such as `bg-blue-600`, `bg-red-50`, or colorful gradients) for public buttons, filters, or pagination. Always use monochrome black/zinc/white states.

---

## 3. Typography & Hierarchy

The global font is **Instrument Sans** (`--font-sans` in `resources/css/app.css`).

### Typographic Scale & Patterns:
- **Navigation Bar (`NavBar`):**
  - Desktop links: `text-2xl`, separated from search/theme controls by `divide-x`. Active route uses `underline`, all items use `hover:underline`.
  - Mobile drawer (`Sheet`): `text-right text-3xl` vertical stack.
- **Section Kickers / Labels:**
  - `text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400` (e.g., `Institucional`, `Acervo`, `Exposição`).
- **Uppercase Section Headers:**
  - Used for major home blocks and entity subsections:
    - Home section headers: `text-3xl uppercase` paired with `<ArrowUpRight size={32} />` (e.g., `ÚLTIMOS ARTIGOS`, `OBRAS EM DESTAQUE`, `ÚLTIMAS CRÍTICAS`).
    - Detail page subsection headers: `text-xl font-medium uppercase` (e.g., `BIOGRAFIA`, `CRONOLOGIA`, `CRÍTICAS`, `OBRAS`, `EXPOSIÇÕES`, `SHAULA - CRÍTICA`).
- **Page & Article Titles (`h1`):**
  - Index/Institutional headers: `text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl`.
  - Editorial show pages (`/critica/{slug}`, `/historia/artigo/{slug}`, `/historia/periodo/{slug}`):
    - Review show: `text-3xl font-semibold` (left-aligned above date and prose).
    - History Article show: `text-2xl font-medium md:text-3xl` (centered with inline comma-separated authors).
    - Period show: `text-4xl font-bold` accompanied by `text-2xl` date range (`<span>{start_date}</span> <ArrowRight /> <span>{end_date}</span>`).
- **Feed & Card Titles (`h2` / `h3`):**
  - Review feed & Period list: `text-2xl font-semibold` or `text-2xl font-medium group-hover:underline md:text-3xl`.
  - Related items / Secondary cards: `text-lg` or `text-xl font-medium group-hover:underline`.
- **Rich Text Prose (`dangerouslySetInnerHTML`):**
  - Article & Review body: `text-lg lg:text-xl` or `text-lg md:text-2xl` with generous vertical spacing (`mt-3 pb-6` or `leading-relaxed`).
  - Card excerpts: `mt-3 line-clamp-3`, `line-clamp-4`, or `line-clamp-5 text-lg text-gray-600 dark:text-gray-300`.
- **Bylines & Metadata:**
  - Author links: `hover:underline` or `text-gray-500 underline` linking to `route('public.people.show', author)`.
  - Dates: Formatted via `formatDate()` or `formatExhibitDateRange()` from `@/lib/utils`, styled as `text-sm text-slate-500` or `text-sm text-zinc-600 dark:text-zinc-400`.

---

## 4. Layout Shell & Page Archetypes

All public pages wrap their content in `PublicLayout` (`resources/js/layouts/public-layout.tsx`):
- Fixed top `NavBar` (`h-16 border-b bg-white px-4 dark:bg-zinc-950`) that hides on downward scroll and reveals on upward scroll.
- Main container (`main.mt-16.flex-1`).
- Minimal footer border (`mt-6 w-full border-t p-12`).

### Archetype A: Editorial Feed with Featured Carousel & Divided Columns
**Reference Pages:** `/critica` (`resources/js/pages/review/index.tsx`)
1. **Top Hero Carousel:** `FeaturedCarousel` (`max-h-[50vh]`, 2 items per view on desktop `basis-full md:basis-1/2`, `aspect-video` image with `bg-gradient-to-t from-black/85 via-black/40 to-transparent` overlay and centered white title + underlined authors).
2. **3-Column Divided Grid:** `section.grid.grid-cols-1.divide-x.px-4.pt-8.md:grid-cols-8.md:gap-8.md:px-8`
   - **Left Column (`md:col-span-2 pr-8`):** Section title (`h1.font-medium`) and institutional description (`max-w-sm text-justify`).
   - **Center Feed (`md:col-span-4 lg:col-span-5 divide-y md:pr-8`):** Vertical list of horizontal 2-column cards (`grid gap-3 py-6 md:grid-cols-2`), pairing an `aspect-video w-full object-cover` thumbnail with title, authors, and `line-clamp-5` excerpt, followed by `PaginationWithAnchor`.
   - **Right Filter Sidebar (`md:col-span-2 lg:col-span-1 md:pl-4`):** `border-b` heading (`Categorias` + `Limpar`), vertical list of filter links (active item bold + underlined), and `Ver mais` incremental loader.

### Archetype B: Chronological Timeline Index
**Reference Pages:** `/historia/artigos` & `/historia/periodizacao` (`resources/js/pages/historyArticle/index.tsx`)
1. **Top Hero Carousel:** `FeaturedCarousel` showcasing the latest history articles.
2. **Centered Vertical Timeline:** `section.flex.w-full.items-center.justify-center.px-4.pt-8` -> `div.max-w-2xl` -> `div.mt-3.divide-y`
   - Each `Period` entry uses a left timeline border (`group cursor-pointer space-y-3 border-l-1 border-slate-300 py-6`).
   - Horizontal tick connector (`flex items-center gap-6` containing `<div className="h-[1px] w-8 bg-slate-300" />` + `h2.text-2xl.font-medium.group-hover:underline.md:text-3xl`).
   - Indented content block (` space-y-3 pl-8`): Date range with `<ArrowRight />`, `aspect-video w-full object-cover` image, and `line-clamp-5 text-lg text-gray-600` summary.

### Archetype C: Period Split-View Show Page
**Reference Page:** `/historia/periodo/{period:slug}` (`resources/js/pages/period/show.tsx`)
1. **Top Cropped Banner:** `div.max-h-[40vh].overflow-hidden` with full-width primary image (`w-full`).
2. **2-Column Divided Split:** `div.grid.grid-cols-1.gap-6.divide-x.p-4.md:grid-cols-2.md:p-8`
   - **Left Column (`md:pr-6`):** Period title (`text-4xl font-bold`), date range (`mt-3 flex gap-2 text-2xl` with `<ArrowRight />`), and rich HTML overview (`mt-8 text-xl`).
   - **Right Column:** Related articles (`h2.text-xl` `Artigos relacionados`), rendered as a `flex flex-col gap-6 divide-y` stack where each item is a horizontal flex card (`group flex gap-6 pb-6`) with an `aspect-square w-40 object-cover` thumbnail, `text-xl font-medium group-hover:underline` title, underlined authors, and `line-clamp-4` excerpt.

### Archetype D: Editorial Article / Review Reading View
**Reference Pages:** `/critica/{review:slug}` (`resources/js/pages/review/show.tsx`), `/historia/artigo/{historyArticle:slug}` (`resources/js/pages/historyArticle/show.tsx`), `/obras/{artwork:slug}` (`resources/js/pages/artwork/show.tsx`)
> **Important Rule — Distinct Model Detail Signatures:** Each domain model's detail page (`show.tsx`) must have its own distinct structural layout so users can immediately recognize where they are (Review vs. History Article vs. Period vs. Person vs. Artwork vs. Exhibit), while sharing the same design tokens, typography, and structural `divide-x`/`divide-y` hairlines. Listing pages (`index.tsx`) do not need unique layouts and can share clean directory/catalog archetypes.

1. **Mobile Metadata Drawer:** `MobileDetailBar` (`fixed bottom-0 z-10 w-full backdrop-blur-lg lg:hidden`) providing collapsible access to sidebar metadata (`Período`, `Autoria`, `Categorias`, `Fontes`) separated by `divide-y *:pb-3`.
2. **Desktop Divided Multi-Column Grids (Per-Model Signatures):**
   - **Review Show (`/critica/{slug}`):**
     - Top parallax/fixed hero banner (`relative -mt-16 h-[25vh] lg:h-[50vh] overflow-hidden` with `fixed w-screen` image).
     - 6-column divided body (`relative grid gap-8 bg-white dark:bg-zinc-950 p-4 pt-8 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-8 lg:divide-x lg:pt-12`):
       - Left (`lg:col-span-1 hidden lg:block divide-y *:pb-3 lg:pr-8`): `Autoria` & `Categorias`.
       - Center (`md:col-span-2 lg:col-span-3 md:pr-6 lg:pr-8`): Title, authors, date, `divide-y` separating prose (`text-lg lg:text-xl`) and `Fontes` (`SourceCard`).
       - Right (`lg:col-span-2`): 2-column `ExpandableImage` gallery (`grid grid-cols-2 items-end gap-8`).
   - **History Article Show (`/historia/artigo/{slug}`):**
     - 6-column divided grid (`grid gap-12 p-4 pt-8 pb-20 md:grid-cols-6 md:divide-x-1 md:px-8`):
       - Left (`hidden md:col-span-2 lg:block lg:pr-12`): `divide-y *:pb-3` blocks for `Períodos`, `Autoria`, `Categorias`, and `Fontes`.
       - Right (`col-span-6 lg:col-span-4 lg:pr-12 space-y-8 divide-y *:pb-8`): Centered title & inline authors, `h-64 w-full object-cover` lead image, date (`text-sm text-slate-500`), prose (`text-lg md:text-2xl`), and a 2-column modulo-distributed (`acc[index % 2]`) `ExpandableImage` gallery below the divider.
   - **Exhibit Show (`/exposicoes/{slug}` — `resources/js/pages/exhibit/show.tsx`):**
     - **Top Split Exhibition Poster Header:** Full-width `border-b` 12-column split header (`grid grid-cols-1 divide-y border-b md:grid-cols-12 md:divide-x md:divide-y-0`):
       - Left Panel (`md:col-span-5`): `Exposição` kicker, bold exhibition title (`text-3xl sm:text-4xl lg:text-5xl font-bold`), prominent date range (`text-lg md:text-xl`), and a bottom `border-t` strip with `Autoria` and `Período` links.
       - Right Panel (`md:col-span-7 bg-zinc-100 dark:bg-zinc-900`): Framed `aspect-video max-h-[55vh]` primary exhibition poster/cover image (`ExpandableImage`).
     - **Divided Exhibition Catalog Body (`grid grid-cols-1 md:grid-cols-12 lg:divide-x`):**
       - Left Sticky Technical Sheet (`lg:col-span-3`): `Ficha Técnica` header + `divide-y` blocks for `Autoria`, `Equipe e Participantes`, `Períodos`, `Categorias`, and `Premiações` (paired with `MobileDetailBar title="Ficha Técnica"` on mobile).
       - Right Horizontal Showcase Sections (`lg:col-span-9 divide-y`): Full-width stacked catalog sections for `SOBRE A EXPOSIÇÃO` (curatorial text), `OBRAS EM EXPOSIÇÃO` (4-column square artwork showcase grid), `REGISTROS DA EXPOSIÇÃO` (3-column `ExpandableImage` installation gallery), and `FONTES`.

### Archetype E: Clean Container Directory / Catalog Listing
**Reference Pages:** `/pessoas` (`resources/js/pages/person/index.tsx`), `/exposicoes` (`resources/js/pages/exhibit/index.tsx`), `/sobre` (`resources/js/pages/about/index.tsx`)
- Centered container (`mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8` or `max-w-5xl` for single-column institutional prose).
- Header block with uppercase kicker (`text-xs font-semibold tracking-widest text-zinc-500 uppercase`), `h1` title, and optional record counter or monochrome filter bar (`border-b border-zinc-200 pb-8 dark:border-zinc-800`).
- Multi-column responsive grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) with either:
  - Text-only directory rows (`border-b border-zinc-200 py-4` + `group-hover:underline` + `ArrowUpRight` icon) as in `/pessoas`.
  - Square media cards (`aspect-square w-full object-cover` + `mt-2 text-xl group-hover:underline` + muted subtitle) as in `/exposicoes`.

---

## 5. Shared Public UI Components

Always reuse these existing components rather than reinventing them:

1. **`PublicLayout` (`@/layouts/public-layout`):**
   - Standard wrapper for all public pages. Pass `head="Page Title"`.
2. **`FeaturedCarousel` (`@/components/public/featured-carousel`):**
   - Embla autoplay hero carousel for editorial index pages (`/critica`, `/historia/artigos`). Accepts `items` and `getHref={(item) => route(...)}`.
3. **`MobileDetailBar` (`@/components/public/mobile-detail-bar`):**
   - Bottom collapsible sheet (`lg:hidden`) for displaying sidebar metadata (`Autoria`, `Categorias`, `Períodos`, `Fontes`) on mobile screens.
4. **`ExpandableImage` (`@/components/expandable-image`):**
   - Click-to-expand image component with fullscreen backdrop-blur lightbox and `Escape` key handling. Use for article, review, exhibit, and about page imagery.
5. **`PaginationWithAnchor` (`@/components/PaginationWithAnchor`):**
   - Standard pagination bar (`links={paginatedData.meta.links}` and optional `anchor="#section-id"`). Uses monochrome active (`bg-black text-white`) and inactive (`bg-white text-gray-700`) states.
6. **`SourceCard` (`@/components/ui/source-card`):**
   - Renders bibliographic source HTML and automatically links to the source file or embedded URL in a new tab (`hover:underline`).
7. **Home Cards (`@/components/public/artwork-card`, `review-card`, `history-article-card`):**
   - Standardized cards with `group-hover:scale-105` image transitions and `group-hover:underline` titles.

---

## 6. Checklist When Creating or Updating Public Pages

- [ ] Wrap page in `<PublicLayout head="...">`.
- [ ] Use structural `divide-x`, `divide-y`, and `border-b`/`border-t` hairlines to separate columns and content sections.
- [ ] Keep all interactive states (`Link`, filter buttons, pagination) strictly monochrome (`black`/`white`/`zinc`) with `hover:underline` or `group-hover:underline`.
- [ ] Include both light and `.dark` mode classes (`text-zinc-950 dark:text-zinc-50`, `border-zinc-200 dark:border-zinc-800`).
- [ ] Pair desktop metadata sidebars (`hidden lg:block`) with `<MobileDetailBar>` so metadata remains accessible on mobile devices.
- [ ] Use `<ExpandableImage>` for gallery images and `<SourceCard>` for bibliographic references.
- [ ] Provide a clean empty state with a "Limpar filtro" action whenever filtering can return zero results.
