"use client";

import { useMemo, useState } from "react";
import type { Tool } from "./tool-data";

const toolDetails = {
  shohizei: {
    inputs: ["税抜価格", "税率（%）", "予備"],
    formula: "税込価格 = 税抜価格 × (1 + 税率 ÷ 100)。消費税額は税抜価格 × 税率 ÷ 100 で計算します。",
    usage: "10%の標準税率だけでなく、食品や新聞などで使われる8%の軽減税率にも対応できます。請求書、レシート確認、ネットショップの商品価格確認に使えます。",
    faqs: [
      ["税込から税抜にしたい場合は？", "税率10%なら税込価格を1.1で割ると税抜価格の目安になります。8%なら1.08で割ります。"],
      ["端数はどう考えればいい？", "実務では切り捨て、切り上げ、四捨五入が使われることがあります。このツールは目安として表示します。"],
    ],
  },
  tsumitate: {
    inputs: ["毎月の積立額", "年利（%）", "積立年数"],
    formula: "毎月積立額 × 複利係数で将来額を計算します。月利は年利 ÷ 12 として扱います。",
    usage: "新NISA、iDeCo、投資信託の長期積立を始める前に、毎月いくら積み立てると将来いくらになりそうかを確認できます。",
    faqs: [
      ["利回りは何%で見るべき？", "将来の利回りは確定しません。保守的に3%、標準的に5%、強めに7%など複数パターンで見るのがおすすめです。"],
      ["税金は含まれる？", "この簡易計算では税金や手数料は含めていません。NISA口座以外では運用益に税金がかかります。"],
    ],
  },
  percent: {
    inputs: ["元の金額", "割合（%）", "予備"],
    formula: "割合の値 = 元の値 × パーセント ÷ 100。割引後は 元の値 × (1 - パーセント ÷ 100) です。",
    usage: "セール価格、増減率、達成率、構成比など、日常でよく出るパーセント計算をすぐ確認できます。",
    faqs: [
      ["20%オフはいくら引く？", "元の金額に0.2を掛けた金額が割引額です。支払額は元の金額の80%です。"],
      ["何%増えたかはどう計算する？", "増加分 ÷ 元の値 × 100 で増加率を出せます。"],
    ],
  },
  nenrei: {
    inputs: ["生年月日", "基準日", "予備"],
    formula: "基準日から生年月日を引き、今年の誕生日を迎えているかで満年齢を調整します。",
    usage: "履歴書、申請書、保険、学校関係の書類で満年齢を確認したいときに使えます。",
    faqs: [
      ["満年齢とは？", "生まれた日を0歳として、誕生日を迎えるたびに1歳増える数え方です。"],
      ["学年も出せる？", "この簡易版では満年齢と次の誕生日までの日数を表示します。"],
    ],
  },
  bmi: {
    inputs: ["身長（cm）", "体重（kg）", "予備"],
    formula: "BMI = 体重kg ÷ (身長m × 身長m)。標準体重は 身長m × 身長m × 22 で計算します。",
    usage: "健康診断前の確認、ダイエットや増量の目標体重の目安づくりに使えます。",
    faqs: [
      ["BMI 22が標準なの？", "日本ではBMI 22前後が統計的に病気が少ない目安として使われます。"],
      ["筋肉量は考慮される？", "BMIは身長と体重だけで見る指標なので、筋肉量や体脂肪率は考慮しません。"],
    ],
  },
  warikan: {
    inputs: ["合計金額", "人数", "予備"],
    formula: "一人あたり = 合計金額 ÷ 人数。端数が出る場合は切り上げて表示します。",
    usage: "飲み会、ランチ、旅行、共同購入など、複数人で支払う金額をすばやく分けたいときに使えます。",
    faqs: [
      ["幹事だけ多めに払う計算はできる？", "この簡易版は均等割りです。端数分を幹事が持つ場合は、表示額との差額を調整してください。"],
      ["税込金額で入力する？", "実際に支払う合計金額を入力すると、一人あたりの負担額がわかります。"],
    ],
  },
  nichisu: {
    inputs: ["開始日", "終了日", "日数"],
    formula: "終了日と開始日の時刻差を1日=86,400,000ミリ秒として日数に換算します。",
    usage: "締切までの日数、旅行期間、契約期間、イベントまでのカウントダウンなどに使えます。",
    faqs: [
      ["開始日は含む？", "この簡易計算では日付同士の差分を表示します。用途に応じて1日足して調整してください。"],
      ["何日後の日付も見られる？", "入力1の日数を開始日に足した日付も内訳に表示します。"],
    ],
  },
  jikyu: {
    inputs: ["月収", "月の労働日数", "1日の労働時間"],
    formula: "時給 = 月収 ÷ (月の労働日数 × 1日の労働時間)。",
    usage: "正社員、アルバイト、副業の条件比較や、年収・月収が実際の時給でどれくらいかを確認するときに使えます。",
    faqs: [
      ["残業時間は含める？", "実際の労働時間ベースで見たい場合は、残業を含めた月間労働時間を入力してください。"],
      ["手取りで計算すべき？", "働き方の比較なら額面、生活感の確認なら手取りで見ると実感に近くなります。"],
    ],
  },
  zangyo: {
    inputs: ["基礎時給", "残業時間", "割増率（%）"],
    formula: "残業代 = 基礎時給 × 残業時間 × 割増率。法定時間外は一般的に125%で計算します。",
    usage: "月の残業代の概算、給与明細の確認、残業時間が増えた場合の収入見込みに使えます。",
    faqs: [
      ["25%割増はどう入力する？", "通常時給の1.25倍なので、割増率には125を入力します。"],
      ["深夜残業は？", "深夜や休日は割増率が変わるため、該当する倍率を入力してください。"],
    ],
  },
  chokin: {
    inputs: ["目標金額", "期間（月）", "予備"],
    formula: "毎月必要な貯金額 = 目標金額 ÷ 期間（月）。",
    usage: "旅行、引っ越し、車、結婚、住宅購入など、期限がある目標に向けて毎月いくら貯めるべきかを確認できます。",
    faqs: [
      ["ボーナス貯金は含める？", "ボーナス分を目標金額から引いてから入力すると、毎月分だけの必要額がわかります。"],
      ["利息は考慮される？", "この簡易版は利息なしです。運用込みなら積立投資シミュレーターも使ってください。"],
    ],
  },
  calorie: {
    inputs: ["身長（cm）", "体重（kg）", "年齢"],
    formula: "基礎代謝は Mifflin-St Jeor式の男性式、10×体重 + 6.25×身長 - 5×年齢 + 5 を目安にしています。",
    usage: "ダイエット、増量、維持カロリーの目安を知りたいときに使えます。",
    faqs: [
      ["女性の場合は？", "女性式では最後の+5を-161に置き換えるのが一般的です。この簡易版は目安として見てください。"],
      ["活動量込みとは？", "基礎代謝に日常活動の係数を掛けた、おおまかな消費カロリーです。"],
    ],
  },
  suimin: {
    inputs: ["基準日", "起きる日", "予備"],
    formula: "90分の睡眠サイクルをもとに、起床時刻から4.5時間、6時間、7.5時間、9時間を逆算します。",
    usage: "翌朝すっきり起きたいとき、寝る時刻の候補を決めるために使えます。",
    faqs: [
      ["必ず90分周期なの？", "個人差があります。90分は目安なので、実際の寝つき時間も考えて調整してください。"],
      ["昼寝にも使える？", "短い睡眠なら90分または20分前後を目安にすると使いやすいです。"],
    ],
  },
  wareki: {
    inputs: ["西暦", "予備", "予備"],
    formula: "令和は西暦-2018、平成は西暦-1988、昭和は西暦-1925で年数を計算します。",
    usage: "履歴書、申請書、契約書などで西暦と和暦を確認したいときに使えます。",
    faqs: [
      ["令和元年はいつ？", "令和元年は2019年です。"],
      ["日付まで厳密に変換する？", "この簡易版は年単位の変換です。改元日の前後は注意してください。"],
    ],
  },
  tanni: {
    inputs: ["数値", "予備", "予備"],
    formula: "1坪 = 3.305785㎡、1m = 100cm、1kg = 1000g として換算します。",
    usage: "住宅の面積、買い物時の重量、長さの単位確認などに使えます。",
    faqs: [
      ["坪から平米はどう計算する？", "坪数に3.305785を掛けると平方メートルになります。"],
      ["複数の単位を同時に見られる？", "入力した数値を長さ・重さ・面積の代表単位にまとめて換算します。"],
    ],
  },
  risoku: {
    inputs: ["元本", "年利（%）", "期間（年）"],
    formula: "単利は 元本×年利×期間、複利は 元本×(1+年利)^期間 - 元本 で計算します。",
    usage: "預金、債券、貸付、投資商品の利息をざっくり比較したいときに使えます。",
    faqs: [
      ["単利と複利の違いは？", "単利は元本だけに利息がつき、複利は増えた利息にも次の利息がつきます。"],
      ["税金は含む？", "この簡易版では税金や手数料は含めていません。"],
    ],
  },
  "ookina-kazu": {
    inputs: ["整数1", "整数2", "予備"],
    formula: "入力した整数をBigIntとして扱い、足し算・引き算・掛け算を行います。",
    usage: "桁数の多い数、通常の電卓で指数表示になってしまう数の確認に使えます。",
    faqs: [
      ["小数は使える？", "このツールは整数向けです。小数部分は切り捨てて扱います。"],
      ["どれくらい大きい数まで扱える？", "ブラウザが扱えるBigIntの範囲で、かなり大きな整数まで計算できます。"],
    ],
  },
  moji: {
    inputs: ["文章", "予備", "予備"],
    formula: "文字数はJavaScriptの文字列長、バイト数はBlobのサイズで算出します。",
    usage: "SNS投稿、レポート、記事タイトル、メタディスクリプション、応募フォームの文字数確認に使えます。",
    faqs: [
      ["改行は文字数に含まれる？", "文字数には改行も含まれます。行数は改行で分けて数えます。"],
      ["日本語のバイト数も見られる？", "UTF-8でのバイト数の目安を表示します。"],
    ],
  },
  taishokukin: {
    inputs: ["退職金", "勤続年数", "予備"],
    formula: "退職所得控除は20年以下なら40万円×勤続年数、20年超なら800万円+70万円×超過年数で計算します。",
    usage: "退職金の支給額から税引後の受取額をざっくり確認したいときに使えます。",
    faqs: [
      ["退職所得は半分になる？", "退職所得控除後の金額を2分の1にする扱いが一般的です。条件により異なる場合があります。"],
      ["住民税も含む？", "この簡易版は概算です。実際の税額は勤務先や専門家に確認してください。"],
    ],
  },
  "kokumin-hoken": {
    inputs: ["前年所得", "予備", "予備"],
    formula: "前年所得から基礎控除43万円を引いた額に、目安料率と均等割相当額を足して試算します。",
    usage: "会社員からフリーランスになる前、自営業の年間保険料をざっくり把握したいときに使えます。",
    faqs: [
      ["自治体で金額は変わる？", "変わります。国民健康保険料は自治体や世帯人数、年齢によって大きく異なります。"],
      ["正確な金額はどこで見る？", "住んでいる自治体の国民健康保険料シミュレーターや窓口で確認してください。"],
    ],
  },
  "yume-nikki": {
    inputs: ["夢の内容", "記録日", "予備"],
    formula: "入力した文章を日付と一緒にブラウザ上で扱う、簡易的な夢の記録ツールです。",
    usage: "朝起きてすぐ夢の内容をメモしたいとき、印象・気分・キーワードを残す習慣づくりに使えます。",
    faqs: [
      ["夢日記は何を書く？", "場所、登場人物、感情、印象的な言葉など、思い出せる断片だけで十分です。"],
      ["保存はどこにされる？", "この簡易版ではブラウザ内での利用を想定しています。大切な記録は別途バックアップしてください。"],
    ],
  },
} as const;

