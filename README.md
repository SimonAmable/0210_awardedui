# AwwwardWinning UI

A curated shadcn registry for production-ready creative React components. It is an independent project and is not affiliated with Awwwards.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Base UI primitives, shadcn-compatible registry JSON, pnpm, and Lucide icons.

## Local development

```bash
pnpm install
pnpm registry:build
pnpm dev
```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin and `NEXT_PUBLIC_GITHUB_URL` to the repository URL. These values power the registry homepage, install commands, and site GitHub link.

## Install a component

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/marquee-strip.json
```

The registry catalog is available at `http://localhost:3000/r/registry.json`. Use it with `list` or `search`:

```bash
pnpm dlx shadcn@latest list http://localhost:3000/r/registry.json
pnpm dlx shadcn@latest search http://localhost:3000/r/registry.json --query shader
```

## Registry authoring

Each component is defined once in `registry/manifest.ts`. The manifest owns the install metadata, files, targets, documentation usage, props, preview, and customizer behavior. `pnpm registry:build` generates the root `registry.json`, installable files under `public/r/`, and preview loaders.

Component source lives under `registry/components/` and demos live under `registry/examples/`. Registry targets use shadcn aliases such as `@ui/` and `@lib/` so consumers' `components.json` configuration is respected.

## Verification

```bash
pnpm registry:build
pnpm registry:validate
pnpm registry:validate:official
pnpm lint
pnpm typecheck
pnpm build
pnpm registry:test-install
pnpm verify
```

`registry:test-install` rebuilds the registry and site, starts a local production server, installs every manifest item into the isolated fixture, verifies every declared target, type-checks the fixture, and builds it.

`registry:validate:official` runs the current shadcn CLI validator and may download the CLI the first time.

## Structure

```text
app/                 Documentation routes and site shell
components/site/     Reusable documentation UI
lib/                 Shared types and utilities
registry/manifest.ts Single source of truth for registry items
registry/components/ Canonical component sources
registry/examples/   Canonical previews and demos
registry/generated/  Generated preview loaders
public/r/            Generated installable registry JSON
scripts/              Build, validation, and clean-install checks
fixtures/             Isolated Next + shadcn installation fixture
```

## Adding a component

Use the project skill `$add-registry-component`. It creates or updates the canonical source, demo, manifest entry, and generated outputs, then runs the registry quality gates.
