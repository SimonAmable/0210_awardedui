export type RegistryItemMetadata = {
  name: string
  slug: string
  title: string
  description: string
  category: string
  status: "new" | "stable" | "experimental"
  engine: "css" | "motion" | "gsap" | "webgl"
  dependencies: string[]
  registryDependencies: string[]
  tags: string[]
  touchSupport: "full" | "fallback" | "none"
  reducedMotion: boolean
  performance: "low" | "medium" | "high"
  installCommand: string
  implementationPrompt: string
}
