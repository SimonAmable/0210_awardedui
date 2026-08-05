import { EditorialImageReveal } from "@/components/ui/editorial-image-reveal"
import { MarqueeStrip } from "@/components/ui/marquee-strip"
import { SmokeShaderBackground } from "@/components/ui/smoke-shader-background"

export default function Page() {
  return <main className="mx-auto max-w-3xl space-y-8 p-8"><MarqueeStrip><span>Installed from the registry</span><span>✳</span><span>Fixture ready</span></MarqueeStrip><EditorialImageReveal eyebrow="Installed component" title="The registry installation worked." year="2026" href="#installed" media={<div className="h-full w-full bg-zinc-200" />} /><section className="relative h-64 overflow-hidden rounded-lg bg-black"><SmokeShaderBackground /><p className="relative z-10 p-6 text-white">Shader installed from the registry.</p></section></main>
}
