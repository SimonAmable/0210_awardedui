import { registryItems } from "@/registry/manifest"

export function getRegistryItem(slug: string) {
  return registryItems.find((item) => item.slug === slug)
}

export function getRegistrySourcePath(slug: string) {
  return getRegistryItem(slug)?.primarySourcePath
}

export function getRegistryTargets(slug: string) {
  return getRegistryItem(slug)?.files.map((file) => file.target ?? file.path) ?? []
}
