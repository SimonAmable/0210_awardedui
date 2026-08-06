export const siteConfig = {
  name: "AwwwardWinning UI",
  description: "A curated registry of production-ready creative components and motion effects for React.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/SimonAmable/0210_awardedui",
}

export function registryUrl(slug: string) {
  return `${siteConfig.url.replace(/\/$/, "")}/r/${slug}.json`
}
