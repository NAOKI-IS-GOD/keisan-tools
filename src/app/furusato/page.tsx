import type { Metadata } from "next";
import ToolSeoContent, { getSeoTool } from "../ToolSeoContent";
import FurusatoCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "ふるさと納税シミュレーター — 自己負担2000円の上限額を計算",
  description: "年収・家族構成を入力するだけでふるさと納税の上限額を計算。独身・配偶者あり・扶養家族ありに対応。年末の駆け込み寄付前に上限額を確認。",
  keywords: ["ふるさと納税", "シミュレーター", "上限額", "寄付金控除", "節税"],
  alternates: {
    canonical: "/furusato",
  },
  openGraph: {
    url: "/furusato",
  },
};

export default function FurusatoPage() {
  const tool = getSeoTool("furusato");
  return <><FurusatoCalculator />{tool && <ToolSeoContent tool={tool} />}</>;
}
