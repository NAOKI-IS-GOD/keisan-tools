import { tools } from "./tool-data";

export const siteUrl = "https://keisan-tools-alpha.vercel.app";

export const siteRoutes = [
  { path: "/", priority: 1 },
  ...tools.map((tool) => ({
    path: tool.href,
    priority: ["nenshu", "furusato", "shohizei", "tsumitate", "percent"].includes(tool.slug)
      ? 0.9
      : 0.8,
  })),
] as const;
