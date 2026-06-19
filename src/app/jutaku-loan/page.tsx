import type { Metadata } from "next";
import JutakuLoanCalculator from "./Calculator";

export const metadata: Metadata = {
  title: "住宅ローン計算機 — 月々の返済額・総支払額を即計算",
  description: "借入金額・金利・返済期間を入力して月々の返済額と総支払額を計算。繰り上げ返済シミュレーションで節約額も試算。固定・変動金利どちらにも対応。",
  keywords: ["住宅ローン", "計算機", "返済額", "繰り上げ返済", "シミュレーター"],
  alternates: {
    canonical: "/jutaku-loan",
  },
  openGraph: {
    url: "/jutaku-loan",
  },
};

export default function JutakuLoanPage() {
  return <JutakuLoanCalculator />;
}
