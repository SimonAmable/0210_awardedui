import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/site/badge"
import { Button } from "@/components/ui/button"

export default function Home() {
  return <main><section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-12 text-center sm:py-16"><Badge>Independent component registry</Badge><h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">Creative components.<br />Installed like shadcn.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">A curated registry of production-ready creative components and motion effects for React, Next.js, Tailwind CSS, and shadcn/ui.</p><div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-9"><Button asChild><Link href="/components">Browse components <ArrowRight aria-hidden="true" className="size-4" /></Link></Button><Button variant="outline" asChild><Link href="/docs/installation">View installation</Link></Button></div></section></main>
}
