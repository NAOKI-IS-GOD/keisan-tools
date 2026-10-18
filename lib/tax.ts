// 給与所得の「税・社会保険料」を区分税率で計算するユーティリティ。
// 2026年度の制度をベースにした概算（端数処理・扶養控除・介護保険などは未反映）。
// 金額はすべて「円」で入出力する。

/** 給与所得控除 */
export function salaryDeduction(s:number):number{
  if(s<=1625000)return 550000;
  if(s<=1800000)return s*0.4-100000;
  if(s<=3600000)return s*0.3+80000;
  if(s<=6600000)return s*0.2+440000;
  return 1950000;
}

/** 社会保険料（厚生年金9.15%・健康保険約4.95%・雇用保険0.55%、上限あり） */
export function socialIns(s:number):number{
  const nen=Math.min(s,7800000)*0.0915; // 厚生年金 標準報酬上限65万/月
  const ken=Math.min(s,16680000)*0.0495; // 健康保険 標準報酬上限139万/月
  return nen+ken+s*0.0055;
}

/** 課税所得（所得税計算の基礎。基礎控除48万まで反映） */
export function taxableIncome(s:number):number{
  return Math.max(0,s-salaryDeduction(s)-socialIns(s)-480000);
}

/** 国税の税率区分（復興特別所得税を除く素の所得税） */
function natTax(t:number):number{
  if(t<=1950000)return t*0.05;
  if(t<=3300000)return t*0.10-97500;
  if(t<=6950000)return t*0.20-427500;
  if(t<=9000000)return t*0.23-636000;
  if(t<=18000000)return t*0.33-1536000;
  if(t<=40000000)return t*0.40-2796000;
  return t*0.45-4796000;
}

/** 所得税（復興特別所得税2.1%込み） */
export function incomeTax(s:number):number{
  return natTax(taxableIncome(s))*1.021;
}

/** 住民税（所得割10%＋均等割5,000円。所得45万以下は非課税） */
export function residentTax(s:number):number{
  const base=Math.max(0,s-salaryDeduction(s)-socialIns(s)-430000);
  return base<=450000?0:base*0.1+5000;
}

/** 額面年収から年間手取り */
export function netAnnual(s:number):number{
  return s-socialIns(s)-incomeTax(s)-residentTax(s);
}

/** 寄付・退職金などの限界所得税率（復興込み）。贅沢な近似: その人の課税所得区分の率 */
export function marginalRate(s:number):number{
  const t=taxableIncome(s);
  if(t<=1950000)return 0.05105;
  if(t<=3300000)return 0.1021;
  if(t<=6950000)return 0.2042;
  if(t<=9000000)return 0.23483;
  if(t<=18000000)return 0.33693;
  if(t<=40000000)return 0.4082;
  return 0.45945;
}

/** ふるさと納税の上限（自己負担2,000円になる寄付額）。住民税所得割と所得税の特例控除から逆算 */
export function furusatoLimit(s:number):number{
  const a=marginalRate(s);
  const rIncome=Math.max(0,s-salaryDeduction(s)-socialIns(s)-430000);
  const R=rIncome*0.1; // 住民税所得割額
  return Math.max(0,(0.2*R-2000*a)/(0.9-a));
}

/** 賞与の手取り（厚生年金9.15%・健保約4.95%が上乗せで掛かり、所得税は源泉概算5.105%） */
export function bonusNet(b:number):number{
  const ins=Math.min(b,1500000)*0.0915+Math.min(b,5730000)*0.0495;
  const tax=Math.max(0,b-ins)*0.05105;
  return b-ins-tax;
}

/** 退職金の手取り（退職所得控除＋退職所得の軽減税率＋住民税10%。2年以内の再就職調整は未反映） */
export function retirementNet(amount:number,years:number):number{
  const d=years<=20?years*400000:8000000+(years-20)*700000;
  const taxable=Math.max(0,(amount-d)*0.5);
  const nat=natTax(taxable)*1.021;
  return amount-nat-taxable*0.1;
}

/** 目標手取りから必要な額面年収を二分探索で逆算 */
export function requiredGross(want:number):number{
  let hi=Math.max(want,1000000)*10;
  let lo=0;
  for(let i=0;i<200;i++){
    const mid=(lo+hi)/2;
    if(netAnnual(mid)>=want)hi=mid;else lo=mid;
  }
  return hi;
}
