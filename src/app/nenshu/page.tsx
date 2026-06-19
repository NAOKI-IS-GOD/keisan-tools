import type { Metadata } from "next";
import ToolSeoContent, { getSeoTool } from "../ToolSeoContent";
import NenshuCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "年収手取り計算機 — 所得税・住民税・社会保険料を一発計算",
  description: "年収を入力するだけで手取り額を即座に計算。所得税・住民税・健康保険・厚生年金・雇用保険を2024年度の税制で算出。転職・昇給時の手取り確認に。",
  keywords: ["手取り計算", "年収手取り", "所得税計算", "住民税計算", "社会保険料"],
  alternates: {
    canonical: "/nenshu",
  },
  openGraph: {
    url: "/nenshu",
  },
};

export default function NenshuPage() {
  const tool = getSeoTool("nenshu");
  return <><NenshuCalculator />{tool && <ToolSeoContent tool={tool} />}</>;
}
