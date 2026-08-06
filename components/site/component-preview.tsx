"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { registryPreviewLoaders } from "@/registry/generated/preview-loaders"

type DemoComponent = ComponentType<{ preview?: boolean }>

function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true)
        observer.disconnect()
      }
    }, { root: null, rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}

export function ComponentPreview({ slug }: { slug: string }) {
  const { ref, inView } = useInView()
  const [Loaded, setLoaded] = useState<DemoComponent | null>(null)

  useEffect(() => {
    if (!inView) return
    const loader = registryPreviewLoaders[slug]
    if (!loader) return
    let mounted = true
    loader().then((module) => {
      if (mounted) setLoaded(() => module.Component)
    }).catch(() => {})
    return () => { mounted = false }
  }, [inView, slug])

  return (
    <div ref={ref} className="relative w-full">
      {!Loaded ? (
        <div className="w-full overflow-hidden rounded-lg"><Skeleton className="h-[16rem] w-full" /></div>
      ) : (
        <div className="flex h-[16rem] w-full items-center justify-center overflow-hidden rounded-lg">
          <Loaded preview />
        </div>
      )}
    </div>
  )
}
