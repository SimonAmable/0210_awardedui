import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { loadEnvConfig } from "@next/env"

import type { RegistryItemMetadata } from "../lib/registry-types"

loadEnvConfig(process.cwd())

const registrySchema = "https://ui.shadcn.com/schema/registry.json"
const registryItemSchema = "https://ui.shadcn.com/schema/registry-item.json"

function registryDefinition(item: RegistryItemMetadata) {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
  }
}

async function main() {
  const [{ registryItems }, { siteConfig }] = await Promise.all([
    import("../registry/manifest"),
    import("../lib/site"),
  ])
  const root = process.cwd()
  const output = path.join(root, "public/r")
  const catalog = {
    $schema: registrySchema,
    name: "awwward-winning-ui",
    homepage: siteConfig.url,
    items: registryItems.map(registryDefinition),
  }

  await writeFile(path.join(root, "registry.json"), `${JSON.stringify(catalog, null, 2)}\n`)
  await rm(output, { recursive: true, force: true })
  await mkdir(output, { recursive: true })
  await mkdir(path.join(root, "registry/generated"), { recursive: true })

  const sourceEntries: string[] = []
  for (const item of registryItems) {
    const files = await Promise.all(item.files.map(async (file) => ({
      ...file,
      content: await readFile(path.join(root, file.path), "utf8"),
    })))
    const primary = files.find((file) => file.path === item.primarySourcePath)
    if (!primary) throw new Error(`Primary source ${item.primarySourcePath} is not declared by ${item.name}.`)
    sourceEntries.push(`  ${JSON.stringify(item.slug)}: ${JSON.stringify(primary.content)},`)
    await writeFile(path.join(output, `${item.name}.json`), `${JSON.stringify({ $schema: registryItemSchema, ...registryDefinition(item), files }, null, 2)}\n`)
  }

  await writeFile(path.join(output, "registry.json"), `${JSON.stringify(catalog, null, 2)}\n`)

  const loaders = registryItems.map((item) => {
    const demoPath = item.demoPath.replace(/^registry\//, "@/registry/").replace(/\.tsx$/, "")
    const demoName = `${item.name.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join("")}Demo`
    return `  ${JSON.stringify(item.slug)}: () => import(${JSON.stringify(demoPath)}).then((module) => ({ Component: module.${demoName} })),`
  }).join("\n")
  const loaderSource = `import type { ComponentType } from "react"\n\nexport type RegistryPreviewModule = { Component: ComponentType<{ preview?: boolean }> }\n\nexport const registryPreviewLoaders: Record<string, () => Promise<RegistryPreviewModule>> = {\n${loaders}\n}\n`
  await writeFile(path.join(root, "registry/generated/preview-loaders.ts"), loaderSource)
  await writeFile(path.join(root, "registry/generated/source-content.ts"), `export const registrySourceBySlug: Record<string, string> = {\n${sourceEntries.join("\n")}\n}\n`)

  console.log(`Built ${registryItems.length} registry item(s) in public/r.`)
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
