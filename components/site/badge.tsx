import { Badge as ShadcnBadge } from "@/components/ui/badge"

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ShadcnBadge variant="outline" className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground ${className ?? ""}`}>{children}</ShadcnBadge>
}
