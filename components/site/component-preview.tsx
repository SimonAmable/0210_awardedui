"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type Slug = "marquee-strip" | "smoke-shader-background" | "caustics-shader-background" | "imposter-syndrome-shader"

function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { setInView(true); obs.disconnect(); return }
    }, { root: null, rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])

  return { ref, inView }
}

const loaders: Record<Slug, () => Promise<any>> = {
  // load the demo wrappers (they provide sensible demo props/children)
  "marquee-strip": () => import("@/registry/examples/marquee-strip-demo").then((m) => ({ Component: m.MarqueeStripDemo })),
  "smoke-shader-background": () => import("@/registry/examples/smoke-shader-background-demo").then((m) => ({ Component: m.SmokeShaderBackgroundDemo })),
  "caustics-shader-background": () => import("@/registry/examples/caustics-shader-background-demo").then((m) => ({ Component: m.CausticsShaderBackgroundDemo })),
  "imposter-syndrome-shader": () => import("@/registry/examples/imposter-syndrome-shader-demo").then((m) => ({ Component: m.ImposterSyndromeShaderDemo })),
}

export function ComponentPreview({ slug }: { slug: string }) {
  const s = slug as Slug
  const { ref, inView } = useInView()
  const [Loaded, setLoaded] = useState<any>(null)

  useEffect(() => {
    if (!inView) return
    let mounted = true
    // dynamic import the real component only when visible
    loaders[s]().then((mod) => { if (!mounted) return; setLoaded(() => mod.Component) }).catch(() => {})
    return () => { mounted = false }
  }, [inView, s])

  // skeleton placeholder used while loading or when preview is missing
  const placeholder = <Skeleton className="h-[16rem] w-full" />

  return (
    <div ref={ref as any} className="relative w-full">
      {!Loaded ? (
        <div className="w-full overflow-hidden rounded-lg">{placeholder}</div>
      ) : (
        // Keep every card preview in the same frame while preserving each demo's natural content height.
        <div className="flex h-[16rem] w-full items-center justify-center overflow-hidden rounded-lg">
          <Loaded preview />
        </div>
      )}
    </div>
  )
}
