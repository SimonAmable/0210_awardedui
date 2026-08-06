import { registryUrl } from "@/lib/site"
import type { RegistryItemFile, RegistryItemMetadata, RegistryItemType, RegistryCustomizer, RegistryProp } from "@/lib/registry-types"

const implementationPrompt = (title: string, command: string, placement: string) => `Install and integrate the ${title} component from the AwwwardWinning UI shadcn registry.

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

type ItemInput = Omit<RegistryItemMetadata, "slug" | "installCommand" | "implementationPrompt">

function item(input: ItemInput & { placement: string }): RegistryItemMetadata {
  const { placement, ...metadata } = input
  const command = `pnpm dlx shadcn@latest add ${registryUrl(input.name)}`
  return {
    ...metadata,
    slug: input.name,
    installCommand: command,
    implementationPrompt: implementationPrompt(input.title, command, placement),
  }
}

const marqueeProps: RegistryProp[] = [
  { name: "children", type: "ReactNode", defaultValue: "Required", description: "Content repeated in the strip." },
  { name: "duration", type: "number", defaultValue: "28", description: "Loop duration in seconds." },
  { name: "direction", type: '"left" | "right"', defaultValue: '"left"', description: "Scroll direction." },
  { name: "repeat", type: "number", defaultValue: "2", description: "Number of content copies." },
  { name: "className", type: "string", defaultValue: "—", description: "Optional wrapper classes." },
]

const shaderProps: RegistryProp[] = [
  { name: "colors", type: "string[]", defaultValue: "preset palette", description: "One to eight custom colours; overrides the selected preset." },
  { name: "preset", type: '"smoke" | "caustics" | "ember" | "aurora"', defaultValue: '"smoke"', description: "Built-in palette used when colors is omitted." },
  { name: "intensity / contrast", type: "number", defaultValue: "100 / 25", description: "Output strength and tonal separation." },
  { name: "speed / drift", type: "number", defaultValue: "33 / 0", description: "Animation rate and directional travel." },
  { name: "zoom / warp", type: "number", defaultValue: "50 / 50", description: "Field scale and distortion." },
  { name: "grain / seed", type: "number", defaultValue: "74 / 0", description: "Noise texture and deterministic variation." },
  { name: "rotation / offset", type: "number / object", defaultValue: "0 / { 0, 0 }", description: "Field orientation and position." },
  { name: "animate / reverse", type: "boolean", defaultValue: "true / false", description: "Playback controls." },
  { name: "smoothBlend", type: "boolean", defaultValue: "false", description: "Ease palette transitions." },
  { name: "cursor*", type: "boolean / options", defaultValue: "off", description: "Optional pointer velocity, repel, swirl, or ripple effect." },
  { name: "className", type: "string", defaultValue: "—", description: "Optional canvas classes." },
]

const simpleClassNameProps: RegistryProp[] = [
  { name: "className", type: "string", defaultValue: "—", description: "Optional wrapper classes." },
]

const shaderFiles = (component: string, helper = "shader-utils.ts"): RegistryItemFile[] => [
  { path: `registry/components/${helper}`, type: "registry:lib", target: `@ui/${helper}` },
  { path: `registry/components/${component}.tsx`, type: "registry:component", target: `@ui/${component}.tsx` },
]

export const registryItems = [
  item({
    name: "marquee-strip",
    type: "registry:component",
    title: "Marquee Strip",
    description: "A responsive, pauseable content ribbon for statements, logos, and editorial details.",
    category: "Typography",
    status: "new",
    engine: "css",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "registry/components/marquee-strip.tsx", type: "registry:component", target: "@ui/marquee-strip.tsx" }],
    primarySourcePath: "registry/components/marquee-strip.tsx",
    demoPath: "registry/examples/marquee-strip-demo.tsx",
    usage: `import { MarqueeStrip } from "@/components/ui/marquee-strip"

<MarqueeStrip duration={28} direction="left" repeat={2}>
  <span>Design direction</span>
  <span aria-hidden="true">✳</span>
  <span>Built to ship</span>
</MarqueeStrip>`,
    props: marqueeProps,
    customizer: "marquee",
    tags: ["marquee", "ticker", "logo-strip"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "low",
    placement: "an existing hero, client list, announcement, or section divider",
  }),
  item({
    name: "smoke-shader-background",
    type: "registry:block",
    title: "Smoke Shader Background",
    description: "A self-contained WebGL smoke background with cursor effects and an expansive prop surface.",
    category: "Backgrounds",
    status: "new",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    files: shaderFiles("smoke-shader-background"),
    primarySourcePath: "registry/components/smoke-shader-background.tsx",
    demoPath: "registry/examples/smoke-shader-background-demo.tsx",
    usage: `import { SmokeShaderBackground } from "@/components/ui/smoke-shader-background"

