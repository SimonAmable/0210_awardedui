import { registryItems } from "@/content/registry-items"

export function getRegistryItem(slug: string) {
  return registryItems.find((item) => item.slug === slug)
}

export function getRegistrySourcePath(slug: string) {
  return `registry/components/${slug}.tsx`
}
