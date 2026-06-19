import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SimpleToolCalculator from "../SimpleToolCalculator";
import { getTool, tools } from "../tool-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools
    .filter((tool) => tool.kind)
    .map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.title} — 無料で即計算`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: tool.href,
    },
    openGraph: {
      url: tool.href,
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool || !tool.kind) {
    notFound();
  }

  return <SimpleToolCalculator tool={tool} />;
}

