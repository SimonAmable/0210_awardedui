import { SmokeShaderBackground } from "@/registry/components/smoke-shader-background"

export function SmokeShaderBackgroundDemo() {
  return <section className="relative h-96 overflow-hidden rounded-lg bg-black"><SmokeShaderBackground /><div className="relative z-10 flex h-full items-end p-8 text-white"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">WebGL background</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Smoke, shaped in real time.</h2></div></div></section>
}
