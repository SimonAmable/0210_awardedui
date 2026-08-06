# Registry Standards

## Repository contract

- `registry/manifest.ts` is the only handwritten registry catalog and documentation metadata source.
- `registry.json` at the repository root is generated from the manifest and must remain a valid shadcn source catalog.
- `public/r/<name>.json` contains generated installable item payloads with inlined file contents.
- `registry/generated/preview-loaders.ts` is generated from each item's demo path.
- `registry/generated/source-content.ts` is generated for the documentation code view.
- `content/registry-items.ts` is a compatibility re-export, not a second catalog.

## Item and file types

| Use | Item type | File type |
| --- | --- | --- |
| Single simple component | `registry:component` | `registry:component` |
| Multi-file visual or feature | `registry:block` | component files use `registry:component` |
| Shared helper or shader source | — | `registry:lib` |
| UI primitive | `registry:ui` | `registry:ui` |
| React hook | — | `registry:hook` |

Use `target: "@ui/<file>"` for consumer UI files and `target: "@lib/<file>"` for consumer utilities. The placeholders resolve through the installing project's `components.json` aliases.

## Dependency rules

1. Scan every import in the installable files.
2. Treat React, browser APIs, and the consumer's existing `@/lib/utils` convention as baseline requirements unless the item explicitly ships those files.
3. Add every imported npm package not already guaranteed by the baseline to `dependencies`.
4. Add `registryDependencies` only for actual registry items; do not use it as a generic local-file list.
5. Keep dependencies minimal and pin versions when reproducibility matters.

## Interactive-component gates

- Put browser-only work inside `useEffect` or another client-only boundary.
- Add `"use client"` at the entry point consumed from a Server Component when needed.
- Clean up event listeners, observers, animation frames, WebGL buffers, textures, and programs.
- Pause or reduce work when the document is hidden or the component is offscreen when feasible.
- Respect `prefers-reduced-motion` and expose an explicit `animate` prop when useful.
- Provide a non-WebGL fallback or an intentional static surface when context creation or shader compilation fails.
- Mark decorative canvases `aria-hidden="true"`; give meaningful interactive surfaces an accessible label and alternative interaction path where required.
- Avoid global CSS and fixed IDs.

## Required verification

Run `pnpm registry:build` before validation. Then run the custom validator, linter, and typecheck. Use the official shadcn validator and clean fixture install for changes affecting item types, targets, dependencies, or generated payloads.
