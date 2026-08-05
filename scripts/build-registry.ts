import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

type RegistryDefinition = {
  items: Array<{
    name: string
    type: string
    title: string
    description: string
    dependencies?: string[]
    registryDependencies?: string[]
    files: Array<{ path: string; type: string; target: string }>
  }>
}

async function main() {
  const root = process.cwd()
  const definition = JSON.parse(await readFile(path.join(root, "registry/registry.json"), "utf8")) as RegistryDefinition
  const output = path.join(root, "public/r")
  await rm(output, { recursive: true, force: true })
  await mkdir(output, { recursive: true })

  for (const item of definition.items) {
    const files = await Promise.all(item.files.map(async (file) => ({ ...file, content: await readFile(path.join(root, file.path), "utf8") })))
    await writeFile(path.join(output, `${item.name}.json`), `${JSON.stringify({ ...item, files }, null, 2)}\n`)
  }
  await writeFile(path.join(output, "registry.json"), `${JSON.stringify({ name: definition.items.map((item) => item.name) }, null, 2)}\n`)
  console.log(`Built ${definition.items.length} registry item(s) in public/r.`)
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
