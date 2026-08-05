import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CharacterLogo } from "@/components/site/character-logo"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { siteConfig } from "@/lib/site"

const links = [{ href: "/components", label: "Components" }, { href: "/docs/installation", label: "Installation" }]

export function SiteHeader() {
  return <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur"><div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5"><Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight"><CharacterLogo className="size-7" /><span className="hidden sm:inline">AwwwardWinning UI<span className="text-muted-foreground">.</span></span></Link><nav aria-label="Main navigation" className="flex items-center gap-1 text-sm text-muted-foreground">{links.map((link) => <Button key={link.href} variant="ghost" size="sm" asChild><Link href={link.href}>{link.label}</Link></Button>)}<ThemeToggle /><Button variant="ghost" size="icon" asChild><a href={siteConfig.githubUrl} aria-label="GitHub repository"><Github aria-hidden="true" className="size-4" /></a></Button></nav></div></header>
}