<section className="relative h-96 overflow-hidden bg-black">
  <SmokeShaderBackground preset="smoke" speed={33} grain={74} />
  <div className="relative z-10 p-8 text-white">Your content</div>
</section>`,
    props: shaderProps,
    customizer: "shader-smoke",
    tags: ["smoke", "webgl", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    placement: "a relative, overflow-hidden hero or feature section, with content layered above the canvas",
  }),
  item({
    name: "caustics-shader-background",
    type: "registry:block",
    title: "Caustics Shader Background",
    description: "A self-contained WebGL caustics background with cursor effects and an expansive prop surface.",
    category: "Backgrounds",
    status: "new",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    files: shaderFiles("caustics-shader-background"),
    primarySourcePath: "registry/components/caustics-shader-background.tsx",
    demoPath: "registry/examples/caustics-shader-background-demo.tsx",
    usage: `import { CausticsShaderBackground } from "@/components/ui/caustics-shader-background"

<section className="relative h-96 overflow-hidden bg-black">
  <CausticsShaderBackground preset="caustics" speed={33} grain={74} />
  <div className="relative z-10 p-8 text-white">Your content</div>
</section>`,
    props: shaderProps.map((prop) => prop.name === "preset" ? { ...prop, defaultValue: '"caustics"' } : prop),
    customizer: "shader-caustics",
    tags: ["caustics", "webgl", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    placement: "a relative, overflow-hidden hero or feature section, with content layered above the canvas",
  }),
  item({
    name: "imposter-syndrome-shader",
    type: "registry:block",
    title: "Imposter Syndrome Shader",
    description: "An atmospheric interactive sky shader with clouds, sun, moon, rain, aurora, and weather effects.",
    category: "Backgrounds",
    status: "experimental",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    files: [
      { path: "registry/components/imposter-syndrome-shader-source.ts", type: "registry:lib", target: "@ui/imposter-syndrome-shader-source.ts" },
      { path: "registry/components/imposter-syndrome-shader.tsx", type: "registry:component", target: "@ui/imposter-syndrome-shader.tsx" },
    ],
    primarySourcePath: "registry/components/imposter-syndrome-shader.tsx",
    demoPath: "registry/examples/imposter-syndrome-shader-demo.tsx",
    usage: `import { ImposterSyndromeShader } from "@/components/ui/imposter-syndrome-shader"

<ImposterSyndromeShader />`,
    props: simpleClassNameProps,
    customizer: "scene",
    tags: ["sky", "clouds", "weather", "shadertoy", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    placement: "a relative, overflow-hidden hero or atmospheric feature section",
    reference: { href: "https://www.shadertoy.com/view/cdlyWr", label: "“Imposter Syndrome” by stilltravelling on Shadertoy" },
  }),
  item({
    name: "clouds-shader-background",
    type: "registry:block",
    title: "Clouds Shader Background",
    description: "A self-contained WebGL cloudscape built from the supplied Shadertoy-style noise shader.",
    category: "Backgrounds",
    status: "new",
    engine: "webgl",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "registry/components/clouds-shader-background-source.ts", type: "registry:lib", target: "@ui/clouds-shader-background-source.ts" }, { path: "registry/components/clouds-shader-background.tsx", type: "registry:component", target: "@ui/clouds-shader-background.tsx" }],
    primarySourcePath: "registry/components/clouds-shader-background.tsx",
    demoPath: "registry/examples/clouds-shader-background-demo.tsx",
    usage: `import { CloudsShaderBackground } from "@/components/ui/clouds-shader-background"

<section className="relative h-96 overflow-hidden">
  <CloudsShaderBackground />
  <div className="relative z-10 p-8 text-white">Your content</div>
</section>`,
    props: [
      { name: "animate", type: "boolean", defaultValue: "true", description: "Animate the cloud movement; reduced-motion preferences are respected." },
      ...simpleClassNameProps,
    ],
    customizer: "clouds",
    tags: ["clouds", "sky", "webgl", "shader", "background"],
    touchSupport: "full",
    reducedMotion: true,
    performance: "high",
    placement: "a relative, overflow-hidden hero or atmospheric feature section",
  }),
] satisfies RegistryItemMetadata[]
