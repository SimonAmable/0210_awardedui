import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { registryItems } from "../content/registry-items"

type Definition = { items: Array<{ name: string; dependencies?: string[]; registryDependencies?: string[]; files: Array<{ path: string; target: string }> }> }

async function main() {
  const root = process.cwd()
  const definition = JSON.parse(await readFile(path.join(root, "registry/registry.json"), "utf8")) as Definition
  const names = definition.items.map((item) => item.name)
  const slugs = registryItems.map((item) => item.slug)
  if (new Set(names).size !== names.length || new Set(slugs).size !== slugs.length) throw new Error("Registry names and metadata slugs must be unique.")
  if (names.length !== registryItems.length) throw new Error("Registry definition and metadata entry counts differ.")
  for (const item of definition.items) {
    const metadata = registryItems.find((entry) => entry.slug === item.name)
    if (!metadata) throw new Error(`Missing metadata for ${item.name}.`)
    if (JSON.stringify(item.dependencies ?? []) !== JSON.stringify(metadata.dependencies)) throw new Error(`Dependency mismatch for ${item.name}.`)
    if (JSON.stringify(item.registryDependencies ?? []) !== JSON.stringify(metadata.registryDependencies)) throw new Error(`Registry dependency mismatch for ${item.name}.`)
    for (const file of item.files) await access(path.join(root, file.path))
    await access(path.join(root, "registry/examples", `${item.name}-demo.tsx`))
    await access(path.join(root, "public/r", `${item.name}.json`))
  }
  console.log(`Validated ${names.length} registry item(s), canonical sources, demos, metadata, and output.`)
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
