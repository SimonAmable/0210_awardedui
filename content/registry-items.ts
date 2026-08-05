import { registryUrl } from "@/lib/site"
import type { RegistryItemMetadata } from "@/lib/registry-types"

function implementationPrompt(title: string, command: string, placement: string) {
  return `Install and integrate the ${title} component from the AwwwardWinning UI shadcn registry.

Use the provided registry command and preserve the component inside the project's configured component directory.

Integration requirements:
- Replace the demo content with content already present in the application.
- Preserve the application's typography, colors, spacing, and border-radius tokens.
- Place the component inside ${placement}.
- Preserve semantic HTML and keyboard accessibility.
- Do not introduce global styles, fixed IDs, or unnecessary dependencies.
- Do not rebuild unrelated sections of the page.
- Keep the component responsive and respect reduced-motion preferences.
- Confirm the registry component installed successfully before integration.

Registry command:
${command}`
}

const marqueeCommand = `pnpm dlx shadcn@latest add ${registryUrl("marquee-strip")}`
const editorialCommand = `pnpm dlx shadcn@latest add ${registryUrl("editorial-image-reveal")}`
const smokeShaderCommand = `pnpm dlx shadcn@latest add ${registryUrl("smoke-shader-background")}`
const causticsShaderCommand = `pnpm dlx shadcn@latest add ${registryUrl("caustics-shader-background")}`

export const registryItems: RegistryItemMetadata[] = [
  {
    name: "marquee-strip",
    slug: "marquee-strip",
    title: "Marquee Strip",
    description: "A responsive, pauseable content ribbon for statements, logos, and editorial details.",
    category: "Typography",
    status: "new",
    engine: "css",
    dependencies: [],
    registryDependencies: [],
    tags: ["marquee", "ticker", "logo-strip"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "low",
    installCommand: marqueeCommand,
    implementationPrompt: implementationPrompt("Marquee Strip", marqueeCommand, "an existing hero, client list, announcement, or section divider"),
  },
  {
    name: "editorial-image-reveal",
    slug: "editorial-image-reveal",
    title: "Editorial Image Reveal",
    description: "An editorial project card with a clean CSS mask reveal and fully custom media content.",
    category: "Media",
    status: "new",
    engine: "css",
    dependencies: [],
    registryDependencies: [],
    tags: ["image", "reveal", "portfolio"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "low",
    installCommand: editorialCommand,
    implementationPrompt: implementationPrompt("Editorial Image Reveal", editorialCommand, "an existing featured-work, case-study, or portfolio section"),
  },
  {
    name: "smoke-shader-background",
    slug: "smoke-shader-background",
    title: "Smoke Shader Background",
    description: "A self-contained WebGL smoke background with cursor effects and an expansive prop surface.",
    category: "Backgrounds",
    status: "new",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    tags: ["smoke", "webgl", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    installCommand: smokeShaderCommand,
    implementationPrompt: implementationPrompt("Smoke Shader Background", smokeShaderCommand, "a relative, overflow-hidden hero or feature section, with content layered above the canvas"),
  },
  {
    name: "caustics-shader-background",
    slug: "caustics-shader-background",
    title: "Caustics Shader Background",
    description: "A self-contained WebGL caustics background with cursor effects and an expansive prop surface.",
    category: "Backgrounds",
    status: "new",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    tags: ["caustics", "webgl", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    installCommand: causticsShaderCommand,
    implementationPrompt: implementationPrompt("Caustics Shader Background", causticsShaderCommand, "a relative, overflow-hidden hero or feature section, with content layered above the canvas"),
  },
]
