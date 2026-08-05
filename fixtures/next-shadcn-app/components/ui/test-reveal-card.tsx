import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TestRevealCardProps {
  eyebrow: string
  title: string
  description: string
  accent: string
  href: string
  className?: string
}

export function TestRevealCard({
  eyebrow,
  title,
  description,
  accent,
  href,
  className,
}: TestRevealCardProps) {
  return (
    <article className={cn("group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50", className)}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_72%_28%,rgba(161,161,170,.85),transparent_18%),radial-gradient(circle_at_35%_75%,rgba(63,63,70,.92),transparent_30%),linear-gradient(135deg,#18181b,#52525b_55%,#a1a1aa)] transition-transform duration-500 ease-out group-hover:scale-105" />
      <div aria-hidden="true" className="absolute inset-x-0 top-36 h-28 bg-gradient-to-b from-transparent to-white dark:to-zinc-950" />
      <div className="relative flex min-h-[26rem] flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          <span>{eyebrow}</span>
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] text-white backdrop-blur-sm">{accent}</span>
        </div>
        <div className="mt-auto pt-32">
          <h3 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
          <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
          <a href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-4 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950">
            Explore component <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
