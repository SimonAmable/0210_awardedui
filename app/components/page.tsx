import type { Metadata } from "next"

import { ComponentCard } from "@/components/site/component-card"
import { DocsShell } from "@/components/site/docs-shell"
import { registryItems } from "@/content/registry-items"

export const metadata: Metadata = { title: "Components", description: "Browse the AwwwardWinning UI component registry." }

export default function ComponentsPage() {
  return <DocsShell active="components"><main className="min-w-0 px-5 py-10 sm:px-10 sm:py-12"><p className="text-sm text-muted-foreground">Registry</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Components</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">A small, intentional collection of creative details with installable source code.</p><p className="mt-8 text-sm text-muted-foreground">{registryItems.length} {registryItems.length === 1 ? "component" : "components"} available</p><div className="mt-4 grid max-w-4xl gap-4 sm:grid-cols-2">{registryItems.map((item) => <ComponentCard key={item.slug} item={item} />)}</div></main></DocsShell>
}
