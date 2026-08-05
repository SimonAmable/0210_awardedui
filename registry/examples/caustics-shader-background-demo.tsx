import { CausticsShaderBackground } from "@/registry/components/caustics-shader-background"

export function CausticsShaderBackgroundDemo({ preview = false }: { preview?: boolean }) {
  return (
    <section className={`relative w-full ${preview ? "h-64" : "h-96"} overflow-hidden rounded-lg bg-black`}>
      <CausticsShaderBackground />
      {!preview && (
        <div className="relative z-10 flex h-full items-end p-8 text-white">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">WebGL background</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Caustics, shaped in real time.</h2>
          </div>
        </div>
      )}
    </section>
  )
}
