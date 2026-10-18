'use client';
import {useEffect,useState} from 'react';
import {tools} from '@/lib/tools';

export const FAV_KEY='sokukeisan:favs';
/** Calculator側の星ボタンと状態を共有するためのイベント名 */
export const FAV_EVENT='sokukeisan:favs-changed';

export default function Favorites(){
  const [slugs,setSlugs]=useState<string[]>([]);
  useEffect(()=>{
    const load=()=>{
      try{
        const raw=localStorage.getItem(FAV_KEY);
        setSlugs(raw?JSON.parse(raw):[]);
      }catch{setSlugs([])}
    };
    load();
    window.addEventListener(FAV_EVENT,load);
    window.addEventListener('storage',load);
    return()=>{window.removeEventListener(FAV_EVENT,load);window.removeEventListener('storage',load)};
  },[]);
  const favs=slugs.map(s=>tools.find(t=>t.slug===s)).filter(Boolean) as typeof tools;
  if(favs.length===0){
    return <p className="fav-empty">まだお気に入りはありません。各計算ツールページの「☆ お気に入り」ボタンから追加できます。</p>;
  }
  return (
    <div className="grid">
      {favs.map(t=>(
        <a className="card" href={`/${t.slug}`} key={t.slug}>
          <span className="icon">{t.icon}</span>
          <h3>{t.name}</h3>
          <p>{t.description}</p>
          <span className="badge">★ 登録済み — 開く →</span>
        </a>
      ))}
    </div>
  );
}
