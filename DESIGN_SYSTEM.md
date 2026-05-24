# JCH Portfolio Design System

A design system for a **developer portfolio** — specifically for a Korean game/engine programmer whose identity statement is:

> **"사용성의 진짜 의미는 외부 API뿐 아니라 변경에 강한 구조에서 나온다."**
> *Real usability lives not just in the external API, but in a structure that survives change.*

The portfolio's job is to make three things legible at a glance:

1. **Project overview & outcomes** — what was shipped, what it did
2. **Architecture, design, and design intent** — *why* it was structured this way
3. **Problems solved** — concrete pain points and the resolution

Code blocks are **secondary** by design. The reader should grasp intent and structure without reading code; if they want code, it sits one interaction deeper.

## Constraints (locked)

- **Primary aspect ratio**: 16:9 — slides and detail surfaces are designed at 1920×1080 first; smaller breakpoints reflow.
- **Density**: pack slides densely without harming the design — fill 16:9 surfaces with structured content rather than centering a small block in whitespace.
- **Language**: communicate with the owner in **Korean**. Internal prompts, code, comments, asset names — **English**.
- **Profile photo**: `assets/profile.jpg` (single canonical portrait).
- **Brand mark**: `assets/brand-mark.png` (mammoth glyph on sage circle).
- **Primary font**: Pretendard Variable, loaded locally from `fonts/PretendardVariable.ttf`. Pretendard is the **single base typeface** for both Korean and Latin — no separate Latin fallback (mono is JetBrains Mono only, used for code).
- **Tone**: *clean but friendly* — a notebook page that is well-kept, not a corporate doc. Hairline rules + soft sage/terra tints + occasional dashed strokes; never sterile, never overly playful.
- **Highlighter is a first-class tool** — `<mark class="hl">` (sage) and `<mark class="hl hl--terra">` (terracotta) are used to mark important inline phrases. **Only these two brand colors** are valid highlighter fills; no other color may be used.

## Architecture rules (locked)

The portfolio is a **responsive web** surface that must also produce a **print PDF**. To keep both surfaces in sync without divergence:

1. **React components are the single source of truth for semantic structure.**
   `Tag`, `Button`, `Callout`, `ProjectCard`, etc. live as standalone JSX modules. They are imported — never re-defined inline inside views.
2. **CSS classes + CSS variables are the single source of truth for visual style.**
   All component styles live in `src/styles/components.css`. Tokens live in `src/styles/tokens.css` (currently mirrored as the project-root `colors_and_type.css`).
3. **Web and Print share data; layout wrappers are separated.**
   `views/WebPortfolio.jsx` and `views/PrintPortfolio.jsx` consume the same data and the same primitive components but lay them out differently (responsive grid vs. fixed-page).
4. **Web-only effects stay in `web.css`.** Hover, transitions, animations, sticky headers, blur, viewport-relative units — all live only in this layer.
5. **Print-only constraints stay in `print.css`.** Fixed width / fixed margins / static layout / `page-break-*` / `@page`.
6. **Preview cards must import from the same components** as the real UI kit. A preview card is a thin demo wrapper around the canonical component, never a re-implementation.

```text
/src
  /components       — primitive + composite components (single source of meaning)
    Tag.jsx · Button.jsx · Callout.jsx · CodeReveal.jsx · ProjectCard.jsx
  /views            — layout wrappers
    WebPortfolio.jsx · PrintPortfolio.jsx
  /styles
    tokens.css · components.css · web.css · print.css
  App.jsx
```

## Type weight rules (locked)

- **Avoid Light (300) and below.** Light weights make Korean glyphs feel cold and overly modern — exactly the opposite of the friendly-notebook tone.
- **Use weights 400, 500, 600, 700.** Body defaults to 400; emphasis uses 500–600; headlines use 600–700.
- The highlighter utility intentionally bumps marked text to 600 to keep emphasis warm and confident.

