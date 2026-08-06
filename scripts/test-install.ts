import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { spawn, type ChildProcess } from "node:child_process"
import net from "node:net"
import path from "node:path"

import { registryItems } from "../registry/manifest"

const root = process.cwd()
const fixture = path.join(root, "fixtures/next-shadcn-app")
const fixtureLockfile = path.join(fixture, "pnpm-lock.yaml")
const port = 3200 + Math.floor(Math.random() * 500)
const registryUrls = registryItems.map((item) => `http://127.0.0.1:${port}/r/${item.name}.json`)

function run(command: string, args: string[], cwd = root) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" })
    child.on("error", reject)
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)))
  })
}

function startServer(): ChildProcess {
  return spawn(process.execPath, [path.join(root, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)], { cwd: root, stdio: "inherit", windowsHide: true })
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt++) {
    const connected = await new Promise<boolean>((resolve) => {
      const socket = net.connect(port, "127.0.0.1")
      socket.once("connect", () => { socket.end(); resolve(true) })
      socket.once("error", () => resolve(false))
    })
    if (connected) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error("Timed out waiting for local registry server.")
}

function resolveFixtureTarget(target: string) {
  if (target.startsWith("~/")) return target.slice(2)
  const separator = target.indexOf("/")
  const alias = separator === -1 ? target : target.slice(0, separator)
  const rest = separator === -1 ? "" : target.slice(separator + 1)
  const aliasMap: Record<string, string> = {
    "@ui": "components/ui",
    "@components": "components",
    "@lib": "lib",
    "@hooks": "hooks",
  }
  return aliasMap[alias] ? path.join(aliasMap[alias], rest ?? "") : target
}

function fixturePath(relativeTarget: string) {
  const resolved = path.resolve(fixture, relativeTarget)
  const fixtureRoot = `${path.resolve(fixture)}${path.sep}`
  if (!resolved.startsWith(fixtureRoot)) throw new Error(`Registry target escapes fixture: ${relativeTarget}`)
  return resolved
}

async function main() {
  await run("pnpm", ["registry:build"])
  await run("pnpm", ["build"])

  const targets = [...new Set(registryItems.flatMap((item) => item.files.map((file) => resolveFixtureTarget(file.target ?? file.path))))]
  const originalTargets = new Map<string, string | null>()
  await Promise.all(targets.map(async (target) => {
    try {
      originalTargets.set(target, await readFile(fixturePath(target), "utf8"))
    } catch {
      originalTargets.set(target, null)
    }
  }))
  await Promise.all(targets.map((target) => rm(fixturePath(target), { force: true })))
  await rm(fixtureLockfile, { force: true })
  let server: ChildProcess | null = null
  try {
    await run("pnpm", ["install", "--ignore-workspace"], fixture)
    server = startServer()
    await waitForServer()
    await run("pnpm", ["dlx", "shadcn@latest", "add", ...registryUrls, "--yes"], fixture)
    await Promise.all(targets.map((target) => access(fixturePath(target))))
    await run("pnpm", ["typecheck"], fixture)
    await run("pnpm", ["build"], fixture)
  } finally {
    server?.kill()
    await rm(fixtureLockfile, { force: true })
    await Promise.all([...originalTargets.entries()].map(async ([target, content]) => {
      const destination = fixturePath(target)
      if (content === null) return rm(destination, { force: true })
      await mkdir(path.dirname(destination), { recursive: true })
      await writeFile(destination, content)
    }))
  }
  console.log(`Clean fixture installed, type-checked, and built ${registryItems.length} registry components.`)
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
