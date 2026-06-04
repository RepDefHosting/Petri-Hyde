# MPDS-Microsite — Claude Code Context

Portfolio/executive profile microsite template. Each deploy creates a new client repo + Netlify project. Built with Gatsby 2 and Netlify CMS (git-gateway backend).

## Stack

- **Framework:** Gatsby 2 (React 16) — not v4/v5; some APIs differ
- **CMS:** Netlify CMS with JavaScript config (not YAML)
- **Package manager:** Yarn 1.22.4
- **Node:** 20.19.0 with `--openssl-legacy-provider` (required for Gatsby 2 on Node 20)
- **Deployment:** Netlify, branch: `master`

## Key Locations

- Pages (markdown): `src/pages/`
- Page templates: `src/templates/`
- Components: `src/components/`
- Custom hooks: `src/hooks/`
- React context: `src/context/`
- Styles: `src/style/`
- CMS config: `src/cms/`
  - Collections: `src/cms/collections/`
  - Partials (reusable field groups): `src/cms/partials/`
  - Preview templates: `src/cms/preview-templates/`
  - Entry point: `src/cms/index.js`
- Static assets / uploaded images: `static/img/`
- Netlify headers: `static/_headers`
- Build config: `netlify.toml`

---

## How Pages Are Built

`gatsby-node.js` queries all markdown files, reads the `templateKey` frontmatter field from each, and calls `createPage()` pointing to the matching file in `src/templates/`. **`templateKey` is the sole bridge between CMS content and templates** — if it doesn't match a template filename, the page won't build.

Slugs come from `createFilePath()` with trailing slashes enforced via `addTrailingSlash()`. Every URL ends in `/` — no exceptions.

### Page inventory

| File | `templateKey` | URL |
|------|--------------|-----|
| `src/pages/index.md` | `index-page` | `/` |
| `src/pages/profile.md` | `profile-page` | `/profile/` |
| `src/pages/blog/index.md` | `blog-archive` | `/blog/` |
| `src/pages/gallery/index.md` | `gallery-archive` | `/gallery/` |
| `src/pages/sitedata.md` | `site-data` | (never published — global config) |
| `src/pages/menudata.md` | `menu-data` | (never published — nav config) |
| `src/pages/404.js` | — | `/404` |

### Template inventory

| Template | Renders |
|----------|---------|
| `src/templates/page.js` | Home and profile pages |
| `src/templates/blog-post.js` | Individual blog articles |
| `src/templates/blog-archive.js` | Blog listing page |
| `src/templates/gallery-post.js` | Individual gallery images |
| `src/templates/gallery-archive.js` | Gallery grid with lightbox |

### Date handling

CMS date field → git creation timestamp (`gitCreatedTime` via `execSync git log`) → build time. Formatted with moment-timezone (America/Los_Angeles). `dateModified` uses `gitAuthorTime`.

---

## Component Inventory

All components are in `src/components/` and exported from `src/components/index.js`.

| Component | Role |
|-----------|------|
| `Layout.js` | Root wrapper — Nav, Footer, SEO, Fonts, ThemeContext |
| `Nav.js` | Responsive header nav; mobile toggle; initials logo |
| `Footer.js` | Name, location, social links (`show: true` filtered) |
| `Banner.js` | Hero — featured image, header/subheader, optional profile image |
| `SEO.js` | React Helmet; og:/twitter: meta; JSON-LD schema.org; applies theme class to `<html>` |
| `Fonts.js` | Injects Google Font `@font-face` based on `fontScheme` |
| `DynamicFavicon.js` | Canvas-generated favicon with client initials |
| `HTMLContent.js` | Renders remark HTML; swaps inline `<img>` for Gatsby `<Img>`; lazy-loads iframes |
| `PostCard.js` | Article preview card — image, title, date, teaser |
| `PostFeed.js` | Grid container for PostCard list; empty state fallback |
| `PhotoCard.js` | Gallery thumbnail — image + caption; click opens lightbox |
| `PhotoFeed.js` | Gallery grid + keyboard-navigable lightbox (arrows, ESC) |
| `PreviewableImage.js` | Gatsby `<Img>` in prod; raw `<img>` in CMS preview |
| `InlineBackgroundImage.js` | Background-image container with color overlay |
| `ExtraContent.js` | Optional markdown section with IntersectionObserver visibility |
| `ThemeSwitcher.js` | Dev-only panel for switching color/font schemes |

**Custom hooks** (`src/hooks/`): `useSiteData`, `useNavPages`, `useRecentPosts` — abstract StaticQuery calls so components don't write raw GraphQL inline.

---

## CMS Collections → Templates

CMS is configured in JavaScript files, not YAML. Match the existing pattern in `src/cms/collections/page.js` when adding collections.

| Collection | Content type | Template | Preview template |
|------------|-------------|----------|-----------------|
| `collections/blog.js` | Blog posts (`src/pages/blog/`) | `blog-post.js` | `BlogPostPreview.js` |
| `collections/gallery.js` | Gallery posts (`src/pages/gallery/`) | `gallery-post.js` | `GalleryPostPreview.js` |
| `collections/page.js` | Fixed pages (index, profile, archives) | `page.js` | `PagePreview.js` |
| `collections/meta.js` | `sitedata.md` + `menudata.md` | (never published) | — |

When adding a new collection:
1. Create the collection file in `src/cms/collections/`
2. Add a preview template in `src/cms/preview-templates/`
3. Register both in `src/cms/index.js`
4. Create the matching template in `src/templates/`
5. Ensure the template actually uses every CMS field you define

### Reusable partials

