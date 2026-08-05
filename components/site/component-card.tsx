import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/site/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { RegistryItemMetadata } from "@/lib/registry-types"

export function ComponentCard({ item }: { item: RegistryItemMetadata }) {
  return <Card className="group overflow-hidden transition-shadow hover:shadow-md"><Link href={`/components/${item.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"><CardContent className="p-5"><div className="aspect-[16/9] rounded-lg bg-[radial-gradient(circle_at_72%_28%,#a1a1aa,transparent_16%),radial-gradient(circle_at_35%_75%,#3f3f46,transparent_32%),linear-gradient(135deg,#18181b,#52525b_55%,#a1a1aa)]" /><div className="mt-5 flex items-start justify-between gap-4"><div><h2 className="font-semibold tracking-tight">{item.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p></div><ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div><div className="mt-4 flex flex-wrap gap-1.5"><Badge>{item.category}</Badge><Badge>{item.engine}</Badge><Badge>{item.status}</Badge></div></CardContent></Link></Card>
}
