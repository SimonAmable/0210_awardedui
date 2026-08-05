"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  return <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle color theme"><Sun aria-hidden="true" className="hidden size-4 dark:block" /><Moon aria-hidden="true" className="block size-4 dark:hidden" /></Button>
}
