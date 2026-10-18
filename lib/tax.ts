// 給与所得の「税・社会保険料」を区分税率で計算するユーティリティ。
// 適用年度: 令和8年分（2026年分）の所得税・令和8年度分の住民税をベースにした概算。
// 端数処理・扶養控除・住宅ローン控除などは未反映。金額はすべて「円」。
// 次年度以降はこのファイル内の定数を更新するだけで、PRECISE経由で全ツールに反映される。

/** 給与所得控除（令和8年分: 最低74万・190〜220万は最低69万保証・660〜850万は10%+110万） */
export function salaryDeduction(s:number):number{
  if(s<=1900000)return 740000;
  if(s<=2200000)return Math.max(s*0.3+80000,690000);
  if(s<=3600000)return s*0.3+80000;
  if(s<=6600000)return s*0.2+440000;
  if(s<=8500000)return s*0.1+1100000;
  return 1950000;
}

/** 社会保険料。厚生年金9.15%（上限780万）／健康保険約4.95%（上限1668万）／雇用保険0.55%。
 *  40歳以上65歳未満は介護保険（自己負担約0.82%）が加わる。 */
export function socialIns(s:number,age?:number):number{
  const nen=Math.min(s,7800000)*0.0915;
  const ken=Math.min(s,16680000)*0.0495;
  const care=age!==undefined&&age>=40&&age<65?Math.min(s,16680000)*0.0082:0;
  return nen+ken+s*0.0055+care;
}

/** 基礎控除（所得税・令和8年分。給与所得を入力して返す） */
export function basicDeduction(goshi:number):number{
  if(goshi<=4890000)return 1040000; // 本則62万＋特例加算42万
  if(goshi<=6550000)return 670000;  // 本則62万＋特例加算5万
  if(goshi<=23500000)return 620000;
  return 0;
}

/** 課税所得（所得税計算の基礎） */
export function taxableIncome(s:number,age?:number):number{
  const goshi=s-salaryDeduction(s);
  return Math.max(0,goshi-socialIns(s,age)-basicDeduction(goshi));
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
export function incomeTax(s:number,age?:number):number{
  return natTax(taxableIncome(s,age))*1.021;
}

/** 住民税。給与所得45万以下は非課税、所得割10%＋均等割5,000円。基礎控除は住民税基準の最高43万 */
export function residentTax(s:number,age?:number):number{
  const goshi=s-salaryDeduction(s);
  if(goshi<=450000)return 0;
  const base=Math.max(0,goshi-socialIns(s,age)-430000);
  return base*0.1+5000;
}

/** 額面年収から年間手取り */
export function netAnnual(s:number,age?:number):number{
  return s-socialIns(s,age)-incomeTax(s,age)-residentTax(s,age);
}

/** 寄付などの限界所得税率（復興込み）。課税所得区分の率から概算 */
export function marginalRate(s:number,age?:number):number{
  const t=taxableIncome(s,age);
  if(t<=1950000)return 0.05105;
  if(t<=3300000)return 0.1021;
  if(t<=6950000)return 0.2042;
  if(t<=9000000)return 0.23483;
  if(t<=18000000)return 0.33693;
  if(t<=40000000)return 0.4082;
  return 0.45945;
}

/** ふるさと納税の上限（自己負担2,000円になる寄付額）。住民税所得割と所得税率の特例控除から逆算 */
export function furusatoLimit(s:number,age?:number):number{
  const a=marginalRate(s,age);
  const rIncome=Math.max(0,s-salaryDeduction(s)-socialIns(s,age)-430000);
  const R=rIncome*0.1; // 住民税所得割額
  return Math.max(0,(0.2*R-2000*a)/(0.9-a));
}

/** 賞与の手取り。厚生年金9.15%（1回150万上限）・健保約4.95%（573万上限）と、40〜64歳は介護保険が上乗せで掛かり、所得税は源泉概算5.105% */
export function bonusNet(b:number,age?:number):number{
  const careRate=age!==undefined&&age>=40&&age<65?0.0082:0;
  const ins=Math.min(b,1500000)*0.0915+Math.min(b,5730000)*(0.0495+careRate);
  const tax=Math.max(0,b-ins)*0.05105;
  return b-ins-tax;
}

/** 退職金の手取り（退職所得控除＋累進税率＋住民税10%。2年以内の再就職調整は未反映） */
export function retirementNet(amount:number,years:number):number{
  const d=years<=20?years*400000:8000000+(years-20)*700000;
  const taxable=Math.max(0,(amount-d)*0.5);
  const nat=natTax(taxable)*1.021;
  return amount-nat-taxable*0.1;
}

/** 目標手取りから必要な額面年収を二分探索で逆算 */
export function requiredGross(want:number,age?:number):number{
  let hi=Math.max(want,1000000)*10;
  let lo=0;
  for(let i=0;i<200;i++){
    const mid=(lo+hi)/2;
    if(netAnnual(mid,age)>=want)hi=mid;else lo=mid;
  }
  return hi;
}