- `src/cms/partials/seo.js` — `pageTitle`, `metaDescription`, `published` (included in every collection)
- `src/cms/partials/featuredImage.js` — `src` (image widget) + `alt` (required for SEO)

### Key field conventions

- `templateKey` — hidden field, hardcoded default; routes `gatsby-node.js` to the right template
- `schemaType` — select widget; drives JSON-LD type (BlogPosting, WebPage, ProfilePage)
- `published` — boolean; `gatsby-node.js` filters out `published: false` pages from nav/build
- Buttons (`profileButton`, `blogButton`) — relation widgets referencing page slugs
- Gallery posts have no `body` field — image-only content type
- `sitedata.md` and `menudata.md` use `published: false` to hide from CMS nav

---

## Styles / CSS

Mixed SCSS (`.scss`) and SASS (`.sass` indented syntax) — both are valid, don't convert between them.

```
src/style/
├── main.scss              ← entry point; imports common/ and sections/
├── all.sass               ← CMS preview entry point
├── common/                ← SCSS
│   ├── _colors.scss           CSS variables & theme color definitions
│   ├── _common.scss           Reset + base element styles
│   ├── _header.scss           Nav/header
│   ├── _footer.scss           Footer
│   ├── _mob-menu-pnl.scss     Mobile menu panel
│   └── _svgs.scss             SVG rules
├── components/            ← SASS (indented)
│   ├── _vars.sass             Breakpoints ($small: 740px, $xsmall: 480px), spacing ($margin: 2rem, $height: 4rem)
│   ├── _themeColors.sass      Color scheme overrides (.londn, .sand, .coral, .sun)
│   ├── _themeFonts.sass       Font scheme overrides (.muli, .lora, .proza, .rubik, .popp)
│   └── ...                    buttons, nav, postcards, posts, etc.
└── sections/              ← SCSS
    ├── _sec-hero-main.scss    Home page hero
    ├── _sec-hero-sml.scss     Archive page hero
    ├── _sec-article-list.scss Blog archive grid
    ├── _sec-article-full.scss Blog post detail
    ├── _sec-picture-list.scss Gallery grid
    └── lightbox.scss          Lightbox modal
```

**Naming conventions:**
- Sections: `.sec-*` (e.g., `.sec-hero-main`, `.sec-article-list`)
- BEM-lite: `.component-variant` (e.g., `.extra-content-home`)

**Theme system:** `ThemeOptionsContext` (`src/context/ThemeOptions.js`) holds `colorScheme` + `fontScheme` sourced from `sitedata.md`. The SEO component applies the corresponding class to `<html>` (e.g., `class="londn muli"`). CSS overrides in `_themeColors.sass` and `_themeFonts.sass` use ancestor selectors: `.londn .element { color: ... }`.

`gatsby-plugin-purgecss` strips unused CSS in production. Theme class names (`londn`, `sand`, `coral`, `sun`, `muli`, `lora`, `proza`, `rubik`, `popp`) are whitelisted — do not remove them from the whitelist.

---

## gatsby-config.js

**Site metadata fields:** `title`, `colorOptions` (`[londn, sand, coral, sun]`), `fontOptions` (`[muli, lora, proza, rubik, popp]`)

**Plugin order matters** — `gatsby-plugin-netlify` must be last.

Key plugin notes:
- `gatsby-source-filesystem` for `static/img` must come before `src/pages` (required for image optimization)
- `gatsby-transformer-remark` runs 7 sub-plugins including image optimization (maxWidth: 1360, quality: 75, WebP) and external links (open in new tab)
- `gatsby-plugin-purgecss` is disabled in development
- `gatsby-plugin-netlify-cms` uses `manualInit: true` — CMS is initialized in `src/cms/index.js`, not automatically

---

## Patterns & Conventions

**File naming:**
- Markdown pages: `kebab-case.md`
- Components: `PascalCase.js`
- SCSS/SASS partials: `_kebab-case.scss` / `_kebab-case.sass`
- Hooks: `useCamelCase.js`
- CMS collections: `lowercase.js`

**GraphQL image aliasing:** Always request 3 variants per featured image:
- `d:` — desktop (1440px wide)
- `m:` — mobile (720px wide)
- `square:` — square crop (270×270, cropFocus: CENTER)

Use `...GatsbyImageSharpFluid_withWebp` fragment on all image queries.

**Inline images in markdown:** `HTMLContent.js` parses the rendered HTML and swaps `<img>` tags for Gatsby `<Img>` components using the `inlineImages` array passed from `gatsby-node.js`. Don't bypass this — raw `<img>` tags won't be optimized.

**SEO pattern:** Every template calls `seoProps(data)` utility → passes result to `<Layout>` → consumed by `<SEO>` → rendered via React Helmet. Schema.org JSON-LD type is controlled by `schemaType` frontmatter.

**CMS preview flag:** Components receive `isPreview` prop when rendered inside the CMS preview pane. `PreviewableImage` uses this to skip Gatsby image processing (not available in preview context).

**Routing:** All slugs have trailing slashes. `addTrailingSlash()` in `gatsby-node.js` enforces this — don't hardcode paths without a trailing slash.

---

## Build & Dev

```bash
yarn install
gatsby develop       # local dev server
yarn build           # production build (runs scripts/prebuild first)
```

`netlify.toml` build command: `scripts/prebuild && gatsby clean && gatsby build`

The `--openssl-legacy-provider` Node option is set in `netlify.toml` and is required — Gatsby 2 dependencies use legacy OpenSSL on Node 20.

Push to `master` triggers Netlify auto-deploy.
