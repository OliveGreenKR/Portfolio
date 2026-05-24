# Portfolio UI Kit

Recreation of the developer portfolio site this design system was built for. Single-page document with five surfaces:

1. **Hero** — name, identity quote, contact
2. **Project list** — numbered cards (DX11, Cartapli, Wobble Wobble, 1000 Kittens, Badulbadul)
3. **Project detail** — Context · Problem · Action · Result · Evidence rail with tags, stats, code-reveal
4. **About / Identity narrative**
5. **Footer** — contact + role target

Components live in `App.jsx`. Open `index.html` to interact.

## Components
- `Header` · sticky top, mono nav
- `Hero` · name + identity quote
- `ProjectList` · numbered list with tags + meta
- `ProjectDetail` · the structural label rail (CONTEXT/PROBLEM/...) + stats row + code-reveal
- `About` · identity narrative pull
- `Footer`
- `Tag`, `StatRow`, `Callout`, `CodeReveal` · primitives

## Interactions
- Click a project in the list → opens detail in place
- "Back to projects" returns to the list
- Code-reveal `<details>` toggles real code on demand (the "one depth deeper" rule)

This is a fidelity recreation, not production code. Designs lifted from the research dossiers in `uploads/`; the user's actual site assets, if any, were not provided.
