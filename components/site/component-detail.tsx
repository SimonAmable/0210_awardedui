import Link from "next/link"

import { Badge } from "@/components/site/badge"
import { CodeBlock } from "@/components/site/code-block"
import { CopyButton } from "@/components/site/copy-button"
import { PreviewCodeTabs } from "@/components/site/preview-code-tabs"
import { Separator } from "@/components/ui/separator"
import type { RegistryItemMetadata } from "@/lib/registry-types"

export function ComponentDetail({ item, source }: { item: RegistryItemMetadata; source: string }) {
  return (
    <main className="min-w-0 max-w-4xl px-5 py-10 sm:px-10 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/components" className="hover:text-foreground">Components</Link> <span aria-hidden="true">/</span> <span>{item.title}</span>
      </nav>
      <div className="mt-7">
        <div className="flex flex-wrap items-center gap-2"><Badge>{item.category}</Badge><Badge>{item.engine}</Badge><Badge>{item.status}</Badge></div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
      <section className="mt-8">
        <PreviewCodeTabs item={item} code={source} />
      </section>
      <Separator className="my-10" />
      <section>
        <h2 className="text-lg font-semibold">Install</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Add the component directly to your configured component directory.</p>
        <div className="mt-3"><CodeBlock code={item.installCommand} label="Copy command" /></div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Usage</h2>
        <div className="mt-3"><CodeBlock code={item.usage} label="Copy usage" /></div>
      </section>
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div><h2 className="text-lg font-semibold">Implementation prompt</h2><p className="mt-1 text-sm text-muted-foreground">A ready-to-use integration brief for a coding agent.</p></div>
          <CopyButton value={item.implementationPrompt} label="Copy prompt" />
        </div>
        <pre className="mt-3 max-w-full whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">{item.implementationPrompt}</pre>
      </section>
      <section className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3">
        <div><h2 className="text-sm font-semibold">Dependencies</h2><p className="mt-2 text-sm text-muted-foreground">{item.dependencies.join(", ") || "None"}</p></div>
        <div><h2 className="text-sm font-semibold">Touch</h2><p className="mt-2 text-sm text-muted-foreground">{item.touchSupport}</p></div>
        <div><h2 className="text-sm font-semibold">Motion</h2><p className="mt-2 text-sm text-muted-foreground">{item.reducedMotion ? "Reduced-motion support" : "No reduced-motion mode"}</p></div>
      </section>
      {item.reference && <p className="mt-10 border-t pt-6 text-xs leading-5 text-muted-foreground">Shader reference: <Link href={item.reference.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">{item.reference.label}</Link>.</p>}
    </main>
  )
}
