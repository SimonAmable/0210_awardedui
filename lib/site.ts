export const siteConfig = {
  name: "AwwwardWinning UI",
  description: "A curated registry of production-ready creative components and motion effects for React.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  githubUrl: "https://github.com/your-org/awwward-winning-ui",
}

export function registryUrl(slug: string) {
  return `${siteConfig.url.replace(/\/$/, "")}/r/${slug}.json`
}
