"use client";

import { useState } from "react";

const PRESETS = [
  { name: "エアコン（冷房）", w: 700, h: 8 },
  { name: "エアコン（暖房）", w: 1000, h: 8 },
  { name: "テレビ（50型）", w: 120, h: 5 },
  { name: "冷蔵庫（400L）", w: 45, h: 24 },
  { name: "洗濯機", w: 500, h: 1 },
  { name: "電子レンジ", w: 1200, h: 0.5 },
  { name: "IHクッキングヒーター", w: 1400, h: 1 },
  { name: "電気ストーブ（800W）", w: 800, h: 6 },
  { name: "ドライヤー", w: 1200, h: 0.2 },
  { name: "照明（LED 10畳）", w: 30, h: 6 },
  { name: "PC（デスクトップ）", w: 200, h: 8 },
  { name: "PS5", w: 200, h: 3 },
];

interface Appliance {
  id: number;
  name: string;
  watt: string;
  hours: string;
  days: string;
}

function formatJpy(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function DenkiPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 1, name: "エアコン（冷房）", watt: "700", hours: "8", days: "30" },
    { id: 2, name: "冷蔵庫", watt: "45", hours: "24", days: "30" },
  ]);
  const [tanka, setTanka] = useState("31");
  const [nextId, setNextId] = useState(3);

  const addAppliance = () => {
    setAppliances((prev) => [
      ...prev,
      { id: nextId, name: "", watt: "", hours: "", days: "30" },
    ]);
    setNextId((n) => n + 1);
  };

  const addPreset = (preset: typeof PRESETS[0]) => {
    setAppliances((prev) => [
      ...prev,
      { id: nextId, name: preset.name, watt: String(preset.w), hours: String(preset.h), days: "30" },
    ]);
    setNextId((n) => n + 1);
  };

  const updateAppliance = (id: number, field: keyof Appliance, value: string) => {
    setAppliances((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const removeAppliance = (id: number) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const calcCost = (a: Appliance) => {
    const w = Number(a.watt);
    const h = Number(a.hours);
    const d = Number(a.days);
    const t = Number(tanka);
    if (!w || !h || !d || !t) return 0;
    return (w / 1000) * h * d * t;
  };

  const total = appliances.reduce((sum, a) => sum + calcCost(a), 0);
  const yearTotal = total * 12;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-amber-600 font-medium mb-1">無料計算ツール</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">電気代計算機</h1>
        <p className="text-slate-500">家電の消費電力・使用時間から月の電気代を計算。複数の家電をまとめて試算できます。</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-slate-700 whitespace-nowrap">電気料金単価（円/kWh）</label>
          <div className="relative w-32">
            <input
              type="number"
              value={tanka}
              onChange={(e) => setTanka(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
              min="0"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">円</span>
          </div>
          <p className="text-xs text-slate-400">全国平均：約31円/kWh（2024年）</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="space-y-3 mb-4">
          {appliances.map((a) => (
            <div key={a.id} className="grid grid-cols-[1fr_80px_70px_70px_auto] gap-2 items-center">
              <input
                type="text"
                value={a.name}
                onChange={(e) => updateAppliance(a.id, "name", e.target.value)}
                placeholder="家電名"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="relative">
                <input
                  type="number"
                  value={a.watt}
                  onChange={(e) => updateAppliance(a.id, "watt", e.target.value)}
                  placeholder="W数"
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">W</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={a.hours}
                  onChange={(e) => updateAppliance(a.id, "hours", e.target.value)}
                  placeholder="時間"
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  step="0.5"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">h</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={a.days}
                  onChange={(e) => updateAppliance(a.id, "days", e.target.value)}
                  placeholder="日数"
                  className="w-full border border-slate-300 rounded-lg px-2 py-2 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  max="31"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">日</span>
              </div>
              <button
                onClick={() => removeAppliance(a.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={addAppliance}
            className="text-sm border border-slate-300 hover:border-amber-400 text-slate-600 hover:text-amber-700 px-3 py-2 rounded-lg transition-colors"
          >
            + 空欄を追加
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">プリセットから追加：</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => addPreset(p)}
                className="text-xs border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-1 rounded-full transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-600 text-white rounded-2xl p-6 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm opacity-80 mb-1">月の電気代（合計）</div>
            <div className="text-3xl font-bold">{formatJpy(total)}</div>
          </div>
          <div>
            <div className="text-sm opacity-80 mb-1">年間換算</div>
            <div className="text-3xl font-bold">{formatJpy(yearTotal)}</div>
          </div>
        </div>
      </div>

      {appliances.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <h2 className="font-bold text-slate-700 mb-3">家電別の内訳</h2>
          <div className="space-y-2">
            {appliances.map((a) => {
              const cost = calcCost(a);
              const pct = total > 0 ? (cost / total) * 100 : 0;
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 truncate">{a.name || "（未入力）"}</span>
                      <span className="font-medium ml-2">{formatJpy(cost)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-700 mb-4">消費電力の調べ方</h2>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>家電の裏や底面のシールに「定格消費電力 〇〇W」と記載あり</li>
          <li>取扱説明書やメーカーサイトのスペック欄で確認できる</li>
          <li>エアコンは「冷房〇W〜〇W」のように範囲で書かれることが多い（中央値を使用）</li>
          <li>冷蔵庫は「年間消費電力量〇〇kWh」で記載されることが多い（÷8760時間≒平均W数）</li>
        </ul>
      </div>
    </div>
  );
}
