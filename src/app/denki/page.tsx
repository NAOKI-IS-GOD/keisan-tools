import type { Metadata } from "next";
import DenkiCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "電気代計算機 — 家電の消費電力から月の電気料金を計算",
  description: "家電の消費電力（W数）と使用時間を入力して月の電気代を計算。エアコン・冷蔵庫・テレビなどのプリセット付き。複数家電をまとめて試算できます。",
  keywords: ["電気代", "計算機", "消費電力", "節電", "光熱費"],
  alternates: {
    canonical: "/denki",
  },
  openGraph: {
    url: "/denki",
  },
};

export default function DenkiPage() {
  return <DenkiCalculator />;
}
