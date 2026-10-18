'use client';
import {useMemo,useState} from 'react';
import {categories,tools} from '@/lib/tools';

const norm=(s:string)=>s.toLowerCase().replace(/\s+/g,'');
/** ひらがな→カタカナ（カタカナ表記の名前をひらがなで検索できるようにする） */
const hira=(s:string)=>s.replace(/[\u30A1-\u30F6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));

export default function SearchTools(){
  const [query,setQuery]=useState('');
  const hits=useMemo(()=>{
    const q=hira(norm(query));
    if(!q)return [];
    return tools.filter(t=>hira(norm(t.name+t.description+categories[t.category])).includes(q)).slice(0,8);
  },[query]);
  return (
    <div className="finder">
      <input
        className="finder-input"
        type="search"
        placeholder="ツール名を入力（例：手取り、ローン、BMI）"
        value={query}
        onChange={e=>setQuery(e.target.value)}
        aria-label="計算ツールを検索"
      />
      {query&&hits.length===0&&<p className="finder-empty">「{query}」に一致するツールは見つかりませんでした。</p>}
      {hits.length>0&&(
        <ul className="finder-list">
          {hits.map(t=>(
            <li key={t.slug}>
              <a href={`/${t.slug}`}>
                <span className="icon">{t.icon}</span>
                <span className="finder-body">
                  <b>{t.name}</b>
                  <small>{t.description}</small>
                </span>
                <span className="finder-cat">{categories[t.category]}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {!query&&<p className="finder-hint">{tools.length}種類のツールから、名前・用途で検索できます。</p>}
    </div>
  );
}
