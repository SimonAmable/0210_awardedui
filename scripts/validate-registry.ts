import { access, readFile } from "node:fs/promises"
import path from "node:path"

import { registryItems } from "../registry/manifest"
import type { RegistryItemMetadata } from "../lib/registry-types"

const root = process.cwd()

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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

async function main() {
  const catalog = JSON.parse(await readFile(path.join(root, "registry.json"), "utf8")) as { name?: unknown; homepage?: unknown; items?: unknown[] }
  assert(typeof catalog.name === "string", "Root registry catalog must have a string name.")
  assert(typeof catalog.homepage === "string", "Root registry catalog must have a homepage.")
  assert(Array.isArray(catalog.items), "Root registry catalog must have an items array.")
  assert(catalog.items.length === registryItems.length, "Generated catalog and manifest counts differ.")

  const names = registryItems.map((item) => item.name)
  assert(new Set(names).size === names.length, "Registry item names must be unique.")
  assert(names.every((name) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)), "Registry item names must be lowercase kebab-case.")

  const targetSources = new Map<string, string>()
  for (const item of registryItems) {
    const expected = JSON.stringify(registryDefinition(item))
    assert(JSON.stringify(catalog.items.find((entry) => (entry as { name?: string }).name === item.name)) === expected, `Generated catalog mismatch for ${item.name}.`)
    assert(item.files.length > 0, `${item.name} must declare at least one file.`)
    assert(item.primarySourcePath.startsWith("registry/"), `${item.name} primary source must be inside registry/.`)
    await access(path.join(root, item.demoPath))
    await access(path.join(root, item.primarySourcePath))

    const targetNames = new Set<string>()
    for (const file of item.files) {
      await access(path.join(root, file.path))
      const target = file.target ?? file.path
      assert(!targetNames.has(target), `${item.name} declares duplicate target ${target}.`)
      targetNames.add(target)
      const existingSource = targetSources.get(target)
      if (existingSource && existingSource !== file.path) {
        const [first, second] = await Promise.all([
          readFile(path.join(root, existingSource), "utf8"),
          readFile(path.join(root, file.path), "utf8"),
        ])
        assert(first === second, `Target ${target} is declared by different file contents.`)
      } else {
        targetSources.set(target, file.path)
      }
    }

    const built = JSON.parse(await readFile(path.join(root, "public/r", `${item.name}.json`), "utf8")) as { files?: Array<{ path: string; content?: string }> }
    assert(Array.isArray(built.files), `Built item ${item.name} is missing files.`)
    for (const file of built.files) {
      const content = await readFile(path.join(root, file.path), "utf8")
      assert(file.content === content, `Built content drift detected for ${item.name}:${file.path}.`)
    }
  }

  await access(path.join(root, "public/r/registry.json"))
  await access(path.join(root, "registry/generated/preview-loaders.ts"))
  console.log(`Validated ${registryItems.length} registry item(s), manifests, source files, generated output, demos, and targets.`)
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
