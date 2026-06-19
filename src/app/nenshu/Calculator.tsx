"use client";

import { useState, useCallback } from "react";

// 給与所得控除（2020年〜）
function kyuyoShotokuKojo(nenshu: number): number {
  if (nenshu <= 1_625_000) return 550_000;
  if (nenshu <= 1_800_000) return Math.floor(nenshu * 0.4) - 100_000;
  if (nenshu <= 3_600_000) return Math.floor(nenshu * 0.3) + 80_000;
  if (nenshu <= 6_600_000) return Math.floor(nenshu * 0.2) + 440_000;
  if (nenshu <= 8_500_000) return Math.floor(nenshu * 0.1) + 1_100_000;
  return 1_950_000;
}

// 所得税計算（課税所得に対して）
function calcShotokuZei(kazeiShotoku: number): number {
  const brackets = [
    [1_950_000, 0.05, 0],
    [3_300_000, 0.1, 97_500],
    [6_950_000, 0.2, 427_500],
    [9_000_000, 0.23, 636_000],
    [18_000_000, 0.33, 1_536_000],
    [40_000_000, 0.4, 2_796_000],
    [Infinity, 0.45, 4_796_000],
  ];
  for (const [limit, rate, deduction] of brackets) {
    if (kazeiShotoku <= (limit as number)) {
      return Math.floor(kazeiShotoku * (rate as number) - (deduction as number));
    }
  }
  return 0;
}

// 社会保険料計算（会社員、協会けんぽ東京2024）
function calcShakaihoken(nenshu: number, age: number): { kenko: number; nenkin: number; koyo: number; kaigo: number; total: number } {
  const tsukikyuyo = nenshu / 12;
  // 健康保険（東京、2024）9.98%を労使折半→4.99%
  const kenko = Math.floor(tsukikyuyo * 0.0499) * 12;
  // 厚生年金 18.3%を折半→9.15%、上限65万/月
  const nenkinBase = Math.min(tsukikyuyo, 650_000);
  const nenkin = Math.floor(nenkinBase * 0.0915) * 12;
  // 雇用保険 0.6%
  const koyo = Math.floor(nenshu * 0.006);
  // 介護保険（40歳以上）1.82%折半→0.91%
  const kaigo = age >= 40 ? Math.floor(tsukikyuyo * 0.0091) * 12 : 0;
  return { kenko, nenkin, koyo, kaigo, total: kenko + nenkin + koyo + kaigo };
}

