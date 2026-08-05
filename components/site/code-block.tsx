import { CopyButton } from "@/components/site/copy-button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CodeBlock({ code, label = "Copy", className }: { code: string; label?: string; className?: string }) {
  return <Card className={cn("overflow-hidden rounded-lg bg-zinc-950 text-zinc-100 shadow-none", className)}><div className="flex items-center justify-between border-b border-white/10 px-3 py-2"><span className="font-mono text-[11px] text-zinc-400">terminal</span><CopyButton value={code} label={label} className="border-white/10 bg-transparent text-zinc-200 hover:bg-white/10 hover:text-zinc-100" /></div><CardContent className="p-0"><pre className="overflow-x-auto p-4 text-sm leading-6"><code>{code}</code></pre></CardContent></Card>
}
