<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application structure
- The homepage is composed from independent sections in `src/sections/*`, with editable marketing copy centralized in `src/content/home.ts`; keep this separation so content and layout remain easy to maintain.
- The homepage hero background effect lives in `src/lib/fold-wave.ts` (framework-free WebGL loop) mounted by `src/components/site/HeroFoldBackground.tsx`; keep per-frame state out of React and colors in the `--fold-*` CSS tokens so the effect stays cheap and themeable.
- The intro's 3D infinity logo lives in `src/lib/infinity-3d.ts` (framework-free three.js, loaded with a dynamic import by `IntroAnimation`); the intro timeline waits for it on a white screen and falls back to the original SVG logo when WebGL is missing or slow, so the sequence never breaks.
- The Hero → About slide-over lives in `src/components/site/HeroSlideOver.tsx` (sticky hero + About panel above it, rAF only for edge shadow/radius); it owns the in-flow `#home` anchor so nav and scroll spy keep working while the hero is pinned, and must wrap only those two sections.
- Homepage cards that will open future detail pages store a `PlannedLink` (route + `live` flag) in `src/content/home.ts` and get their href from `exploreHref` in `src/lib/explore-link.ts`; it falls back to `#contact` until the route exists, so no card ever opens a missing page.
