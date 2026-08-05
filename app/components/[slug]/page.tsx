import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComponentDetail } from "@/components/site/component-detail"
import { DocsShell } from "@/components/site/docs-shell"
import { registryItems } from "@/content/registry-items"

type PageProps = { params: Promise<{ slug: string }> }

const usageBySlug = {
  "marquee-strip": `import { MarqueeStrip } from "@/components/ui/marquee-strip"

<MarqueeStrip duration={28} direction="left" repeat={2}>
  <span>Design direction</span>
  <span>✳</span>
  <span>Built to ship</span>
</MarqueeStrip>`,
  "editorial-image-reveal": `import { EditorialImageReveal } from "@/components/ui/editorial-image-reveal"

<EditorialImageReveal
  eyebrow="Architecture"
  title="A quiet study in material and light."
  year="2026"
  href="/projects/architecture"
  media={<img src="/project-image.jpg" alt="" />}
/>`,
  "smoke-shader-background": `import { SmokeShaderBackground } from "@/components/ui/smoke-shader-background"

<section className="relative h-96 overflow-hidden bg-black">
  <SmokeShaderBackground
    preset="smoke"
    speed={33}
    grain={74}
  />
  <div className="relative z-10 p-8 text-white">Your content</div>
</section>`,
  "caustics-shader-background": `import { CausticsShaderBackground } from "@/components/ui/caustics-shader-background"

<section className="relative h-96 overflow-hidden bg-black">
  <CausticsShaderBackground
    preset="caustics"
    speed={33}
    grain={74}
  />
  <div className="relative z-10 p-8 text-white">Your content</div>
</section>`,
} as const

export function generateStaticParams() {
  return registryItems.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = registryItems.find((entry) => entry.slug === slug)
  return item ? { title: item.title, description: item.description } : {}
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params
  const item = registryItems.find((entry) => entry.slug === slug)
  if (!item || !(slug in usageBySlug)) notFound()
  const source = await readFile(path.join(process.cwd(), "registry", "components", `${slug}.tsx`), "utf8")
  return <DocsShell active={`/components/${slug}`}><ComponentDetail item={item} source={source} usage={usageBySlug[slug as keyof typeof usageBySlug]} /></DocsShell>
}
