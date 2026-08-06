import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComponentDetail } from "@/components/site/component-detail"
import { DocsShell } from "@/components/site/docs-shell"
import { registrySourceBySlug } from "@/registry/generated/source-content"
import { registryItems } from "@/registry/manifest"

type PageProps = { params: Promise<{ slug: string }> }

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
  if (!item) notFound()
  const source = registrySourceBySlug[item.slug]
  if (!source) notFound()
  return <DocsShell active={`/components/${slug}`}><ComponentDetail item={item} source={source} /></DocsShell>
}
