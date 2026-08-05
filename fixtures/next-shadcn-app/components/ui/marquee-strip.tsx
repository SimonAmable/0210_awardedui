import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface MarqueeStripProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  duration?: number
  direction?: "left" | "right"
  repeat?: number
}

export function MarqueeStrip({
  children,
  className,
  contentClassName,
  duration = 28,
  direction = "left",
  repeat = 2,
}: MarqueeStripProps) {
  const copies = Math.max(2, repeat)
  const trackStyle = {
    animationDuration: `${duration}s`,
    animationDirection: direction === "right" ? "reverse" : "normal",
  } as CSSProperties

  return <section className={cn("group relative overflow-hidden border-y bg-background py-4", className)} aria-label="Scrolling content"><style>{`@keyframes awwward-marquee-shift { to { transform: translateX(-50%); } } @media (prefers-reduced-motion: reduce) { .awwward-marquee-track { animation-play-state: paused !important; transform: none !important; } }`}</style><div className="awwward-marquee-track flex w-max animate-[awwward-marquee-shift_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]" style={trackStyle}>{Array.from({ length: copies }, (_, index) => <div key={index} aria-hidden={index > 0} className={cn("flex shrink-0 items-center gap-8 px-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground", contentClassName)}>{children}</div>)}</div></section>
}