## Index

- `colors_and_type.css` — design tokens (CSS variables + semantic classes)
- `fonts/PretendardVariable.ttf` — primary brand font (variable, weights 100–900)
- `assets/profile.jpg` — owner portrait
- `src/` — components, views, styles (canonical source of meaning)
- `pages/` — per-page React modules + `data.js` content + built `.html`
- `ui_kits/portfolio/` — recreation of the portfolio site

---

## Brand essence

| | |
|---|---|
| **Identity** | *The engineer who builds tools that keep running on their own* |
| **Voice** | Calm, factual, structured. Reflective, not boastful. |
| **Tone** | Document-like, slightly serious, warmly readable |
| **Mood colors** | Sage `#b9d1b0` + Terracotta `#e08a75` on warm paper |
| **Vibe** | A well-kept engineering notebook. Flat, generous whitespace, hairline rules. |

---

## Content fundamentals

**Pronouns & casing.** Korean-first content. The narrative voice uses **"본인"** ("I/myself") in formal write-ups and plain past-tense reflection in personal sections. English-facing copy uses lowercase headlines and sentence case throughout — never ALL CAPS. Eyebrow labels are an exception (mono, uppercase, tracked).

**Structure pattern.** Every project page follows the same skeleton, learned from the source Fact Units:

> **Context → Problem → Action → Result → Evidence**

This mirrors the user's own research format and is the load-bearing structure of the whole system. Headings, cards, and slides should reuse these five labels verbatim where a project deep-dive is shown.

**Specificity over rhetoric.** Numbers carry the weight: *147 files*, *16 weeks*, *98% positive on Steam*, *5-week release*, *14 languages*, *84 tests*, *O(n²)→O(n log n)*. Avoid superlatives ("amazing," "innovative") — let the figure speak. When a number is missing, **say so** ("측정값 없음" / "no measured value"); never invent.

**Honesty about role.** If a piece of work was a teammate's (e.g. Cartapli's paper-folding math), the portfolio explicitly attributes it. The user's research uses ⚠️ flags for this — preserve that pattern.

**Vibe examples.**

- ✅ "동적 AABB 트리로 충돌 감지를 O(n²)에서 O(n log n)으로 개선했다." *(action + measurable outcome)*
- ✅ "PoC 4주, 10개+ 제작·탈락." *(numbers carry the story)*
- ✅ "⚠️ 종이접기 핵심 수학 로직은 PoC 입안자 작품. 본인 담당은 3분할 리팩토링과 입력 컨트롤러 분리." *(role honesty)*
- ❌ "Revolutionary engine pushing the boundaries of game development." *(rhetoric, no fact)*
- ❌ "🚀 Built an amazing physics engine!" *(emoji + superlative + no specifics)*

**Emoji.** Effectively none. The source materials use exactly two glyphs purposefully — ⚠️ for flags/caveats and ✓ for confirmed facts. That is the entire emoji vocabulary. Decorative emoji is forbidden.

**Length.** Short paragraphs. 2–4 sentence chunks. Lists are bulleted with leading nouns/verbs, never bullet-soup. Code is quoted inline as `monospace` and never dumped as long blocks on overview screens.

---

## Visual foundations

**Surface.** Warm paper background `--paper` (`#fbf9f5`) — not white. Card surface is one shade darker `--paper-2`. The whole system reads like a clean engineering notebook on cream stock, not a glossy SaaS landing page.

**Color usage.** Sage `--sage-300` is the system's primary accent — used for active states, success, "shipped", positive numbers. Terracotta `--terra-300` is the secondary — used for callouts, problem statements, warm emphasis, and the single highlight color in long-form text. **Never gradients between the two.** They sit beside each other, never blend. Color is reserved; most surface area is paper + ink.

