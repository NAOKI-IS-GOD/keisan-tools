import type { MetadataRoute } from "next";
import { siteRoutes, siteUrl } from "./site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return siteRoutes.map(({ path, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
