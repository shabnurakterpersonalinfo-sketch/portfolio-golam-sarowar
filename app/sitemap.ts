import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadgolamsarowar.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/experiences",
    "/scholarly-activities",
    "/publications",
    "/awards",
    "/skills",
    "/volunteering",
    "/gallery",
    "/blogs",
    "/contact",
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }))
}
