export type ToolColor =
  | "blue"
  | "green"
  | "orange"
  | "emerald"
  | "lime"
  | "fuchsia"
  | "pink"
  | "amber"
  | "purple"
  | "cyan"
  | "rose"
  | "yellow"
  | "indigo"
  | "violet"
  | "teal"
  | "sky"
  | "slate";

export type ToolKind =
  | "shohizei"
  | "tsumitate"
  | "percent"
  | "nenrei"
  | "bmi"
  | "warikan"
  | "nichisu"
  | "jikyu"
  | "zangyo"
  | "chokin"
  | "calorie"
  | "suimin"
  | "wareki"
  | "tanni"
  | "risoku"
  | "ookina-kazu"
  | "moji"
  | "taishokukin"
  | "kokumin-hoken"
  | "yume-nikki";

export type Tool = {
  slug: string;
  href: string;
  emoji: string;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  color: ToolColor;
  kind?: ToolKind;
};

export const tools: Tool[] = [
  {
    slug: "nenshu",
    href: "/nenshu",
    emoji: "💰",
    title: "年収手取り計算機",
    shortTitle: "手取り",
    description: "年収を入力するだけで、所得税・住民税・社会保険料を引いた手取り額を即座に計算。",
    tags: ["節税", "給与", "社会保険"],
    color: "blue",
  },
  {
    slug: "furusato",
    href: "/furusato",
    emoji: "🎁",
    title: "ふるさと納税シミュレーター",
    shortTitle: "ふるさと納税",
    description: "年収・家族構成から自己負担2,000円になる上限寄付額を計算。お得な限度額を確認。",
    tags: ["節税", "寄付金控除", "返礼品"],
    color: "green",
  },
  {
    slug: "shohizei",
    href: "/shohizei",
    emoji: "🧾",
    title: "消費税計算機",
    shortTitle: "消費税",
    description: "税込・税抜を一発変換。10%と軽減税率8%の両方に対応。",
    tags: ["税込", "税抜", "軽減税率"],
    color: "orange",
    kind: "shohizei",
  },
  {
    slug: "tsumitate",
    href: "/tsumitate",
    emoji: "📈",
    title: "積立投資シミュレーター",
    shortTitle: "積立投資",
    description: "毎月の積立額・利回り・期間から将来の資産額を計算。",
    tags: ["新NISA", "複利", "資産形成"],
    color: "emerald",
    kind: "tsumitate",
  },
  {
    slug: "percent",
    href: "/percent",
    emoji: "％",
    title: "パーセント計算機",
    shortTitle: "パーセント",
    description: "割合・増減率・割引後価格をすぐ計算。",
    tags: ["割合", "増減率", "割引"],
    color: "lime",
    kind: "percent",
  },
  {
    slug: "nenrei",
    href: "/nenrei",
    emoji: "🎂",
    title: "年齢計算機",
    shortTitle: "年齢",
    description: "生年月日から満年齢と次の誕生日までの日数を計算。",
    tags: ["満年齢", "誕生日", "日数"],
    color: "fuchsia",
    kind: "nenrei",
  },
  {
    slug: "bmi",
    href: "/bmi",
    emoji: "⚖️",
    title: "BMI・標準体重計算機",
    shortTitle: "BMI",
    description: "身長・体重からBMIと標準体重を判定。",
    tags: ["健康", "標準体重", "肥満度"],
    color: "pink",
    kind: "bmi",
  },
  {
    slug: "warikan",
    href: "/warikan",
    emoji: "🍺",
    title: "割り勘計算機",
    shortTitle: "割り勘",
    description: "合計金額と人数から一人あたりの支払額を計算。",
    tags: ["飲み会", "端数", "幹事"],
    color: "amber",
    kind: "warikan",
  },
  {
    slug: "jutaku-loan",
    href: "/jutaku-loan",
    emoji: "🏠",
    title: "住宅ローン計算機",
    shortTitle: "住宅ローン",
    description: "借入金額・金利・期間を入力して月々の返済額と総支払額を計算。",
    tags: ["住宅", "返済", "金利"],
    color: "purple",
  },
  {
    slug: "kokumin-hoken",
    href: "/kokumin-hoken",
    emoji: "🏥",
    title: "国民健康保険料計算機",
    shortTitle: "国保",
    description: "所得から国民健康保険料のざっくり目安を試算。",
    tags: ["自営業", "保険料", "所得"],
    color: "cyan",
    kind: "kokumin-hoken",
  },
  {
    slug: "taishokukin",
    href: "/taishokukin",
    emoji: "💼",
    title: "退職金手取り計算機",
    shortTitle: "退職金",
    description: "退職金と勤続年数から税引後の受取額を概算。",
    tags: ["退職所得", "税金", "手取り"],
    color: "rose",
    kind: "taishokukin",
  },
  {
    slug: "denki",
    href: "/denki",
    emoji: "⚡",
    title: "電気代計算機",
    shortTitle: "電気代",
    description: "家電の消費電力と使用時間を入力して月の電気代を計算。",
    tags: ["節約", "光熱費", "省エネ"],
    color: "yellow",
  },
  {
    slug: "nichisu",
    href: "/nichisu",
    emoji: "📅",
    title: "日付・日数計算機",
    shortTitle: "日数",
    description: "開始日と終了日の差、指定日数後の日付を計算。",
    tags: ["日付", "期間", "締切"],
    color: "indigo",
    kind: "nichisu",
  },
  {
    slug: "jikyu",
    href: "/jikyu",
    emoji: "💹",
    title: "時給換算計算機",
    shortTitle: "時給",
    description: "年収・月収・日給を時給に換算。",
    tags: ["年収", "副業", "転職"],
    color: "violet",
    kind: "jikyu",
  },
  {
    slug: "zangyo",
    href: "/zangyo",
    emoji: "🕐",
    title: "残業代計算機",
    shortTitle: "残業代",
    description: "時給・残業時間・割増率から残業代を計算。",
    tags: ["労働", "割増", "給与"],
    color: "rose",
    kind: "zangyo",
  },
  {
    slug: "chokin",
    href: "/chokin",
    emoji: "🏦",
    title: "貯金シミュレーター",
    shortTitle: "貯金",
    description: "目標金額と期間から毎月必要な貯金額を逆算。",
    tags: ["目標", "家計", "積立"],
    color: "teal",
    kind: "chokin",
  },
  {
    slug: "calorie",
    href: "/calorie",
    emoji: "🔥",
    title: "基礎代謝・カロリー計算機",
    shortTitle: "カロリー",
    description: "身長・体重・年齢から基礎代謝と消費カロリーを計算。",
    tags: ["健康", "代謝", "ダイエット"],
    color: "orange",
    kind: "calorie",
  },
  {
    slug: "suimin",
    href: "/suimin",
    emoji: "😴",
    title: "睡眠時間計算機",
    shortTitle: "睡眠",
    description: "睡眠サイクルから起きやすい時刻を計算。",
    tags: ["睡眠", "目覚まし", "90分"],
    color: "sky",
    kind: "suimin",
  },
  {
    slug: "yume-nikki",
    href: "/yume-nikki",
    emoji: "🌙",
    title: "夢日記",
    shortTitle: "夢日記",
    description: "見た夢を日付・気分・鮮明さつきでブラウザに保存。",
    tags: ["記録", "保存", "メモ"],
    color: "indigo",
    kind: "yume-nikki",
  },
  {
    slug: "wareki",
    href: "/wareki",
    emoji: "📜",
    title: "西暦・和暦変換計算機",
    shortTitle: "和暦",
    description: "西暦から令和・平成・昭和などの和暦へ変換。",
    tags: ["令和", "平成", "昭和"],
    color: "indigo",
    kind: "wareki",
  },
  {
    slug: "tanni",
    href: "/tanni",
    emoji: "📏",
    title: "単位換算計算機",
    shortTitle: "単位換算",
    description: "長さ・重さ・面積をまとめて換算。",
    tags: ["長さ", "重さ", "面積"],
    color: "teal",
    kind: "tanni",
  },
  {
    slug: "risoku",
    href: "/risoku",
    emoji: "🏦",
    title: "利息計算機",
    shortTitle: "利息",
    description: "元本・利率・期間から単利と複利の利息を試算。",
    tags: ["単利", "複利", "預金"],
    color: "blue",
    kind: "risoku",
  },
  {
    slug: "ookina-kazu",
    href: "/ookina-kazu",
    emoji: "🔢",
    title: "大きな数計算機",
    shortTitle: "大きな数",
    description: "桁数の多い整数をそのまま四則計算。",
    tags: ["整数", "桁数", "巨大数"],
    color: "slate",
    kind: "ookina-kazu",
  },
  {
    slug: "moji",
    href: "/moji",
    emoji: "✍️",
    title: "文字数カウンター",
    shortTitle: "文字数",
    description: "文章の文字数・行数・バイト数を即カウント。",
    tags: ["文章", "文字数", "バイト"],
    color: "fuchsia",
    kind: "moji",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export const colorMap: Record<ToolColor, string> = {
  blue: "bg-blue-50 border-blue-100 hover:border-blue-300",
  green: "bg-green-50 border-green-100 hover:border-green-300",
  orange: "bg-orange-50 border-orange-100 hover:border-orange-300",
  emerald: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
  lime: "bg-lime-50 border-lime-100 hover:border-lime-300",
  fuchsia: "bg-fuchsia-50 border-fuchsia-100 hover:border-fuchsia-300",
  pink: "bg-pink-50 border-pink-100 hover:border-pink-300",
  amber: "bg-amber-50 border-amber-100 hover:border-amber-300",
  purple: "bg-purple-50 border-purple-100 hover:border-purple-300",
  cyan: "bg-cyan-50 border-cyan-100 hover:border-cyan-300",
  rose: "bg-rose-50 border-rose-100 hover:border-rose-300",
  yellow: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
  indigo: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
  violet: "bg-violet-50 border-violet-100 hover:border-violet-300",
  teal: "bg-teal-50 border-teal-100 hover:border-teal-300",
  sky: "bg-sky-50 border-sky-100 hover:border-sky-300",
  slate: "bg-slate-50 border-slate-200 hover:border-slate-400",
};

export const tagColorMap: Record<ToolColor, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  emerald: "bg-emerald-100 text-emerald-700",
  lime: "bg-lime-100 text-lime-700",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700",
  pink: "bg-pink-100 text-pink-700",
  amber: "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-700",
  cyan: "bg-cyan-100 text-cyan-700",
  rose: "bg-rose-100 text-rose-700",
  yellow: "bg-yellow-100 text-yellow-700",
  indigo: "bg-indigo-100 text-indigo-700",
  violet: "bg-violet-100 text-violet-700",
  teal: "bg-teal-100 text-teal-700",
  sky: "bg-sky-100 text-sky-700",
  slate: "bg-slate-100 text-slate-700",
};

