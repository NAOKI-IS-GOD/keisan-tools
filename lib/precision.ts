import {bonusNet,furusatoLimit,netAnnual,requiredGross,retirementNet} from './tax';

// クライアント側のみで使う高精度計算レジストリ。
// tools.ts には fn の名前だけを持たせる（サーバー→クライアントは関数を渡せないため）。
export const PRECISE:Record<string,(v:Record<string,number>)=>number>={
  'nenshu':v=>netAnnual(v.income*10000)/10000,
  'furusato':v=>Math.floor(furusatoLimit(v.income*10000)/100)*100,
  'bonus':v=>bonusNet(v.amount*10000)/10000,
  'taishokukin':v=>retirementNet(v.amount*10000,v.years)/10000,
  'takehome-reverse':v=>requiredGross(v.want*10000)/10000,
  'unemployment':v=>{
    const dayWage=v.salary*10000/30;
    const rate=v.age>=45&&v.age<60?50:60;
    const cap=v.age<30?7450:v.age<45?8270:v.age<60?9110:7830;
    const daily=Math.min(cap,Math.max(dayWage*rate/100,2562));
    return daily*v.days;
  },
};
