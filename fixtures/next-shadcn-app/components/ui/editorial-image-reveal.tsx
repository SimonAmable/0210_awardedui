import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface EditorialImageRevealProps {
  eyebrow: string
  title: string
  year: string
  href: string
  media: ReactNode
  className?: string
}

export function EditorialImageReveal({ eyebrow, title, year, href, media, className }: EditorialImageRevealProps) {
  return <article className={cn("group", className)}><a href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"><div className="relative aspect-[4/3] overflow-hidden bg-muted"><div aria-hidden="true" className="absolute inset-0 scale-110 opacity-35 transition-transform duration-700 ease-out group-hover:scale-100">{media}</div><div className="absolute inset-y-0 left-0 w-2/3 bg-background transition-transform duration-700 ease-[cubic-bezier(.77,0,.18,1)] group-hover:-translate-x-full motion-reduce:transition-none" /><div className="absolute inset-0 scale-100 transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none">{media}</div></div><div className="mt-4 flex items-start justify-between gap-6 border-t pt-3"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p><h3 className="mt-1 text-xl font-semibold tracking-tight">{title}</h3></div><span className="text-sm text-muted-foreground">{year}</span></div></a></article>
}