function formatJpy(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function NenshuPage() {
  const [nenshu, setNenshu] = useState("500");
  const [age, setAge] = useState("30");
  const [result, setResult] = useState<null | {
    teDori: number;
    shakaihoken: ReturnType<typeof calcShakaihoken>;
    shotokuZei: number;
    juminZei: number;
    nenshuManyen: number;
  }>(null);

  const calculate = useCallback(() => {
    const n = Number(nenshu) * 10_000;
    const a = Number(age);
    if (!n || n < 0) return;

    const sh = calcShakaihoken(n, a);
    // 所得（給与所得控除後）
    const shotoku = n - kyuyoShotokuKojo(n);
    // 課税所得（基礎控除48万 + 社会保険料控除）
    const kazeiShotoku = Math.max(0, shotoku - 480_000 - sh.total);
    // 所得税（復興特別所得税2.1%含む）
    const shotokuZei = Math.floor(calcShotokuZei(kazeiShotoku) * 1.021);
    // 住民税（課税所得×10% - 調整控除2500円、住民税の基礎控除43万）
    const juminKazei = Math.max(0, shotoku - 430_000 - sh.total);
    const juminZei = Math.max(0, Math.floor(juminKazei * 0.1) - 2_500 + 5_000);

    const teDori = n - sh.total - shotokuZei - juminZei;

    setResult({ teDori, shakaihoken: sh, shotokuZei, juminZei, nenshuManyen: n });
  }, [nenshu, age]);

  const pct = (v: number) => result ? ((v / result.nenshuManyen) * 100).toFixed(1) + "%" : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-blue-600 font-medium mb-1">無料計算ツール</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">年収手取り計算機</h1>
        <p className="text-slate-500">年収から所得税・住民税・社会保険料を差し引いた手取り額を計算します。2024年度の税制に対応。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">年収（万円）</label>
            <div className="relative">
              <input
                type="number"
                value={nenshu}
                onChange={(e) => setNenshu(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="10000"
                placeholder="500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">万円</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">年齢（社会保険の計算に使用）</label>
            <div className="relative">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="18"
                max="80"
                placeholder="30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">歳</span>
            </div>
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
        >
          計算する
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-blue-600 text-white rounded-2xl p-6 text-center">
            <div className="text-sm opacity-80 mb-1">手取り年収（概算）</div>
            <div className="text-4xl font-bold">{formatJpy(result.teDori)}</div>
            <div className="text-sm opacity-70 mt-1">月額換算：{formatJpy(result.teDori / 12)} / 月</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-700 mb-4">内訳</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">年収</span>
                <span className="font-medium">{formatJpy(result.nenshuManyen)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">社会保険料合計</span>
                <span className="font-medium text-red-500">−{formatJpy(result.shakaihoken.total)} ({pct(result.shakaihoken.total)})</span>
              </div>
              <div className="pl-4 space-y-1 text-sm text-slate-500">
                <div className="flex justify-between"><span>└ 健康保険</span><span>−{formatJpy(result.shakaihoken.kenko)}</span></div>
                <div className="flex justify-between"><span>└ 厚生年金</span><span>−{formatJpy(result.shakaihoken.nenkin)}</span></div>
                <div className="flex justify-between"><span>└ 雇用保険</span><span>−{formatJpy(result.shakaihoken.koyo)}</span></div>
                {result.shakaihoken.kaigo > 0 && (
                  <div className="flex justify-between"><span>└ 介護保険（40歳以上）</span><span>−{formatJpy(result.shakaihoken.kaigo)}</span></div>
                )}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">所得税</span>
                <span className="font-medium text-red-500">−{formatJpy(result.shotokuZei)} ({pct(result.shotokuZei)})</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">住民税</span>
                <span className="font-medium text-red-500">−{formatJpy(result.juminZei)} ({pct(result.juminZei)})</span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold text-lg">
                <span className="text-slate-800">手取り年収</span>
                <span className="text-blue-600">{formatJpy(result.teDori)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-400">
            ※ 協会けんぽ（東京）の保険料率で計算。配偶者控除・扶養控除・生命保険料控除は含みません。実際の金額は給与明細や確定申告でご確認ください。
          </div>
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-700 mb-4">年収別・手取りの目安</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200">
                <th className="text-left py-2 pr-4">年収</th>
                <th className="text-right py-2 pr-4">手取り（概算）</th>
                <th className="text-right py-2">月額換算</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {[300, 400, 500, 600, 700, 800, 1000, 1200, 1500].map((y) => {
                const n = y * 10_000;
                const sh = calcShakaihoken(n, 35);
                const shotoku = n - kyuyoShotokuKojo(n);
                const kazei = Math.max(0, shotoku - 480_000 - sh.total);
                const st = Math.floor(calcShotokuZei(kazei) * 1.021);
                const jk = Math.max(0, shotoku - 430_000 - sh.total);
                const jt = Math.max(0, Math.floor(jk * 0.1) - 2_500 + 5_000);
                const td = n - sh.total - st - jt;
                return (
                  <tr key={y} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{y}万円</td>
                    <td className="py-2 pr-4 text-right font-medium">{Math.round(td / 10000)}万円</td>
                    <td className="py-2 text-right text-slate-500">{Math.round(td / 12 / 10000)}万円</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">※ 35歳・協会けんぽ（東京）・独身での試算</p>
      </div>
    </div>
  );
}
