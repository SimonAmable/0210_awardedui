import Link from "next/link"

import { registryItems } from "@/content/registry-items"
import { cn } from "@/lib/utils"

export function DocsShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return <div className="mx-auto grid max-w-7xl lg:grid-cols-[13rem_minmax(0,1fr)]"><aside className="hidden border-r lg:block"><div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8"><section aria-labelledby="getting-started-heading"><p id="getting-started-heading" className="mb-3 text-xs font-medium text-muted-foreground">Getting started</p><nav aria-label="Getting started" className="space-y-1 text-sm"><Link href="/docs/installation" className={cn("block rounded-md px-2 py-1.5 hover:bg-muted", active === "installation" && "bg-muted font-medium text-foreground")}>Installation</Link><Link href="/components" className={cn("block rounded-md px-2 py-1.5 hover:bg-muted", active === "components" && "bg-muted font-medium text-foreground")}>All components</Link></nav></section><section aria-labelledby="components-heading"><p id="components-heading" className="mb-3 mt-8 text-xs font-medium text-muted-foreground">Components</p><nav aria-label="Components" className="space-y-1 text-sm">{registryItems.map((item) => { const href = `/components/${item.slug}`; return <Link key={item.slug} href={href} className={cn("block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground", active === href && "bg-muted font-medium text-foreground")}>{item.title}</Link> })}</nav></section></div></aside>{children}</div>
}
