import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { siteUrl } from "./site";
import { tools } from "./tool-data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ソク計算 — 入力したら即わかる無料計算ツール集",
    template: "%s | ソク計算",
  },
  description: "年収手取り・ふるさと納税・住宅ローン・積立投資・パーセント・年齢計算など生活に役立つ無料計算ツール集。入力した瞬間に結果がわかる。",
  keywords: ["計算機", "手取り", "ふるさと納税", "住宅ローン", "電気代", "シミュレーター"],
  openGraph: {
    siteName: "ソク計算",
    locale: "ja_JP",
    type: "website",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "KsLvYdFT8g99CaNMzo8hMks8Iofw7MVbQHv62ugetkw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              ソク計算
            </Link>
            <nav className="hidden md:flex gap-4 text-sm text-slate-600">
              {tools.slice(0, 8).map((tool) => (
                <Link key={tool.slug} href={tool.href} className="hover:text-blue-600 transition-colors">
                  {tool.shortTitle}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-slate-800 text-slate-400 text-sm mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-wrap gap-4 mb-4">
              <Link href="/" className="hover:text-white transition-colors">トップ</Link>
              {tools.map((tool) => (
                <Link key={tool.slug} href={tool.href} className="hover:text-white transition-colors">
                  {tool.shortTitle}
                </Link>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              当サイトの計算結果は概算です。正確な数値は税理士・専門家にご相談ください。
              © {new Date().getFullYear()} ソク計算
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
