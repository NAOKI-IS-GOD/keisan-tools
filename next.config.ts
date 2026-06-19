import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  ...(isGitHubPages && {
    output: "export",
    basePath: "/keisan-tools",
    trailingSlash: true,
  }),
};

export default nextConfig;
