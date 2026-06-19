"use client";

import { useState, useCallback } from "react";

function calcLoan(gankin: number, nenri: number, nensu: number) {
  const tsukiRi = nenri / 100 / 12;
  const kaisu = nensu * 12;

  if (tsukiRi === 0) {
    const tsuki = gankin / kaisu;
    return { tsuki, soShiharai: tsuki * kaisu, soRishi: 0 };
  }

  const tsuki = gankin * (tsukiRi * Math.pow(1 + tsukiRi, kaisu)) / (Math.pow(1 + tsukiRi, kaisu) - 1);
  const soShiharai = tsuki * kaisu;
  const soRishi = soShiharai - gankin;

  return { tsuki, soShiharai, soRishi };
}

function formatJpy(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function JutakuLoanPage() {
  const [gankin, setGankin] = useState("3000");
  const [nenri, setNenri] = useState("1.5");
  const [nensu, setNensu] = useState("35");
  const [result, setResult] = useState<null | ReturnType<typeof calcLoan>>(null);

  const calculate = useCallback(() => {
    const g = Number(gankin) * 10_000;
    const r = Number(nenri);
    const n = Number(nensu);
    if (!g || g <= 0 || r < 0 || !n || n <= 0) return;
    setResult(calcLoan(g, r, n));
  }, [gankin, nenri, nensu]);

  // 繰り上げ返済シミュレーション
  const [kuriage, setKuriage] = useState("100");
  const [kuriageYear, setKuriageYear] = useState("10");
  const [kuriageResult, setKuriageResult] = useState<null | { saved: number; shortMonths: number }>(null);

  const calcKuriage = useCallback(() => {
    const g = Number(gankin) * 10_000;
    const r = Number(nenri) / 100 / 12;
    const n = Number(nensu) * 12;
    const ku = Number(kuriage) * 10_000;
    const ky = Number(kuriageYear) * 12;
    if (!g || !ku || !ky) return;

    // ky回目までの元金残高を計算
    let zankin = g;
    const tsuki = g * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    for (let i = 0; i < ky; i++) {
      const rishi = zankin * r;
      zankin = zankin - (tsuki - rishi);
    }
    zankin = Math.max(0, zankin - ku);

    // 繰り上げ後の残り返済
    const nokoriKaisu = n - ky;
    if (r === 0) {
      const newTsuki = zankin / nokoriKaisu;
      const saved = (tsuki - newTsuki) * nokoriKaisu;
      setKuriageResult({ saved, shortMonths: 0 });
      return;
    }

    // 期間短縮型：同じ月額で何ヶ月短縮できるか
    let months = 0;
    let z = zankin;
    while (z > 0 && months < nokoriKaisu) {
      z = z * (1 + r) - tsuki;
      months++;
    }
    const shortMonths = nokoriKaisu - months;
    const saved = shortMonths * tsuki;
    setKuriageResult({ saved, shortMonths });
  }, [gankin, nenri, nensu, kuriage, kuriageYear]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-purple-600 font-medium mb-1">無料計算ツール</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">住宅ローン計算機</h1>
        <p className="text-slate-500">借入金額・金利・返済期間から月々の返済額と総支払額を計算します。繰り上げ返済のシミュレーションも。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">借入金額（万円）</label>
            <div className="relative">
              <input
                type="number"
                value={gankin}
                onChange={(e) => setGankin(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                placeholder="3000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">万</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">金利（年率%）</label>
            <div className="relative">
              <input
                type="number"
                value={nenri}
                onChange={(e) => setNenri(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                step="0.1"
                placeholder="1.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">返済期間（年）</label>
            <div className="relative">
              <input
                type="number"
                value={nensu}
                onChange={(e) => setNensu(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="50"
                placeholder="35"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">年</span>
            </div>
          </div>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
        >
          計算する
        </button>
      </div>

      {result && (
        <div className="space-y-4 mb-8">
          <div className="bg-purple-600 text-white rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-sm opacity-80 mb-1">毎月の返済額</div>
              <div className="text-4xl font-bold">{formatJpy(result.tsuki)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-xs opacity-70 mb-1">総返済額</div>
                <div className="text-xl font-bold">{formatJpy(result.soShiharai)}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-xs opacity-70 mb-1">利子総額</div>
                <div className="text-xl font-bold">{formatJpy(result.soRishi)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-700 mb-4">繰り上げ返済シミュレーション</h2>
            <p className="text-sm text-slate-500 mb-4">期間短縮型の繰り上げ返済でどれだけ節約できるか計算します。</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">繰り上げ金額（万円）</label>
                <div className="relative">
                  <input
                    type="number"
                    value={kuriage}
                    onChange={(e) => setKuriage(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">万</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">返済開始から何年後</label>
                <div className="relative">
                  <input
                    type="number"
                    value={kuriageYear}
                    onChange={(e) => setKuriageYear(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="49"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">年後</span>
                </div>
              </div>
            </div>
            <button
              onClick={calcKuriage}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
            >
              繰り上げ返済を試算
            </button>

            {kuriageResult && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">返済期間の短縮</div>
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.floor(kuriageResult.shortMonths / 12)}年{kuriageResult.shortMonths % 12}ヶ月
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">利子の節約額</div>
                    <div className="text-2xl font-bold text-purple-700">{formatJpy(kuriageResult.saved)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
        ※ 元利均等返済方式で計算。固定金利として試算。変動金利の場合は金利変動により返済額が変わります。
      </div>
    </div>
  );
}
