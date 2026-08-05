import { rm, access } from "node:fs/promises"
import { spawn, type ChildProcess } from "node:child_process"
import net from "node:net"
import path from "node:path"

const root = process.cwd()
const fixture = path.join(root, "fixtures/next-shadcn-app")
const port = 3200 + Math.floor(Math.random() * 500)
const registrySlugs = ["marquee-strip", "smoke-shader-background", "caustics-shader-background", "imposter-syndrome-shader"]
const registryUrls = registrySlugs.map((slug) => `http://127.0.0.1:${port}/r/${slug}.json`)

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
    const connected = await new Promise<boolean>((resolve) => { const socket = net.connect(port, "127.0.0.1"); socket.once("connect", () => { socket.end(); resolve(true) }); socket.once("error", () => resolve(false)) })
    if (connected) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error("Timed out waiting for local registry server.")
}

async function main() {
  await run("pnpm", ["registry:build"])
  await run("pnpm", ["build"])
  await Promise.all(registrySlugs.map((slug) => rm(path.join(fixture, "components/ui", `${slug}.tsx`), { force: true })))
  await run("pnpm", ["install"], fixture)
  const server = startServer()
  try {
    await waitForServer()
    await run("pnpm", ["dlx", "shadcn@latest", "add", ...registryUrls, "--yes"], fixture)
    await Promise.all(registrySlugs.map((slug) => access(path.join(fixture, "components/ui", `${slug}.tsx`))))
    await run("pnpm", ["typecheck"], fixture)
    await run("pnpm", ["build"], fixture)
  } finally {
    server.kill()
  }
  console.log("Clean fixture installed, type-checked, and built all registry components.")
}

main().catch((error: unknown) => { console.error(error); process.exit(1) })
