export type RegistryItemType = "registry:ui" | "registry:component" | "registry:block"
export type RegistryFileType = "registry:ui" | "registry:component" | "registry:lib" | "registry:hook" | "registry:file"
export type RegistryCustomizer = "generic" | "marquee" | "shader-smoke" | "shader-caustics" | "scene" | "clouds"

export type RegistryItemFile = {
  path: string
  type: RegistryFileType
  target?: string
}

export type RegistryProp = {
  name: string
  type: string
  defaultValue: string
  description: string
}

export type RegistryReference = {
  href: string
  label: string
}

export type RegistryItemMetadata = {
  name: string
  slug: string
  type: RegistryItemType
  title: string
  description: string
  category: string
  status: "new" | "stable" | "experimental"
  engine: "css" | "motion" | "gsap" | "webgl"
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryItemFile[]
  primarySourcePath: string
  demoPath: string
  usage: string
  props: RegistryProp[]
  customizer: RegistryCustomizer
  tags: string[]
  touchSupport: "full" | "fallback" | "none"
  reducedMotion: boolean
  performance: "low" | "medium" | "high"
  installCommand: string
  implementationPrompt: string
  reference?: RegistryReference
}