function getDetails(tool: Tool) {
  return tool.kind ? toolDetails[tool.kind] : undefined;
}

function yen(value: number) {
  return `¥${Math.round(value).toLocaleString("ja-JP")}`;
}

function num(value: number, digits = 0) {
  return value.toLocaleString("ja-JP", { maximumFractionDigits: digits });
}

function diffDays(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / 86_400_000);
}

function wareki(year: number) {
  if (year >= 2019) return `令和${year - 2018}年`;
  if (year >= 1989) return `平成${year - 1988}年`;
  if (year >= 1926) return `昭和${year - 1925}年`;
  if (year >= 1912) return `大正${year - 1911}年`;
  if (year >= 1868) return `明治${year - 1867}年`;
  return "明治より前";
}

export default function SimpleToolCalculator({ tool }: { tool: Tool }) {
  const details = getDetails(tool);
  const [a, setA] = useState("10000");
  const [b, setB] = useState("10");
  const [c, setC] = useState("5");
  const [dateA, setDateA] = useState("1990-01-01");
  const [dateB, setDateB] = useState(new Date().toISOString().slice(0, 10));
  const [text, setText] = useState("ここに文章を入力してください。");

  const result = useMemo(() => {
    const x = Number(a) || 0;
    const y = Number(b) || 0;
    const z = Number(c) || 0;
    const now = new Date();

    switch (tool.kind) {
      case "shohizei":
        return {
          main: yen(x * (1 + y / 100)),
          rows: [
            ["税抜価格", yen(x)],
            ["税率", `${y}%`],
            ["消費税額", yen(x * y / 100)],
            ["税込価格", yen(x * (1 + y / 100))],
          ],
        };
      case "tsumitate": {
        const months = z * 12;
        const monthlyRate = y / 100 / 12;
        const future = monthlyRate === 0 ? x * months : x * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        return {
          main: yen(future),
          rows: [
            ["毎月積立", yen(x)],
            ["想定利回り", `${y}%`],
            ["積立期間", `${z}年`],
            ["元本", yen(x * months)],
            ["運用益", yen(future - x * months)],
          ],
        };
      }
      case "percent":
        return {
          main: yen(x * (1 - y / 100)),
          rows: [
            ["元の金額", yen(x)],
            ["割合", `${y}%`],
            [`${y}%の値`, yen(x * y / 100)],
            ["割引後", yen(x * (1 - y / 100))],
          ],
        };
      case "nenrei": {
        const birth = new Date(dateA);
        let age = now.getFullYear() - birth.getFullYear();
        const birthdayThisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
        if (now < birthdayThisYear) age -= 1;
        const nextBirthday = now <= birthdayThisYear ? birthdayThisYear : new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
        return {
          main: `${age}歳`,
          rows: [
            ["生年月日", dateA],
            ["満年齢", `${age}歳`],
            ["次の誕生日まで", `${Math.ceil((nextBirthday.getTime() - now.getTime()) / 86_400_000)}日`],
          ],
        };
      }
      case "bmi": {
        const height = x / 100;
        const bmi = height > 0 ? y / (height * height) : 0;
        return {
          main: `${num(bmi, 1)}`,
          rows: [
            ["身長", `${x}cm`],
            ["体重", `${y}kg`],
            ["BMI", num(bmi, 1)],
            ["標準体重", `${num(22 * height * height, 1)}kg`],
          ],
        };
      }
      case "warikan":
        return {
          main: yen(y ? Math.ceil(x / y) : 0),
          rows: [
            ["合計金額", yen(x)],
            ["人数", `${y}人`],
            ["一人あたり", yen(y ? Math.ceil(x / y) : 0)],
          ],
        };
      case "nichisu": {
        const days = diffDays(dateA, dateB);
        const after = new Date(dateA);
        after.setDate(after.getDate() + x);
        return {
          main: `${Math.abs(days)}日`,
          rows: [
            ["開始日", dateA],
            ["終了日", dateB],
            ["差分", `${days}日`],
            [`${x}日後`, after.toISOString().slice(0, 10)],
          ],
        };
      }
      case "jikyu":
        return {
          main: yen(x / Math.max(1, y * z)),
          rows: [
            ["月収", yen(x)],
            ["月の労働日数", `${y}日`],
            ["1日の労働時間", `${z}時間`],
            ["時給換算", yen(x / Math.max(1, y * z))],
          ],
        };
      case "zangyo":
        return {
          main: yen(x * y * (z / 100)),
          rows: [
            ["基礎時給", yen(x)],
            ["残業時間", `${y}時間`],
            ["割増率", `${z}%`],
            ["残業代", yen(x * y * (z / 100))],
          ],
        };
      case "chokin":
        return {
          main: yen(x / Math.max(1, y)),
          rows: [
            ["目標金額", yen(x)],
            ["期間", `${y}か月`],
            ["毎月必要額", yen(x / Math.max(1, y))],
          ],
        };
      case "calorie": {
        const bmr = 10 * y + 6.25 * x - 5 * z + 5;
        return {
          main: `${num(bmr, 0)} kcal`,
          rows: [
            ["身長", `${x}cm`],
            ["体重", `${y}kg`],
            ["年齢", `${z}歳`],
            ["基礎代謝", `${num(bmr, 0)} kcal`],
            ["活動量込み目安", `${num(bmr * 1.5, 0)} kcal`],
          ],
        };
      }
      case "suimin": {
        const wake = new Date(`${dateB}T07:00:00`);
        const sleeps = [4.5, 6, 7.5, 9].map((h) => {
          const t = new Date(wake.getTime() - h * 60 * 60 * 1000);
          return `${h}時間: ${t.toTimeString().slice(0, 5)}`;
        });
        return {
          main: sleeps[2],
          rows: sleeps.map((item) => ["おすすめ就寝", item]),
        };
      }
      case "wareki":
        return {
          main: wareki(x),
          rows: [
            ["西暦", `${x}年`],
            ["和暦", wareki(x)],
          ],
        };
      case "tanni":
        return {
          main: `${num(x * 3.305785, 2)}㎡`,
          rows: [
            ["坪", `${x}坪`],
            ["平方メートル", `${num(x * 3.305785, 2)}㎡`],
            ["メートル", `${x}m`],
            ["センチメートル", `${num(x * 100, 0)}cm`],
            ["キログラム", `${x}kg`],
            ["グラム", `${num(x * 1000, 0)}g`],
          ],
        };
      case "risoku": {
        const simple = x * (y / 100) * z;
        const compound = x * Math.pow(1 + y / 100, z) - x;
        return {
          main: yen(compound),
          rows: [
            ["元本", yen(x)],
            ["年利", `${y}%`],
            ["期間", `${z}年`],
            ["単利の利息", yen(simple)],
            ["複利の利息", yen(compound)],
          ],
        };
      }
      case "ookina-kazu":
        return {
          main: (BigInt(Math.trunc(x)) * BigInt(Math.trunc(y || 1))).toLocaleString("ja-JP"),
          rows: [
            ["足し算", (BigInt(Math.trunc(x)) + BigInt(Math.trunc(y))).toLocaleString("ja-JP")],
            ["引き算", (BigInt(Math.trunc(x)) - BigInt(Math.trunc(y))).toLocaleString("ja-JP")],
            ["掛け算", (BigInt(Math.trunc(x)) * BigInt(Math.trunc(y || 1))).toLocaleString("ja-JP")],
          ],
        };
      case "moji": {
        const bytes = new Blob([text]).size;
        return {
          main: `${text.length}文字`,
          rows: [
            ["文字数", `${text.length}文字`],
            ["行数", `${text.split(/\r?\n/).length}行`],
            ["バイト数", `${bytes} bytes`],
          ],
        };
      }
      case "taishokukin": {
        const deduction = y <= 20 ? y * 400_000 : 8_000_000 + (y - 20) * 700_000;
        const taxable = Math.max(0, (x - deduction) / 2);
        const tax = taxable * 0.15315;
        return {
          main: yen(x - tax),
          rows: [
            ["退職金", yen(x)],
            ["勤続年数", `${y}年`],
            ["退職所得控除", yen(deduction)],
            ["税額目安", yen(tax)],
            ["手取り", yen(x - tax)],
          ],
        };
      }
      case "kokumin-hoken": {
        const taxable = Math.max(0, x - 430_000);
        const annual = taxable * 0.1 + 65_000;
        return {
          main: yen(annual),
          rows: [
            ["前年所得", yen(x)],
            ["基礎控除後", yen(taxable)],
            ["年間保険料目安", yen(annual)],
            ["月額目安", yen(annual / 12)],
          ],
        };
      }
      case "yume-nikki":
        return {
          main: "保存できます",
          rows: [
            ["タイトル", text.slice(0, 24) || "無題の夢"],
            ["記録日", dateB],
            ["保存先", "このブラウザ"],
          ],
        };
      default:
        return {
          main: yen(x),
          rows: [["入力値", yen(x)]],
        };
    }
  }, [a, b, c, dateA, dateB, text, tool.kind]);

  const isTextTool = tool.kind === "moji" || tool.kind === "yume-nikki";
  const isDateTool = tool.kind === "nenrei" || tool.kind === "nichisu" || tool.kind === "suimin";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-sm text-blue-600 font-medium mb-1">無料計算ツール</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">{tool.title}</h1>
        <p className="text-slate-500">{tool.description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        {isTextTool ? (
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-2">テキスト</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={8}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        ) : isDateTool ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className="block text-sm font-medium text-slate-700 mb-2">{tool.kind === "nenrei" ? "生年月日" : "開始日"}</span>
              <input type="date" value={dateA} onChange={(event) => setDateA(event.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3" />
            </label>
            <label>
              <span className="block text-sm font-medium text-slate-700 mb-2">{tool.kind === "suimin" ? "起きる日" : "終了日"}</span>
              <input type="date" value={dateB} onChange={(event) => setDateB(event.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label>
              <span className="block text-sm font-medium text-slate-700 mb-2">{details?.inputs[0] ?? "入力1"}</span>
              <input type="number" value={a} onChange={(event) => setA(event.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3" />
            </label>
            <label>
              <span className="block text-sm font-medium text-slate-700 mb-2">{details?.inputs[1] ?? "入力2"}</span>
              <input type="number" value={b} onChange={(event) => setB(event.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3" />
            </label>
            <label>
              <span className="block text-sm font-medium text-slate-700 mb-2">{details?.inputs[2] ?? "入力3"}</span>
              <input type="number" value={c} onChange={(event) => setC(event.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3" />
            </label>
          </div>
        )}
      </div>

      <div className="bg-blue-600 text-white rounded-2xl p-6 text-center mb-4">
        <div className="text-sm opacity-80 mb-1">計算結果</div>
        <div className="text-4xl font-bold break-words">{result.main}</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-700 mb-4">内訳</h2>
        <div className="space-y-3">
          {result.rows.map(([label, value], index) => (
            <div key={`${label}-${index}`} className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-800 text-right">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">※ 簡易計算の目安です。税金・保険料などは制度や自治体により異なります。</p>
      </div>

      {details && (
        <div className="mt-6 space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-3">{tool.title}の使い方</h2>
            <p className="text-slate-600 leading-7">{details.usage}</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-3">計算式</h2>
            <p className="text-slate-600 leading-7">{details.formula}</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">よくある質問</h2>
            <div className="space-y-4">
              {details.faqs.map(([question, answer]) => (
                <div key={question} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-bold text-slate-800 mb-1">{question}</h3>
                  <p className="text-slate-600 leading-7">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
