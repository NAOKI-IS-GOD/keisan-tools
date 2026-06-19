import Link from "next/link";
import type { Metadata } from "next";
import { colorMap, tagColorMap, tools } from "./tool-data";

export const metadata: Metadata = {
  title: "ソク計算 — 入力したら即わかる無料計算ツール集",
  description: "年収手取り・ふるさと納税・消費税・積立投資・BMI・文字数など、生活に役立つ無料計算ツール集。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          ソク計算
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          生活・お金に関わる計算をすべて無料で。全{tools.length}種類のツールをすぐ使えます。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`block rounded-2xl border-2 p-6 transition-all duration-200 ${colorMap[tool.color as keyof typeof colorMap]}`}
          >
            <div className="text-4xl mb-3">{tool.emoji}</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${tagColorMap[tool.color as keyof typeof tagColorMap]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-3">よくある使い方</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="p-4">
            <div className="text-2xl mb-2">📊</div>
            <p>転職・昇給時に<br/>手取りを事前確認</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🗓️</div>
            <p>年末にふるさと納税の<br/>上限額をチェック</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🔌</div>
            <p>家電購入前に<br/>電気代を試算</p>
          </div>
        </div>
      </div>
    </div>
  );
}
