import { MarqueeStrip } from "@/components/ui/marquee-strip"
import { SmokeShaderBackground } from "@/components/ui/smoke-shader-background"

export default function Page() {
  return <main className="mx-auto max-w-3xl space-y-8 p-8"><MarqueeStrip><span>Installed from the registry</span><span>✳</span><span>Fixture ready</span></MarqueeStrip><section className="relative h-64 overflow-hidden rounded-lg bg-black"><SmokeShaderBackground /><p className="relative z-10 p-6 text-white">Shader installed from the registry.</p></section></main>
}
