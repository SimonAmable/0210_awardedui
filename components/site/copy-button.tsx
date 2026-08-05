"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return <Button type="button" variant="outline" size="sm" onClick={copy} className={className} aria-live="polite">{copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}{copied ? "Copied" : label}</Button>
}