**Type.** Pretendard (Korean-first) for everything; IBM Plex Sans KR as fallback; JetBrains Mono for code, eyebrows, and stat figures. Display sizes are tight (`-0.02em`); body is generous (`line-height: 1.65`). One typeface family — no mixing display serifs or script.

**Backgrounds.** No imagery, no gradients, no repeating patterns, no full-bleed photography. The system relies entirely on space + hairline rules + the two accent colors. This is intentional: a portfolio about structural clarity should *look* structurally clear.

**Animation.** Restrained. Fades and 4–8px translations only, 120–320ms, `cubic-bezier(0.2, 0.6, 0.2, 1)`. No bounces, no springs, no parallax. Cards don't lift on hover; they get a 1px ring instead.

**Hover states.** Color shifts only — surface goes from `--paper-2` to `--paper-3`; text links pick up an underline; buttons darken. **No scale, no shadow change.**

**Press states.** A 1px inset shadow + slight ink-darken. No shrink/scale.

**Borders.** 1px hairline `--rule` (`#d9d3c4`) is the dominant divider. Rules and borders carry more visual weight than shadows in this system.

**Shadows.** Almost none. `--shadow-1` is a 1px ground-line; `--shadow-2` is for the rare floating element (modal, tooltip). Cards do **not** have drop shadows — they have a 1px border instead.

**Capsules vs gradients.** Tags and badges are flat capsules (`--r-pill`) with a 1px border in the tag's hue. No glow, no gradient fill.

**Layout rules.** A 12-column grid at 1280px, 8-column at tablet, single column at mobile. Project pages run on a left-margin **structural label column** (40–80px wide) that prints CONTEXT / PROBLEM / ACTION / RESULT / EVIDENCE in mono eyebrow style — this column is the visual signature of the system.

**Transparency / blur.** Used only for the sticky page header (88% paper + 12px backdrop-blur). Nowhere else.

**Imagery.** Black-and-white or desaturated; warm grain optional; never cool/blue. Most pages have **no imagery** — diagrams and structured text instead.

**Corner radii.** Tiny. `--r-2` (4px) is the default for cards and inputs. `--r-pill` for tags only. The system reads more like printed paper than rounded UI.

**Cards.** 1px border (`--rule`), 4px radius, no shadow, paper-2 fill. Hover: border darkens to `--rule-2`, fill goes paper-3. That's the entire card vocabulary.

**Fixed elements.** Sticky page header (top, 64px). Optional table-of-contents rail on the right for long project pages. No fixed CTAs at bottom — the document flows.

---

## Iconography

The portfolio doesn't lean on iconography — **structured text and tags do most of the visual work**. Where icons are needed, the system uses **Lucide** (loaded from CDN) for its consistent 1.5px stroke weight and pared-down geometry, which matches the flat-document aesthetic.

- **Stroke icons only** — no filled icons, no duotone, no rounded color icons.
- **24px default**, 20px in dense UI, 16px inline.
- **Color** matches surrounding text (`--fg-2` typically); never bright/colored icons.
- **Brand glyphs** (project marks for DX11 / Cartapli / Wobble / 1000Kittens) are simple monogram letterforms in `assets/` — see brand cards.
- **No emoji** in product surfaces. ⚠️ and ✓ are the only allowed unicode marks, used exactly as the source research uses them.
- **No hand-drawn SVG, no AI-generated illustration.** The system deliberately abstains from decorative imagery.

> **Substitution flag.** The intended Korean web font is **Pretendard** (loaded from Google Fonts as configured). If the user has specific Pretendard `.woff2` files (variable or static) they want bundled locally for offline / production use, please attach them; the current setup uses the public Google Fonts CDN with IBM Plex Sans KR as fallback.

---

## UI kits

- **`ui_kits/portfolio/`** — single-page portfolio recreation: hero, project list, project detail (Context/Problem/Action/Result/Evidence), about, footer. This is the canonical surface the design system is in service of.

There is no separate marketing site or app — the portfolio *is* the product.
