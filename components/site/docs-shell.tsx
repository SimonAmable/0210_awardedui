import Link from "next/link"

import { cn } from "@/lib/utils"

const componentLinks = [
  { href: "/components/marquee-strip", label: "Marquee Strip" },
  { href: "/components/editorial-image-reveal", label: "Editorial Image Reveal" },
  { href: "/components/smoke-shader-background", label: "Smoke Shader Background" },
  { href: "/components/caustics-shader-background", label: "Caustics Shader Background" },
]

export function DocsShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return <div className="mx-auto grid max-w-7xl lg:grid-cols-[13rem_minmax(0,1fr)]"><aside className="hidden border-r lg:block"><div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8"><p className="mb-3 text-xs font-medium text-muted-foreground">Getting started</p><nav className="space-y-1 text-sm"><Link href="/docs/installation" className={cn("block rounded-md px-2 py-1.5 hover:bg-muted", active === "installation" && "bg-muted font-medium text-foreground")}>Installation</Link></nav><p className="mb-3 mt-8 text-xs font-medium text-muted-foreground">Components</p><nav className="space-y-1 text-sm"><Link href="/components" className={cn("block rounded-md px-2 py-1.5 hover:bg-muted", active === "components" && "bg-muted font-medium text-foreground")}>All components</Link>{componentLinks.map((link) => <Link key={link.href} href={link.href} className={cn("block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground", active === link.href && "bg-muted font-medium text-foreground")}>{link.label}</Link>)}</nav></div></aside>{children}</div>
}
