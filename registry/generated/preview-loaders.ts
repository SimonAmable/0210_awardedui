import type { ComponentType } from "react"

export type RegistryPreviewModule = { Component: ComponentType<{ preview?: boolean }> }

export const registryPreviewLoaders: Record<string, () => Promise<RegistryPreviewModule>> = {
  "marquee-strip": () => import("@/registry/examples/marquee-strip-demo").then((module) => ({ Component: module.MarqueeStripDemo })),
  "smoke-shader-background": () => import("@/registry/examples/smoke-shader-background-demo").then((module) => ({ Component: module.SmokeShaderBackgroundDemo })),
  "caustics-shader-background": () => import("@/registry/examples/caustics-shader-background-demo").then((module) => ({ Component: module.CausticsShaderBackgroundDemo })),
  "imposter-syndrome-shader": () => import("@/registry/examples/imposter-syndrome-shader-demo").then((module) => ({ Component: module.ImposterSyndromeShaderDemo })),
  "clouds-shader-background": () => import("@/registry/examples/clouds-shader-background-demo").then((module) => ({ Component: module.CloudsShaderBackgroundDemo })),
}
