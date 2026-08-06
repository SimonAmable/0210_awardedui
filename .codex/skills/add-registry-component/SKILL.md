---
name: add-registry-component
description: Add, port, or register a new component in this shadcn-compatible registry. Use when a user provides a component reference, source file, design, animation, shader, hook, or visual and wants it added to the registry with clean metadata, demos, generated install payloads, documentation, and verification.
---

# Add Registry Component

Use this skill for every new registry item in this repository. Treat `registry/manifest.ts` as the authoring source of truth. Do not hand-edit generated `registry.json`, `public/r/`, or `registry/generated/preview-loaders.ts` files.

## Workflow

### 1. Inspect before editing

- Read `AGENTS.md`, `package.json`, `components.json`, `registry/manifest.ts`, and one existing item closest to the requested component.
- Inspect the supplied source/reference and identify its public component name, props, browser APIs, external imports, animation behavior, accessibility model, and required files.
- Preserve unrelated user changes in the worktree.

### 2. Choose the registry shape

Use `registry:component` for a simple installable component and `registry:block` for a multi-file visual, feature, or shader. Use `registry:ui` only for a primitive that is intentionally part of the UI layer.

For each file, choose the semantic file type:

- Component implementation: `registry:component`
- Shared utility or shader source: `registry:lib`
- Hook: `registry:hook`
- UI primitive: `registry:ui`

Use `@ui/`, `@components/`, `@lib/`, and `@hooks/` targets. Never hardcode `components/ui`, `src/components`, or a consumer-specific alias.

Read [registry-standards.md](references/registry-standards.md) when deciding item types, targets, dependencies, or interactive-component quality gates.

### 3. Add the canonical source and demo

- Keep installable source under `registry/components/`.
- Keep one preview/demo wrapper under `registry/examples/` named `<slug>-demo.tsx`.
- Keep demos small, deterministic, responsive, and representative of the public API.
- Give every demo an optional `preview?: boolean` prop so the catalog preview can constrain its size.
- Use `"use client"` only when the component needs state, effects, event handlers, or browser APIs.
- Keep registry source independent from `components/site`, `app`, `content`, environment secrets, and site-only assets.
- Use `cn()` and accept `className` where styling is part of the component API.

For WebGL or animation components, also require shader compile/link checks, cleanup for every listener/resource/frame, reduced-motion behavior, visibility throttling where appropriate, and a graceful fallback when the browser lacks the required capability.

### 4. Add one manifest entry

Add one item to `registry/manifest.ts` containing:

- Name, title, description, category, status, engine, and tags
- Correct registry item type
- Every source file, semantic file type, and alias-based target
- Real npm dependencies and registry dependencies only
- Primary source path and demo path
- Usage example, prop rows, customizer mode, touch support, reduced-motion support, and performance level
- A reference URL when the component is derived from an external source

For a normal component, use `customizer: "generic"`; the existing generic preview will render the demo without adding another hardcoded slug map. Add a new customizer mode only when the item genuinely needs interactive controls beyond the generic preview.

### 5. Generate and verify

Run these from the repository root:

```bash
pnpm registry:build
pnpm registry:validate
pnpm lint
pnpm typecheck
```

For a complete registry change, also run:

```bash
pnpm registry:validate:official
pnpm registry:test-install
```

The official validator may download the current shadcn CLI. The install test must verify every declared target, not just the primary `.tsx` file.

### 6. Report the result

Summarize the new item, source/demo/manifest files, dependencies, generated outputs, and verification results. If validation fails, fix the source or manifest rather than weakening the validator.

## Guardrails

- Do not update multiple handwritten metadata maps to make it work. Add the manifest entry and regenerate.
- Do not add dependencies merely because they exist in the host app; declare only imports required by the installed item.
- Do not introduce global CSS, fixed IDs, unbounded animation loops, or undocumented browser-only assumptions.
- Do not claim touch support, reduced-motion support, or low performance unless the implementation actually satisfies the claim.
- Do not remove or overwrite unrelated uncommitted work.
