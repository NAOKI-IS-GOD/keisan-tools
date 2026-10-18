'use client';
import {useEffect,useMemo,useState} from 'react';
import type {Tool} from '@/lib/tools';
import {FAV_EVENT,FAV_KEY} from '@/components/Favorites';

const readFavs=():string[]=>{
  try{const raw=localStorage.getItem(FAV_KEY);return raw?JSON.parse(raw):[]}catch{return []}
};

export default function Calculator({tool}:{tool:Tool}){
  const initial=Object.fromEntries(tool.fields.map(x=>[x.key,x.default]));
  const [values,setValues]=useState<Record<string,number>>(initial);
  const [copied,setCopied]=useState(false);
  const [faved,setFaved]=useState(false);
  useEffect(()=>{
    const q=new URLSearchParams(location.search);
    setValues(v=>Object.fromEntries(Object.entries(v).map(([k,n])=>[k,q.has(k)?Number(q.get(k)):n])));
    setFaved(readFavs().includes(tool.slug));
  },[tool.slug]);

  const result=useMemo(()=>{
    try{
      const fn=new Function(...Object.keys(values),`return ${tool.formula}`);
      const n=Number(fn(...Object.values(values)));
      return Number.isFinite(n)?n:0;
    }catch{return 0}
  },[values,tool.formula]);

  const shown=Math.abs(result)>=100?Math.round(result).toLocaleString('ja-JP'):Math.round(result*100)/100;
  /** 円系の単位なら万円相当も併記して桁感をつかみやすくする */
  const yenLine=tool.resultUnit.includes('円')&&Math.abs(result)>=10000
    ?`＝ 約 ${(Math.round(result/10000*100)/100).toLocaleString('ja-JP')} 万円`
    :'';

  const share=async()=>{
    const q=new URLSearchParams(Object.fromEntries(Object.entries(values).map(([k,v])=>[k,String(v)])));
    const url=`${location.origin}${location.pathname}?${q}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(()=>setCopied(false),1800);
  };

  const toggleFav=()=>{
    const cur=readFavs();
    const next=cur.includes(tool.slug)?cur.filter(s=>s!==tool.slug):[...cur,tool.slug];
    try{localStorage.setItem(FAV_KEY,JSON.stringify(next))}catch{}
    setFaved(next.includes(tool.slug));
    window.dispatchEvent(new Event(FAV_EVENT));
  };

  const decision=result>0
    ?'プラスの結果です。ほかの条件や将来の支出も含めて比較すると、判断の精度が上がります。'
    :result<0
      ?'マイナスの結果です。条件を変え、どこまで改善すればプラスになるか試してみましょう。'
      :'条件がほぼ同じです。時間・安心・働きやすさなど金額以外の差も比べましょう。';

  return (
    <div className="panel">
      {tool.fields.map(field=>(
        <div className="field" key={field.key}>
          <label htmlFor={field.key}>{field.label}</label>
          <div className="inputrow">
            <input
              id={field.key}
              type="number"
              inputMode="decimal"
              min={field.min}
              step={field.step}
              value={values[field.key]}
              onChange={e=>setValues(v=>({...v,[field.key]:Number(e.target.value)}))}
            />
            <span className="unit">{field.unit}</span>
          </div>
        </div>
      ))}
      <div className="result" aria-live="polite">
        <small>{tool.resultLabel}</small>
        <strong>{shown} <span style={{fontSize:16}}>{tool.resultUnit}</span></strong>
        {yenLine&&<div className="yenline">{yenLine}</div>}
        <div className="decision"><b>結果の見方：</b> {decision}</div>
      </div>
      <div className="panel-actions">
        <button className="share" type="button" onClick={share}>{copied?'共有URLをコピーしました':'この条件をURLで共有'}</button>
        <button className="favbtn" type="button" onClick={toggleFav} aria-pressed={faved}>{faved?'★ お気に入り登録済み':'☆ お気に入りに追加'}</button>
      </div>
      <p className="note">入力値に基づく概算です。端数処理や個別条件により実際の金額と異なる場合があります。</p>
    </div>
  );
}
