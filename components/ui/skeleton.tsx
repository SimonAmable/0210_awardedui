import * as React from "react"

import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-lg bg-muted animate-pulse", className)} />
}

export default Skeleton
