"use client";

import { useState, useCallback } from "react";

// ふるさと納税の自己負担2000円となる上限寄付額を計算
// 参考：総務省の計算式

function calcFurusatoLimit(nenshu: number, kazoku: string, haigu: boolean, children: number): number {
  // 給与所得控除
  function kyuyoKojo(n: number): number {
    if (n <= 1_625_000) return 550_000;
    if (n <= 1_800_000) return Math.floor(n * 0.4) - 100_000;
    if (n <= 3_600_000) return Math.floor(n * 0.3) + 80_000;
    if (n <= 6_600_000) return Math.floor(n * 0.2) + 440_000;
    if (n <= 8_500_000) return Math.floor(n * 0.1) + 1_100_000;
    return 1_950_000;
  }

  const shotoku = nenshu - kyuyoKojo(nenshu);

  // 人的控除
  let jintekiKojo = 480_000; // 基礎控除
  if (haigu) jintekiKojo += 380_000; // 配偶者控除（配偶者所得0と仮定）
  if (kazoku === "kofu") jintekiKojo += 0; // 寡婦・ひとり親は複雑なので省略
  jintekiKojo += children * 380_000; // 扶養控除（一般）

  // 住民税の人的控除差
  // 住民税基礎控除43万、所得税基礎控除48万→差5万
  // 配偶者：住民税33万、所得税38万→差5万
  let juminJintekiSa = 50_000; // 基礎控除差
  if (haigu) juminJintekiSa += 50_000;
  juminJintekiSa += children * 50_000;

  // 社会保険料（簡易計算）
  const shakai = nenshu * 0.145;

  // 課税所得（所得税用）
  const kazeiShotokuSt = Math.max(0, shotoku - jintekiKojo - shakai);

  // 所得税率
  function stRate(k: number): number {
    if (k <= 1_950_000) return 0.05;
    if (k <= 3_300_000) return 0.1;
    if (k <= 6_950_000) return 0.2;
    if (k <= 9_000_000) return 0.23;
    if (k <= 18_000_000) return 0.33;
    if (k <= 40_000_000) return 0.4;
    return 0.45;
  }

  const stRateVal = stRate(kazeiShotokuSt);

  // 住民税の課税所得
  const juminKazei = Math.max(0, shotoku - (jintekiKojo - juminJintekiSa) - shakai);

  // 上限額の計算式（総務省）
  // 上限 = (住民税の課税所得 × 10%) / (90% - 所得税率 × 1.021) + 2000
  const bunbo = 0.9 - stRateVal * 1.021;
  if (bunbo <= 0) return 0;

  const limit = Math.floor((juminKazei * 0.1) / bunbo) + 2_000;
  return Math.max(2_000, limit);
}

function formatJpy(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function FurusatoPage() {
  const [nenshu, setNenshu] = useState("500");
  const [haigu, setHaigu] = useState(false);
  const [children, setChildren] = useState("0");
  const [result, setResult] = useState<number | null>(null);

  const calculate = useCallback(() => {
    const n = Number(nenshu) * 10_000;
    if (!n || n < 0) return;
    const limit = calcFurusatoLimit(n, "", haigu, Number(children));
    setResult(limit);
  }, [nenshu, haigu, children]);

  // 年収別上限テーブル用データ
  const tableData = [300, 400, 500, 600, 700, 800, 1000, 1200, 1500].map((y) => ({
    y,
    single: calcFurusatoLimit(y * 10_000, "", false, 0),
    haigusha: calcFurusatoLimit(y * 10_000, "", true, 0),
    child1: calcFurusatoLimit(y * 10_000, "", false, 1),
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-green-600 font-medium mb-1">無料計算ツール</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">ふるさと納税シミュレーター</h1>
        <p className="text-slate-500">自己負担2,000円で寄付できる上限額を計算します。年収・家族構成を入力するだけ。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">年収（万円）</label>
            <div className="relative">
              <input
                type="number"
                value={nenshu}
                onChange={(e) => setNenshu(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                placeholder="500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">万円</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">家族構成</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={haigu}
                  onChange={(e) => setHaigu(e.target.checked)}
                  className="w-5 h-5 rounded accent-green-600"
                />
                <span className="text-slate-700">配偶者がいる（配偶者の収入が150万円以下）</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">16歳以上の扶養家族（子・親など）の人数</label>
            <div className="relative w-40">
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">人</span>
            </div>
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
        >
          上限額を計算する
        </button>
      </div>

      {result !== null && (
        <div className="space-y-4 mb-8">
          <div className="bg-green-600 text-white rounded-2xl p-6 text-center">
            <div className="text-sm opacity-80 mb-1">ふるさと納税の上限額（目安）</div>
            <div className="text-4xl font-bold">{formatJpy(result)}</div>
            <div className="text-sm opacity-70 mt-2">この金額まで寄付すれば自己負担は実質2,000円</div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-800">
            <p className="font-medium mb-2">お得に活用するポイント</p>
            <ul className="space-y-1 text-green-700 list-disc list-inside">
              <li>返礼品の還元率は最大30%なので、上限いっぱい寄付するとお得</li>
              <li>ワンストップ特例制度を使えば確定申告不要（5自治体まで）</li>
              <li>年末（12月31日）までの寄付が今年度分に反映</li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-400">
            ※ 社会保険料を年収の14.5%として試算。医療費控除・生命保険料控除等は考慮していません。実際の上限額はふるさと納税サイトや自治体の窓口でご確認ください。
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-700 mb-4">年収別・上限額の目安</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200">
                <th className="text-left py-2 pr-3">年収</th>
                <th className="text-right py-2 pr-3">独身</th>
                <th className="text-right py-2 pr-3">配偶者あり</th>
                <th className="text-right py-2">扶養1人</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {tableData.map(({ y, single, haigusha, child1 }) => (
                <tr key={y} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{y}万円</td>
                  <td className="py-2 pr-3 text-right">{Math.round(single / 1000)}千円</td>
                  <td className="py-2 pr-3 text-right">{Math.round(haigusha / 1000)}千円</td>
                  <td className="py-2 text-right">{Math.round(child1 / 1000)}千円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">※ 概算値。詳細はシミュレーターで個別計算してください。</p>
      </div>
    </div>
  );
}
