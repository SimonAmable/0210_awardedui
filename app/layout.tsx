import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site/header"
import { ThemeProvider } from "@/components/site/theme-provider"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = { title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` }, description: siteConfig.description }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><SiteHeader />{children}<footer className="border-t py-8 text-center text-xs text-muted-foreground">AwwwardWinning UI is an independent project and is not affiliated with Awwwards.</footer></ThemeProvider></body></html>
}
